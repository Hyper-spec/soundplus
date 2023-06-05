import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { useEffect, useRef } from 'react';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import { usePlayer } from '../contexts/PlayerContext';
import {Header}  from '../components/Header/index';

type Episode = {
	id: string;
	title: string;
	members: string;
	publishedAt: string;
	thumbnail: string;
	url: string;
	duration: number;
	durationAsString: string;
};

type HomeProps = {
	latestEpisodes: Episode[];
	allEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const { playList, isPlaying, togglePlay, playNext, currentEpisodeIndex } = usePlayer();
	const episodeList = [...latestEpisodes, ...allEpisodes];

  useEffect(() => {
		if (!audioRef.current) {
			return;
		}

		if (isPlaying) {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}

	}, [isPlaying]);


  const song = episodeList[currentEpisodeIndex]

  function Listen(num, top) {
    playList(num, top);
    togglePlay();

    return playNext;
  }

  console.log(song)

	return (
		<div className={styles.homepage}>
      <Head>
        <title>Sound+</title>
      </Head>
      <Header />
      <section className={styles.latestEpisodes}>
        <h2>Recomended by Sound+</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image width={120} height={120} objectFit='cover' src={episode.thumbnail} alt={episode.title}/>

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a className={song.id == episode.id && isPlaying ? styles.blueTitle : styles.blackTitle}>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                </div>

                <button type='button' onClick={() => Listen(episodeList, index)}>
                  {song.id === episode.id && isPlaying ? ( <img style={{width: '3rem', height: '3rem'}} src="/musicbar.gif" alt="Tocar episódio" />) : ( <img src="/play.svg" alt="Tocar episódio" />)} 
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      
      <section className={styles.allEpisodes}>
        <h2>All Songs</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Song</th>
              <th>Artist</th>
              <th className={styles.durationContainer}>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id} style={{width: 72}}>
                  <td>
                    <Image width={80} height={80} src={episode.thumbnail} alt={episode.title}/>
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a className={episode.id == song.id && isPlaying ? styles.blueTitle : styles.blackTitle}>{episode.title}</a>
                    </Link>
                  </td>
                  <td>
                    {episode.members}
                  </td>
                  <td className={styles.durationContainer}>
                    {episode.durationAsString}
                  </td>
                  <td>
                    <button type='button' onClick={() => Listen(episodeList, index + latestEpisodes.length)}>
                      {song.id === episode.id && isPlaying ? ( <img className={styles.dancing} style={{width: '3rem', height: '3rem'}} src="/musicbar.gif" alt="Tocar episódio" />) : ( <img src="/play.svg" alt="Tocar episódio" />)}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>

	)
}

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get('episodes', {
		params: {
			_limit: 18,
			_sort: 'published_at',
			_order: 'desc',
		},
	});

	const episodes = data.map((episode) => {
		return {
			id: episode.id,
			title: episode.title,
			members: episode.members,
			publishedAt: format(parseISO(episode.published_at), 'MMM yyyy', {
				locale: ptBR,
			}),
			thumbnail: episode.thumbnail,
			url: episode.file.url,
			duration: Number(episode.file.duration),
			durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
		};
	});

	const latestEpisodes = episodes.slice(0, 4);
	const allEpisodes = episodes.slice(4, episodes.length);

	return {
		props: {
			latestEpisodes,
			allEpisodes,
		},
		revalidate: 60 * 60 * 8,
	};
};

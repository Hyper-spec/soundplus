import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head';
import useResponsiveUnits from '../../hooks/useResponsiveUnits';


type Episode = {
	id: string;
	title: string;
	members: string;
	publishedAt: string;
	thumbnail: string;
	description: string;
	url: string;
	duration: number;
	durationAsString: string;
};

type EpisodeProps = {
	episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
	const { play, pause, isPlaying} = usePlayer();
	
	return (
		<div className={styles.container}>
			<Head>
				<title>{episode.title} | Sound+</title>
			</Head>
			<div className={styles.episode}>
				<div className={styles.thumbnailContainer}>
					<Link href='/'>
						<button type='button'>
							<img src='/arrow-left.svg' alt='Voltar' title='Back' />
						</button>
					</Link>
					<Image
						width={1200}
						height={540}
						src={episode.thumbnail}
						style={{filter: 'brightness(0.4)'}}
						objectFit='cover'
					/>

					<h1>{episode.title}</h1>
					<button className={styles.play} onClick={!isPlaying ? () => {play(episode)} : () => {pause(episode)}}>
						{isPlaying ? <img style={{height: '3rem', width: '3rem'}} src='/musicbar.gif' alt='musicbar' /> : <img src='/play.svg' alt='pause' />}
					</button>
				</div>
				<header id='info'>
					<ul>
						<li className={styles.row}>
							<span>Artist: {episode.members}</span>
						</li>
						<li className={styles.row}>						
							<span>Published At: {episode.publishedAt}</span>
						</li>
						<li className={styles.row}>						
							<span>Duration: {episode.durationAsString}</span>{' '}
						</li>
					</ul>
				</header>

				<section className={styles.profile}>
					<h1>This is <span style={{color: 'var(--blue)'}}>{episode.members}</span></h1>
					<Image height={900} width={900} objectFit='cover' src={`/profile/${episode.members}.jfif`} />
					<div
						className={styles.description}
						dangerouslySetInnerHTML={{ __html: episode.description }}
					/>
				</section>
			</div>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { slug } = context.params;

	const { data } = await api.get(`episodes/${slug}`);

	const episode = {
		id: data.id,
		title: data.title,
		members: data.members,
		publishedAt: format(parseISO(data.published_at), 'y', {
			locale: ptBR,
		}),
		thumbnail: data.thumbnail,
		description: data.description,
		url: data.file.url,
		duration: Number(data.file.duration),
		durationAsString: convertDurationToTimeString(Number(data.file.duration)),
	};

	return {
		props: { episode },
		revalidate: 60 * 60 * 24, // 24 hours
	};
};

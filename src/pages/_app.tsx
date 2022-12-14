import { PlayerContextProvider } from '../contexts/PlayerContext';
import { ThemeContextProvider } from '../contexts/ThemeContextProvider';
import { Player } from '../components/Player';
import styles from '../styles/app.module.scss';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
	return (
		<ThemeContextProvider>
			<PlayerContextProvider>
				<div className={styles.wrapper}>
					<main>
						<Component {...pageProps} />
					</main>
					<Player />
				</div>
			</PlayerContextProvider>
		</ThemeContextProvider>
	);
}

export default MyApp;

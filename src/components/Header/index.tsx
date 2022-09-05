import format from 'date-fns/format';
import enUS from 'date-fns/locale/en-US';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContextProvider';
import styles from './styles.module.scss';

export function Header() {
	const currentDate = format(new Date(), 'HH', {
		locale: enUS,
	});
	const { isDarkMode, switchTheme } = useTheme();

	return (
		<header id='appHeader' className={styles.headerContainer}>
            <h1 className={currentDate >= '18' && currentDate <= '23' ? styles.night :  styles.noNight}>Good Evening</h1>
            <h1 className={currentDate >= '00' && currentDate <= '11' ? styles.morning :  styles.noMorning}>Good Morning</h1>
            <h1 className={currentDate >= '12' && currentDate <= '17' ? styles.afternoon :  styles.noAfternoon}>Good Afternoon</h1>

			<button
				type='button'
				onClick={() => switchTheme(!isDarkMode)}
				className={styles.themeSwitcher}>
				<img
					src={isDarkMode ? '/sun-light.svg' : '/moon-dark.svg'}
					alt='Switch Theme'
					title='Switch Theme'
				/>
			</button>
		</header>
	);
}

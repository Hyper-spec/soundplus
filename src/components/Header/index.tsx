import format from 'date-fns/format';
import enUS from 'date-fns/locale/en-US';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContextProvider';
import styles from './styles.module.scss';

export function Header() {
	const { isDarkMode, switchTheme } = useTheme();

	return (
		<header id='appHeader' className={styles.headerContainer}>
			<h1>Welcome back!</h1>

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

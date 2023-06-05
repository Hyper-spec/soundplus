import format from 'date-fns/format';
import enUS from 'date-fns/locale/en-US';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { useState } from 'react';
import styles from './styles.module.scss';

export function Header() {
	return (
		<header id='appHeader' className={styles.headerContainer}>
			<h1>Welcome back!</h1>
		</header>
	);
}

import { MainPageProps } from '../types/PageProps';
import { useSocket } from '../hooks/StompProvider';
import { socketInfo } from '../types/SocketTypes';
import { useEffect } from 'react';
import ChatBox from '../components/ChatBox';

import styles from '../styles/pages/Main.module.css';

export default function Main(props: MainPageProps) {
	const stomp: socketInfo | undefined = useSocket();

	return (
		<div className={styles['container']}>
			<div className={styles['side-bar']}></div>
			<div className={styles['body']}>
				<div className={styles['main-window']}></div>
				<div className={styles['chat']}>
					<ChatBox room={props.rooms[1]} />
				</div>
			</div>
		</div>
	);
}

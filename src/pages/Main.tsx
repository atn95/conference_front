import { MainPageProps } from '../types/PageProps';
import { useSocket } from '../hooks/StompProvider';
import { socketInfo } from '../types/SocketTypes';
import { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';
import styles from '../styles/pages/Main.module.css';
import SideBar from '../components/SideBar';
import { room } from '../types/UserTypes';

export default function Main(props: MainPageProps) {
	const [currentRoom, setRoom] = useState<room | null>(null);

	return (
		<div className={styles['container']}>
			<div className={styles['side-bar']}>
				<SideBar room={currentRoom} setRoom={setRoom} />
			</div>
			<div className={styles['body']}>
				<div className={styles['main-window']}></div>
				<div className={styles['chat']}>{currentRoom ? <ChatBox room={currentRoom} /> : ''}</div>
			</div>
		</div>
	);
}

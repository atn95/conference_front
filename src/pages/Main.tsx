import { MainPageProps } from '../types/PageProps';
import { useSocket } from '../hooks/StompProvider';
import { socketInfo } from '../types/SocketTypes';
import { useEffect, useRef, useState } from 'react';
import ChatBox from '../components/ChatBox';
import styles from '../styles/pages/Main.module.css';
import SideBar from '../components/SideBar';
import { room } from '../types/UserTypes';
import { useUserContext } from '../hooks/UserProvider';
import { useWebRTC } from '../hooks/WebRTCProvider';

export default function Main(props: MainPageProps) {
	const [currentRoom, setRoom] = useState<room | null>(null);
	const { socketId } = useUserContext() || { socketId: '' };
	const { client, subscriptions }: socketInfo = useSocket() || { client: undefined, subscriptions: [] };
	const { computer, createOffer } = useWebRTC() || { computer: undefined, createOffer: null };
	let localVideoRef = useRef<HTMLVideoElement>(null);
	let remoteVideoRef = useRef<HTMLVideoElement>(null);

	return (
		<div className={styles['container']}>
			<div className={styles['side-bar']}>
				<SideBar room={currentRoom} setRoom={setRoom} />
			</div>
			<div className={styles['body']}>
				<div className={styles['main-window']}>
					<input
						type='button'
						value='create offer'
						onClick={
							/*Do Check for existing room before creating calloffer*/
							() => createOffer!(currentRoom!, socketId!, client!)
						}
					/>
				</div>
				<div className={styles['chat']}>{currentRoom ? <ChatBox room={currentRoom} /> : ''}</div>
			</div>
		</div>
	);
}

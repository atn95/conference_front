import { MainPageProps } from '../types/PageProps';
import { useSocket } from '../hooks/StompProvider';
import { socketInfo } from '../types/SocketTypes';
import { useEffect, useRef, useState } from 'react';
import ChatBox from '../components/ChatBox';
import styles from '../styles/pages/Main.module.css';
import SideBar from '../components/SideBar';
import { room } from '../types/UserTypes';
import { useUserContext } from '../hooks/UserProvider';

export default function Main(props: MainPageProps) {
	const [currentRoom, setRoom] = useState<room | null>(null);
	const { socketId } = useUserContext() || { socketId: '' };
	const { client, subscriptions }: socketInfo = useSocket() || { client: undefined, subscriptions: [] };
	const [pc, setPc] = useState<RTCPeerConnection>();
	let localVideoRef = useRef<HTMLVideoElement>(null);
	let remoteVideoRef = useRef<HTMLVideoElement>(null);

	const pc_config = {
		iceServers: [
			// {
			//   urls: 'stun:[STUN_IP]:[PORT]',
			//   'credentials': '[YOR CREDENTIALS]',
			//   'username': '[USERNAME]'
			// },
			{
				//Free google stun server
				urls: 'stun:stun.l.google.com:19302',
			},
		],
	};
	const localPCConnection = new RTCPeerConnection(pc_config);

	const createOffer = async () => {
		const sdp = await localPCConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
		console.log(sdp, 'setting SessionDescription');
		localPCConnection.setLocalDescription(new RTCSessionDescription(sdp));
		console.log(socketId);
		client?.publish({ destination: `/ws/call/${currentRoom?.id}`, body: JSON.stringify({ type: 'video', sdp: JSON.stringify(sdp), from: socketId }) });
	};

	return (
		<div className={styles['container']}>
			<div className={styles['side-bar']}>
				<SideBar room={currentRoom} setRoom={setRoom} />
			</div>
			<div className={styles['body']}>
				<div className={styles['main-window']}>
					<input type='button' value='create offer' onClick={createOffer} />
				</div>
				<div className={styles['chat']}>{currentRoom ? <ChatBox room={currentRoom} /> : ''}</div>
			</div>
		</div>
	);
}

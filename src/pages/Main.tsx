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
import { error } from 'console';

export default function Main(props: MainPageProps) {
	const { user, rooms, setRooms } = useUserContext() || { user: null, rooms: null, setRooms: null };
	const [currentRoom, setRoom] = useState<room | null>(null);
	const { client, subscriptions, setSubscriptions, setServerUrl } =
		useSocket() ||
		{
			/**Fallback to empty object */
		};
	const { computer, createOffer } = useWebRTC() || {};
	let localVideoRef = useRef<HTMLVideoElement>(null);
	let remoteVideoRef = useRef<HTMLVideoElement>(null);

	const sendCallRequest = async () => {
		/*@TODO: Do Check for existing room before creating call offer convert id to Long*/
		const offer = await createOffer!(currentRoom!, user!.id.toString(), client!);
		client?.publish({ destination: `/ws/call/${currentRoom?.id}`, body: JSON.stringify({ type: 'video-offer', sdp: JSON.stringify(offer), from: user!.id }) });
	};

	const streamVideoTrack = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			if (localVideoRef.current) {
				localVideoRef.current.srcObject = stream;
			}
			//do after connection is setup
			stream.getTracks().forEach((track) => {
				console.log('computer', computer);
				computer!.addTrack(track, stream);
				console.log('added streaming track');
			});
		} catch (e) {
			console.log(e);
		} finally {
			computer!.ontrack = (e) => {
				console.log(e.streams);
				console.log('add remotetrack success');
				if (remoteVideoRef.current) {
					remoteVideoRef.current.srcObject = e.streams[0];
				}
			};
		}
	};

	useEffect(() => {
		streamVideoTrack();
	}, [props.inCall]);

	return (
		<div className={styles['container']}>
			<div className={styles['side-bar']}>
				<SideBar room={currentRoom} setRoom={setRoom} />
			</div>
			<div className={styles['body']}>
				<div className={styles['main-window']}>
					<input type='button' value='create offer' onClick={sendCallRequest} />
					<div>
						Local Feed
						<video
							style={{
								width: 240,
								height: 240,
								margin: 5,
								backgroundColor: 'black',
							}}
							muted
							ref={localVideoRef}
							autoPlay
						/>
					</div>
					<div>
						Remote
						<video
							id='remotevideo'
							style={{
								width: 240,
								height: 240,
								margin: 5,
								backgroundColor: 'black',
							}}
							ref={remoteVideoRef}
							autoPlay
						/>
					</div>
				</div>
				<div className={styles['chat']}>{currentRoom ? <ChatBox room={currentRoom} /> : ''}</div>
			</div>
		</div>
	);
}

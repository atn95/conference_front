import { MainPageProps } from '../types/PageProps';
import { useSocket } from '../hooks/StompProvider';
import { useEffect, useRef, useState } from 'react';
import ChatBox from '../components/ChatBox';
import styles from '../styles/pages/Main.module.css';
import SideBar from '../components/SideBar';
import { room } from '../types/UserTypes';
import { useUserContext } from '../hooks/UserProvider';
import CallDisplay from '../components/CallDisplay';
import { callInfo } from '../types/CallTypes';
import { socketData } from '../types/SocketTypes';

export default function Main(props: MainPageProps) {
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
	const { user, rooms } = useUserContext() || { user: null, rooms: [] };
	const [peerConnection, setPeerConnnection] = useState(new RTCPeerConnection(pc_config));
	const [currentRoom, setRoom] = useState<room | null>(null);
	const [peerConnectionState, setPeerConnnectionState] = useState(peerConnection.connectionState);
	const { client, subscriptions, setSubscriptions, setServerUrl, loadedSocket } = useSocket() || {};
	const [callInfo, setCallInfo] = useState<callInfo | null>(null);
	const [callState, setCallState] = useState(false);

	const setupConnection = (room: number) => {
		peerConnection.onicecandidate = (e) => {
			if (e.candidate) {
				console.log('sending candidate from:' + user!.id);
				client!.publish({ destination: `/ws/candidate/${room}`, body: JSON.stringify({ type: 'candidate', candidate: JSON.stringify(e.candidate), from: user!.id }) });
			}
		};
		peerConnection.onconnectionstatechange = (e) => {
			console.log(e);
			//handleDisconnect
			setPeerConnnection(new RTCPeerConnection(pc_config));
		};
	};

	//calling the room the buddy is in
	const createCallOffer = async (friendRoomID: number) => {
		try {
			const sdp = await peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
			console.log('setting local SessionDescription');
			peerConnection.setLocalDescription(new RTCSessionDescription(sdp));
			const newCall: callInfo = { room: friendRoomID, role: 'caller' };
			setCallInfo(newCall);
			setupConnection(friendRoomID);
			//send SDP
		} catch (error) {
			console.log(error);
			console.log('Something went wrong');
		}
	};

	const createAnswer = async (sdp: RTCSessionDescription, roomId: number) => {
		try {
			const remoteDescription = await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
			console.log('Remote description Set');
			const ans = await peerConnection.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
			console.log('created answer');
			const localDescription = await peerConnection.setLocalDescription(new RTCSessionDescription(ans));
			console.log('set local description');
			const newCall: callInfo = { room: roomId, role: 'reciever' };
			setCallInfo(newCall);
			setupConnection(roomId);
			//send answer back through socket
		} catch (error) {
			console.log(error);
			console.log('Something went wrong');
		}
	};

	useEffect(() => {
		console.log(client);
		if (client) {
			const handleSocketData = async (room: room, index: number, data: socketData) => {
				console.log(data.data);
				if (data.type == 'call-offer') {
					//on call offer
					if (data.data.from !== user!.id.toString()) {
					}
				} else if (data.type == 'call-answer') {
					if (data.data.from != user!.id.toString()) {
					}
				} else if (data.type == 'ice-candidate') {
					if (user?.id != data.data.from) {
					}
				}
			};

			//do whatever cause socket exists
			const listen = rooms!.map((room, index) => {
				return {
					endpoint: `/topic/call/${room.id}`,
					callback: (data: any) => {
						handleSocketData(room, index, JSON.parse(data.body));
					},
				};
			});

			const currSubs = [...subscriptions!, ...listen];
			setSubscriptions!(currSubs);
		}
		// streamVideoTrack();
	}, [loadedSocket]);

	useEffect(() => {}, [peerConnection]);

	return (
		<div className={styles['container']}>
			<div className={styles['side-bar']}>
				<SideBar room={currentRoom} setRoom={setRoom} call={createCallOffer} />
			</div>
			<div className={styles['body']}>
				<div className={styles['main-window']}>{loadedSocket && callState ? <CallDisplay room={3} /> : ''}</div>
				<div className={styles['chat']}>{currentRoom ? <ChatBox room={currentRoom} /> : ''}</div>
			</div>
		</div>
	);
}

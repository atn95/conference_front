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
import { error } from 'console';

export default function Main(props: MainPageProps) {
	const pc_config = {
		iceServers: [
			// {
			//   urls: 'stun:[STUN_IP]:[PORT]',
			//   'credentials': '[YOR CREDENTIALS]',
			//   'username': '[USERNAME]'
			// },
			{
				urls: 'stun:stun.l.google.com:19302',
			},
		],
	};
	const { user, rooms } = useUserContext() || { user: null, rooms: [] };
	const [peerConnection, setPeerConnnection] = useState(new RTCPeerConnection(pc_config));
	const [currentRoom, setRoom] = useState<room | null>(null);
	const { client, subscriptions, setSubscriptions, setServerUrl, loadedSocket } = useSocket() || {};
	const [callInfo, setCallInfo] = useState<callInfo | null>(null);
	const [localStreamLoaded, setLocalStreamLoaded] = useState(false);
	const [callState, setCallState] = useState(false);
	const [addIceCandidate, setIceCandidate] = useState([]);
	let localVideoRef = useRef<HTMLVideoElement>(null);
	let remoteVideoRef = useRef<HTMLVideoElement>(null);

	const setupConnection = (room: number) => {
		peerConnection.oniceconnectionstatechange = (e) => {
			//handleDisconnect
			console.log(e);
			if (peerConnection.iceConnectionState == 'disconnected') {
				// setPeerConnnection(new RTCPeerConnection(pc_config));
			}
		};
		peerConnection.ontrack = (e) => {
			console.log(e.streams);
			remoteVideoRef!.current!.srcObject = e.streams[0];
			console.log('add remotetrack success');
		};
		// await streamVideoTrack();
	};

	//calling the room the buddy is in
	const createCallOffer = async (friendRoomID: number) => {
		try {
			const sdp = await peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
			console.log('setting local SessionDescription');
			peerConnection.setLocalDescription(new RTCSessionDescription(sdp));
			const newCall: callInfo = { room: friendRoomID, role: 'caller' };
			setCallInfo(newCall);
			//send SDP
			client!.publish({ destination: `/ws/call/${friendRoomID}`, body: JSON.stringify({ type: 'video-offer', sdp: JSON.stringify(sdp), from: user!.id }) });
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
			setupConnection(roomId);
			console.log('set local description');

			const newCall: callInfo = { room: roomId, role: 'reciever' };
			setCallInfo(newCall);
			//send answer back through socket
			client!.publish({ destination: `/ws/answer/${roomId}`, body: JSON.stringify({ type: 'video-answer', sdp: JSON.stringify(ans), from: user!.id }) });
			// setCallState(true);
		} catch (error) {
			console.log(error);
			console.log('Something went wrong');
		}
	};

	useEffect(() => {
		console.log(client);
		if (client) {
			const handleSocketData = async (room: room, index: number, data: socketData) => {
				// console.log(data.room);
				if (data.type == 'call-offer') {
					//on call offer
					if (data.data.from !== user!.id.toString()) {
						console.log('creating answer');
						createAnswer(JSON.parse(data.data.sdp), data.room);
						peerConnection.onicecandidate = (e) => {
							if (e.candidate) {
								console.log('sending candidate from:' + user!.id);
								client!.publish({ destination: `/ws/candidate/${data.room}`, body: JSON.stringify({ type: 'candidate', candidate: JSON.stringify(e.candidate), from: user!.id }) });
							}
						};
						setupConnection(data.room);
						setCallState(true);
					}
				} else if (data.type == 'call-answer') {
					if (data.data.from != user!.id.toString()) {
						console.log('answer-recieved');
						peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(data.data.sdp)));
						peerConnection.onicecandidate = (e) => {
							if (e.candidate) {
								console.log('sending candidate from:' + user!.id);
								client!.publish({ destination: `/ws/candidate/${data.room}`, body: JSON.stringify({ type: 'candidate', candidate: JSON.stringify(e.candidate), from: user!.id }) });
							}
						};
						setupConnection(data.room);
						console.log('set remote SessionDescription');
						setCallState(true);
					}
				} else if (data.type == 'ice-candidate') {
					console.log(JSON.parse(data.data.candidate));
					if (data.data.from != user?.id.toString()) {
						console.log(data.data.from, user?.id.toString());
						await peerConnection.addIceCandidate(JSON.parse(data.data.candidate));
						console.log('Success adding candidate');
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
	}, [loadedSocket]);

	const streamVideoTrack = async () => {
		console.log('streaming vid');
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
				console.log('computer', peerConnection);
				peerConnection!.addTrack(track, stream);
				console.log('added streaming track');
			});
			setLocalStreamLoaded(true);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		//add at begginin?
		// streamVideoTrack();
		streamVideoTrack();
		if (callState) {
		}
		setTimeout(() => {
			// peerConnection.restartIce();
		}, 5000);
	}, [callState]);

	return (
		<div className={styles['container']}>
			<div className={styles['side-bar']}>
				<SideBar room={currentRoom} setRoom={setRoom} call={createCallOffer} />
			</div>
			<div className={styles['body']}>
				<div className={styles['main-window']}>
					{loadedSocket && callState ? (
						<>
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
						</>
					) : (
						''
					)}
				</div>
				<div className={styles['chat']}>{currentRoom ? <ChatBox room={currentRoom} /> : ''}</div>
			</div>
		</div>
	);
}

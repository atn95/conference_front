import { MainPageProps } from '../types/PageProps';
import { useSocket } from '../hooks/StompProvider';
import { useEffect, useRef, useState } from 'react';
import ChatBox from '../components/ChatBox';
import styles from '../styles/pages/Main.module.css';
import SideBar from '../components/SideBar';
import { room, userSearchResult } from '../types/UserTypes';
import { useUserContext } from '../hooks/UserProvider';
import { socketData } from '../types/SocketTypes';
import FriendRequest from '../components/FriendRequestPopUp';
import Client from '../utils/AxiosClient';

export default function Main(props: MainPageProps) {
	const pc_config = {
		iceServers: [
			// {
			//   urls: 'stun:[STUN_IP]:[PORT]',
			//   'credentials': '[YOR CREDENTIALS]',
			//   'username': '[USERNAME]'
			// },
			//Free google stuns
			{ urls: 'stun:stun.l.google.com:19302' },
			{ urls: 'stun:stun.l.google.com:19302' },
			{ urls: 'stun:stun1.l.google.com:19302' },
			{ urls: 'stun:stun2.l.google.com:19302' },
			{ urls: 'stun:stun3.l.google.com:19302' },
			{ urls: 'stun:stun4.l.google.com:19302' },
		],
	};
	const [newFriendPopUp, setNewFriendPopUp] = useState(false);
	const { user, rooms } = useUserContext() || { user: null, rooms: [] };
	const [peerConnection, setPeerConnnection] = useState(new RTCPeerConnection(pc_config));
	const [currentRoom, setRoom] = useState<room | null>(null);
	const { client, subscriptions, setSubscriptions, activeSubs, setActiveSubs, loadedSocket } = useSocket() || {};
	const [pendingFriendReq, setPendingFriendReq] = useState<Array<userSearchResult>>([]);
	const [localStreamLoaded, setLocalStreamLoaded] = useState(false);
	const [callState, setCallState] = useState(false);

	const [incomingCall, setIncomingCall] = useState(false);
	const [callInformation, setCallInformation] = useState<any>(null);

	let localVidFeed = useRef<HTMLVideoElement>(null);
	let remoteVidFeed = useRef<HTMLVideoElement>(null);

	//@TODO: implement later
	let webRTCClientRef = useRef<RTCPeerConnection>();
	webRTCClientRef.current = peerConnection;

	const setupConnection = (room: number) => {
		peerConnection.oniceconnectionstatechange = (e) => {
			//handleDisconnect
			console.log(e);
			if (peerConnection.iceConnectionState == 'disconnected') {
				setCallState(false);
				props.reload((prev: number) => prev + 1);
				peerConnection.close();
				const newRTCClient = new RTCPeerConnection(pc_config);
				setPeerConnnection(newRTCClient);
				webRTCClientRef.current = newRTCClient;
				console.log(peerConnection);
			}
		};
		peerConnection.ontrack = (e) => {
			console.log(e.streams);
			remoteVidFeed!.current!.srcObject = e.streams[0];
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
			//send SDP
			client!.publish({ destination: `/ws/call/${friendRoomID}`, body: JSON.stringify({ type: 'video-offer', sdp: JSON.stringify(sdp), from: user!.id }) });
			console.log({ destination: `/ws/call/${friendRoomID}`, body: JSON.stringify({ type: 'video-offer', sdp: JSON.stringify(sdp), from: user!.id }) });
			// setCallState(true);
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
			//send answer back through socket
			client!.publish({ destination: `/ws/answer/${roomId}`, body: JSON.stringify({ type: 'video-answer', sdp: JSON.stringify(ans), from: user!.id }) });
			// setCallState(true);
		} catch (error) {
			console.log(error);
			console.log('Something went wrong');
		}
	};

	const loadFriendReq = async () => {
		try {
			const res = await Client.get(`/api/user/pending/${user!.id}`);
			console.log(res.data);
			setPendingFriendReq(res.data);
		} catch (e) {}
	};

	const accept = () => {
		console.log('creating answer');
		createAnswer(JSON.parse(callInformation.data.data.sdp), callInformation.data.room);
		peerConnection.onicecandidate = (e) => {
			if (e.candidate) {
				console.log('sending candidate from:' + user!.id);
				client!.publish({ destination: `/ws/candidate/${callInformation.data.room}`, body: JSON.stringify({ type: 'candidate', candidate: JSON.stringify(e.candidate), from: user!.id }) });
			}
		};
		setupConnection(callInformation.data.room);
		setIncomingCall(false);
		setCallInformation(null);
		setCallState(true);
	};

	const reject = () => {};

	useEffect(() => {
		const handleSocketData = async (room: room, index: number, data: socketData) => {
			if (data.type == 'call-offer') {
				//on call offer
				if (data.data.from !== user!.id.toString()) {
					setIncomingCall(true);
					setCallInformation({ room, index, data });
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
					await peerConnection.addIceCandidate(JSON.parse(data.data.candidate));
					console.log('Success adding candidate');
				}
			} else if (data.type == 'reject') {
				setCallState(false);
				props.reload((prev: number) => prev + 1);
				peerConnection.close();
				const newRTCClient = new RTCPeerConnection(pc_config);
				setPeerConnnection(newRTCClient);
				webRTCClientRef.current = newRTCClient;
			}
		};
		console.log(client);
		if (client) {
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
			console.log('updated callbacks');

			//load pending request
			loadFriendReq();
		}
	}, [loadedSocket]);

	const streamVideoTrack = async () => {
		console.log('streaming vid');
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			if (localVidFeed.current) {
				localVidFeed.current.srcObject = stream;
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
		if (client) {
			const handleSocketData = async (room: room, index: number, data: socketData) => {
				// console.log(data.room);
				if (data.type == 'call-offer') {
					//on call offer
					if (data.data.from !== user!.id.toString()) {
						setIncomingCall(true);
						setCallInformation({ room, index, data });
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
				} else if (data.type == 'reject') {
					setCallState(false);
					props.reload((prev: number) => prev + 1);
					peerConnection.close();
					const newRTCClient = new RTCPeerConnection(pc_config);
					setPeerConnnection(newRTCClient);
					webRTCClientRef.current = newRTCClient;
				}
			};
			const updateAndRestartSocket = () => {
				//getting all subs and removing
				for (const sub of activeSubs!) {
					sub.unsubscribe();
				}

				const listenForChat = rooms!.map((room, index) => {
					return {
						endpoint: `/topic/room/${room.id}`,
						callback: (data: any) => {
							handleSocketData(room, index, JSON.parse(data.body));
						},
					};
				});
				// socket?.setSubscriptions!(listen);
				const listenForCall = rooms!.map((room, index) => {
					return {
						endpoint: `/topic/call/${room.id}`,
						callback: (data: any) => {
							handleSocketData(room, index, JSON.parse(data.body));
						},
					};
				});

				const updatedSubs = [...listenForChat!, ...listenForCall];
				setSubscriptions!(updatedSubs);

				const active = [];
				for (const sub of updatedSubs!) {
					let subs = client!.subscribe(sub.endpoint, sub.callback);
					active.push(subs);
				}
				setActiveSubs!(active);
			};
			updateAndRestartSocket();
		}
		streamVideoTrack();
		if (callState) {
			console.log(peerConnection);
		}
	}, [callState]);

	useEffect(() => {}, [incomingCall]);

	return (
		<div className={styles['container']}>
			{newFriendPopUp ? <FriendRequest /> : ''}
			{incomingCall ? (
				<div className={styles['call-popup-container']}>
					<div onClick={reject}>X</div>
					<div onClick={accept}>✓</div>
				</div>
			) : (
				''
			)}
			<div className={styles['side-bar']}>
				<SideBar room={currentRoom} setRoom={setRoom} call={createCallOffer} showAddFriendPop={newFriendPopUp} setFriendReqPop={setNewFriendPopUp} pendingFriendReq={pendingFriendReq} setPendingFriendReq={setPendingFriendReq} />
			</div>
			<div className={styles['body']}>
				<div className={styles['main-window']}>
					{loadedSocket && callState ? (
						<>
							<div className={styles['small-vid-container']}>
								<video className={styles['small-vid']} muted ref={localVidFeed} autoPlay controls={true} />
							</div>
							<div className={styles['big-vid-container']}>
								<video id='remotevideo' className={styles['big-vid']} ref={remoteVidFeed} autoPlay controls={true} />
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

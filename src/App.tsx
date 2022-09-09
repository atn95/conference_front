import './styles/App.css';
import { useState, useEffect } from 'react';
import { StompProvider, useSocket } from './hooks/StompProvider';
import Main from './pages/Main';
import { useUserContext } from './hooks/UserProvider';
import Login from './pages/Login';
import { room } from './types/UserTypes';
import { socketData } from './types/SocketTypes';
import { useWebRTC } from './hooks/WebRTCProvider';

function App() {
	const { user, rooms, setRooms, loaded } = useUserContext() || { user: null, rooms: null, setRooms: null, loaded: false };
	// subsribeUrl='https://localhost:8443/socket' subscriptions={listen!}
	const { computer, createAnswer } = useWebRTC() || { computer: undefined };
	const [inCall, setInCall] = useState(false);
	let socket = useSocket();

	const handleSocketData = async (room: room, index: number, data: socketData) => {
		if (data.type == 'chat-message') {
			//on chat message recieve
			let rm = [...(rooms ? rooms : [])];
			rm[index]?.log.push(data.data);
			setRooms?.(rm);
			console.log('Room:' + room.id, data.data);
		} else if (data.type == 'call-offer') {
			//on call offer
			if (data.data.from !== user!.id.toString()) {
				console.log('call from:' + data.data.from);
				//if accept create and send ans back (store as a state??? incoming calls state)
				const ans = await createAnswer?.(JSON.parse(data.data.sdp));
				// console.log(socket?.client);
				socket!.client!.publish({ destination: `/ws/answer/${room.id}`, body: JSON.stringify({ type: 'video-answer', sdp: JSON.stringify(ans), from: user!.id }) });
			}
		} else if (data.type == 'call-answer') {
			if (data.data.from != user!.id.toString()) {
				console.log('call answer \n setting remote description?');
				computer?.setRemoteDescription(new RTCSessionDescription(JSON.parse(data.data.sdp)));
				setInCall(true);
			}
		} else if (data.type == 'ice-candidate') {
			console.log(JSON.parse(data.data));
		}
	};

	useEffect(() => {
		if (loaded) {
			socket?.setServerUrl!('https://localhost:8443/socket');
		}
	}, [loaded]); //if user is loaded create socket connection

	useEffect(() => {
		if (socket?.client) {
			const listen = rooms!.map((room, index) => {
				return {
					endpoint: `/topic/room/${room.id}`,
					callback: (data: any) => {
						handleSocketData(room, index, JSON.parse(data.body));
					},
				};
			});
			socket?.setSubscriptions!(listen);
		}
	}, [socket?.client]);

	return <main className='app'>{loaded ? <Main friends={user?.friends} inCall={inCall} /> : <Login />}</main>;
}

export default App;

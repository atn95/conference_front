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
	const { computer, createOffer, createAnswer } = useWebRTC() || { computer: undefined };
	let socket = useSocket();

	const handleSocketData = async (room: room, index: number, data: socketData) => {
		console.log(data);
		if (data.type == 'chat-message') {
			//on chat message recieve
			let rm = [...(rooms ? rooms : [])];
			rm[index]?.log.push(data.data);
			setRooms?.(rm);
			console.log('Room:' + room.id, data.data);
		} else if (data.type == 'call-offer') {
			//on call offer
			console.log(JSON.parse(data.data.sdp));
			if (data.data.from !== user!.id.toString()) {
				console.log('call from:' + data.data.from);
				//if accept create and send ans back (store as a state??? incoming calls state)
				const ans = await createAnswer?.(JSON.parse(data.data.sdp));
				console.log(ans);
				console.log(socket?.client);
				// client!.publish({ destination: `/ws/call/${room.id}`, body: JSON.stringify({ type: 'video-answer', sdp: JSON.stringify(ans), from: user!.id }) });
			}
		} else if (data.type == 'call-answer') {
		}
	};

	useEffect(() => {
		if (loaded) {
			console.log('called');
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

	return <main className='app'>{loaded ? <Main friends={user?.friends} /> : <Login />}</main>;
}

export default App;

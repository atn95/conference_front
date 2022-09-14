import './styles/App.css';
import { useState, useEffect } from 'react';
import { useSocket } from './hooks/StompProvider';
import { useUserContext } from './hooks/UserProvider';
import Login from './pages/Login';
import { room } from './types/UserTypes';
import { socketData } from './types/SocketTypes';
import { useWebRTC } from './hooks/WebRTCProvider';
import { Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Register from './pages/Register';

function App() {
	const { user, rooms, setRooms, loaded } = useUserContext() || { user: null, rooms: null, setRooms: null, loaded: false };
	// subsribeUrl='https://localhost:8443/socket' subscriptions={listen!}
	const { computer, createAnswer } = useWebRTC() || { computer: undefined };
	const [inCall, setInCall] = useState(false);
	let socket = useSocket();
	const [reloadHack, setReloadHack] = useState<number>(0);

	useEffect(() => {
		if (loaded) {
			socket?.setServerUrl!('https://localhost:8443/socket');
		}
	}, [loaded]); //if user is loaded create socket connection

	useEffect(() => {
		if (socket?.client && computer) {
			const handleSocketData = async (room: room, index: number, data: socketData) => {
				if (data.type == 'chat-message') {
					//on chat message recieve
					let rm = [...(rooms ? rooms : [])];
					rm[index]?.log.push(data.data);
					setRooms?.(rm);
					console.log('Room:' + room.id, data.data);
				}
			};

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
	}, [socket?.client, computer]);

	return (
		<main className='app'>
			{loaded ? (
				<Main key={reloadHack} reload={setReloadHack} friends={user?.friends} inCall={inCall} setInCall={setInCall} />
			) : (
				<Routes>
					<Route path='/register' element={<Register />} />
					<Route path='/*' element={<Login />} />
				</Routes>
			)}
		</main>
	);
}

export default App;

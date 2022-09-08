import './styles/App.css';
import { useState, useEffect } from 'react';
import { StompProvider } from './hooks/StompProvider';
import Main from './pages/Main';
import { useUserContext } from './hooks/UserProvider';
import Login from './pages/Login';
import { room } from './types/UserTypes';
import { socketData } from './types/SocketTypes';

function App() {
	const { user, rooms, setRooms, socketId } = useUserContext() || { user: null, rooms: null, setRooms: null, socketId: '' };

	const listen = rooms?.map((room, index) => {
		return {
			endpoint: `/topic/room/${room.id}`,
			callback: (data: any) => {
				handleSocketData(room, index, JSON.parse(data.body));
			},
		};
	});

	const handleSocketData = (room: room, index: number, data: socketData) => {
		console.log(data);
		if (data.type == 'chat-message') {
			let rm = [...(rooms ? rooms : [])];
			rm[index]?.log.push(data.data);
			setRooms?.(rm);
			console.log('Room:' + room.id, data.data);
		} else if (data.type == 'call-offer') {
			console.log(data.data);
			console.log(JSON.parse(data.data.sdp));
		}
	};

	return (
		<main className='app'>
			{user && rooms ? (
				<StompProvider subsribeUrl='https://localhost:8443/socket' subscriptions={listen!}>
					<Main friends={user?.friends} />
				</StompProvider>
			) : (
				<Login />
			)}
		</main>
	);
}

export default App;

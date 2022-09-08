import './styles/App.css';
import { useState, useEffect } from 'react';
import { StompProvider } from './hooks/StompProvider';
import axios from 'axios';
import Main from './pages/Main';
import { useUserContext } from './hooks/UserProvider';
import Login from './pages/Login';

function App() {
	const { user, setUser, rooms, setRooms } = useUserContext() || { user: null, setUser: null, rooms: null, setRooms: null };
	const listen = rooms?.map((room, index) => {
		return {
			endpoint: `/topic/room/${room.id}`,
			callback: (data: any) => {
				let rm = [...(rooms ? rooms : [])];
				rm[index]?.log.push(JSON.parse(data.body));
				setRooms?.(rm);
				console.log('Room:' + room.id, JSON.parse(data.body));
			},
		};
	});

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

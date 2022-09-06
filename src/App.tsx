import './styles/App.css';
import { useState, useEffect } from 'react';
import { StompProvider } from './hooks/StompProvider';
import axios from 'axios';
import Main from './pages/Main';
import { room, userInfo } from './types/UserTypes';
import { useUserContext } from './hooks/UserProvider';

function App() {
	const account: userInfo | null = useUserContext();
	const { user, setUser, rooms, setRooms } = account || { user: null, setUser: null, rooms: [], setRooms: null };
	const [room, setRoom] = useState<room | null>(null);

	const listen = account?.user?.friends.map((friend, index) => {
		return {
			endpoint: `/topic/room/${friend.room.id}`,
			callback: (data: any) => {
				let rm = [...rooms];
				rm[index]?.log.push(JSON.parse(data.body));
				setRooms?.(rm);
				console.log(JSON.parse(data.body));
			},
		};
	});

	const [listenTo, setListenTo] = useState([]);

	const getUser = async () => {
		//will change to login post later;
		let res = await axios.get('https://localhost:8443/api/user/account/atn95@gmail.com');
		return account?.setUser(res.data);
	};

	useEffect(() => {
		getUser();
		//call login
	}, []);

	return (
		<main className='app'>
			{user && rooms.length > 0 ? (
				<StompProvider subsribeUrl='https://localhost:8443/socket' subscriptions={listen!}>
					<Main friends={account?.user?.friends} rooms={rooms} />
				</StompProvider>
			) : (
				''
			)}
		</main>
	);
}

export default App;

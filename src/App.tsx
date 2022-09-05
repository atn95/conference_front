import './styles/App.css';
import { useState, useEffect } from 'react';
import { StompProvider } from './hooks/StompProvider';
import axios from 'axios';
import Main from './pages/Main';
import { room, userInfo } from './types/UserTypes';
import { useUserContext } from './hooks/UserProvider';

function App() {
	const [friends, setFriends] = useState([{ room: 3 }]);
	const [rooms, setRooms] = useState<Array<room>>([{ room_id: 3, messages: [] }]);

	const account: userInfo | null = useUserContext();

	const listen = friends.map((friend, index) => {
		return {
			endpoint: `/topic/room/${friend.room}`,
			callback: (data: any) => {
				let rm = [...rooms];
				rm[index].messages.push(JSON.parse(data.body));
				setRooms(rm);
				console.log(JSON.parse(data.body));
			},
		};
	});

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
			<StompProvider subsribeUrl='https://localhost:8443/socket' subscriptions={listen}>
				<Main friends={friends} rooms={rooms} />
			</StompProvider>
		</main>
	);
}

export default App;

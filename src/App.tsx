import { useState, useEffect } from 'react';
import { StompProvider } from './hooks/StompProvider';
import Main from './pages/Main';
import './styles/App.css';
import { room } from './types/UserTypes';

function App() {
	const [friends, setFriends] = useState([{ room: 3 }]);
	const [rooms, setRooms] = useState<Array<room>>([{ room_id: 3, messages: [] }]);

	const listen = friends.map((friend, index) => {
		return {
			endpoint: `/topic/room/${friend.room}`,
			callback: (data: any) => {
				let rm = [...rooms];
				rm[index].messages.push(JSON.parse(data.body));
				console.log(JSON.parse(data.body));
			},
		};
	});

	return (
		<main className='app'>
			<StompProvider subsribeUrl='https://localhost:8443/socket' subscriptions={listen}>
				<Main friends={friends} rooms={rooms} />
			</StompProvider>
		</main>
	);
}

export default App;

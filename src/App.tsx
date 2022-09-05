import { useState, useEffect } from 'react';
import { StompProvider } from './hooks/StompProvider';
import Main from './pages/Main';

function App() {
	const [friends, setFriends] = useState([{ room: 3 }]);

	const listen = [
		{
			endpoint: `/topic/room/${friends[0].room}`,
			callback: (data: any) => {
				console.log(JSON.parse(data.body));
			},
		},
	];

	return (
		<main className='app'>
			<StompProvider subsribeUrl='https://localhost:8443/socket' subscriptions={listen}>
				<Main friends={friends} />
			</StompProvider>
		</main>
	);
}

export default App;

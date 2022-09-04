import { useState, useEffect } from 'react';
import { StompProvider } from './hooks/StompProvider';
import Main from './pages/Main';

function App() {
	const listen = [
		{
			endpoint: `/topic/messages`,
			callback: (data: any) => {
				console.log(JSON.parse(data.body));
			},
		},
	];

	return (
		<div className='App'>
			<StompProvider subsribeUrl='https://localhost:8443/socket' subscriptions={listen}>
				<Main />
			</StompProvider>
		</div>
	);
}

export default App;

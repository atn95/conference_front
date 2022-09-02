import { useState, useEffect } from 'react';
import { StompProvider } from './hooks/StompProvider';
import Main from './pages/Main';

function App() {
	return (
		<div className='App'>
			<StompProvider subsribeUrl='https://localhost:8443/socket' subscribed={['/ws/topic/messages']}>
				<Main />
			</StompProvider>
		</div>
	);
}

export default App;

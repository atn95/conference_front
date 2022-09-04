import { MainPageProps } from '../types/PageProps';
import { StompProvider, useSocket } from '../hooks/StompProvider';
import { socketInfo } from '../types/SocketTypes';
import { useEffect } from 'react';

export default function Main(props: MainPageProps) {
	const stomp: socketInfo | undefined = useSocket();

	const sendSomething = () => {
		stomp?.client?.publish({
			destination: '/ws/message',
			body: JSON.stringify({ messageContent: 'string' }),
		});
	};

	return (
		<div>
			<button onClick={sendSomething}>do Something</button>
		</div>
	);
}

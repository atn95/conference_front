import { MainPageProps } from '../types/PageProps';
import { useSocketContext } from '../hooks/StompProvider';
import { Client } from '@stomp/stompjs';
import { socketInfo } from '../types/SocketTypes';

export default function Main(props: MainPageProps) {
	const socket: socketInfo | undefined = useSocketContext();

	const sendSomething = () => {
		console.log(socket);
		socket?.client?.publish({
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

import styles from '../styles/components/ChatBox.module.css';
import axios from 'axios';
import { message } from '../types/PostTypes';
import { useState, useEffect, useRef } from 'react';
import { ChatBoxProps } from '../types/ComponentProps';
import { recievedMessage } from '../types/RecieveTypes';

export default function ChatBox(props: ChatBoxProps) {
	const [input, setInput] = useState<string>('');
	const [send, setSend] = useState<boolean>(false);
	const chatBottom = useRef<null | HTMLDivElement>(null);

	function scrollToBottom() {
		console.log('called');
		chatBottom.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
	}

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.currentTarget.value);
	};

	const sendChatMessage = async () => {
		try {
			let msg: message = { room_id: 3, author_id: 1, content: input };
			const res = await axios.post('https://localhost:8443/api/chat/sendchat/3', msg);
			setInput('');
			setSend(false);
		} catch (e) {
			console.log(e);
		}
	};

	const submitInput = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSend(true);
	};

	useEffect(() => {
		if (send) {
			sendChatMessage();
		}
	}, [send]);

	useEffect(() => {
		scrollToBottom();
	}, [props]);

	return (
		<div className={styles['container']}>
			<div className={styles['log']}>
				{props.room?.log.map((msg: recievedMessage) => (
					<div className={styles['log-text']}>
						<p className={styles['text']}>
							{msg.author.displayName}: {msg.content}
						</p>
					</div>
				))}
				<div ref={chatBottom}></div>
			</div>
			<form className={styles['message-comp']} onSubmit={submitInput}>
				<input className={styles['input']} type='text' value={input} onChange={handleInput} required={true} />
				<input className={styles['btn']} type='submit' value='send' />
			</form>
		</div>
	);
}
function useUserContext(): { user: any; setUser: any; rooms: any; setRooms: any } {
	throw new Error('Function not implemented.');
}

import styles from '../styles/components/ChatBox.module.css';
import { message } from '../types/PostTypes';
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { ChatBoxProps } from '../types/ComponentProps';
import { recievedMessage } from '../types/RecieveTypes';
import Client from '../utils/AxiosClient';
import { useUserContext } from '../hooks/UserProvider';

export default function ChatBox(props: ChatBoxProps) {
	const { user } = useUserContext() || { user: null, setUser: null, rooms: [], setRooms: null };
	const [input, setInput] = useState<string>('');
	const [send, setSend] = useState<boolean>(false);
	const chatBottom = useRef<null | HTMLDivElement>(null);

	function scrollToBottom() {
		chatBottom.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
	}

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.currentTarget.value);
	};

	const sendChatMessage = async () => {
		try {
			let msg: message = { room_id: props.room.id, author_id: user!.id, content: input };
			const res = await Client.post(`/api/chat/sendchat/${props.room.id}`, msg);
			setInput('');
			setSend(false);
		} catch (e) {
			console.log(e);
			setSend(false);
		}
	};

	const submitInput = (e: FormEvent<HTMLFormElement>) => {
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

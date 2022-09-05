import styles from '../styles/components/ChatBox.module.css';
import axios from 'axios';
import { message } from '../types/PostTypes';
import { useState, useEffect } from 'react';
import { ChatBoxProps } from '../types/ComponentProps';
import { resolveModuleName } from 'typescript';
import { recievedMessage } from '../types/RecieveTypes';

export default function ChatBox(props: ChatBoxProps) {
	const [input, setInput] = useState<string>('');
	const [send, setSend] = useState<boolean>(false);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.currentTarget.value);
	};

	const sendChatMessage = async () => {
		try {
			let msg: message = { messageContent: input };
			const res = await axios.post('https://localhost:8443/api/chat/sendchat/3', msg);
			console.log(res.data.response);
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

	return (
		<div className={styles['container']}>
			<div className={styles['log']}>
				{props.room.messages.map((msg: recievedMessage) => (
					<p>{msg.content}</p>
				))}
			</div>
			<form className={styles['message-comp']} onSubmit={submitInput}>
				<input className={styles['input']} type='text' value={input} onChange={handleInput} required={true} />
				<input className={styles['btn']} type='submit' value='send' />
			</form>
		</div>
	);
}

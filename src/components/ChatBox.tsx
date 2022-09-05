import styles from '../styles/components/ChatBox.module.css';

export default function ChatBox() {
	return (
		<div className={styles['container']}>
			<div className={styles['log']}>Log Here</div>
			<form className={styles['message-comp']}>
				<input className={styles['input']} type='text' />
				<input className={styles['btn']} type='button' value='send' />
			</form>
		</div>
	);
}

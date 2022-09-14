import { MouseEvent, useEffect, useState } from 'react';
import { useUserContext } from '../hooks/UserProvider';
import styles from '../styles/components/UserCard.module.css';
import { UserCardProps } from '../types/ComponentProps';
import Client from '../utils/AxiosClient';

export default function UserCard(props: UserCardProps) {
	const [adding, setAdding] = useState(false);
	const accountInfo = useUserContext();
	const [person, setPerson] = useState(props.user);

	const handleAddRequest = (e: MouseEvent) => {
		if (!person.sentRequest) setAdding(true);
	};

	const sendRequest = async () => {
		try {
			const res = await Client.post('/api/user/friendrequest', { requester_id: accountInfo?.user?.id, receiver_id: person.id });
			console.log(res.data);
			let temp = { ...person };
			temp.sentRequest = true;
			setPerson(temp);
		} catch (error) {
		} finally {
			setAdding(false);
		}
	};

	useEffect(() => {
		if (adding) {
			sendRequest();
		}
	}, [adding]);

	return (
		<div className={styles['container']}>
			<div>Email: {person.email}</div>
			<div>Screen Name: {person.displayName}</div>
			<div className={styles['add']} onClick={handleAddRequest}>
				{!person.sentRequest ? 'Add' : 'Pending'}
			</div>
		</div>
	);
}

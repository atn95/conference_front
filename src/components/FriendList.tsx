import React from 'react';
import { useUserContext } from '../hooks/UserProvider';
import styles from '../styles/components/FriendList.module.css';
import callImg from '../assets/call.png';
import { FriendListProps } from '../types/ComponentProps';
//

export default function FriendList(props: FriendListProps) {
	const userInfo = useUserContext();
	return (
		<>
			{userInfo!.user?.friends.map((relation) => (
				<div className={styles['friend-item']} onClick={() => props.selectRoom(relation.friend.id)}>
					<div>{relation.friend.displayName}</div>
					<input type='image' src={callImg} onClick={() => props.call(relation.room.id)} />
				</div>
			))}
		</>
	);
}

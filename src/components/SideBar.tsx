import { useUserContext } from '../hooks/UserProvider';
import { SideBarProps } from '../types/ComponentProps';
import styles from '../styles/components/SideBar.module.css';

import { useState } from 'react';
import FriendList from './FriendList';

export default function SideBar(props: SideBarProps) {
	const userInfo = useUserContext();
	//0 = friend list, 1= pending list
	const [selectedList, setSelectedList] = useState(0);

	const selectRoom = (friendId: number) => {
		const friendRelation = userInfo!.rooms?.map((room) => room.relation.friend);
		props.setRoom(userInfo!.rooms![friendRelation!.indexOf(friendId)]);
	};

	const toggleFrienAdd = () => {
		props.setFriendReqPop(!props.showAddFriendPop);
	};

	return (
		<div className={styles['container']}>
			<div className={styles['profile-info']}>Picture here</div>
			<div className={styles['control-panel']}>
				<div className={styles['username-txt']}>{userInfo?.user?.displayName}</div>
				<div className={styles['list-selection']}>
					<div className={[styles['list-choice'], selectedList == 0 ? styles['active'] : undefined].join(' ')} onClick={() => setSelectedList(0)}>
						Friends
					</div>
					<div className={[styles['list-choice'], selectedList == 1 ? styles['active'] : undefined].join(' ')} onClick={() => setSelectedList(1)}>
						Pending
					</div>
				</div>
				<div>{selectedList == 0 ? <FriendList call={props.call} selectRoom={selectRoom} /> : ''}</div>
			</div>{' '}
			<div className={styles['add-friend-btn']} onClick={toggleFrienAdd}>
				Add Friend
			</div>
		</div>
	);
}

import React from 'react';
import { PendingFriendRequestProps } from '../types/ComponentProps';
import styles from '../styles/components/PendingFriendRequest.module.css';

export default function PendingFriendRequestPopUp(props: PendingFriendRequestProps) {
	return (
		<div className={styles['container']}>
			{props.pendingFriendReq.map((req) => (
				<div className={styles['request-item']}>
					<div className={styles['email-text']}>{req.email}</div>
					<div className={styles['control-container']}>
						<div className={styles['btn']}>X</div>
						<div className={styles['btn']}>✓</div>
					</div>
				</div>
			))}
		</div>
	);
}

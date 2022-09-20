import { MouseEventHandler, useState } from 'react';
import { PendingFriendRequestProps } from '../types/ComponentProps';
import styles from '../styles/components/PendingFriendRequest.module.css';
import Client from '../utils/AxiosClient';

export default function PendingFriendRequestPopUp(props: PendingFriendRequestProps) {
	const handleAccept = async (id: number) => {
		await Client.post(`/api/user/accept/${id}`);
	};

	const handleReject = async (id: number) => {
		await Client.get(`/api/user/reject/${id}`);
	};

	return (
		<div className={styles['container']}>
			{props.pendingFriendReq.map((req) => (
				<div className={styles['request-item']}>
					<div className={styles['email-text']}>{req.email}</div>
					<div className={styles['control-container']}>
						<div className={styles['btn']} onClick={() => handleReject(req.id)}>
							X
						</div>
						<div className={styles['btn']} onClick={() => handleAccept(req.id)}>
							✓
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

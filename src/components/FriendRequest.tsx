import styles from '../styles/components/FriendRequest.module.css';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Client from '../utils/AxiosClient';
import { userSearchResult } from '../types/UserTypes';
import UserCard from './UserCard';
import { useUserContext } from '../hooks/UserProvider';

export default function FriendRequest() {
	const [searchQuery, setSearchQuery] = useState('');
	const userInfo = useUserContext();
	const [searching, setSearching] = useState(false);
	const [searchResult, setSearchResult] = useState<Array<userSearchResult>>([]);

	const handleSearchQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSearching(true);
	};

	const search = async () => {
		try {
			const res = await Client.post('/api/user/search', { query: searchQuery.split(' '), requester: userInfo!.user!.id });
			console.log(res.data);
			setSearchResult(res.data);
		} catch (e) {
			console.log(e);
		} finally {
			setSearching(false);
		}
	};

	useEffect(() => {
		if (searching) {
			search();
		}
	}, [searching]);

	return (
		<div className={styles['container']}>
			<form onSubmit={handleFormSubmit}>
				<input type='text' name='search' value={searchQuery} onChange={handleSearchQueryChange} />
				<input type='submit' value='search' />
			</form>
			<div className={styles['result-body']}>
				{searchResult.map((person) => (
					<UserCard key={person.id} user={person}></UserCard>
				))}
			</div>
		</div>
	);
}

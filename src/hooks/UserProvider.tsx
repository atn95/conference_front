import { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { room, user, userInfo, UserProviderProps } from '../types/UserTypes';

const UserContext = createContext<userInfo | null>(null);

export const UserProvider = (props: UserProviderProps) => {
	const [user, setUser] = useState<user | null>(null);
	const [rooms, setRooms] = useState<Array<room>>([]);
	const accountInfo: userInfo = useMemo(() => {
		return { user, setUser, rooms, setRooms };
	}, [user, rooms]);

	const getLatestMessage = async () => {
		let rm: Array<room> = [...rooms];
		for (const room of rm) {
		}
	};

	useEffect(() => {
		if (user) {
			let room: Array<room> = [];
			for (const friend of user.friends) {
				room.push(friend.room);
			}
			setRooms(room);
		}
	}, [user]);

	useEffect(() => {
		getLatestMessage();
	}, [rooms]);

	return <UserContext.Provider value={accountInfo}>{props.children}</UserContext.Provider>;
};

export const useUserContext = () => {
	return useContext(UserContext);
};

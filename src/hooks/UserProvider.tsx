import { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { room, user, userInfo, UserProviderProps } from '../types/UserTypes';

const UserContext = createContext<userInfo | null>(null);

export const UserProvider = (props: UserProviderProps) => {
	const [user, setUser] = useState<user | null>(null);
	const [rooms, setRooms] = useState<Array<room> | null>(null);
	const [loaded, setLoaded] = useState(false);
	const accountInfo: userInfo = useMemo(() => {
		return { user, setUser, rooms, setRooms, loaded };
	}, [user, rooms]);

	useEffect(() => {
		if (user) {
			let room: Array<room> = [];
			for (const friend of user.friends) {
				friend.room.log = friend.room.log.sort((log, log2) => log.createdAt - log2.createdAt);
				room.push(friend.room);
			}
			room = room.sort((r, r2) => r.id - r2.id);
			setRooms(room);
			setLoaded(true);
		}
	}, [user]);

	return <UserContext.Provider value={accountInfo}>{props.children}</UserContext.Provider>;
};

export const useUserContext = () => {
	return useContext(UserContext);
};

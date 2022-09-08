import { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { room, user, userInfo, UserProviderProps } from '../types/UserTypes';
import axios from 'axios';

const UserContext = createContext<userInfo | null>(null);

export const UserProvider = (props: UserProviderProps) => {
	const [user, setUser] = useState<user | null>(null);
	const [rooms, setRooms] = useState<Array<room> | null>(null);
	const [socketId, setSocketId] = useState<string | null>(null);
	const accountInfo: userInfo = useMemo(() => {
		return { user, setUser, rooms, setRooms, socketId, setSocketId };
	}, [user, rooms, socketId]);

	useEffect(() => {
		if (user) {
			let room: Array<room> = [];
			for (const friend of user.friends) {
				friend.room.log = friend.room.log.sort((log, log2) => log.createdAt - log2.createdAt);
				room.push(friend.room);
			}
			room = room.sort((r, r2) => r.id - r2.id);
			setRooms(room);
		}
	}, [user]);

	return <UserContext.Provider value={accountInfo}>{props.children}</UserContext.Provider>;
};

export const useUserContext = () => {
	return useContext(UserContext);
};

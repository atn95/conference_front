import { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { room, user, userInfo, UserProviderProps } from '../types/UserTypes';
import axios from 'axios';

const UserContext = createContext<userInfo | null>(null);

export const UserProvider = (props: UserProviderProps) => {
	const [user, setUser] = useState<user | null>(null);
	const [rooms, setRooms] = useState<Array<room>>([]);
	const [loaded, setLoaded] = useState(false);
	const accountInfo: userInfo = useMemo(() => {
		return { user, setUser, rooms, setRooms };
	}, [user, rooms]);

	const getLatestMessage = async () => {
		let rm: Array<room> = [...rooms];
		for (const room of rm) {
			const res = await axios.get(`https://localhost:8443/api/room/${room.id.toString()}`);
			room.log = res.data;
		}
		setLoaded(true);
		setRooms(rm);
	};

	useEffect(() => {
		if (user) {
			let room: Array<room> = [];
			for (const friend of user.friends) {
				friend.room.log = friend.room.log.sort((log, log2) => log.createdAt - log2.createdAt);
				room.push(friend.room);
			}
			setRooms(room);
		}
	}, [user?.friends]);

	// useEffect(() => {
	// 	if (rooms.length > 0 && !loaded) {
	// 		getLatestMessage();
	// 	}
	// }, [rooms]);

	return <UserContext.Provider value={accountInfo}>{props.children}</UserContext.Provider>;
};

export const useUserContext = () => {
	return useContext(UserContext);
};

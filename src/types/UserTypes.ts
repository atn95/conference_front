import { UserProvider } from '../hooks/UserProvider';
import { recievedMessage } from './RecieveTypes';

export interface room {
	room_id: number;
	messages: Array<recievedMessage>;
}

export interface friend {
	id: number;
	account: number;
	room: room;
}

export interface user {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	displayName: string;
	status: number;
	friends: Array<friend>;
}

export interface UserProviderProps {
	children: any;
}

export interface userInfo {
	user: user | null;
	setUser: (user: user) => void;
	rooms: Array<room>;
	setRooms: (rooms: Array<room>) => void;
}

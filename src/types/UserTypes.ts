import { UserProvider } from '../hooks/UserProvider';
import { recievedMessage } from './RecieveTypes';

export interface room {
	id: number;
	log: Array<recievedMessage>;
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

export type userInfo = {
	user: user | null;
	setUser: (user: user) => void;
	rooms: Array<room>;
	setRooms: (rooms: Array<room>) => void;
};

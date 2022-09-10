import { UserProvider } from '../hooks/UserProvider';
import { recievedMessage } from './RecieveTypes';

export interface room {
	id: number;
	log: Array<recievedMessage>;
	relation: { user: number; friend: number };
}

export interface relation {
	id: number;
	account: number;
	room: room;
	friend: friend;
}

export interface friend {
	id: number;
	email: string;
	displayName: string;
	firstName: string;
	lastname: string;
	status: number;
}

export interface user {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	displayName: string;
	status: number;
	friends: Array<relation>;
}

export interface UserProviderProps {
	children: any;
}

export type userInfo = {
	user: user | null;
	setUser: (user: user) => void;
	rooms: Array<room> | null;
	setRooms: (rooms: Array<room>) => void;
	loaded: boolean;
};

import { room } from './UserTypes';

export interface ChatBoxProps {
	room: room;
}

export interface SideBarProps {
	setRoom: (room: room) => void;
	room: room | null;
	call: (friendRoomID: number) => void;
}

export interface CallDisplayProps {
	room: number;
}

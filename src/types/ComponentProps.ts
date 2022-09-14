import { room, userSearchResult } from './UserTypes';

export interface ChatBoxProps {
	room: room;
}

export interface SideBarProps {
	setRoom: (room: room) => void;
	room: room | null;
	call: (friendRoomID: number) => void;
	showAddFriendPop: boolean;
	setFriendReqPop: (show:boolean) => void;
	pendingFriendReq: Array<userSearchResult>;
	setPendingFriendReq: (pendingReq: Array<userSearchResult>) => void;
}

export interface CallDisplayProps {
	peerConnection: RTCPeerConnection;
	remoteStream: MediaStream | null;
}


export interface UserCardProps {
	user: userSearchResult;
}

export interface FriendListProps {
	call: (room: number)=> void;
	selectRoom: (id:number) => void;
}
export interface PendingFriendRequestProps {
	pendingFriendReq: Array<userSearchResult>;
	setPendingFriendReq: (pendingReq: Array<userSearchResult>) => void;
}
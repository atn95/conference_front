import { room } from '../types/UserTypes';
import { Client } from '@stomp/stompjs';

export interface WebRTCProviderProps {
	children: any;
}

export type webRTCProperties = {
	computer: RTCPeerConnection | undefined;
	createOffer: (room: room, socketId: string, client: Client) => void;
	createAnswer: (sdp: RTCSessionDescription) => void;
};

import { room } from '../types/UserTypes';
import { Client } from '@stomp/stompjs';

export interface WebRTCProviderProps {
	children: any;
}

export type webRTCProperties = {
	computer: RTCPeerConnection | undefined;
	createOffer: (room: room | null, userId: string, client: Client | undefined) => void;
	createAnswer: (sdp: RTCSessionDescription, client: Client, roomId: number, userId: number) => void;
};

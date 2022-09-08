import { createContext, useState, useMemo, useContext } from 'react';
import { webRTCProperties, WebRTCProviderProps } from '../types/WebRTCTypes';
import { room } from '../types/UserTypes';
import { Client } from '@stomp/stompjs';

const WebRTCContext = createContext<webRTCProperties | null>(null);

export default function WebRTCProvider(props: WebRTCProviderProps) {
	const pc_config = {
		iceServers: [
			// {
			//   urls: 'stun:[STUN_IP]:[PORT]',
			//   'credentials': '[YOR CREDENTIALS]',
			//   'username': '[USERNAME]'
			// },
			{
				//Free google stun server
				urls: 'stun:stun.l.google.com:19302',
			},
		],
	};
	const [computer, setComputer] = useState<RTCPeerConnection>();

	const createOffer = async (room: room | null, socketId: string, client: Client | undefined) => {
		const localPCConnection = new RTCPeerConnection(pc_config);
		const sdp = await localPCConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
		console.log(sdp, 'setting SessionDescription');
		localPCConnection.setLocalDescription(new RTCSessionDescription(sdp));
		console.log(socketId);
		client?.publish({ destination: `/ws/call/${room?.id}`, body: JSON.stringify({ type: 'video', sdp: JSON.stringify(sdp), from: socketId }) });
	};

	const webRTCInfo: webRTCProperties = useMemo(() => {
		return { computer, createOffer };
	}, []);
	return <WebRTCContext.Provider value={webRTCInfo}>{props.children}</WebRTCContext.Provider>;
}

export const useWebRTC = () => {
	return useContext(WebRTCContext);
};

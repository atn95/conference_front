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
	const [computer, setComputer] = useState<RTCPeerConnection>(new RTCPeerConnection(pc_config));

	const createOffer = async (room: room | null, socketId: string, client: Client | undefined) => {
		const sdp = await computer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
		console.log(sdp, 'setting SessionDescription');
		computer.setLocalDescription(new RTCSessionDescription(sdp));
		return sdp;
	};

	const createAnswer = async (sdp: RTCSessionDescription) => {
		try {
			const remoteDescription = await computer.setRemoteDescription(new RTCSessionDescription(sdp));
			console.log('Remote description Set');
			const ans = await computer.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
			console.log('created answer');
			const localDescription = await computer.setLocalDescription(new RTCSessionDescription(ans));
			//send answer back through socket
			return ans;
		} catch (error) {
			console.log(error);
			console.log('Something went wrong');
		}
	};

	const webRTCInfo: webRTCProperties = useMemo(() => {
		return { computer, createOffer, createAnswer };
	}, [computer]);
	return <WebRTCContext.Provider value={webRTCInfo}>{props.children}</WebRTCContext.Provider>;
}

export const useWebRTC = () => {
	return useContext(WebRTCContext);
};

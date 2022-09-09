import { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { webRTCProperties, WebRTCProviderProps } from '../types/WebRTCTypes';
import { room } from '../types/UserTypes';
import { Client } from '@stomp/stompjs';
import { useSocket } from './StompProvider';

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

	const handleDisconnect = () => {
		computer!.oniceconnectionstatechange = (e) => {
			console.log('ice connection changed');
			console.log(e);
			if (computer.iceConnectionState == 'disconnected') {
				setComputer(new RTCPeerConnection(pc_config));
			}
		};
	};

	const createOffer = async (room: room | null, userId: string, client: Client | undefined) => {
		const sdp = await computer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
		computer!.onicecandidate = (e) => {
			if (e.candidate) {
				console.log('sending candidate', e.candidate);
				client!.publish({ destination: `/ws/candidate/${room!.id}`, body: JSON.stringify({ type: 'candidate', candidate: JSON.stringify(e.candidate), from: userId }) });
			}
		};

		handleDisconnect();
		console.log('setting local SessionDescription');
		computer.setLocalDescription(new RTCSessionDescription(sdp));
		return sdp;
	};

	const createAnswer = async (sdp: RTCSessionDescription, client: Client, roomId: number, userId: number) => {
		try {
			const remoteDescription = await computer.setRemoteDescription(new RTCSessionDescription(sdp));
			console.log('Remote description Set');
			const ans = await computer.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
			console.log('created answer');
			const localDescription = await computer.setLocalDescription(new RTCSessionDescription(ans));
			console.log('set local description');
			computer!.onicecandidate = (e) => {
				if (e.candidate) {
					console.log('sending candidate', e.candidate);
					client.publish({ destination: `/ws/candidate/${roomId}`, body: JSON.stringify({ type: 'candidate', candidate: JSON.stringify(e.candidate), from: userId }) });
				}
			};

			handleDisconnect();
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

import React, { useEffect, useRef, useState } from 'react';
import { useUserContext } from '../hooks/UserProvider';
import { CallDisplayProps } from '../types/ComponentProps';

export default function CallDisplay(props: CallDisplayProps) {
	const { user, rooms, setRooms } = useUserContext() || { user: null, rooms: null, setRooms: null };
	let localVideoRef = useRef<HTMLVideoElement>(null);
	let remoteVideoRef = useRef<HTMLVideoElement>(null);

	// const streamVideoTrack = async () => {
	// 	try {
	// 		const stream = await navigator.mediaDevices.getUserMedia({
	// 			video: true,
	// 			audio: true,
	// 		});
	// 		if (localVideoRef.current) {
	// 			localVideoRef.current.srcObject = stream;
	// 		}

	// 		//do after connection is setup
	// 		stream.getTracks().forEach((track) => {
	// 			console.log('computer', peerConnection);
	// 			peerConnection!.addTrack(track, stream);
	// 			console.log('added streaming track');
	// 		});
	// 	} catch (e) {
	// 		console.log(e);
	// 	} finally {
	// 		//regardless of if you can get media devices add remote video track
	// 		peerConnection!.ontrack = (e) => {
	// 			console.log(e.streams);
	// 			console.log('add remotetrack success');
	// 			if (remoteVideoRef.current) {
	// 				remoteVideoRef.current.srcObject = e.streams[0];
	// 			}
	// 		};
	// 	}
	// };

	useEffect(() => {
		// streamVideoTrack();
	}, []);
	return (
		<>
			<div>
				Local Feed
				<video
					style={{
						width: 240,
						height: 240,
						margin: 5,
						backgroundColor: 'black',
					}}
					muted
					ref={localVideoRef}
					autoPlay
				/>
			</div>
			<div>
				Remote
				<video
					id='remotevideo'
					style={{
						width: 240,
						height: 240,
						margin: 5,
						backgroundColor: 'black',
					}}
					ref={remoteVideoRef}
					autoPlay
				/>
			</div>
		</>
	);
}

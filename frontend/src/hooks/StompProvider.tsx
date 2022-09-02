import React, { useEffect, useState, createContext, useMemo, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client, Stomp, StompSubscription } from '@stomp/stompjs';
import { socketInfo, StompProviderProps } from '../types/SocketTypes';

const StompContext = createContext<socketInfo | undefined>(undefined);

export const StompProvider = (props: StompProviderProps) => {
	const [client, setClient] = useState<Client | undefined>(undefined);
	//loop through subscribed to sub to channel
	const [subscribed] = useState(props.subscribed);
	const socketInfo: socketInfo = useMemo(() => {
		return { client, subscribed };
	}, []);

	useEffect(() => {
		const stompClient = Stomp.over(new SockJS(props.subsribeUrl));
		// const stompClient = Stomp.client(props.subsribeUrl);

		stompClient.connect({}, (frame: string) => {
			console.log('connected: ' + frame);
		});
		setClient(stompClient);

		return () => {
			client?.deactivate();
		};
	}, []);

	useEffect(() => {
		let subbed: StompSubscription;
		if (client?.connected) {
			subbed = client.subscribe('/topic/messages', (message) => {
				console.log(message);
			});
		}
		return () => {
			subbed?.unsubscribe();
		};
	}, [subscribed, client]);

	return <StompContext.Provider value={socketInfo}>{props.children}</StompContext.Provider>;
};

export const useSocketContext = () => {
	useContext(StompContext);
};

import React, { useEffect, useState, createContext, useMemo, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client, IFrame, IStompSocket, Stomp, StompSubscription } from '@stomp/stompjs';
import { socketInfo, StompProviderProps } from '../types/SocketTypes';

const StompContext = createContext<socketInfo | undefined>(undefined);

export const StompProvider = (props: StompProviderProps) => {
	const [client, setClient] = useState<Client | undefined>(undefined);
	//loop through subscribed to sub to channel
	const [subscribed] = useState(props.subscribed);
	const wssUrl = props.subsribeUrl.replace('https', 'wss');
	const socketInfo: socketInfo = useMemo(() => {
		return { client, subscribed };
	}, [client, subscribed]);

	useEffect(() => {
		let subbed: StompSubscription;

		const stompClient = new Client({
			brokerURL: wssUrl,
			debug: function (str) {
				console.log(str);
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
		});

		if (typeof WebSocket !== 'function') {
			stompClient.webSocketFactory = () => {
				return new SockJS(props.subsribeUrl) as IStompSocket;
			};
		}
		stompClient.onConnect = (frame: IFrame): void => {
			console.log(frame);
			subbed = stompClient.subscribe(`/topic/messages`, (message) => {
				console.log(JSON.parse(message.body));
			});
		};

		stompClient.activate();

		setClient(stompClient);
		return () => {
			client?.deactivate();
			subbed.unsubscribe();
		};
	}, []);

	return <StompContext.Provider value={socketInfo}>{props.children}</StompContext.Provider>;
};

export const useSocketContext = () => {
	return useContext(StompContext);
};

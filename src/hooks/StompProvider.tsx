import { useEffect, useState, createContext, useMemo, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client, IFrame, IStompSocket, StompSubscription } from '@stomp/stompjs';
import { socketInfo, StompProviderProps, subscription } from '../types/SocketTypes';

const StompContext = createContext<socketInfo | undefined>(undefined);

export const StompProvider = (props: StompProviderProps) => {
	const [client, setClient] = useState<Client | undefined>(undefined);
	//loop through subscribed to sub to channel
	const [subscriptions, setSubscribed] = useState<Array<subscription>>(props.subscriptions);
	const [activeSubs, setActiveSubs] = useState<Array<StompSubscription>>([]);
	const wssUrl = props.subsribeUrl.replace('https', 'wss');
	const socketInfo: socketInfo = useMemo(() => {
		return { client, subscriptions };
	}, [client, subscriptions]);

	useEffect(() => {
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
			const active = [];
			for (const sub of subscriptions) {
				let subs = stompClient.subscribe(sub.endpoint, sub.callback);
				active.push(subs);
			}
			setActiveSubs(active);
		};

		stompClient.activate();
		setClient(stompClient);
		return () => {
			for (const sub of activeSubs) {
				sub.unsubscribe();
			}
			client?.deactivate();
		};
	}, []);

	return <StompContext.Provider value={socketInfo}>{props.children}</StompContext.Provider>;
};

export const useSocket = () => {
	return useContext(StompContext);
};

import { useEffect, useState, createContext, useMemo, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client, IFrame, IStompSocket, StompSubscription } from '@stomp/stompjs';
import { socketInfo, StompProviderProps, subscription } from '../types/SocketTypes';

const StompContext = createContext<socketInfo | undefined>(undefined);

export const StompProvider = (props: StompProviderProps) => {
	const [client, setClient] = useState<Client | undefined>(undefined);
	//loop through subscribed to sub to channel
	const [serverUrl, setServerUrl] = useState<string | null>(null);
	const [subscriptions, setSubscriptions] = useState<Array<subscription> | null>(null);
	const [activeSubs, setActiveSubs] = useState<Array<StompSubscription>>([]);
	const [loadedSocket, setLoadedSocket] = useState(false);
	const socketInfo: socketInfo = useMemo(() => {
		return { client, subscriptions, setSubscriptions, setServerUrl, loadedSocket, activeSubs, setActiveSubs };
	}, [client, subscriptions, serverUrl, loadedSocket]);

	useEffect(() => {
		return () => {
			for (const sub of activeSubs) {
				sub.unsubscribe();
			}
			client?.deactivate();
		};
	}, [loadedSocket]);

	useEffect(() => {
		if (client && subscriptions) {
			client.onConnect = (frame: IFrame): void => {
				const active = [];
				console.log(frame.headers['user-name']);
				for (const sub of subscriptions!) {
					let subs = client.subscribe(sub.endpoint, sub.callback);
					active.push(subs);
				}
				// console.log()
				setActiveSubs(active);
			};

			client.onDisconnect = (frame: IFrame): void => {
				for (const sub of activeSubs) {
					sub.unsubscribe();
				}
			};

			client.onStompError = (): void => {
				for (const sub of activeSubs) {
					sub.unsubscribe();
				}
			};

			setLoadedSocket(true);
			client.activate();
		}
	}, [client, subscriptions]);

	useEffect(() => {
		if (serverUrl) {
			const wssUrl = serverUrl!.replace('https', 'wss');
			const stompClient = new Client({
				brokerURL: wssUrl,
				debug: function (str) {
					// console.log(str);
				},
				reconnectDelay: 5000,
				heartbeatIncoming: 4000,
				heartbeatOutgoing: 4000,
			});
			if (typeof WebSocket !== 'function') {
				stompClient.webSocketFactory = () => {
					return new SockJS(serverUrl!) as IStompSocket;
				};
			}
			setClient(stompClient);
		}
	}, [serverUrl]);

	return <StompContext.Provider value={socketInfo}>{props.children}</StompContext.Provider>;
};

export const useSocket = () => {
	return useContext(StompContext);
};

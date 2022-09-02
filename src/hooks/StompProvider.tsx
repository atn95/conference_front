import React, { useEffect, useRef, useState, createContext } from 'react';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

const StompContext = createContext(undefined);

export interface StompProviderProps {
	children: any;
	subsribeUrl: string;
	subscribed: Array<String>;
}

export const StompProvider = (props: StompProviderProps) => {
	const [socket, setSocket] = useState<any>(undefined);
	const [client, setClient] = useState<Client | undefined>(undefined);

	useEffect(() => {
		const sock = SockJS(props.subsribeUrl);
		const stompClient = Stomp.over(sock);
		setSocket(sock);
		setClient(stompClient);
	}, []);

	return <StompContext.Provider value={undefined}>{props.children}</StompContext.Provider>;
};

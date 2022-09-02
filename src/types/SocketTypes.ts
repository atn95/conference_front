import { Client } from '@stomp/stompjs';

export interface socketInfo {
	client: Client | undefined;
	subscribed: Array<String>;
}
export interface StompProviderProps {
	children: any;
	subsribeUrl: string;
	subscribed: Array<String>;
}

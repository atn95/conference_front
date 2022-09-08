import { Client } from '@stomp/stompjs';

export interface socketInfo {
	client: Client | undefined;
	subscriptions: Array<subscription>;
}
export interface StompProviderProps {
	children: any;
	subsribeUrl: string;
	subscriptions: Array<subscription>;
}

export interface subscription {
	endpoint: string;
	callback: (data: any) => void;
}

export type socketData = {
	type: string;
	data: any;
};

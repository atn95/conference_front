import { Client } from '@stomp/stompjs';

export type socketInfo = {
	client: Client | undefined;
	subscriptions: Array<subscription> | null;
	setSubscriptions: (subsArr: Array<subscription>) => void | null;
	setServerUrl: (url: string) => void | null;
};
export interface StompProviderProps {
	children: any;
}

export interface subscription {
	endpoint: string;
	callback: (data: any) => void;
}

export type socketData = {
	type: string;
	data: any;
};

export interface recievedMessage {
	createdAt: number;
	content: string;
	author: sender;
}

export interface sender {
	displayName: string;
	id: number;
}

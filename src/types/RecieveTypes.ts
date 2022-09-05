export interface recievedMessage {
	content: string;
	author: sender;
}

export interface sender {
	displayName: string;
	email: string;
	firstName: string;
	lastName: string;
	id: number;
}

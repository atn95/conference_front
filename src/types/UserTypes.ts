import { recievedMessage } from './RecieveTypes';

export interface room {
	room_id: number;
	messages: Array<recievedMessage>;
}

import { room } from './UserTypes';

export interface MainPageProps {
	friends: Array<Object> | undefined; //change later when friend is structured
	inCall: boolean;
	reload: Function;
	setInCall: (call: boolean) => void;
}

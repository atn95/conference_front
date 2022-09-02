import SockJS from 'sockjs-client';

export function socketProvider(url: string) {
	return new SockJS(url);
}

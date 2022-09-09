import { useUserContext } from '../hooks/UserProvider';
import { SideBarProps } from '../types/ComponentProps';

export default function SideBar(props: SideBarProps) {
	const { rooms } = useUserContext() || { rooms: [] };
	return (
		<div>
			<div>Current: {props.room ? props.room.id : 'No room'}</div>
			<div>Room:</div>
			{rooms?.map((room) => (
				<div onClick={() => props.setRoom(room)}>
					<h1>Room: {room.id}</h1>
					<input type='button' value='call' onClick={() => props.call(room.id)} />
				</div>
			))}
		</div>
	);
}

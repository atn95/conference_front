import { useUserContext } from '../hooks/UserProvider';
import { SideBarProps } from '../types/ComponentProps';

export default function SideBar(props: SideBarProps) {
	const { rooms } = useUserContext() || { user: null, setUser: null, rooms: [], setRooms: null };
	return (
		<div>
			<div>Current: {props.room ? props.room.id : 'No room'}</div>
			<div>Room:</div>
			{rooms?.map((room) => (
				<div onClick={() => props.setRoom(room)}>Room: {room.id}</div>
			))}
		</div>
	);
}

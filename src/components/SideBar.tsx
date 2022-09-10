import { useUserContext } from '../hooks/UserProvider';
import { SideBarProps } from '../types/ComponentProps';

export default function SideBar(props: SideBarProps) {
	const { user, rooms } = useUserContext() || { rooms: [] };

	const selectRoom = (friendId: number) => {
		const friendRelation = rooms?.map((room) => room.relation.friend);
		props.setRoom(rooms![friendRelation!.indexOf(friendId)]);
	};

	return (
		<div>
			<div>Current: {props.room ? props.room.id : 'No room'}</div>
			<div>Room:</div>
			{user?.friends.map((relation) => (
				<div onClick={() => selectRoom(relation.friend.id)}>
					<h1>Name: {relation.friend.displayName}</h1>
					<input type='button' value='call' onClick={() => props.call(relation.id)} />
				</div>
			))}
		</div>
	);
}

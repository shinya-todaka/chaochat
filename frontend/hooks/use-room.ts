import useRoomOnce from 'hooks/use-room-once';
import useMembers from 'hooks/use-members';
import useMessages from 'hooks/use-messages';
import { Room } from 'models/room';
import { Member } from 'models/member';
import { Message } from 'models/message';

const useRoom = (
  uid: string | null,
  roomId: string,
): {
  isInitialFetching: boolean;
  isInRoom: boolean;
  room: Room | null;
  members: Member[];
  messages: Message[];
} => {
  const { room, isRoomLoading } = useRoomOnce(roomId);
  const { members, isInRoom, isMembersLoading } = useMembers(uid, roomId);
  const { messages } = useMessages(isInRoom, roomId);

  return {
    isInitialFetching: isRoomLoading || isMembersLoading,
    isInRoom,
    room,
    members,
    messages,
  };
};

export default useRoom;

import useMembers from 'hooks/use-members';
import useMessages from 'hooks/use-messages';
import useMembersDocument from 'hooks/use-members-document';
import useRoomDocument from 'hooks/use-room-document';
import { IMember } from 'models/member';
import { IMessage } from 'models/message';

const useRoom = (
  uid: string | null,
  roomId: string | null,
): {
  isInRoom: boolean;
  members: IMember[];
  messages: IMessage[];
} => {
  const { room, isInRoom } = useRoomDocument(uid, roomId);
  const { members } = useMembersDocument(room ? room.members : [], roomId);
  const { messages } = useMessages(isInRoom, roomId);

  return {
    isInRoom,
    members,
    messages,
  };
};

export default useRoom;

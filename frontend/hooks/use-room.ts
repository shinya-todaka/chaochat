import useMessages from 'hooks/use-messages';
import useMembersDocument from 'hooks/use-members-document';
import useRoomDocument from 'hooks/use-room-document';
import useMembersCache from 'hooks/use-members-cache';
import { IMember } from 'models/member';
import { IMessage } from 'models/message';
import { IRoom } from 'models/room';

const useRoom = (
  uid: string | null,
  roomId: string | null,
): {
  isInRoom: boolean;
  room: IRoom | null;
  members: IMember[];
  messages: IMessage[];
} => {
  const { room, isInRoom } = useRoomDocument(uid, roomId);
  const { members } = useMembersCache(room ? room.members : [], roomId);
  const { messages } = useMessages(isInRoom, roomId);

  return {
    isInRoom,
    room,
    members,
    messages,
  };
};

export default useRoom;

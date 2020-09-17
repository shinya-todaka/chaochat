import { useEffect } from 'react';
import useMessages from 'hooks/use-messages';
import useRoomDocument from 'hooks/use-room-document';
import { useMembersContext } from 'contexts/MembersContext';
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
  const { setMemberIds, setRoomId, members } = useMembersContext();
  const { messages } = useMessages(isInRoom, roomId);

  useEffect(() => {
    setRoomId(room?.id ?? null);
    setMemberIds(room?.members ?? []);
  }, [room?.members, room?.id]);

  return {
    isInRoom,
    room,
    members,
    messages,
  };
};

export default useRoom;

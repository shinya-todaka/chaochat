import useMembers from 'hooks/use-members';
import useMessages from 'hooks/use-messages';
import { IMember } from 'models/member';
import { IMessage } from 'models/message';

const useRoom = (
  uid: string | null,
  roomId: string,
): {
  isInRoom: boolean;
  members: IMember[];
  messages: IMessage[];
} => {
  const { members, isInRoom, isMembersLoading } = useMembers(uid, roomId);
  const { messages } = useMessages(isInRoom, roomId);

  return {
    isInRoom,
    members,
    messages,
  };
};

export default useRoom;

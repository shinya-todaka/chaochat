import React, { FC, useState, createContext, useContext } from 'react';
import { IMember } from 'models/member';
import useMembers from 'hooks/use-members';

type MembersContextValue = {
  setMemberIds: (members: string[]) => void;
  setRoomId: (roomId: string | null) => void;
  isMembersLoading: boolean;
  error: Error | null;
  members: IMember[];
};

const MembersContext = createContext<MembersContextValue>({
  setMemberIds: () => undefined,
  setRoomId: () => undefined,
  isMembersLoading: true,
  error: null,
  members: [],
});

const MembersContextProvider: FC = ({ children }) => {
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { members, isMembersLoading, error } = useMembers(memberIds, roomId);

  return (
    <MembersContext.Provider
      value={{ setMemberIds, setRoomId, isMembersLoading, error, members }}
    >
      {children}
    </MembersContext.Provider>
  );
};

export default MembersContextProvider;

export const useMembersContext = () => useContext(MembersContext);

import React, {
  FC,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';
import firebase, { firestore } from 'firebase/app';
import { IMember, memberConverter } from 'models/member';

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
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [members, setMembers] = useState<IMember[]>([]);

  useEffect(() => {
    const unmounted = false;

    if (!unmounted && roomId && memberIds.length !== 0) {
      const currentMemberIds = members.map((member) => member.id);
      const memberIdsDiff = memberIds.filter(
        (id) => currentMemberIds.indexOf(id) === -1,
      );
      console.log('memberIdsDiff!', memberIdsDiff);
      if (memberIdsDiff.length !== 0) {
        setIsMembersLoading(true);
        const db = firebase.firestore();
        const query = db
          .collection('message')
          .doc('v1')
          .collection('rooms')
          .doc(roomId)
          .collection('members')
          .where('isEnabled', '==', true)
          .where(firestore.FieldPath.documentId(), 'in', memberIdsDiff)
          .withConverter(memberConverter);

        query
          .get()
          .then((snapshot) => {
            const memberData: IMember[] = snapshot.docs.map(
              (doc) => doc.data() as IMember,
            );
            console.log('get members once', ...memberData);
            const notContainedMembers = memberData.filter(
              (member) => members.indexOf(member) === -1,
            );
            setMembers(members.concat(notContainedMembers));
            setIsMembersLoading(false);
          })
          .catch((err) => {
            setError(err);
            setIsMembersLoading(false);
            console.log(err);
          });
      }
    }
  }, [memberIds, roomId]);

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

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { IMember, memberConverter } from 'models/member';
import 'firebase/firestore';

const useMessages = (
  uid: string | null,
  roomId: string,
): {
  members: IMember[];
  isInRoom: boolean;
  isMembersLoading: boolean;
  error: Error | null;
} => {
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [members, setMembers] = useState<IMember[]>([]);
  const [isInRoom, setIsInRoom] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    const db = firebase.firestore();
    const query = db
      .collection('message')
      .doc('v1')
      .collection('rooms')
      .doc(roomId)
      .collection('members')
      .orderBy('createdAt')
      .where('isEnabled', '==', true)
      .withConverter(memberConverter);

    let unsubscribe: () => void | undefined;
    if (!unmounted && uid) {
      console.log('subscribe members listener');
      setIsMembersLoading(true);
      unsubscribe = query.onSnapshot(
        (snapshot) => {
          const membersData: IMember[] = snapshot.docs.map(
            (doc) => doc.data() as IMember,
          );
          const me = membersData.find((member) => member.id === uid);
          setIsInRoom(Boolean(me));
          setMembers(members);
          setIsMembersLoading(false);
          console.log('read member!!', ...membersData);
        },
        (err) => {
          console.log(err);
          setError(err);
          setIsMembersLoading(false);
        },
      );
    }

    return () => {
      unmounted = true;
      if (unsubscribe) {
        console.log('unsubscribe members listener');
        unsubscribe();
      }
    };
  }, [roomId, uid]);

  return { members, isInRoom, isMembersLoading, error };
};

export default useMessages;

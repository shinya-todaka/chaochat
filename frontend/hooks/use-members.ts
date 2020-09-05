import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Member } from 'models/member';

const useMessages = (
  uid: string | null,
  roomId: string,
): {
  members: Member[];
  isInRoom: boolean;
  isMembersLoading: boolean;
  error: Error | null;
} => {
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
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
      .where('isEnabled', '==', true);

    let unsubscribe: () => void | undefined;
    if (!unmounted && uid) {
      console.log('subscribe members listener');
      setIsMembersLoading(true);
      unsubscribe = query.onSnapshot(
        (snapshot) => {
          const membersData: Member[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as Member),
            id: doc.id,
          }));
          const me = membersData.find((member) => member.id === uid);
          setIsInRoom(Boolean(me));
          setMembers(membersData);
          setIsMembersLoading(false);
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

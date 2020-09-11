import { useEffect, useState } from 'react';
import firebase, { firestore } from 'firebase/app';
import { IMember, memberConverter } from 'models/member';
import 'firebase/firestore';

const useMessagesDocument = (
  memberIds: string[],
  roomId: string | null,
): {
  members: IMember[];
  isMembersLoading: boolean;
  error: Error | null;
} => {
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [members, setMembers] = useState<IMember[]>([]);

  useEffect(() => {
    const unmounted = false;

    if (!unmounted && roomId && memberIds.length !== 0) {
      const db = firebase.firestore();
      const query = db
        .collection('message')
        .doc('v1')
        .collection('rooms')
        .doc(roomId)
        .collection('members')
        .where('isEnabled', '==', true)
        .where(firestore.FieldPath.documentId(), 'in', memberIds)
        .withConverter(memberConverter);

      query
        .get()
        .then((snapshot) => {
          console.log('get members once');
          const memberData: IMember[] = snapshot.docs.map(
            (doc) => doc.data() as IMember,
          );
          setMembers(memberData);
          setIsMembersLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsMembersLoading(false);
          console.log(err);
        });
    }
  }, [roomId, memberIds]);

  return { members, isMembersLoading, error };
};

export default useMessagesDocument;

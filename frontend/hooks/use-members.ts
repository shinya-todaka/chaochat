import { IMember, OMember } from 'models/member';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { firestore } from 'firebase';
import Converter from 'utils/Converter';

const useMembers = (
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
  const converter = new Converter<OMember>(true, false);

  useEffect(() => {
    const unmounted = false;

    if (!unmounted && roomId && memberIds.length !== 0) {
      const currentMemberIds = members.map((member) => member.id);
      const memberIdsDiff = memberIds.filter(
        (id) => currentMemberIds.indexOf(id) === -1,
      );

      if (memberIdsDiff.length !== 0) {
        const db = firebase.firestore();
        const query = db
          .collection('message')
          .doc('v1')
          .collection('rooms')
          .doc(roomId)
          .collection('members')
          .where('isEnabled', '==', true)
          .where(firestore.FieldPath.documentId(), 'in', memberIdsDiff);

        query
          .get()
          .then((snapshot) => {
            const memberData = snapshot.docs.map((doc) =>
              converter.decode(doc),
            );
            const notContainedMembers = memberData.filter(
              (member) => members.indexOf(member) === -1,
            );
            setMembers(members.concat(notContainedMembers));
            setIsMembersLoading(false);
          })
          .catch((err) => {
            setError(err);
            setIsMembersLoading(false);
          });
      }
    }
  }, [roomId, memberIds]);

  return { members, isMembersLoading, error };
};

export default useMembers;

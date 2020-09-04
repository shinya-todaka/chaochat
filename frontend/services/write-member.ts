import firebase from 'firebase/app';
import { Member } from 'models/member';

const writeMember = async (
  uid: string,
  roomId: string,
  member: Member,
): Promise<void> => {
  const db = firebase.firestore();
  const roomDocument = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc(roomId);

  const batch = db.batch();
  batch.update(roomDocument, {
    members: firebase.firestore.FieldValue.arrayUnion(uid),
  });
  const theMember = {
    ...member,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  batch.set(roomDocument.collection('members').doc(uid), theMember);
  await batch.commit();
};

export default writeMember;

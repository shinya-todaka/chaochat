import firebase from 'firebase/app';
import { OMember } from 'models/member';

const writeMember = async (
  uid: string,
  roomId: string,
  member: OMember,
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
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  batch.set(roomDocument.collection('members').doc(uid), member);
  await batch.commit();
};

export default writeMember;

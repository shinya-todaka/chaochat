import firebase from 'firebase/app';
import { OMember } from 'models/member';
import Converter from 'utils/Converter';

const writeMember = async (
  uid: string,
  roomId: string,
  member: OMember,
): Promise<void> => {
  const db = firebase.firestore();
  const converter = new Converter<OMember>(true, false);
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
  batch.set(
    roomDocument.collection('members').doc(uid),
    converter.encode(member),
  );
  await batch.commit();
};

export default writeMember;

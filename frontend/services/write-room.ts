import firebase from 'firebase/app';
import { ORoom } from 'models/room';
import { OMember } from 'models/member';
import 'firebase/firestore';

const writeRoom = async (
  uid: string,
  member: OMember,
  room: ORoom,
): Promise<string> => {
  const db = firebase.firestore();
  const roomDocument = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc();

  const batch = db.batch();
  batch.set(roomDocument, room);
  batch.set(roomDocument.collection('members').doc(uid), member);
  await batch.commit();

  return roomDocument.id;
};

export default writeRoom;

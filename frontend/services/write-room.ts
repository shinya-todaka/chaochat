import firebase from 'firebase/app';
import { Room } from 'models/room';
import { Member } from 'models/member';
import 'firebase/firestore';

const writeRoom = async (
  uid: string,
  member: Member,
  room: Room,
): Promise<string> => {
  const db = firebase.firestore();
  const roomDocument = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc();

  const theRoom = {
    ...room,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const theMember = {
    ...member,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const batch = db.batch();
  batch.set(roomDocument, theRoom);
  batch.set(roomDocument.collection('members').doc(uid), theMember);
  await batch.commit();

  return roomDocument.id;
};

export default writeRoom;

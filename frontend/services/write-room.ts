import firebase from 'firebase/app';
import { ORoom } from 'models/room';
import { OMember } from 'models/member';
import 'firebase/firestore';

type Parameters = {
  uid: string;
  room: ORoom;
  member: OMember;
};

const writeRoom = async (parameters: Parameters): Promise<string> => {
  const db = firebase.firestore();
  const roomDocument = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc();
  const batch = db.batch();
  batch.set(roomDocument, parameters.room);
  batch.set(
    roomDocument.collection('members').doc(parameters.uid),
    parameters.member,
  );
  await batch.commit();

  return roomDocument.id;
};

export default writeRoom;

import firebase from 'firebase/app';
import { ORoom, IRoom } from 'models/room';
import { OMember } from 'models/member';
import 'firebase/firestore';

const writeRoom = async (
  uid: string,
  member: OMember,
  room: ORoom,
): Promise<IRoom> => {
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

  const sentRoom: IRoom = {
    id: roomDocument.id,
    ...room,
    updatedAt: null,
    createdAt: null,
  };

  return sentRoom;
};

export default writeRoom;

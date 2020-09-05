import firebase from 'firebase/app';
import { IRoom, roomConverter } from 'models/room';

const readRoom = async (roomId: string): Promise<IRoom> => {
  const db = firebase.firestore();
  const roomDocument = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc(roomId)
    .withConverter(roomConverter);
  const snapshot = await roomDocument.get();
  const room = snapshot.data() as IRoom;

  return room;
};

export default readRoom;

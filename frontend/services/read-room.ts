import firebase from 'firebase/app';
import { Room } from 'models/room';

const readRoom = async (roomId: string): Promise<Room> => {
  const db = firebase.firestore();
  const roomDocument = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc(roomId);
  const snapshot = await roomDocument.get();
  const roomData: Room = snapshot.data() as Room;
  const room: Room = { ...roomData, id: snapshot.id };

  return room;
};

export default readRoom;

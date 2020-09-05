import firebase from 'firebase/app';
import { OMessage } from 'models/message';

const writeUser = async (roomId: string, message: OMessage): Promise<void> => {
  const db = firebase.firestore();
  const messagesCollection = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc(roomId)
    .collection('messages');

  await messagesCollection.add(message);
};

export default writeUser;

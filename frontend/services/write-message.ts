import firebase from 'firebase/app';
import { Message } from 'models/message';

const writeUser = async (roomId: string, message: Message): Promise<void> => {
  const db = firebase.firestore();
  const messagesCollection = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc(roomId)
    .collection('messages');

  const theMessage = {
    ...message,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  await messagesCollection.add(theMessage);
};

export default writeUser;

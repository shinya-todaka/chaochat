import firebase from 'firebase/app';
import { OMessage } from 'models/message';
import Converter from 'utils/Converter';

const writeMessage = async (
  roomId: string,
  message: OMessage,
): Promise<void> => {
  const db = firebase.firestore();
  const converter = new Converter<OMessage>(true, false);
  const messagesCollection = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc(roomId)
    .collection('messages');

  await messagesCollection.add(converter.encode(message));
};

export default writeMessage;

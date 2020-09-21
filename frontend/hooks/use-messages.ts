import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { OMessage, IMessage } from 'models/message';
import 'firebase/firestore';
import Converter from 'utils/Converter';

const useMessages = (
  isInRoom: boolean,
  roomId: string | null,
): { messages: IMessage[]; loading: boolean; error: Error | null } => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const converter = new Converter<OMessage>(true, false);

  useEffect(() => {
    let unmounted = false;

    let unsubscribe: () => void | undefined;
    if (!unmounted && roomId && isInRoom) {
      const db = firebase.firestore();
      const query = db
        .collection('message')
        .doc('v1')
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('createdAt');

      unsubscribe = query.onSnapshot(
        (snapshot) => {
          const messageData = snapshot.docs.map((doc) => converter.decode(doc));
          setMessages(messageData);
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        },
      );
    }

    return () => {
      unmounted = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [roomId, isInRoom]);

  return { messages, loading, error };
};

export default useMessages;

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { IMessage, messageConverter } from 'models/message';
import 'firebase/firestore';

interface MessagesDictionary {
  [name: string]: IMessage;
}

const useMessages = (
  roomId: string | null,
): { messages: IMessage[]; loading: boolean; error: Error | null } => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unmounted = false;
    const messagesDictionary: MessagesDictionary = {};

    let unsubscribe: () => void | undefined;
    if (!unmounted && roomId) {
      const db = firebase.firestore();
      const query = db
        .collection('message')
        .doc('v1')
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('createdAt')
        .withConverter(messageConverter);

      console.log('subscribe messages listener');
      unsubscribe = query.onSnapshot(
        { includeMetadataChanges: true },
        (snapshot) => {
          snapshot
            .docChanges({ includeMetadataChanges: true })
            .forEach((docChange) => {
              const { doc } = docChange;
              const message = doc.data() as IMessage;
              if (docChange.type === 'added') {
                messagesDictionary[doc.id] = message;
              } else if (docChange.type === 'modified') {
                messagesDictionary[doc.id] = message;
              } else if (docChange.type === 'removed') {
                if (messagesDictionary[doc.id]) {
                  delete messagesDictionary[doc.id];
                }
              }
              if (doc.metadata.hasPendingWrites) {
                console.log(`${message.text} has pending writes `);
              }

              if (doc.metadata.fromCache) {
                console.log(`${message.text} is ${docChange.type} from cache`);
              } else {
                console.log(`${message.text} is ${docChange.type} from server`);
              }
            });
          const messageData = Object.values(messagesDictionary);
          setMessages(messageData);
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        },
      );
    } else {
      setMessages([]);
    }

    return () => {
      unmounted = true;
      if (unsubscribe) {
        console.log('unsubscribe messages listener');
        unsubscribe();
      }
    };
  }, [roomId]);

  return { messages, loading, error };
};

export default useMessages;

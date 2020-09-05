import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Message } from 'models/message';

interface MessagesDictionary {
  [name: string]: Message;
}

const useMessages = (
  isReady: boolean,
  roomId: string,
): { messages: Message[]; loading: boolean; error: Error | null } => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unmounted = false;
    const db = firebase.firestore();
    const query = db
      .collection('message')
      .doc('v1')
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt');

    let unsubscribe: () => void | undefined;
    if (!unmounted && isReady) {
      const messagesDictionary: MessagesDictionary = {};
      console.log('subscribe messages listener');
      unsubscribe = query.onSnapshot(
        { includeMetadataChanges: true },
        (snapshot) => {
          snapshot
            .docChanges({ includeMetadataChanges: true })
            .forEach((docChange) => {
              const { doc } = docChange;
              const message = {
                ...(doc.data() as Message),
                id: doc.id,
              };
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
  }, [isReady, roomId]);

  return { messages, loading, error };
};

export default useMessages;

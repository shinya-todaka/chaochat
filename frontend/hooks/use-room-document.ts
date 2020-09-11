import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { IRoom, roomConverter } from 'models/room';
import 'firebase/firestore';

const useRoomDocument = (
  uid: string | null,
  roomId: string | null,
): {
  room: IRoom | null;
  isInRoom: boolean;
  isRoomLoading: boolean;
  error: Error | null;
} => {
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [isInRoom, setIsInRoom] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;

    let unsubscribe: () => void | undefined;
    if (!unmounted && uid && roomId) {
      const db = firebase.firestore();
      const query = db
        .collection('message')
        .doc('v1')
        .collection('rooms')
        .doc(roomId)
        .withConverter(roomConverter);

      console.log('subscribe room document listener');
      unsubscribe = query.onSnapshot(
        (snapshot) => {
          setIsRoomLoading(true);
          const roomData = snapshot.data() as IRoom;
          if (!snapshot.metadata.hasPendingWrites) {
            const me = roomData.members.find((memberId) => memberId === uid);
            setIsInRoom(Boolean(me));
          }

          setRoom(roomData);
          setIsRoomLoading(false);
          console.log('read room!!', roomData);
        },
        (err) => {
          console.log(err);
          setError(err);
          setIsRoomLoading(false);
        },
      );
    }

    return () => {
      unmounted = true;
      if (unsubscribe) {
        console.log('unsubscribe room listener');
        unsubscribe();
      }
    };
  }, [uid, roomId]);

  return { room, isInRoom, isRoomLoading, error };
};

export default useRoomDocument;

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

      unsubscribe = query.onSnapshot(
        (snapshot) => {
          setIsRoomLoading(true);
          if (snapshot.exists) {
            const roomData = snapshot.data() as IRoom;
            if (!snapshot.metadata.hasPendingWrites) {
              const me = roomData.members.find((memberId) => memberId === uid);
              if (roomData.isClosed) {
                setIsInRoom(false);
              } else {
                setIsInRoom(Boolean(me));
              }
              setRoom(roomData);
            }
          }

          setIsRoomLoading(false);
        },
        (err) => {
          setError(err);
          setIsRoomLoading(false);
        },
      );
    }

    return () => {
      unmounted = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [uid, roomId]);

  return { room, isInRoom, isRoomLoading, error };
};

export default useRoomDocument;

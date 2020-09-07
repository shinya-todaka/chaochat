import firebase from 'firebase/app';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { IRoom } from 'models/room';

const useRoomOnce = (
  roomId: string,
): { room: IRoom | null; isRoomLoading: boolean; error: Error | null } => {
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [room, setRoom] = useState<IRoom | null>(null);

  useEffect(() => {
    const roomDocument = firebase
      .firestore()
      .collection('message')
      .doc('v1')
      .collection('rooms')
      .doc(roomId);

    roomDocument
      .get()
      .then((snapshot) => {
        console.log('get room once');
        const roomData: IRoom = snapshot.data() as IRoom;
        setRoom({ ...roomData, id: snapshot.id });
        setIsRoomLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsRoomLoading(false);
      });
  }, [roomId]);

  return { room, isRoomLoading, error };
};

export default useRoomOnce;

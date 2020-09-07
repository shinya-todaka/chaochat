import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { IMember } from 'models/member';

const useMember = (roomId: string, memberId: string) => {
  const [member, setMember] = useState<IMember>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const db = firebase.firestore();
    const docReference = db
      .collection('message')
      .doc('v1')
      .collection('rooms')
      .doc(roomId)
      .collection('members')
      .doc(memberId);

    const load = async () => {
      setLoading(true);
      docReference
        .get({ source: 'cache' })
        .then((doc) => {
          const cacheData = doc.data() as IMember;
          setMember({ ...cacheData, id: doc.id });
          setError(null);
          setLoading(false);
          console.log('get member doc from cache');
        })
        .catch(() => {
          docReference
            .get({ source: 'server' })
            .then((doc) => {
              const serverData = doc.data() as IMember;
              setMember({ ...serverData, id: doc.id });
              setError(null);
              setLoading(false);
              console.log('get member doc from server');
            })
            .catch((err) => {
              setError(err);
              setLoading(false);
              console.log('cant get member doc');
            });
        });
    };
    load();
  }, [roomId, memberId]);

  return { member, loading, error };
};

export default useMember;

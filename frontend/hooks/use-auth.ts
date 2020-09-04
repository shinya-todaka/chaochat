import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { User } from 'models/user';
import 'firebase/auth';

const useAuth = (): [User | null, boolean] => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const { displayName, photoURL } = authUser;
        if (displayName && photoURL) {
          setUser({ id: authUser.uid, displayName, photoUrl: photoURL });
        }
      } else {
        setUser(null);
      }
      setUserLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return [user, userLoading];
};

export default useAuth;

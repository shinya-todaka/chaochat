import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { User } from 'models/user';
import 'firebase/auth';

const useAuth = (): { user: User | null; loadingUser: boolean } => {
  const [user, setUser] = useState<null | User>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const { displayName, photoURL } = authUser;
        if (displayName && photoURL) {
          setUser({ id: authUser.uid, displayName, photoURL });
        }
      } else {
        setUser(null);
      }
      setLoadingUser(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user, loadingUser };
};

export default useAuth;

import firebase from 'firebase/app';
import { User } from 'models/user';

const writeUser = async (authUser: firebase.User): Promise<User | null> => {
  const db = firebase.firestore();
  const userReferece = db.collection('users').doc(authUser.uid);

  if (authUser.displayName && authUser.photoURL) {
    const theUser = {
      displayName: authUser.displayName,
      photoUrl: authUser.photoURL,
    };
    await userReferece.set(theUser);
    const user: User = {
      id: authUser.uid,
      displayName: authUser.displayName,
      photoURL: authUser.photoURL,
    };

    return user;
  }

  return null;
};

export default writeUser;

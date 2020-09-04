import firebase from 'firebase/app';

export type Member = {
  id?: string;
  displayName: string;
  photoUrl: string | null;
  isEnabled: boolean;
  createdAt: firebase.firestore.Timestamp | null;
};

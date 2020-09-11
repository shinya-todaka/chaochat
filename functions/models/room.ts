import firebase from 'firebase/app';

export type IRoom = {
  id: string;
  name: string | null;
  members: string[];
  expiresIn: 1 | 3 | 5 | 10;
  isClosed: boolean;
  updatedAt: firebase.firestore.Timestamp | null;
  createdAt: firebase.firestore.Timestamp | null;
};

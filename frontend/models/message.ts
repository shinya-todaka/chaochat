import firebase from 'firebase/app';

export type Message = {
  id?: string;
  from: string;
  text: string;
  createdAt: firebase.firestore.Timestamp | null;
};

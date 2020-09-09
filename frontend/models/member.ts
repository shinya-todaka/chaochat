import firebase from 'firebase/app';
import 'firebase/firestore';

export type IMember = {
  id: string;
  displayName: string;
  photoURL: string | null;
  isEnabled: boolean;
  createdAt: Date | null;
};

export type OMember = {
  displayName: string;
  photoURL: string | null;
  isEnabled: boolean;
  createdAt?: firebase.firestore.FieldValue;
};

export const memberConverter: firebase.firestore.FirestoreDataConverter<
  IMember | OMember
> = {
  toFirestore: (member: OMember): firebase.firestore.DocumentData => {
    return member;
  },
  fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot): IMember {
    const { createdAt } = snapshot.data();
    const member = {
      id: snapshot.id,
      createdAt: (createdAt && createdAt.toDate()) || null,
      ...snapshot.data(),
    } as IMember;

    return member;
  },
};

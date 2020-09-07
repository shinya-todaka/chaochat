import firebase from 'firebase/app';
import 'firebase/firestore';

export type OMember = {
  displayName: string;
  photoUrl: string | null;
  isEnabled: boolean;
  createdAt: firebase.firestore.FieldValue;
};

export type IMember = {
  id: string;
  displayName: string;
  photoUrl: string | null;
  isEnabled: boolean;
  createdAt: Date | null;
};

export const memberConverter: firebase.firestore.FirestoreDataConverter<
  IMember | OMember
> = {
  toFirestore: (member: OMember): firebase.firestore.DocumentData => ({
    displayName: member.displayName,
    photoUrl: member.photoUrl,
    isEnabled: member.isEnabled,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  }),
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

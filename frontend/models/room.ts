import firebase from 'firebase/app';

export type IRoom = {
  id: string;
  name: string | null;
  members: string[];
  updatedAt: Date | null;
  createdAt: Date | null;
};

export type ORoom = {
  name: string | null;
  members: string[];
  updatedAt: firebase.firestore.FieldValue;
  createdAt?: firebase.firestore.FieldValue;
};

export const roomConverter: firebase.firestore.FirestoreDataConverter<
  IRoom | ORoom
> = {
  toFirestore: (room: ORoom): firebase.firestore.DocumentData => {
    return room;
  },
  fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot): IRoom {
    const { updatedAt, createdAt, name, members } = snapshot.data();
    const roomData = {
      id: snapshot.id,
      updatedAt: (updatedAt && updatedAt.toDate()) || null,
      createdAt: (createdAt && createdAt.toDate()) || null,
      name,
      members,
    };

    return roomData;
  },
};

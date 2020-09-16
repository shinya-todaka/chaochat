import firebase from 'firebase/app';

export type IRoom = {
  id: string;
  name: string | null;
  members: string[];
  expiresIn: 3 | 5 | 10 | 15;
  isClosed: boolean;
  updatedAt: firebase.firestore.Timestamp | null;
  createdAt: firebase.firestore.Timestamp | null;
};

export type ORoom = {
  name: string | null;
  members: string[];
  expiresIn: 3 | 5 | 10 | 15;
  isClosed: boolean;
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
    const {
      updatedAt,
      createdAt,
      isClosed,
      name,
      members,
      expiresIn,
    } = snapshot.data();
    const roomData = {
      id: snapshot.id,
      updatedAt,
      createdAt,
      expiresIn,
      isClosed,
      name,
      members,
    };

    return roomData;
  },
};

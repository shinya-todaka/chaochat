import firebase from 'firebase/app';

export type IRoom = {
  id: string;
  name: string | null;
  members: string[];
  createdAt: Date;
};

export type ORoom = {
  name: string | null;
  members: string[];
  createdAt: firebase.firestore.FieldValue = firebase.firestore.FieldValue.serverTimestamp();
};

export const roomConverter: firebase.firestore.FirestoreDataConverter<
  IRoom | ORoom
> = {
  toFirestore: (room: ORoom): firebase.firestore.DocumentData => {
    return {
      name: room.name,
      members: room.members,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
  },
  fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot): IRoom {
    const createdAt = snapshot.data().createdAt as firebase.firestore.Timestamp;
    const room = {
      id: snapshot.id,
      createdAt: createdAt.toDate(),
      ...snapshot.data(),
    } as IRoom;

    return room;
  },
};

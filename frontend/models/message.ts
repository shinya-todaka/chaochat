import firebase from 'firebase/app';

export type IMessage = {
  id: string;
  from: string;
  text: string;
  createdAt: Date;
};

export type OMessage = {
  from: string;
  text: string;
  createdAt: firebase.firestore.FieldValue;
};

export const messageConverter: firebase.firestore.FirestoreDataConverter<
  IMessage | OMessage
> = {
  toFirestore: (message: OMessage): firebase.firestore.DocumentData => {
    return {
      from: message.from,
      text: message.text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
  },
  fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot): IMessage {
    const createdAt = snapshot.data().createdAt as firebase.firestore.Timestamp;
    const message = {
      id: snapshot.id,
      createdAt: createdAt.toDate(),
      ...snapshot.data(),
    } as IMessage;

    return message;
  },
};

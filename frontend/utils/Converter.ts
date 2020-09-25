import { firestore } from 'firebase';

export type Decoded<T> = T & {
  id: string;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};

export type Encoded<T> = T & {
  createdAt?: firestore.FieldValue;
  updatedAt?: firestore.FieldValue;
};

export default class Converter<T> {
  private includeCreatedAt: boolean;

  private includeUpdatedAt: boolean;

  constructor(includeCreatedAt: boolean, includeUpdatedAt: boolean) {
    this.includeCreatedAt = includeCreatedAt;
    this.includeUpdatedAt = includeUpdatedAt;
  }

  encode(data: T): Encoded<T> {
    const encodedData: Encoded<T> = data;
    if (this.includeCreatedAt) {
      encodedData.createdAt = firestore.FieldValue.serverTimestamp();
    }

    if (this.includeUpdatedAt) {
      encodedData.updatedAt = firestore.FieldValue.serverTimestamp();
    }

    return encodedData;
  }

  decode(snapshot: firestore.DocumentSnapshot): Decoded<T> {
    const data = snapshot.data();
    const originalData = data as T;
    const createdAt =
      data?.createdAt && this.includeCreatedAt
        ? (data.createdAt as firestore.Timestamp)
        : null;
    const updatedAt =
      data?.updatedAt && this.includeUpdatedAt
        ? (data.updatedAt as firestore.Timestamp)
        : null;

    return { id: snapshot.id, ...originalData, createdAt, updatedAt };
  }
}

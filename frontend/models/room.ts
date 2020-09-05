export type Room = {
  id?: string;
  name: string | null;
  members: string[];
  createdAt: firebase.firestore.Timestamp | null | Date;
};

import firebase from 'firebase/app';

const readMemberDocument = async (
  roomId: string,
  memberId: string,
): Promise<firebase.firestore.DocumentData> => {
  const db = firebase.firestore();
  const memberDocument = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc(roomId)
    .collection('members')
    .doc(memberId);

  const snapshot = await memberDocument.get();

  return snapshot;
};

export default readMemberDocument;

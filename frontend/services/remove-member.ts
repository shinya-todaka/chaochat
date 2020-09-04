import firebase from 'firebase/app';

const removeMember = async (uid: string, roomId: string): Promise<void> => {
  const db = firebase.firestore();
  const roomDocument = db
    .collection('message')
    .doc('v1')
    .collection('rooms')
    .doc(roomId);

  const batch = firebase.firestore().batch();
  batch.update(roomDocument, {
    members: firebase.firestore.FieldValue.arrayRemove(uid),
  });
  batch.update(roomDocument.collection('members').doc(uid), {
    isEnabled: false,
  });
  await batch.commit();
};

export default removeMember;

/* eslint-disable jest/expect-expect */
/* eslint-disable camelcase */
import * as firebase from '@firebase/testing';
import { firestore } from 'firebase';
import { firestore as admin_firestore } from 'firebase-admin';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { OMessage, messageConverter } from '../../frontend/models/message';

const projectId = `test-${uuid()}`;
const uid = 'alice';

const rules = fs.readFileSync('firestore.rules', 'utf8');
firebase.loadFirestoreRules({
  projectId,
  rules,
});

describe('test', () => {
  let userFirestore: firestore.Firestore;
  let adminFirestore: admin_firestore.Firestore;
  const roomPath = 'message/v1/rooms/aliceRoom';

  const baseMessage: OMessage = {
    from: 'alice',
    text: 'whats up!',
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  beforeAll(async () => {
    userFirestore = firebase
      .initializeTestApp({
        projectId,
        auth: { uid },
      })
      .firestore();

    // user SDKとadmin SDKのFirestoreは型レベルでは別物だが、initializeAdminAppはuser SDKのFirestoreを返すので無理やりキャスト
    adminFirestore = (firebase
      .initializeAdminApp({
        projectId,
      })
      .firestore() as unknown) as admin_firestore.Firestore;
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  afterEach(async () => {
    await firebase.clearFirestoreData({
      projectId,
    });
  });

  test('適切なmessageだとcreateできる', async () => {
    await adminFirestore.doc(roomPath).collection('members').doc(uid).set({});
    const roomReference = userFirestore.doc(roomPath);
    await firebase.assertSucceeds(
      roomReference.collection('messages').add(baseMessage),
    );
  });

  test('roomに属していないとcreateできない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    await firebase.assertFails(
      roomReference.collection('messages').add(baseMessage),
    );
  });

  // validation

  test('fromがないとcreateできない', async () => {
    await adminFirestore.doc(roomPath).collection('members').doc(uid).set({});
    const roomReference = userFirestore.doc(roomPath);
    const { from, ...message } = baseMessage;
    await firebase.assertFails(
      roomReference.collection('messages').add(message),
    );
  });

  test('textがないとcreateできない', async () => {
    await adminFirestore.doc(roomPath).collection('members').doc(uid).set({});
    const roomReference = userFirestore.doc(roomPath);
    const { text, ...message } = baseMessage;
    await firebase.assertFails(
      roomReference.collection('messages').add(message),
    );
  });

  test('textが空文字だとcreateできない', async () => {
    await adminFirestore.doc(roomPath).collection('members').doc(uid).set({});
    const roomReference = userFirestore.doc(roomPath);
    const message = { ...baseMessage, text: '' };
    await firebase.assertFails(
      roomReference.collection('messages').add(message),
    );
  });

  test('textが101文字以上だとcreateできない', async () => {
    await adminFirestore.doc(roomPath).collection('members').doc(uid).set({});
    const roomReference = userFirestore.doc(roomPath);
    const message = {
      ...baseMessage,
      text: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901'.replace(
        /\n/g,
        '',
      ),
    };
    console.log(message);
    await firebase.assertFails(
      roomReference.collection('messages').add(message),
    );
  });

  test('createdAtがないとcreateできない', async () => {
    await adminFirestore.doc(roomPath).collection('members').doc(uid).set({});
    const roomReference = userFirestore.doc(roomPath);
    const { createdAt, ...message } = baseMessage;
    console.log(message);
    await firebase.assertFails(
      roomReference.collection('messages').add(message),
    );
  });
});

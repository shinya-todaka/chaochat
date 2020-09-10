/* eslint-disable jest/expect-expect */
/* eslint-disable camelcase */
import * as firebase from '@firebase/testing';
import { firestore } from 'firebase';
import { firestore as admin_firestore } from 'firebase-admin';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { ORoom } from '../../frontend/models/room';
import { OMember } from '../../frontend/models/member';

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

  const baseRoom: ORoom = {
    name: 'aliceRoom',
    members: [uid],
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  const baseMember: OMember = {
    displayName: 'shinya',
    photoURL: null,
    isEnabled: true,
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

  test('適切なmemberだとcreateできる', async () => {
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, baseRoom);
    batch.set(roomReference.collection('members').doc(uid), baseMember);

    await firebase.assertSucceeds(batch.commit());
  });

  test('roomがupdateされてないとcreateできない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    await firebase.assertFails(
      roomReference.collection('members').doc(uid).set(baseMember),
    );
  });

  test('displayNameがないとcreateできない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, baseRoom);
    const { displayName, ...member } = baseMember;
    batch.set(roomReference.collection('members').doc(uid), member);

    await firebase.assertFails(batch.commit());
  });

  test('displayNameが空文字だとcreateできない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, baseRoom);
    const member = { ...baseMember, displayName: '' };
    batch.set(roomReference.collection('members').doc(uid), member);

    await firebase.assertFails(batch.commit());
  });

  test('displayNameが31文字以上だとcreateできない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, baseRoom);
    const member = {
      ...baseMember,
      displayName: '1234567890123456789012345678901',
    };
    batch.set(roomReference.collection('members').doc(uid), member);

    await firebase.assertFails(batch.commit());
  });

  test('photoUrlがないとcreateできない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, baseRoom);
    const { photoURL, ...member } = baseMember;
    batch.set(roomReference.collection('members').doc(uid), member);

    await firebase.assertFails(batch.commit());
  });

  test('createdAtがないとcreateできない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, baseRoom);
    const { createdAt, ...member } = baseMember;
    batch.set(roomReference.collection('members').doc(uid), member);

    await firebase.assertFails(batch.commit());
  });

  test('isEnabledがないとcreateできない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, baseRoom);
    const { isEnabled, ...member } = baseMember;
    batch.set(roomReference.collection('members').doc(uid), member);

    await firebase.assertFails(batch.commit());
  });

  test('isEnabledがtrueでないとcreateできない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, baseRoom);
    const member = { ...baseMember, isEnabled: 'true' };
    batch.set(roomReference.collection('members').doc(uid), member);

    await firebase.assertFails(batch.commit());
  });
});

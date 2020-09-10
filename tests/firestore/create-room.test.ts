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

  test('適切なroomだとcreateできる', async () => {
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, baseRoom);
    batch.set(roomReference.collection('members').doc(uid), baseMember);

    await firebase.assertSucceeds(batch.commit());
  });

  // validation
  test('nameが空文字だと作れない', async () => {
    const room = { ...baseRoom, name: '' };
    console.log(room);
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, room);
    batch.set(roomReference.collection('members').doc(uid), baseMember);

    await firebase.assertFails(batch.commit());
  });

  test('nameが30文字より大きいと作れない', async () => {
    const room = {
      ...baseRoom,
      name: 'アイウエオか聞くけこさしすせそたちつてとなにぬねのは皮膚へほま',
    };
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, room);
    batch.set(roomReference.collection('members').doc(uid), baseMember);

    await firebase.assertFails(batch.commit());
  });

  test('membersのuidでmemberが同時に作られていない', async () => {
    const roomReference = userFirestore.doc(roomPath);
    await firebase.assertFails(roomReference.set(baseRoom));
  });

  test('updatedAtがないと作れない', async () => {
    const { updatedAt, ...room } = baseRoom;
    console.log(room);
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, room);
    batch.set(roomReference.collection('members').doc(uid), baseMember);

    await firebase.assertFails(batch.commit());
  });

  test('createdAtがないので作れない', async () => {
    const { createdAt, ...room } = baseRoom;
    const roomReference = userFirestore.doc(roomPath);
    const batch = userFirestore.batch();
    batch.set(roomReference, room);
    batch.set(roomReference.collection('members').doc(uid), baseMember);

    await firebase.assertFails(batch.commit());
  });
});

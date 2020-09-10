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
const tomuid = 'tom';

const rules = fs.readFileSync('firestore.rules', 'utf8');
firebase.loadFirestoreRules({
  projectId,
  rules,
});

describe('test', () => {
  let aliceFirestore: firestore.Firestore;
  let tomFirestore: firestore.Firestore;
  let adminFirestore: admin_firestore.Firestore;
  const roomPath = 'message/v1/rooms/aliceRoom';

  const baseRoom: ORoom = {
    name: 'aliceRoom',
    members: [uid],
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  const baseMember: OMember = {
    displayName: 'alice',
    photoURL: null,
    isEnabled: true,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  beforeAll(async () => {
    aliceFirestore = firebase
      .initializeTestApp({
        projectId,
        auth: { uid },
      })
      .firestore();

    tomFirestore = firebase
      .initializeTestApp({
        projectId,
        auth: { uid: tomuid },
      })
      .firestore();

    // user SDKとadmin SDKのFirestoreは型レベルでは別物だが、initializeAdminAppはuser SDKのFirestoreを返すので無理やりキャスト
    adminFirestore = (firebase
      .initializeAdminApp({
        projectId,
      })
      .firestore() as unknown) as admin_firestore.Firestore;
  });

  beforeEach(async () => {
    const roomReference = aliceFirestore.doc(roomPath);
    const batch = aliceFirestore.batch();
    batch.set(roomReference, baseRoom);
    batch.set(roomReference.collection('members').doc(uid), baseMember);

    await firebase.assertSucceeds(batch.commit());
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  afterEach(async () => {
    await firebase.clearFirestoreData({
      projectId,
    });
  });

  test('適切なupdateなのでできる', async () => {
    const tomMember = { ...baseMember, displayName: 'tom' };
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: firestore.FieldValue.arrayUnion(tomuid),
    });
    batch.set(roomReference.collection('members').doc(tomuid), tomMember);
    await firebase.assertSucceeds(batch.commit());
  });
});

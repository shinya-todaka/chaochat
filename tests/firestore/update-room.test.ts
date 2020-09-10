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
const reouid = 'reo';

const rules = fs.readFileSync('firestore.rules', 'utf8');
firebase.loadFirestoreRules({
  projectId,
  rules,
});

describe('test', () => {
  let aliceFirestore: firestore.Firestore;
  let tomFirestore: firestore.Firestore;
  let reoFirestore: firestore.Firestore;
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

    reoFirestore = firebase
      .initializeTestApp({
        projectId,
        auth: { uid: reouid },
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

  test('roomのupdateだけはできない', async () => {
    const roomReference = tomFirestore.doc(roomPath);
    firebase.assertFails(
      roomReference.update({
        updatedAt: firestore.FieldValue.serverTimestamp(),
        members: firestore.FieldValue.arrayUnion(tomuid),
      }),
    );
  });

  // validation

  test('nameが変わっているのでupdateできない', async () => {
    const tomMember = { ...baseMember, displayName: 'tom' };
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      name: 'shinyaRoom',
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: firestore.FieldValue.arrayUnion(tomuid),
    });
    batch.set(roomReference.collection('members').doc(tomuid), tomMember);
    await firebase.assertFails(batch.commit());
  });

  test('新しいfieldが追加されているのでupdateできない', async () => {
    const tomMember = { ...baseMember, displayName: 'tom' };
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      hogehoge: 'hogehoge',
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: firestore.FieldValue.arrayUnion(tomuid),
    });
    batch.set(roomReference.collection('members').doc(tomuid), tomMember);
    await firebase.assertFails(batch.commit());
  });

  test('fieldが削除されているのでupdateできない', async () => {
    const tomMember = { ...baseMember, displayName: 'tom' };
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      name: firestore.FieldValue.delete(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: firestore.FieldValue.arrayUnion(tomuid),
    });
    batch.set(roomReference.collection('members').doc(tomuid), tomMember);
    await firebase.assertFails(batch.commit());
  });

  test('membersが消されているのでupdateできない', async () => {
    const tomMember = { ...baseMember, displayName: 'tom' };
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: [],
    });
    batch.set(roomReference.collection('members').doc(tomuid), tomMember);
    await firebase.assertFails(batch.commit());
  });

  test('mebersが複数追加されているのでupdateできない', async () => {
    const tomMember = { ...baseMember, displayName: 'tom' };
    const reoMember = { ...baseMember, displayName: 'reo' };
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: firestore.FieldValue.arrayUnion(tomuid, reouid),
    });
    batch.set(roomReference.collection('members').doc(tomuid), tomMember);
    batch.set(roomReference.collection('members').doc(reouid), reoMember);
    await firebase.assertFails(batch.commit());
  });

  test('membersには自分のuidでないとupdateできない', async () => {
    const reoMember = { ...baseMember, displayName: 'reo' };
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: firestore.FieldValue.arrayUnion(reouid),
    });
    batch.set(roomReference.collection('members').doc(reouid), reoMember);
    await firebase.assertFails(batch.commit());
  });

  test('元のmemberが変わっているとupdateできない', async () => {
    const tomMember = { ...baseMember, displayName: 'reo' };
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: ['hogehoge', tomuid],
    });
    batch.set(roomReference.collection('members').doc(tomuid), tomMember);
    await firebase.assertFails(batch.commit());
  });

  test('すでにいるmemberは追加できない', async () => {
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: firestore.FieldValue.arrayUnion(uid),
    });
    batch.set(roomReference.collection('members').doc(uid), baseMember);
    await firebase.assertFails(batch.commit());
  });

  test('updatedAtがないとupdateできない', async () => {
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      members: firestore.FieldValue.arrayUnion(uid),
    });
    batch.set(roomReference.collection('members').doc(uid), baseMember);
    await firebase.assertFails(batch.commit());
  });

  test('membersを30人より大きいとupdateできない', async () => {
    const addingMembers = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29'.split(
      ',',
    );
    await adminFirestore
      .doc(roomPath)
      .update({ members: firestore.FieldValue.arrayUnion(...addingMembers) });
    const tomMember = { ...baseMember, displayName: 'tom' };
    const roomReference = tomFirestore.doc(roomPath);
    const batch = tomFirestore.batch();
    batch.update(roomReference, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      members: firestore.FieldValue.arrayUnion(tomuid),
    });
    batch.set(roomReference.collection('members').doc(tomuid), tomMember);
    await firebase.assertFails(batch.commit());
  });
});

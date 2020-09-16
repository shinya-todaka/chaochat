import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { IRoom } from '../../models/room';
import ExpirationTaskPayload from '../../models/ExpirationTaskPayload';
import { createBuffer } from './helper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CloudTasksClient } = require('@google-cloud/tasks');

export const onCreate = functions
  .region('asia-northeast1')
  .firestore.document('/message/{version}/rooms/{roomID}')
  .onCreate(async (snapshot) => {
    const room = snapshot.data() as IRoom;
    const { expiresIn } = room;
    const expirationAtSeconds = Date.now() / 1000 + expiresIn * 60;

    const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId;
    const location = 'asia-northeast1';
    const queue = 'room-ttl';

    const tasksClient = new CloudTasksClient();
    const queuePath = tasksClient.queuePath(project, location, queue);

    const url = `https://${location}-${project}.cloudfunctions.net/firestoreTtlCallback`;
    const serviceAccountId = 'close-room';
    const serviceAccountEmail = `${serviceAccountId}@${project}.iam.gserviceaccount.com`;
    const docPath = snapshot.ref.path;
    const payload: ExpirationTaskPayload = { docPath };

    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url,
        body: Buffer.from(JSON.stringify(payload)).toString('base64'),
        oidcToken: {
          serviceAccountEmail,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
      scheduleTime: {
        seconds: expirationAtSeconds,
      },
    };
    try {
      await tasksClient.createTask({ parent: queuePath, task });
    } catch (error) {
      functions.logger.error(error);
    }

    const bucket = admin.storage().bucket();
    try {
      const buffer = await createBuffer(room);
      const path = `message/v1/ogpImage/roomId/${snapshot.id}.png`;
      await bucket.file(path).save(buffer);
      await bucket.file(path).makePublic();
    } catch (error) {
      functions.logger.error(error);
    }
  });

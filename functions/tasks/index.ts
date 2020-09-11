import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import ExpirationTaskPayload from '../models/ExpirationTaskPayload';

export const firestoreTtlCallback = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const payload = req.body as ExpirationTaskPayload;
    try {
      await admin.firestore().doc(payload.docPath).update({
        isClosed: true,
      });
      res.send(200);
    } catch (error) {
      functions.logger.error(error);
      console.log(error);
      res.status(500).send(error);
    }
  });

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import express from 'express';
import next from 'next';
import * as firestore from './firestore';
import { firestoreTtlCallback } from './tasks';

admin.initializeApp();

const distDir = `${path.relative(process.cwd(), __dirname)}/next`;
const app = next({
  dev: false,
  conf: { distDir },
});

const handle = app.getRequestHandler();

const nextjsFunc = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  const server = express();

  server.get('*', async (_req, _res) => {
    await handle(_req, _res);
  });
  server.use((error: any) => {
    functions.logger.error(error);
    res.status(500).send('error');
  });
  server(req, res);
});

export { nextjsFunc, firestore, firestoreTtlCallback };

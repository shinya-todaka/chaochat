import * as functions from 'firebase-functions';
import * as path from 'path';
import express from 'express';
import next from 'next';
import helloWorld from './helloWorld';
import ogpImage from './ogpImage';

const distDir = `${path.relative(process.cwd(), __dirname)}/next`;
const app = next({
  dev: false,
  conf: { distDir },
});

const handle = app.getRequestHandler();

export const nextjsFunc = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  const server = express();
  server.use('/helloWorld', helloWorld);
  server.use('/ogpImage', ogpImage);

  server.get('*', async (_req, _res) => {
    await handle(_req, _res);
  });
  server.use((error: any) => {
    functions.logger.error(error);
    res.status(500).send('error');
  });
  server(req, res);
});

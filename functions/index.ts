import * as functions from 'firebase-functions';
import * as path from 'path';
import express from 'express';
import next from 'next';

const helloWorld = express();
helloWorld.get('*', (req, res) => {
  res.status(200).send('Hello World!');
});

const server = express();
server.use('/helloWorld', helloWorld);
server.get('*', async (_req, _res) => {
  const distDir = `${path.relative(process.cwd(), __dirname)}/next`;

  functions.logger.info('distDir', distDir);
  const nextjsServer = next({
    dev: false,
    conf: { distDir },
  });
  const nextjsHandle = nextjsServer.getRequestHandler();
  await nextjsServer.prepare();
  await nextjsHandle(_req, _res);
});

export const nextjsFunc = functions.https.onRequest(server);

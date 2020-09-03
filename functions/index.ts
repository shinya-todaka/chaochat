import * as functions from 'firebase-functions';
import * as path from 'path';
import next from 'next';

const distDir = `${path.relative(process.cwd(), __dirname)}/next`;

const nextjsServer = next({
  dev: false,
  conf: { distDir },
});
const nextjsHandle = nextjsServer.getRequestHandler();

export const nextjsFunc = functions.https.onRequest((req, res) => {
  return nextjsServer.prepare().then(() => nextjsHandle(req, res));
});

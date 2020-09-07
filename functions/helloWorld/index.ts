import express from 'express';

const helloWorld = express();
helloWorld.get('*', (req, res) => {
  res.status(200).send('Hello World!');
});

export default helloWorld;

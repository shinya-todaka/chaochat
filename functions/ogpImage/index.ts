import express from 'express';
import { createCanvas, loadImage } from 'canvas';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

const imagePath = 'dist/images/background.png';

async function createBuffer(): Promise<Buffer> {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const context = canvas.getContext('2d');
  const image = await loadImage(imagePath);
  context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  return canvas.toBuffer();
}

const app = express();
app.get('*', async (req, res) => {
  try {
    const imageBinary: Buffer = await createBuffer();
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': imageBinary.length,
    });
    res.status(200).end(imageBinary, 'binary');
  } catch (error) {
    res.status(400).send(error);
  }
});

export default app;

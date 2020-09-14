import express from 'express';
import admin from 'firebase-admin';
import dayjs from 'dayjs';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { IRoom } from '../models/room';
import 'dayjs/locale/ja';
import { clock } from './helper';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

const IMAGE_PATH = 'dist/images/background.png';
const FONT_PATH = 'dist/fonts/OpenSans-Bold.ttf';
const MAIN_FONT_SIZE = 80;
const FONT_FAMILY = 'OpenSans Bold';

const splitByMeasureWidth = (
  str: string,
  maxWidth: number,
  context: CanvasRenderingContext2D,
): string[] => {
  const lines: string[] = [];
  let line = '';
  str.split('').forEach((char) => {
    line += char;
    if (context.measureText(line).width > maxWidth) {
      lines.push(line.slice(0, -1));
      line = line.slice(-1);
    }
  });
  lines.push(line);

  return lines;
};

async function createBuffer(room: IRoom): Promise<Buffer> {
  registerFont(FONT_PATH, { family: FONT_FAMILY });
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const context = canvas.getContext('2d');
  const image = await loadImage(IMAGE_PATH);
  context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.font = `${MAIN_FONT_SIZE}px ${FONT_FAMILY}`;
  context.fillStyle = '#000';

  if (room.name) {
    const descriptionLines: string[] = splitByMeasureWidth(
      room.name,
      CANVAS_WIDTH - 40,
      context,
    );

    let startingPositionY = CANVAS_HEIGHT / 2;
    if (descriptionLines.length === 3) {
      startingPositionY -= MAIN_FONT_SIZE;
    } else if (descriptionLines.length === 2) {
      startingPositionY -= MAIN_FONT_SIZE / 2;
    }
    descriptionLines.forEach((line: string) => {
      const textWidth: number = context.measureText(line).width;
      context.fillText(line, (CANVAS_WIDTH - textWidth) / 2, startingPositionY);
      startingPositionY += MAIN_FONT_SIZE + 20;
    });
  }

  // change font size
  context.font = `${90}px ${FONT_FAMILY}`;
  context.fillStyle = '#000';
  const time = dayjs(Date()).add(9, 'hour').add(room.expiresIn, 'minute');
  const timeFormat = time.format('A HH:mm:ss まで');
  const textWidth: number = context.measureText(timeFormat).width;
  context.fillText(
    timeFormat,
    (CANVAS_WIDTH - textWidth) / 2,
    500 + 90 / 2 - 8,
  );

  // draw clock
  return canvas.toBuffer();
}

const app = express();
app.get('*', async (req, res) => {
  const { roomId } = req.query;
  res.set('Cache-Control', 'public, max-age=600, s-maxage=600');
  try {
    if (!roomId || typeof roomId !== 'string') {
      throw Error('roomId cannot be found');
    } else {
      const roomReference = admin
        .firestore()
        .collection('message')
        .doc('v1')
        .collection('rooms')
        .doc(roomId);
      const roomDoc = await roomReference.get();
      const room = roomDoc.data() as IRoom;
      const imageBinary: Buffer = await createBuffer(room);
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imageBinary.length,
      });
      res.status(200).end(imageBinary, 'binary');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

export default app;

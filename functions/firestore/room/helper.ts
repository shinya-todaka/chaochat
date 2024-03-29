import dayjs from 'dayjs';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { IRoom } from '../../models/room';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

const IMAGE_PATH = 'dist/images/background.png';
const FONT_PATH = 'dist/fonts/NotoSansJP-Bold.otf';
const MAIN_FONT_SIZE = 70;
const DATE_FONT_SIZE = 50;
const FONT_FAMILY = 'NotoSansJP Bold';

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

export async function createBuffer(room: IRoom): Promise<Buffer> {
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
  } else {
    const text = `${room.expiresIn}分間話そう！`;
    const textWidth = context.measureText(text).width;
    context.fillText(text, (CANVAS_WIDTH - textWidth) / 2, CANVAS_HEIGHT / 2);
  }

  context.font = `${DATE_FONT_SIZE}px ${FONT_FAMILY}`;
  context.fillStyle = '#000';
  const time = dayjs(room.createdAt.toDate())
    .add(9, 'hour')
    .add(room.expiresIn, 'minute');
  const timeFormat = time.format('A h:mm:ss まで');
  context.fillText(timeFormat, 484, 530);

  return canvas.toBuffer();
}

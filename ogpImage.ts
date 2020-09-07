const imagePath = 'images/background.png';
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const FONT_SIZE = 60;
const FONT_FAMILY = 'Noto Sans JP';
const FONT_PATH = 'fonts/NotoSansJP-Regular.otf';

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

async function createBuffer(userName: string): Promise<Buffer> {
  registerFont(FONT_PATH, { family: FONT_FAMILY });
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const context = canvas.getContext('2d');
  const image = await loadImage(imagePath);
  context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
  context.fillStyle = '#000000';

  const descriptionLines: string[] = splitByMeasureWidth(
    userName,
    CANVAS_WIDTH - 16,
    context,
  );
  let startingPositionY = 400;
  descriptionLines.forEach((line: string) => {
    const textWidth: number = context.measureText(line).width;
    context.fillText(line, (CANVAS_WIDTH - textWidth) / 2, startingPositionY);
    startingPositionY += FONT_SIZE + 20;
  });

  return canvas.toBuffer();
}

const ogpImage = express();
ogpImage.get('*', async (req, res) => {
  const { userName } = req.query;
  const buffer = await createBuffer(userName as string);
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
  });
  res.status(200).end(buffer, 'binary');
});
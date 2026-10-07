/**
 * Helper to render and download meme image on HTML5 Canvas
 */

export interface MemeRenderOptions {
  imageUrl: string;
  topText: string;
  bottomText: string;
  fontFamily?: string;
  customFontSizeRatio?: number;
}

/**
 * Splits text into wrapped lines that fit within maxWidth
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/);
  if (words.length === 0 || !text.trim()) return [];

  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

/**
 * Draws meme text (uppercase, Impact font, white with thick black outline)
 */
function drawMemeText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  canvasWidth: number,
  fontSize: number,
  isTop: boolean
) {
  if (!text || !text.trim()) return;

  const upperText = text.toUpperCase();
  ctx.save();
  ctx.font = `900 ${fontSize}px Impact, "Arial Black", "Trebuchet MS", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = isTop ? 'top' : 'bottom';
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(3, fontSize * 0.14);
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 2;

  const maxWidth = canvasWidth * 0.92;
  const lines = wrapText(ctx, upperText, maxWidth);
  const lineHeight = fontSize * 1.15;

  if (isTop) {
    lines.forEach((line, index) => {
      const lineY = y + index * lineHeight;
      ctx.strokeText(line, canvasWidth / 2, lineY);
      ctx.fillText(line, canvasWidth / 2, lineY);
    });
  } else {
    // Bottom text drawn upward
    const reversedLines = [...lines].reverse();
    reversedLines.forEach((line, index) => {
      const lineY = y - index * lineHeight;
      ctx.strokeText(line, canvasWidth / 2, lineY);
      ctx.fillText(line, canvasWidth / 2, lineY);
    });
  }

  ctx.restore();
}

/**
 * Generates a PNG Blob or Data URL from an image and top/bottom text
 */
export async function generateMemeDataUrl(options: MemeRenderOptions): Promise<string> {
  const { imageUrl, topText, bottomText } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 800;
      canvas.height = img.naturalHeight || img.height || 600;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not supported'));
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Calculate dynamic font size based on image dimensions
      const baseDim = Math.min(canvas.width, canvas.height);
      const fontSize = Math.max(24, Math.min(72, Math.round(baseDim * 0.085)));

      const margin = Math.round(canvas.height * 0.035);

      // Draw top text
      if (topText) {
        drawMemeText(ctx, topText, margin, canvas.width, fontSize, true);
      }

      // Draw bottom text
      if (bottomText) {
        drawMemeText(ctx, bottomText, canvas.height - margin, canvas.width, fontSize, false);
      }

      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for meme export'));
    };

    img.src = imageUrl;
  });
}

/**
 * Triggers browser download of the meme as PNG
 */
export async function downloadMemePng(
  options: MemeRenderOptions,
  filename = 'captioncraft-meme.png'
): Promise<void> {
  const dataUrl = await generateMemeDataUrl(options);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

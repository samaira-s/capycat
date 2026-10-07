import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '35mb' }));

// Shared server-side Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION =
  'You are a sharp, funny caption writer. Look carefully at what is actually in the image (objects, expressions, setting, mood) and write captions that reference specific details. Never write generic captions. Keep each under 20 words.';

// Helper to sanitize base64 input
function parseBase64Image(dataUrlOrBase64: string, fallbackMime = 'image/jpeg') {
  if (dataUrlOrBase64.startsWith('data:')) {
    const commaIndex = dataUrlOrBase64.indexOf(',');
    const meta = dataUrlOrBase64.substring(0, commaIndex);
    const mimeMatch = meta.match(/data:([^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : fallbackMime;
    const base64Data = dataUrlOrBase64.substring(commaIndex + 1);
    return { mimeType, base64Data };
  }
  return { mimeType: fallbackMime, base64Data: dataUrlOrBase64 };
}

// Generate 5 captions
app.post('/api/generate-captions', async (req: Request, res: Response) => {
  try {
    const { image, mimeType = 'image/jpeg', style = 'Witty', memeMode = false } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please verify your environment secrets.',
      });
    }

    const { mimeType: resolvedMime, base64Data } = parseBase64Image(image, mimeType);

    const promptText = `Generate exactly 5 distinct, clever caption options for this image in the style: "${style}".
${
  memeMode
    ? 'Meme mode is active: Ensure top_text and bottom_text follow classic, punchy meme setup-and-punchline humor directly referencing what is happening in the picture.'
    : 'Also include top_text and bottom_text for meme format overlay.'
}
Strict requirements:
1. Every caption must reference concrete, recognizable details in the photo (e.g. postures, background props, eye contact, expressions, colors, text, or activities).
2. Never write cliché or generic filler (like "Living my best life" or "Just vibe").
3. Keep the "text" field strictly under 20 words.
4. Keep top_text and bottom_text punchy, short, and impactful.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: resolvedMime,
              data: base64Data,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              description: 'List of 5 unique caption options for the image.',
              items: {
                type: Type.OBJECT,
                properties: {
                  text: {
                    type: Type.STRING,
                    description: 'A sharp, specific caption under 20 words.',
                  },
                  top_text: {
                    type: Type.STRING,
                    description: 'Punchy top text for meme format.',
                  },
                  bottom_text: {
                    type: Type.STRING,
                    description: 'Punchy bottom text for meme format.',
                  },
                },
                required: ['text', 'top_text', 'bottom_text'],
              },
            },
          },
          required: ['captions'],
        },
      },
    });

    const rawText = response.text || '';
    let parsedData: { captions?: Array<{ text: string; top_text: string; bottom_text: string }> };
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', rawText);
      return res.status(502).json({ error: 'Invalid JSON returned from AI model. Please try again.' });
    }

    if (!parsedData.captions || !Array.isArray(parsedData.captions) || parsedData.captions.length === 0) {
      return res.status(502).json({ error: 'No captions were generated. Please try again.' });
    }

    return res.json({ captions: parsedData.captions.slice(0, 5) });
  } catch (err: unknown) {
    console.error('Error generating captions:', err);
    const message = err instanceof Error ? err.message : 'Failed to generate captions';
    return res.status(500).json({ error: message });
  }
});

// Regenerate single caption
app.post('/api/regenerate-caption', async (req: Request, res: Response) => {
  try {
    const {
      image,
      mimeType = 'image/jpeg',
      style = 'Witty',
      existingCaptions = [],
      memeMode = false,
    } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const { mimeType: resolvedMime, base64Data } = parseBase64Image(image, mimeType);

    const existingList = Array.isArray(existingCaptions) && existingCaptions.length > 0
      ? `Do NOT repeat or closely rephrase any of these previous captions:\n- ${existingCaptions.join('\n- ')}`
      : '';

    const promptText = `Generate ONE single brand-new, fresh caption option for this image in the style: "${style}".
${existingList}
${
  memeMode
    ? 'Meme mode is active: Ensure top_text and bottom_text form a punchy, hilarious meme setup-and-punchline directly referencing visual elements.'
    : 'Provide top_text and bottom_text for meme format as well.'
}
Strict requirements:
1. Must reference visible concrete details in the photo.
2. Under 20 words for the "text" field.
3. Completely different angle/joke from existing ones.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: resolvedMime,
              data: base64Data,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: 'A sharp, specific single caption under 20 words.',
            },
            top_text: {
              type: Type.STRING,
              description: 'Punchy top text for meme format.',
            },
            bottom_text: {
              type: Type.STRING,
              description: 'Punchy bottom text for meme format.',
            },
          },
          required: ['text', 'top_text', 'bottom_text'],
        },
      },
    });

    const rawText = response.text || '';
    let parsedData: { text: string; top_text: string; bottom_text: string };
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      return res.status(502).json({ error: 'Failed to parse regenerated caption response.' });
    }

    return res.json({ caption: parsedData });
  } catch (err: unknown) {
    console.error('Error regenerating caption:', err);
    const message = err instanceof Error ? err.message : 'Failed to regenerate caption';
    return res.status(500).json({ error: message });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CaptionCraft server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});

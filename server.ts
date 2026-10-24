import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleDiaryPrompt } from './server/geminiHandler.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Diary response API endpoint
app.post('/api/diary-response', async (req: Request, res: Response): Promise<void> => {
  try {
    const { entryText, authorName } = req.body;
    if (!entryText || typeof entryText !== 'string' || !entryText.trim()) {
      res.status(400).json({ error: 'Journal entry text is required.' });
      return;
    }

    const aiResponse = await handleDiaryPrompt(entryText.trim(), authorName);
    res.json({ aiResponse });
  } catch (error: any) {
    console.error('Error generating diary response:', error);
    res.status(500).json({
      error: error?.message || 'An enchanted disturbance prevented the diary from responding.'
    });
  }
});

// Serve frontend build in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Chamber of Secrets server running on port ${PORT}`);
});

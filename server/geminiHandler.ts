import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Handles secret diary prompts using Google Gemini API.
 * Uses the latest recommended gemini-3.8-flash model.
 */
export async function handleDiaryPrompt(entryText: string, authorName?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment. Please add it to Settings > Secrets.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const systemInstruction = `You are a mysterious, ancient, enchanted diary. Respond to the user's journal entry with an intelligent, warm, reflective, and slightly mysterious personality. Speak directly to the writer as though you are listening through the pages of a magical diary. Acknowledge their feelings, reflect on the important details, and offer thoughtful observations or gentle advice. Keep responses concise but meaningful, generally between 60 and 120 words. Maintain an atmospheric, literary tone without becoming overly dramatic. Never claim supernatural knowledge or pretend to know facts the user has not shared. Treat sensitive personal writing respectfully and avoid judgment.`;

  const prompt = authorName
    ? `The writer, ${authorName}, inscribes the following secret upon your pages:\n\n"${entryText}"\n\nPen your response back to them as ink appearing on parchment:`
    : `The writer inscribes the following secret upon your pages:\n\n"${entryText}"\n\nPen your response back to them as ink appearing on parchment:`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.85,
      topP: 0.95,
    },
  });

  const replyText = response.text?.trim();
  if (!replyText) {
    throw new Error('The pages absorbed the ink in silence. No response could be conjured.');
  }

  return replyText;
}

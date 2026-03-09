import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { vertexAI } from '@genkit-ai/vertexai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    vertexAI({
      location: 'us-central1', // Default location for Vertex AI services
    }),
  ],
  model: 'googleai/gemini-2.5-flash', // Default model for standard tasks
});

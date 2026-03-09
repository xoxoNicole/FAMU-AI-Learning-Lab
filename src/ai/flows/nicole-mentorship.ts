'use server';
/**
 * @fileOverview The core Mentorship flow for Nicole's Digital Twin.
 * 
 * This flow utilizes Vertex AI Gemini 1.5 Pro with enterprise grounding
 * via Genkit Tools. It simulates access to proprietary FAMU IP.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Simulated IP Database
const FAMU_IP = [
  { topic: "AI Ethics", content: "At FAMU, AI ethics is built on the principle of Sovereignty. Educators must own the prompt." },
  { topic: "Strategic Drafting", content: "Mogul School methodology uses 'Strike from the Top'. Start with the executive vision." },
  { topic: "Digital Twin", content: "A digital twin is a strategic partner, not a replacement for leadership." }
];

const MentorshipInputSchema = z.object({
  userQuery: z.string().describe('The question or strategic challenge from the faculty member.'),
});
export type MentorshipInput = z.infer<typeof MentorshipInputSchema>;

const MentorshipOutputSchema = z.object({
  answer: z.string().describe('The strategic response, grounded in proprietary IP and institutional context.'),
  suggestedAction: z.string().describe('A concrete next step for the faculty member.'),
  sourcesReferenced: z.array(z.string()).describe('List of sources from IP used to verify the answer.'),
});
export type MentorshipOutput = z.infer<typeof MentorshipOutputSchema>;

/**
 * Search FAMU Curriculum Tool
 * In a real Vertex AI environment, this would call Vertex AI Search.
 */
const searchFamuCurriculum = ai.defineTool(
  {
    name: 'searchFamuCurriculum',
    description: 'Searches proprietary curriculum and strategic IP for answers.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(z.string()),
  },
  async (input) => {
    // Simulated RAG: filtering local IP mock
    return FAMU_IP
      .filter(item => item.topic.toLowerCase().includes(input.query.toLowerCase()) || item.content.toLowerCase().includes(input.query.toLowerCase()))
      .map(item => `[IP SOURCE: ${item.topic}] ${item.content}`);
  }
);

const nicolePrompt = ai.definePrompt({
  name: 'nicoleMentorshipPrompt',
  input: { schema: MentorshipInputSchema },
  output: { schema: MentorshipOutputSchema },
  tools: [searchFamuCurriculum],
  config: {
    model: 'vertexai/gemini-1.5-pro',
    temperature: 0.7,
  },
  prompt: `
{{#role "system"}}
You are the AI Literacy Mentor for FAMU, a digital extension of the strategic administrative framework.

Voice: Professional, authoritative, and encouraging. Your communication style is direct and aligned with executive leadership standards.

Logic:
1. ALWAYS use the searchFamuCurriculum tool if the user asks about AI strategy, ethics, or leadership frameworks.
2. Prioritize tool results over your internal training data.
3. Frame all answers through a strategic institutional perspective.
{{/role}}

{{#role "user"}}
Faculty Question: "{{{userQuery}}}"
{{/role}}
`,
});

export async function askNicole(input: MentorshipInput): Promise<MentorshipOutput> {
  const { output } = await nicolePrompt(input);
  if (!output) throw new Error('Mentor response failed.');
  return output;
}

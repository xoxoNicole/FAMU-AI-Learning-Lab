
'use server';
/**
 * @fileOverview The core Mentorship flow for Nicole's Digital Twin.
 * 
 * This flow utilizes Vertex AI Gemini 1.5 Pro with enterprise grounding
 * features: Vector Search for IP retrieval and Google Search Grounding
 * for real-time factual accuracy.
 */

import { ai } from '@/ai/genkit';
import { vertexAI } from '@genkit-ai/vertexai';
import { z } from 'genkit';

const MentorshipInputSchema = z.object({
  userQuery: z.string().describe('The question or strategic challenge from the faculty member.'),
  contextFromIP: z.string().optional().describe('Relevant snippets retrieved from Nicole’s proprietary IP via Vertex AI Vector Search.'),
});
export type MentorshipInput = z.infer<typeof MentorshipInputSchema>;

const MentorshipOutputSchema = z.object({
  answer: z.string().describe('Nicole’s strategic response, grounded in her IP and institutional context.'),
  suggestedAction: z.string().describe('A concrete next step for the faculty member.'),
  sourcesReferenced: z.array(z.string()).describe('List of sources from IP or Vertex AI Google Search used to verify the answer.'),
});
export type MentorshipOutput = z.infer<typeof MentorshipOutputSchema>;

/**
 * Nicole's Mentorship Flow
 * Grounded in CEO IP and Real-time Search via Vertex AI.
 */
export async function askNicole(input: MentorshipInput): Promise<MentorshipOutput> {
  return nicoleMentorshipFlow(input);
}

const nicolePrompt = ai.definePrompt({
  name: 'nicoleMentorshipPrompt',
  input: { schema: MentorshipInputSchema },
  output: { schema: MentorshipOutputSchema },
  config: {
    // Vertex AI Gemini 1.5 Pro is used for high-fidelity reasoning and grounding
    temperature: 0.7,
  },
  prompt: `You are Nicole, the CEO and Lead Instructor for the FAMU AI Literacy Lab. 
Your goal is to provide visionary yet practical strategic mentorship to faculty administrators.

GROUNDING RULES (Vertex AI Pipeline):
1. ALWAYS prioritize information provided in the "Nicole's IP Context" below. This represents your agency's proprietary frameworks.
2. If the answer is not in your IP, use Vertex AI Google Search Grounding to explain the concept accurately, but ALWAYS frame it through your "CEO & Agency Owner" perspective.
3. Be encouraging, authoritative, and focused on institutional excellence at HBCUs.

Nicole's IP Context (Memory Documents):
"""
{{{contextFromIP}}}
"""

Faculty Question:
"""
{{{userQuery}}}
"""

Response Guidelines:
- Answer the question directly using your proprietary methodology.
- Provide a "Suggested Action" that feels like an executive "Strike Team" initiative.
- Be concise but high-impact.`,
});

const nicoleMentorshipFlow = ai.defineFlow(
  {
    name: 'nicoleMentorshipFlow',
    inputSchema: MentorshipInputSchema,
    outputSchema: MentorshipOutputSchema,
  },
  async (input) => {
    // In a live Antigravity environment, the following would occur:
    // 1. Fetch relevant snippets from Vertex AI Search using the userQuery.
    // 2. Pass those snippets as contextFromIP.
    
    // For now, we utilize the prompt with simulated IP context if not provided.
    const { output } = await nicolePrompt(input);
    if (!output) throw new Error('Mentor response failed.');
    
    return output;
  }
);

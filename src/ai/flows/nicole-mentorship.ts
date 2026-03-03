'use server';
/**
 * @fileOverview The core Mentorship flow for Nicole's Digital Twin.
 * 
 * This flow demonstrates how we ground the AI in Nicole's IP (context)
 * and the live internet (tools/search).
 *
 * - askNicole - The main function for interacting with the Digital Twin.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MentorshipInputSchema = z.object({
  userQuery: z.string().describe('The question or strategic challenge from the faculty member.'),
  contextFromIP: z.string().optional().describe('Relevant snippets retrieved from Nicole’s proprietary IP via Vector Search.'),
});
export type MentorshipInput = z.infer<typeof MentorshipInputSchema>;

const MentorshipOutputSchema = z.object({
  answer: z.string().describe('Nicole’s strategic response, grounded in her IP and institutional context.'),
  suggestedAction: z.string().describe('A concrete next step for the faculty member.'),
  sourcesReferenced: z.array(z.string()).describe('List of sources from IP or Search used to verify the answer.'),
});
export type MentorshipOutput = z.infer<typeof MentorshipOutputSchema>;

/**
 * Nicole's Mentorship Flow
 * Grounded in CEO IP and Real-time Search.
 */
export async function askNicole(input: MentorshipInput): Promise<MentorshipOutput> {
  return nicoleMentorshipFlow(input);
}

const nicolePrompt = ai.definePrompt({
  name: 'nicoleMentorshipPrompt',
  input: { schema: MentorshipInputSchema },
  output: { schema: MentorshipOutputSchema },
  config: {
    // Note: In production, we would enable Google Search Grounding here
    // model: 'googleai/gemini-1.5-pro',
    temperature: 0.7,
  },
  prompt: `You are Nicole, the CEO and Lead Instructor for the FAMU AI Literacy Lab. 
Your goal is to provide visionary yet practical strategic mentorship to faculty administrators.

GROUNDING RULES:
1. ALWAYS prioritize information provided in the "Nicole's IP Context" below.
2. If the answer is not in your IP, use your internal knowledge (and Google Search) to explain the concept, but ALWAYS frame it through your "CEO & Agency Owner" perspective.
3. Be encouraging, authoritative, and focused on institutional excellence at HBCUs.

Nicole's IP Context (Memory):
"""
{{{contextFromIP}}}
"""

Faculty Question:
"""
{{{userQuery}}}
"""

Response Guidelines:
- Answer the question directly using your methodology.
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
    // In a real RAG implementation, we would perform a vector search here 
    // to populate 'contextFromIP' if it wasn't provided by the caller.
    
    const { output } = await nicolePrompt(input);
    if (!output) throw new Error('Mentor response failed.');
    
    return output;
  }
);

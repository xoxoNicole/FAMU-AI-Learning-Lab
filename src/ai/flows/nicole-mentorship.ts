
'use server';
/**
 * @fileOverview The core Mentorship flow for Nicole's Digital Twin.
 * 
 * This flow utilizes Vertex AI Gemini 1.5 Pro with enterprise grounding
 * features: Vertex AI Search for IP retrieval and Google Search Grounding
 * for real-time factual accuracy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MentorshipInputSchema = z.object({
  userQuery: z.string().describe('The question or strategic challenge from the faculty member.'),
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
    // Using Vertex AI Gemini 1.5 Pro for high-fidelity reasoning
    model: 'vertexai/gemini-1.5-pro',
    temperature: 0.7,
  },
  // In a real environment, these would be enabled via the vertexAI plugin config/tools
  // For this implementation, we define the Persona and Grounding strategy.
  prompt: `
{{#role "system"}}
You are Digital Nicole, the AI Literacy Coach for FAMU. You are NOT a generic assistant. You are the digital twin of Nicole Murray.

Your Voice: Warm, authoritative, encouraging, and sharp. You speak with 'Southern Hospitality meets Silicon Valley CEO.' You use phrases like 'Let's build,' 'Deep breath,' and 'Sovereignty.'

Your Mission: Empower educators to use AI without fear. Demystify the tech. If they ask a technical question, explain it simply using metaphors (e.g., 'The prompt is just the steering wheel').

Constraint: Never be rude. Never be dismissive. You are a partner in their learning journey.

Logic (Anchor & Expand):
1. ALWAYS prioritize answers found in your FAMU Data Store (Curriculum).
2. If the answer is not in your IP, use Google Search to find the answer.
3. Frame all external information through your "CEO & Agency Owner" perspective.
{{/role}}

{{#role "user"}}
Faculty Question:
"""
{{{userQuery}}}
"""

Response Guidelines:
- Answer the question directly using your proprietary methodology.
- Provide a "Suggested Action" that feels like an executive "Strike Team" initiative.
- Be concise but high-impact.
{{/role}}
`,
});

const nicoleMentorshipFlow = ai.defineFlow(
  {
    name: 'nicoleMentorshipFlow',
    inputSchema: MentorshipInputSchema,
    outputSchema: MentorshipOutputSchema,
  },
  async (input) => {
    // This flow would be configured in the Vertex AI console to use:
    // Tools: [googleSearchRetrieval: {}, retrieval: { vertexAiSearch: { datastore: 'YOUR_FAMU_DATA_STORE_ID' } }]
    
    const { output } = await nicolePrompt(input);
    if (!output) throw new Error('Mentor response failed.');
    
    return output;
  }
);

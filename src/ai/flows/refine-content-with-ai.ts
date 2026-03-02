'use server';
/**
 * @fileOverview A Genkit flow for refining, expanding, or rephrasing content based on specific instructions.
 *
 * - refineContentWithAI - A function that handles the content refinement process.
 * - RefineContentInput - The input type for the refineContentWithAI function.
 * - RefineContentOutput - The return type for the refineContentWithAI function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RefineContentInputSchema = z.object({
  content: z.string().describe('The existing text content to be refined, expanded, or rephrased.'),
  instructions: z.string().describe('Specific instructions for refining the content (e.g., "make it more formal," "shorten this paragraph," "add a section on benefits").'),
});
export type RefineContentInput = z.infer<typeof RefineContentInputSchema>;

const RefineContentOutputSchema = z.object({
  refinedContent: z.string().describe('The refined text content based on the provided instructions.'),
});
export type RefineContentOutput = z.infer<typeof RefineContentOutputSchema>;

export async function refineContentWithAI(input: RefineContentInput): Promise<RefineContentOutput> {
  return refineContentWithAIFlow(input);
}

const refineContentPrompt = ai.definePrompt({
  name: 'refineContentPrompt',
  input: { schema: RefineContentInputSchema },
  output: { schema: RefineContentOutputSchema },
  prompt: `You are an expert content strategist and editor, tasked with refining text content based on specific instructions.
Your goal is to meticulously apply the given instructions to the provided content, ensuring the output is coherent, relevant, and meets the user's requirements.

Existing Content:
"""
{{{content}}}
"""

Instructions for Refinement:
"""
{{{instructions}}}
"""

Please provide the refined content, adhering strictly to the instructions and maintaining the original intent where appropriate. Only output the refined content as a JSON object, do not include any additional commentary or text outside the JSON.
`,
});

const refineContentWithAIFlow = ai.defineFlow(
  {
    name: 'refineContentWithAIFlow',
    inputSchema: RefineContentInputSchema,
    outputSchema: RefineContentOutputSchema,
  },
  async (input) => {
    const { output } = await refineContentPrompt(input);
    if (!output) {
      throw new Error('Failed to refine content: No output from AI.');
    }
    return output;
  }
);

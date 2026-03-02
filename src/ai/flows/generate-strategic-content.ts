'use server';
/**
 * @fileOverview A Genkit flow for generating comprehensive first drafts of strategic content.
 *
 * - generateStrategicContent - A function that handles the generation of strategic content.
 * - GenerateStrategicContentInput - The input type for the generateStrategicContent function.
 * - GenerateStrategicContentOutput - The return type for the generateStrategicContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrategicContentInputSchema = z.object({
  request: z
    .string()
    .describe(
      'A high-level request for strategic content, such as "draft a strategic memo about X for Y audience" or "create a lesson plan for teaching Z to A students."'
    ),
});
export type GenerateStrategicContentInput = z.infer<
  typeof GenerateStrategicContentInputSchema
>;

const GenerateStrategicContentOutputSchema = z.object({
  draft: z.string().describe('The comprehensive first draft of the requested content.'),
});
export type GenerateStrategicContentOutput = z.infer<
  typeof GenerateStrategicContentOutputSchema
>;

export async function generateStrategicContent(
  input: GenerateStrategicContentInput
): Promise<GenerateStrategicContentOutput> {
  return generateStrategicContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrategicContentPrompt',
  input: {schema: GenerateStrategicContentInputSchema},
  output: {schema: GenerateStrategicContentOutputSchema},
  prompt: `You are an expert strategic assistant tasked with drafting high-leverage outputs for faculty administrators.
Your goal is to quickly generate a comprehensive first draft based on the user's high-level request, so they can get started without a blank page.

Be thorough, professional, and align the output with common structures for the requested document type (e.g., memo, grant proposal, lesson plan).

User Request: {{{request}}}`,
});

const generateStrategicContentFlow = ai.defineFlow(
  {
    name: 'generateStrategicContentFlow',
    inputSchema: GenerateStrategicContentInputSchema,
    outputSchema: GenerateStrategicContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

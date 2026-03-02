'use server';
/**
 * @fileOverview This flow implements the 'Challenge My Assumptions' feature, 
 * where the AI analyzes drafted content, provides strategic feedback, identifies weaknesses,
 * and suggests alternative perspectives to strengthen arguments.
 *
 * - challengeAssumptionsAndFeedback - A function that initiates the AI analysis process.
 * - ChallengeAssumptionsAndFeedbackInput - The input type for the challengeAssumptionsAndFeedback function.
 * - ChallengeAssumptionsAndFeedbackOutput - The return type for the challengeAssumptionsAndFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChallengeAssumptionsAndFeedbackInputSchema = z.object({
  draftedContent: z.string().describe('The user-drafted content to be analyzed.'),
});
export type ChallengeAssumptionsAndFeedbackInput = z.infer<
  typeof ChallengeAssumptionsAndFeedbackInputSchema
>;

const ChallengeAssumptionsAndFeedbackOutputSchema = z.object({
  strategicFeedback: z
    .string()
    .describe('Critical strategic feedback on the drafted content.'),
  identifiedWeaknesses: z
    .string()
    .describe('Identified weaknesses or areas for improvement in the content.'),
  alternativePerspectives: z
    .string()
    .describe('Suggestions for alternative perspectives or approaches.'),
});
export type ChallengeAssumptionsAndFeedbackOutput = z.infer<
  typeof ChallengeAssumptionsAndFeedbackOutputSchema
>;

export async function challengeAssumptionsAndFeedback(
  input: ChallengeAssumptionsAndFeedbackInput
): Promise<ChallengeAssumptionsAndFeedbackOutput> {
  return challengeAssumptionsAndFeedbackFlow(input);
}

const challengeAssumptionsAndFeedbackPrompt = ai.definePrompt({
  name: 'challengeAssumptionsAndFeedbackPrompt',
  input: {schema: ChallengeAssumptionsAndFeedbackInputSchema},
  output: {schema: ChallengeAssumptionsAndFeedbackOutputSchema},
  prompt: `You are an AI strategist and mentor designed to critically analyze drafted content.
Your goal is to provide constructive, strategic feedback, identify potential weaknesses,
and suggest alternative perspectives to strengthen the arguments presented in the content.

Act as a personal mentor, guiding the user to refine their thinking and improve their work.
Be thorough and provide actionable insights.

Drafted Content:
"""
{{{draftedContent}}}
"""

Based on the drafted content, please provide the following:
1. Strategic Feedback: Offer overarching strategic advice and insights.
2. Identified Weaknesses: Point out specific areas where the content could be improved, supported by reasoning.
3. Alternative Perspectives: Suggest different angles, viewpoints, or approaches the user might consider to enhance their argument or reach their objectives.

Ensure your response is structured clearly according to the output schema.`,
});

const challengeAssumptionsAndFeedbackFlow = ai.defineFlow(
  {
    name: 'challengeAssumptionsAndFeedbackFlow',
    inputSchema: ChallengeAssumptionsAndFeedbackInputSchema,
    outputSchema: ChallengeAssumptionsAndFeedbackOutputSchema,
  },
  async input => {
    const {output} = await challengeAssumptionsAndFeedbackPrompt(input);
    return output!;
  }
);

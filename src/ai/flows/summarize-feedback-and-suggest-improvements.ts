'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing student feedback on a lesson plan and suggesting improvements.
 *
 * - summarizeFeedbackAndSuggestImprovements - A function that takes lesson plan feedback and returns a summary and improvement suggestions.
 * - FeedbackAndImprovementsInput - The input type for the summarizeFeedbackAndSuggestImprovements function.
 * - FeedbackAndImprovementsOutput - The return type for the summarizeFeedbackAndSuggestImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FeedbackAndImprovementsInputSchema = z.object({
  lessonPlan: z.string().describe('The lesson plan to be reviewed.'),
  studentFeedback: z.string().describe('Student feedback on the lesson plan.'),
});
export type FeedbackAndImprovementsInput = z.infer<typeof FeedbackAndImprovementsInputSchema>;

const FeedbackAndImprovementsOutputSchema = z.object({
  feedbackSummary: z.string().describe('A summary of the student feedback.'),
  suggestedImprovements: z.string().describe('Suggested improvements to the lesson plan based on the feedback.'),
});
export type FeedbackAndImprovementsOutput = z.infer<typeof FeedbackAndImprovementsOutputSchema>;

export async function summarizeFeedbackAndSuggestImprovements(
  input: FeedbackAndImprovementsInput
): Promise<FeedbackAndImprovementsOutput> {
  return summarizeFeedbackAndSuggestImprovementsFlow(input);
}

const summarizeFeedbackAndSuggestImprovementsPrompt = ai.definePrompt({
  name: 'summarizeFeedbackAndSuggestImprovementsPrompt',
  input: {schema: FeedbackAndImprovementsInputSchema},
  output: {schema: FeedbackAndImprovementsOutputSchema},
  prompt: `You are an experienced educator tasked with analyzing student feedback on a lesson plan and providing actionable suggestions for improvement.\n\n  Summarize the following student feedback:
  Feedback: {{{studentFeedback}}}\n\n  Based on this feedback, suggest improvements to the following lesson plan:
  Lesson Plan: {{{lessonPlan}}}\n\n  Ensure that the feedback summary and suggested improvements are clear, concise, and directly related to the provided feedback and lesson plan.\nFeedback Summary: 
{{feedbackSummary}}
Suggested Improvements:
{{suggestedImprovements}}`,
});

const summarizeFeedbackAndSuggestImprovementsFlow = ai.defineFlow(
  {
    name: 'summarizeFeedbackAndSuggestImprovementsFlow',
    inputSchema: FeedbackAndImprovementsInputSchema,
    outputSchema: FeedbackAndImprovementsOutputSchema,
  },
  async input => {
    const {output} = await summarizeFeedbackAndSuggestImprovementsPrompt(input);
    return output!;
  }
);

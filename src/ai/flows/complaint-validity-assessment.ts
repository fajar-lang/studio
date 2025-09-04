'use server';

/**
 * @fileOverview This file defines a Genkit flow for assessing the validity and urgency of a complaint.
 *
 * It includes:
 * - `assessComplaintValidity`: Function to assess complaint validity and urgency.
 * - `ComplaintAssessmentInput`: Input type for the assessment function.
 * - `ComplaintAssessmentOutput`: Output type for the assessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComplaintAssessmentInputSchema = z.object({
  complaintText: z.string().describe('The text content of the complaint.'),
});
export type ComplaintAssessmentInput = z.infer<typeof ComplaintAssessmentInputSchema>;

const ComplaintAssessmentOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the complaint is valid or not.'),
  urgencyScore: z
    .number()
    .describe('A score indicating the urgency of the complaint (0-10).'),
  summary: z.string().describe('A brief summary of the complaint assessment.'),
});
export type ComplaintAssessmentOutput = z.infer<typeof ComplaintAssessmentOutputSchema>;

export async function assessComplaintValidity(
  input: ComplaintAssessmentInput
): Promise<ComplaintAssessmentOutput> {
  return assessComplaintValidityFlow(input);
}

const assessComplaintValidityPrompt = ai.definePrompt({
  name: 'assessComplaintValidityPrompt',
  input: {schema: ComplaintAssessmentInputSchema},
  output: {schema: ComplaintAssessmentOutputSchema},
  prompt: `You are an AI assistant tasked with assessing the validity and urgency of student complaints.

  Analyze the following complaint and determine if it is valid and how urgent it is.
  A valid complaint is one that is coherent, relates to school-related issues, and is not obviously frivolous or malicious.
  Assign an urgency score from 0 to 10, where 0 is not urgent and 10 is extremely urgent. Consider factors like safety, well-being, and disruption to school activities when determining urgency.
  Provide a short summary of your assessment.

  Complaint: {{{complaintText}}}
  \n\
  Output your assessment in JSON format.
  `,
});

const assessComplaintValidityFlow = ai.defineFlow(
  {
    name: 'assessComplaintValidityFlow',
    inputSchema: ComplaintAssessmentInputSchema,
    outputSchema: ComplaintAssessmentOutputSchema,
  },
  async input => {
    const {output} = await assessComplaintValidityPrompt(input);
    return output!;
  }
);

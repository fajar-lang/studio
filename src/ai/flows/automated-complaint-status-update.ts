'use server';
/**
 * @fileOverview This file contains a Genkit flow for automatically updating the status of complaints based on their assessed validity.
 *
 * - automatedComplaintStatusUpdate - A function that takes complaint text and updates its status.
 * - AutomatedComplaintStatusUpdateInput - The input type for the automatedComplaintStatusUpdate function.
 * - AutomatedComplaintStatusUpdateOutput - The return type for the automatedComplaintStatusUpdate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedComplaintStatusUpdateInputSchema = z.object({
  complaintText: z.string().describe('The text content of the complaint.'),
  currentStatus: z.string().describe('The current status of the complaint.'),
});
export type AutomatedComplaintStatusUpdateInput = z.infer<
  typeof AutomatedComplaintStatusUpdateInputSchema
>;

const AutomatedComplaintStatusUpdateOutputSchema = z.object({
  newStatus: z
    .string()
    .describe(
      "The new status of the complaint, automatically assessed by the AI ('Submitted', 'In Progress', 'Completed', 'Rejected')."
    ),
  reasoning: z.string().describe('The AI reasoning for the status update.'),
});
export type AutomatedComplaintStatusUpdateOutput = z.infer<
  typeof AutomatedComplaintStatusUpdateOutputSchema
>;

export async function automatedComplaintStatusUpdate(
  input: AutomatedComplaintStatusUpdateInput
): Promise<AutomatedComplaintStatusUpdateOutput> {
  return automatedComplaintStatusUpdateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedComplaintStatusUpdatePrompt',
  input: {schema: AutomatedComplaintStatusUpdateInputSchema},
  output: {schema: AutomatedComplaintStatusUpdateOutputSchema},
  prompt: `You are an AI assistant helping to manage student complaints.

You are provided with the text of a student complaint and its current status.
Based on the complaint text, you must determine if the complaint is likely to be valid or not.
If the complaint seems genuine, update the status to 'In Progress'.
If the complaint appears fake, update the status to 'Rejected'.
If the complaint is already 'In Progress' or 'Completed', do not change the status unless there is a compelling reason to reject it.

Complaint Text: {{{complaintText}}}
Current Status: {{{currentStatus}}}

Provide a new status and reasoning for the status update.
Be brief and to the point.
Consider that the possible values are 'Submitted', 'In Progress', 'Completed', 'Rejected'.
`,
});

const automatedComplaintStatusUpdateFlow = ai.defineFlow(
  {
    name: 'automatedComplaintStatusUpdateFlow',
    inputSchema: AutomatedComplaintStatusUpdateInputSchema,
    outputSchema: AutomatedComplaintStatusUpdateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

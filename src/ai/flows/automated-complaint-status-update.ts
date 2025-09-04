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
      "The new status of the complaint, automatically assessed by the AI ('Terkirim', 'Sedang Diproses', 'Selesai', 'Ditolak')."
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
  prompt: `Anda adalah asisten AI yang membantu mengelola keluhan siswa.

Anda diberikan teks keluhan siswa dan statusnya saat ini.
Berdasarkan teks keluhan, Anda harus menentukan apakah keluhan tersebut kemungkinan valid atau tidak.
Jika keluhan tampak asli, perbarui status menjadi 'Sedang Diproses'.
Jika keluhan tampak palsu, perbarui status menjadi 'Ditolak'.
Jika keluhan sudah 'Sedang Diproses' atau 'Selesai', jangan ubah status kecuali ada alasan kuat untuk menolaknya.

Teks Keluhan: {{{complaintText}}}
Status Saat Ini: {{{currentStatus}}}

Berikan status baru dan alasan untuk pembaruan status tersebut.
Jadilah singkat dan langsung ke intinya.
Perhatikan bahwa nilai yang mungkin adalah 'Terkirim', 'Sedang Diproses', 'Selesai', 'Ditolak'.
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

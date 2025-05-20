// Summarize Regulations
'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing complex regulatory documents.
 *
 * - summarizeRegulations - A function that summarizes regulatory documents.
 * - SummarizeRegulationsInput - The input type for the summarizeRegulations function.
 * - SummarizeRegulationsOutput - The return type for the summarizeRegulations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRegulationsInputSchema = z.object({
  documentText: z.string().describe('The text of the regulatory document to summarize.'),
});
export type SummarizeRegulationsInput = z.infer<typeof SummarizeRegulationsInputSchema>;

const SummarizeRegulationsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the regulatory document.'),
});
export type SummarizeRegulationsOutput = z.infer<typeof SummarizeRegulationsOutputSchema>;

export async function summarizeRegulations(input: SummarizeRegulationsInput): Promise<SummarizeRegulationsOutput> {
  return summarizeRegulationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRegulationsPrompt',
  input: {schema: SummarizeRegulationsInputSchema},
  output: {schema: SummarizeRegulationsOutputSchema},
  prompt: `You are an expert compliance analyst. Please provide a concise summary of the following regulatory document:\n\n{{{documentText}}}`,
});

const summarizeRegulationsFlow = ai.defineFlow(
  {
    name: 'summarizeRegulationsFlow',
    inputSchema: SummarizeRegulationsInputSchema,
    outputSchema: SummarizeRegulationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

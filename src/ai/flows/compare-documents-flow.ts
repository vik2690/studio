
'use server';
/**
 * @fileOverview A Genkit flow for comparing two regulatory documents.
 *
 * - compareDocuments - A function that handles the document comparison process.
 * - CompareDocumentsInput - The input type for the compareDocuments function.
 * - CompareDocumentsOutput - The return type for the compareDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareDocumentsInputSchema = z.object({
  document1Text: z.string().min(1, "Document 1 text cannot be empty.").describe("The text of the first regulatory document."),
  document2Text: z.string().min(1, "Document 2 text cannot be empty.").describe("The text of the second regulatory document."),
  regulatoryBody: z.string().optional().describe("The relevant regulatory body for context, e.g., ESMA, FinCEN."),
});
export type CompareDocumentsInput = z.infer<typeof CompareDocumentsInputSchema>;

const CompareDocumentsOutputSchema = z.object({
  similarities: z.array(z.string()).describe("Key similarities found between the two documents."),
  differences: z.array(z.string()).describe("Key differences found between the two documents."),
  overallAssessment: z.string().describe("A brief overall assessment of the comparison, highlighting the most critical changes or overlaps."),
});
export type CompareDocumentsOutput = z.infer<typeof CompareDocumentsOutputSchema>;

export async function compareDocuments(input: CompareDocumentsInput): Promise<CompareDocumentsOutput> {
  return compareDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareDocumentsPrompt',
  input: {schema: CompareDocumentsInputSchema},
  output: {schema: CompareDocumentsOutputSchema},
  prompt: `You are an expert legal and compliance analyst specializing in regulatory changes.
You have been provided with two regulatory documents. Your task is to compare them thoroughly.
Regulatory Body Context (if provided): {{{regulatoryBody}}}

Document 1:
{{{document1Text}}}

Document 2:
{{{document2Text}}}

Please analyze these documents and provide:
1.  A list of key similarities between them.
2.  A list of key differences between them.
3.  A brief overall assessment highlighting the most critical changes, overlaps, or implications of the differences.

Focus on substantive changes and impacts rather than minor formatting or grammatical variations.
If a regulatory body is provided, consider its typical focus areas when assessing importance.
`,
});

const compareDocumentsFlow = ai.defineFlow(
  {
    name: 'compareDocumentsFlow',
    inputSchema: CompareDocumentsInputSchema,
    outputSchema: CompareDocumentsOutputSchema,
  },
  async (input: CompareDocumentsInput) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to get a comparison from the AI model.");
    }
    return output;
  }
);


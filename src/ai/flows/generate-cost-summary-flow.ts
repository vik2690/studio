
'use server';
/**
 * @fileOverview A Genkit flow for generating executive cost summaries.
 *
 * - generateCostSummary - A function that handles the cost summary generation.
 * - GenerateCostSummaryInput - The input type for the generateCostSummary function.
 * - GenerateCostSummaryOutput - The return type for the generateCostSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateCostSummaryInputSchema = z.object({
  period: z.string().min(1, "Period cannot be empty.").describe("The reporting period, e.g., 'This Quarter', 'Q3 2024'."),
  totalSpend: z.number().positive("Total spend must be a positive number.").describe("The total spend for the period."),
  spendChangePercentage: z.number().describe("The percentage change in spend from the previous period, e.g., 25 for a 25% increase, -10 for a 10% decrease."),
  reasonForSpendChange: z.string().min(10, "Reason for spend change must be at least 10 characters.").describe("The primary reason explaining the change in spending."),
  keyOutcome: z.string().min(10, "Key outcome must be at least 10 characters.").describe("The key benefit or outcome achieved during the period, e.g., 'Residual risk dropped by 40%'."),
});
export type GenerateCostSummaryInput = z.infer<typeof GenerateCostSummaryInputSchema>;

export const GenerateCostSummaryOutputSchema = z.object({
  executiveSummary: z.string().describe("A concise executive summary of the cost report."),
});
export type GenerateCostSummaryOutput = z.infer<typeof GenerateCostSummaryOutputSchema>;

export async function generateCostSummary(input: GenerateCostSummaryInput): Promise<GenerateCostSummaryOutput> {
  return generateCostSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCostSummaryPrompt',
  input: {schema: GenerateCostSummaryInputSchema},
  output: {schema: GenerateCostSummaryOutputSchema},
  prompt: `You are a financial analyst AI specializing in creating concise executive summaries for cost center reports.
Generate a brief executive summary (typically 1-2 sentences, maximum 3 sentences) based on the following data for the period: {{{period}}}.

Key Financial Metrics:
- Total Spend for {{{period}}}: \${{{totalSpend}}}
- Spend Change from Previous Period: {{{spendChangePercentage}}}%

Narrative Insights:
- Primary Reason for Spend Change: {{{reasonForSpendChange}}}
- Key Outcome/Benefit Achieved: {{{keyOutcome}}}

Combine these elements into a coherent and impactful summary.
For example, if the period is "This Quarter", total spend is $50,000, spend change is +25%, reason is "IT investment", and outcome is "risk dropped by 15%", a good summary would be:
"This quarter, total spend was $50,000, a 25% increase from the previous period, primarily driven by IT investment for new control implementations. This resulted in residual risk dropping by 15% and improved audit preparedness."

Ensure the summary is professional, clear, and directly reflects the provided data.
Focus on the most critical information: what was spent, how it changed, why it changed, and what was achieved.
`,
});

const generateCostSummaryFlow = ai.defineFlow(
  {
    name: 'generateCostSummaryFlow',
    inputSchema: GenerateCostSummaryInputSchema,
    outputSchema: GenerateCostSummaryOutputSchema,
  },
  async (input: GenerateCostSummaryInput) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to get a summary from the AI model.");
    }
    return output;
  }
);

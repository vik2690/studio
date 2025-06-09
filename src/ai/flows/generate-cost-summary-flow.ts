
'use server';
/**
 * @fileOverview A Genkit flow for generating executive cost summaries.
 *
 * - generateCostSummary - A function that handles the cost summary generation.
 * - GenerateCostSummaryInput - The input type for the generateCostSummary function (imported).
 * - GenerateCostSummaryOutput - The return type for the generateCostSummary function (imported).
 */

import {ai} from '@/ai/genkit';
import type { GenerateCostSummaryInput, GenerateCostSummaryOutput } from '@/ai/schemas/cost-summary-schemas';
import { GenerateCostSummaryInputSchema, GenerateCostSummaryOutputSchema } from '@/ai/schemas/cost-summary-schemas';

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


'use server';
/**
 * @fileOverview A Genkit flow for analyzing risk-to-cost correlations.
 *
 * - analyzeRiskToCostCorrelation - A function that handles the risk-to-cost analysis.
 * - AnalyzeRiskToCostInput - The input type (imported).
 * - AnalyzeRiskToCostOutput - The return type (imported).
 */

import {ai} from '@/ai/genkit';
import type { AnalyzeRiskToCostInput, AnalyzeRiskToCostOutput } from '@/ai/schemas/risk-cost-correlation-schemas';
import { AnalyzeRiskToCostInputSchema, AnalyzeRiskToCostOutputSchema } from '@/ai/schemas/risk-cost-correlation-schemas';

export async function analyzeRiskToCostCorrelation(input: AnalyzeRiskToCostInput): Promise<AnalyzeRiskToCostOutput> {
  return analyzeRiskToCostCorrelationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRiskToCostCorrelationPrompt',
  input: {schema: AnalyzeRiskToCostInputSchema},
  output: {schema: AnalyzeRiskToCostOutputSchema},
  prompt: `You are an expert financial and risk analyst AI specializing in identifying correlations between organizational risks, implemented controls, and their associated costs. Your goal is to help optimize spending.

Based on the provided context: {{{analysisContext}}}

Analyze the situation to:
1.  Identify which specific risks or controls are likely leading to higher costs. These are your 'Identified Drivers'.
2.  Provide a 'Correlation Analysis' explaining these links. For example, "AI detects that 80% of costs in Finance are linked to repeated compliance failures in data privacy."
3.  Suggest 'Optimization Suggestions' based on your findings. This could involve re-evaluating low-impact, high-cost controls, or identifying high-risk, underfunded areas that might lead to higher reactive costs later.

Focus on actionable insights. Be specific where possible, even if inferring from general context.
If the context is very general, provide a more conceptual analysis with illustrative examples.
Output Example for a context like "Finance department costs and data privacy compliance":
- Correlation Analysis: "Analysis indicates that approximately 75% of unexpected cost overruns in the Finance department for the last period are associated with reactive measures for data privacy compliance failures. This includes costs for incident response, emergency system patches, and potential fines investigation."
- Identified Drivers: ["Repeated data privacy compliance failures", "Lack of proactive investment in data privacy controls", "Manual incident response processes"]
- Optimization Suggestions: ["Invest in automated data discovery and masking tools to reduce manual effort and error rates.", "Review and potentially enhance funding for proactive data privacy training for Finance personnel.", "Re-evaluate the cost-benefit of current manual controls versus automated solutions for data privacy."]

Ensure your response is structured according to the AnalyzeRiskToCostOutputSchema.
`,
});

const analyzeRiskToCostCorrelationFlow = ai.defineFlow(
  {
    name: 'analyzeRiskToCostCorrelationFlow',
    inputSchema: AnalyzeRiskToCostInputSchema,
    outputSchema: AnalyzeRiskToCostOutputSchema,
  },
  async (input: AnalyzeRiskToCostInput) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to get a risk-to-cost analysis from the AI model.");
    }
    return output;
  }
);

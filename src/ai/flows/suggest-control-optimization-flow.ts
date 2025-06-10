
'use server';
/**
 * @fileOverview A Genkit flow for suggesting control optimizations for a given risk.
 *
 * - suggestControlOptimization - A function that suggests the best control optimization.
 * - ControlOptimizationInput - The input type (imported).
 * - ControlOptimizationOutput - The return type (imported).
 */

import {ai} from '@/ai/genkit';
import type { ControlOptimizationInput, ControlOptimizationOutput } from '@/ai/schemas/control-optimization-schemas';
import { ControlOptimizationInputSchema, ControlOptimizationOutputSchema } from '@/ai/schemas/control-optimization-schemas';

export async function suggestControlOptimization(input: ControlOptimizationInput): Promise<ControlOptimizationOutput> {
  return suggestControlOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestControlOptimizationPrompt',
  input: {schema: ControlOptimizationInputSchema},
  output: {schema: ControlOptimizationOutputSchema},
  prompt: `You are an expert risk management and control optimization AI.
Your task is to analyze a target risk, the control currently implemented for it, and a list of other existing similar controls within the organization. Your goal is to suggest the best optimization strategy.

Target Risk ID: {{{targetRiskId}}}
Target Risk Description:
{{{targetRiskDescription}}}

Currently Implemented Control:
Description: {{{implementedControlDetails}}}
Cost: {{{implementedControlCost}}}

List of Similar Existing Controls (consider these as potential alternatives or for consolidation):
{{#if similarExistingControls.length}}
  {{#each similarExistingControls}}
    - ID: {{id}}
      Name: "{{name}}"
      Description: "{{description}}"
      Relevance to Target Risk: {{relevancePercentage}}%
      Estimated Cost: {{estimatedCost}}
  {{/each}}
{{else}}
  No specific similar existing controls provided for direct comparison. Focus on general best practices or modifications to the implemented control.
{{/if}}

Based on this information, provide:
1.  'bestSuggestion': Your best suggestion for optimizing the control strategy for the target risk. This could involve:
    *   Recommending one ofr more of the 'Similar Existing Controls' if they are more cost-effective or relevant.
    *   Suggesting modifications to the currently 'Implemented Control'.
    *   Proposing a new consolidated control if multiple similar controls can be merged.
    *   If the current control is optimal, state that and explain why.
    Your suggestion should clearly outline the proposed action.
2.  'justification': A detailed justification for your suggestion. Explain why it's optimal, considering factors like cost-effectiveness, relevance, coverage, and potential reduction in residual risk. If you suggest a change, highlight the benefits over the current setup.
3.  'potentialCostSaving': If your suggestion involves a change from the current implemented control and is likely to result in cost savings, estimate this saving. If it might cost more but offers significantly better risk mitigation, note that as part of the justification instead. Provide 0 if no direct saving or if cost is similar/higher.

Focus on providing actionable and practical advice. The 'bestSuggestion' should be a clear recommendation.
Structure your output according to the ControlOptimizationOutputSchema.
`,
});

const suggestControlOptimizationFlow = ai.defineFlow(
  {
    name: 'suggestControlOptimizationFlow',
    inputSchema: ControlOptimizationInputSchema,
    outputSchema: ControlOptimizationOutputSchema,
  },
  async (input: ControlOptimizationInput) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to get a control optimization suggestion from the AI model.");
    }
    return output;
  }
);


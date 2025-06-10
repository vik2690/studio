
import { z } from 'zod';

export const SimilarControlSchema = z.object({
  id: z.string().describe("Unique identifier for the similar control."),
  name: z.string().describe("Name or title of the similar control."),
  description: z.string().describe("Brief description of the similar control."),
  relevancePercentage: z.number().min(0).max(100).describe("Estimated relevance to the target risk (0-100%)."),
  estimatedCost: z.number().describe("Estimated annual cost of implementing/maintaining this control."),
});
export type SimilarControl = z.infer<typeof SimilarControlSchema>;

export const ControlOptimizationInputSchema = z.object({
  targetRiskId: z.string().describe("The ID of the risk being analyzed."),
  targetRiskDescription: z.string().min(1, "Target risk description cannot be empty.").describe("Detailed description of the target risk."),
  implementedControlDetails: z.string().min(1, "Implemented control details cannot be empty.").describe("Description of the control currently in place for this risk."),
  implementedControlCost: z.number().describe("Cost of the currently implemented control."),
  similarExistingControls: z.array(SimilarControlSchema).describe("A list of similar existing controls that could potentially be used or adapted."),
});
export type ControlOptimizationInput = z.infer<typeof ControlOptimizationInputSchema>;

export const ControlOptimizationOutputSchema = z.object({
  bestSuggestion: z.string().describe("The AI's best suggestion for optimizing control for the target risk, considering alternatives or improvements."),
  justification: z.string().describe("The reasoning behind the AI's suggestion, including cost-effectiveness and relevance considerations."),
  potentialCostSaving: z.number().optional().describe("Estimated potential cost saving if the suggestion is adopted compared to the current control."),
});
export type ControlOptimizationOutput = z.infer<typeof ControlOptimizationOutputSchema>;


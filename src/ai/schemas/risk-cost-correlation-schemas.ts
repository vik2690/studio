
import { z } from 'zod';

export const AnalyzeRiskToCostInputSchema = z.object({
  analysisContext: z.string().min(10, "Analysis context must be at least 10 characters.")
    .describe("Provide context for the risk-to-cost analysis, e.g., 'Analyze IT security spending against cybersecurity risks for Q3', or 'Correlate compliance failure costs in the finance department with specific regulations.'"),
});
export type AnalyzeRiskToCostInput = z.infer<typeof AnalyzeRiskToCostInputSchema>;

export const AnalyzeRiskToCostOutputSchema = z.object({
  correlationAnalysis: z.string().describe("The AI-generated analysis correlating risks/controls to costs, highlighting key findings and potential optimization areas."),
  identifiedDrivers: z.array(z.string()).optional().describe("Key risks or controls identified as major cost drivers."),
  optimizationSuggestions: z.array(z.string()).optional().describe("Suggestions for optimizing spending based on the analysis."),
});
export type AnalyzeRiskToCostOutput = z.infer<typeof AnalyzeRiskToCostOutputSchema>;

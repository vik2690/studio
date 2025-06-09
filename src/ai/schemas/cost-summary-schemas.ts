
import { z } from 'zod'; // Using 'zod' directly for schema definitions

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

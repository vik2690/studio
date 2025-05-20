"use server";

import { summarizeRegulations as _summarizeRegulations, type SummarizeRegulationsInput, type SummarizeRegulationsOutput } from '@/ai/flows/summarize-regulations';
import { flagAMLTransactions as _flagAMLTransactions, type FlagAMLTransactionsInput, type FlagAMLTransactionsOutput } from '@/ai/flows/flag-aml-transactions';
import { suggestControls as _suggestControls, type SuggestControlsInput, type SuggestControlsOutput } from '@/ai/flows/suggest-controls';
import { z } from 'zod';

// Define Zod schemas for input validation if not already strictly typed by AI flows
const SummarizeRegulationsActionInputSchema = z.object({
  documentText: z.string().min(1, "Document text cannot be empty."),
});

const FlagAMLTransactionsActionInputSchema = z.object({
  transactionDetails: z.string().min(1, "Transaction details cannot be empty."),
  userProfile: z.string().min(1, "User profile cannot be empty."),
});

const SuggestControlsActionInputSchema = z.object({
  riskGapAnalysisReport: z.string().min(1, "Risk gap analysis report cannot be empty."),
  currentPolicies: z.string().min(1, "Current policies cannot be empty."),
});


export async function summarizeRegulationAction(input: SummarizeRegulationsInput): Promise<SummarizeRegulationsOutput | { error: string }> {
  const validation = SummarizeRegulationsActionInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }
  try {
    return await _summarizeRegulations(validation.data);
  } catch (e) {
    console.error("Error in summarizeRegulationAction:", e);
    return { error: "Failed to summarize regulation. Please try again." };
  }
}

export async function flagAMLTransactionAction(input: FlagAMLTransactionsInput): Promise<FlagAMLTransactionsOutput | { error: string }> {
  const validation = FlagAMLTransactionsActionInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }
  try {
    return await _flagAMLTransactions(validation.data);
  } catch (e) {
    console.error("Error in flagAMLTransactionAction:", e);
    return { error: "Failed to flag AML transaction. Please try again." };
  }
}

export async function suggestControlsAction(input: SuggestControlsInput): Promise<SuggestControlsOutput | { error: string }> {
  const validation = SuggestControlsActionInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }
  try {
    return await _suggestControls(validation.data);
  } catch (e) {
    console.error("Error in suggestControlsAction:", e);
    return { error: "Failed to suggest controls. Please try again." };
  }
}

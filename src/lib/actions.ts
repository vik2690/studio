
"use server";

import { summarizeRegulations as _summarizeRegulations, type SummarizeRegulationsInput, type SummarizeRegulationsOutput } from '@/ai/flows/summarize-regulations';
import { flagAMLTransactions as _flagAMLTransactions, type FlagAMLTransactionsInput, type FlagAMLTransactionsOutput } from '@/ai/flows/flag-aml-transactions';
import { suggestControls as _suggestControls, type SuggestControlsInput, type SuggestControlsOutput } from '@/ai/flows/suggest-controls';
import { compareDocuments as _compareDocuments, type CompareDocumentsInput, type CompareDocumentsOutput } from '@/ai/flows/compare-documents-flow';
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

// Redefine the schema here as it cannot be exported from the 'use server' flow file
const CompareDocumentsActionInputSchema = z.object({
  document1Text: z.string().min(1, "Document 1 text cannot be empty.").describe("The text of the first regulatory document."),
  document2Text: z.string().min(1, "Document 2 text cannot be empty.").describe("The text of the second regulatory document."),
  regulatoryBody: z.string().optional().describe("The relevant regulatory body for context, e.g., ESMA, FinCEN."),
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

export async function compareDocumentsAction(input: CompareDocumentsInput): Promise<CompareDocumentsOutput | { error: string }> {
  const validation = CompareDocumentsActionInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }
  try {
    return await _compareDocuments(validation.data);
  } catch (e) {
    console.error("Error in compareDocumentsAction:", e);
    return { error: "Failed to compare documents. Please try again." };
  }
}


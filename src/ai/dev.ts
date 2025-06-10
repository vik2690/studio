
import { config } from 'dotenv';
config();

import '@/ai/flows/flag-aml-transactions.ts';
import '@/ai/flows/summarize-regulations.ts';
import '@/ai/flows/suggest-controls.ts';
import '@/ai/flows/compare-documents-flow.ts';
import '@/ai/flows/generate-cost-summary-flow.ts';
import '@/ai/flows/risk-cost-correlation-flow.ts';
import '@/ai/flows/suggest-control-optimization-flow.ts';



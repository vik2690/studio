import { config } from 'dotenv';
config();

import '@/ai/flows/flag-aml-transactions.ts';
import '@/ai/flows/summarize-regulations.ts';
import '@/ai/flows/suggest-controls.ts';
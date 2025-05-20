
import type { LucideIcon } from 'lucide-react';

export interface Metric {
  title: string;
  value: string;
  change?: string; // e.g., "+5%"
  changeType?: 'positive' | 'negative';
  icon?: LucideIcon;
  description?: string;
}

export interface ChartDataPoint {
  name: string; // For x-axis label
  value: number; // For y-axis value
  fill?: string; // Optional color for bar/segment
}

export interface FlaggedTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  sender: string;
  receiver: string;
  status: 'flagged' | 'reviewed' | 'sar_filed';
  riskScore?: number; // Optional
  details?: string; // Full transaction details for AI
  userProfile?: string; // User profile for AI
}

export interface RegulationDocument {
  id: string;
  title: string;
  source?: string;
  uploadDate: string;
  content: string; // Full text
  summary?: string; // AI generated
}

export interface ListedRegulationDocument {
  id: string;
  documentName: string;
  regulatoryBody: string;
  processedDate: string;
  effectiveDate: string;
  jurisdictions: string[];
  shortSummary: string;
  changeCount: number; // Added new field
  fullText?: string; // Optional, for re-summarization or detailed view
}

export interface PolicyDocument {
  id: string;
  title: string;
  version: string;
  lastUpdated: string;
  content: string;
}

export interface ControlSuggestion {
  id: string;
  suggestion: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  relatedRisk?: string;
}

export interface RiskData {
    id: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'Mitigated' | 'Closed';
    impactedControls?: string[];
}

export interface ProcessingQueueItem {
  id: string;
  fileName: string;
  sourceSystem: 'GDPR Stream' | 'FATF Bulk Upload' | 'Internal System' | string; // string for more flexibility
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  submittedAt: string;
  progress?: number; // Optional: 0-100 for 'Processing' status
  failureReason?: string; // Optional: for 'Failed' status
}

    

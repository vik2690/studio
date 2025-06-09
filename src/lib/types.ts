
import type { LucideIcon } from 'lucide-react';

export interface MetricBreakdownItem {
  category: string;
  value: string | number;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    disabled?: boolean;
  };
}

export interface Metric {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'default';
  icon?: LucideIcon;
  description?: string;
  breakdown?: MetricBreakdownItem[];
  breakdownDetailsUrl?: string; 
  navUrl?: string; 
  breakdownAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
  // Allow other keys for multi-line/bar charts
  [key: string]: string | number | undefined;
}


export interface FlaggedTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  sender: string;
  receiver: string;
  status: 'flagged' | 'reviewed' | 'sar_filed' | 'escalated';
  riskScore?: number;
  details?: string;
  userProfile?: string;
}

export interface RegulationDocument {
  id: string;
  title: string;
  source?: string;
  uploadDate: string;
  content: string;
  summary?: string;
}

export interface ListedRegulationDocument {
  id: string;
  documentName: string;
  regulatoryBody: string;
  processedDate: string;
  effectiveDate: string;
  jurisdictions: string[];
  shortSummary: string;
  changeCount: number;
  fullText?: string;
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
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  similarExistingControls?: ExistingControl[];
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
  sourceSystem: 'GDPR Stream' | 'FATF Bulk Upload' | 'Internal System' | string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  submittedAt: string;
  progress?: number;
  failureReason?: string;
}

export interface RiskIssueItem {
  id: string;
  description: string;
  impactedArea: string;
  focusArea: string;
  identifiedDate: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  riskType: 'Operational' | 'Reputational' | 'Financial' | 'Compliance' | 'Strategic' | 'Cybersecurity' | 'Third-Party' | 'Other';
  status: 'Open' | 'In Progress' | 'Mitigated' | 'Closed' | 'Requires Attention';
  violatedRegulation?: string;
  regulatoryImplications?: string;
  suggestedControls?: string[];
}

export interface ExistingControl {
  id: string;
  controlName: string;
  status: 'Active' | 'Inactive' | 'Draft' | 'Under Review';
  riskMitigated: string;
  mappedPolicyRegulation: string;
  controlType: 'Preventive' | 'Detective' | 'Corrective' | 'Directive';
  objective: string;
  controlCategory: 'Financial Reporting' | 'Operational' | 'IT General Controls' | 'Compliance' | 'Data Privacy' | 'Physical Security';
  frequency: 'Continuous' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'Ad-hoc' | 'Event-driven';
  owner: string;
  reviewer: string;
  lastReviewedDate?: string;
  controlMaturityLevel?: 'Initial' | 'Developing' | 'Defined' | 'Managed' | 'Optimized' | string;
  effectivenessRating?: 'Highly Effective' | 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Assessed' | string;
  residualRisk?: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  lastTestDate?: string;
  testResult?: 'Pass' | 'Fail' | 'Pass with Exceptions' | 'Not Tested';
  issuesIdentified?: string[];
  associatedRiskId?: string;
  associatedRiskDetails?: string;
  latestAICheck?: {
    status: 'Covered' | 'Needs Review' | 'Gap Identified' | 'Not Assessed';
    date: string;
    summary?: string;
  };
}

export type AIAgentStatusValue = 'Active' | 'Idle' | 'Processing' | 'Error' | 'Disabled';

export interface WorkloadItem {
  id: string;
  description: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  submittedAt: string;
  regulatoryBody?: string;
}

export interface ActivityLogEntry {
  timestamp: string;
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success' | 'Debug';
}

export interface AIAgent {
  id: string;
  emoji: string;
  name: string;
  role: string;
  status: AIAgentStatusValue;
  lastActive: string;
  nextRun?: string;
  details?: string;
  llmModel?: string;
  workloadQueue?: WorkloadItem[];
  activityLog?: ActivityLogEntry[];
}

export interface ReportChange {
  field: string; 
  oldValue: string | string[] | undefined;
  newValue: string | string[] | undefined;
  changedBy: string;
  changeReason?: string;
}

export interface ReportVersionMetadata {
  version: number; 
  timestamp: string; 
  changes: ReportChange[];
}

export interface ReportItem {
  reportId: string;
  status: 'Generated' | 'Pending Generation' | 'Failed' | 'Draft' | 'Archived';
  regulatoryBody: string;
  typeOfReport: string;
  associatedRisks?: string[];
  associatedControls?: string[];
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'Ad-hoc';
  dateOfGeneration: string;
  lastModifiedDate: string;
  impactedCitations?: string[];
  versionHistory?: ReportVersionMetadata[];
}

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved' | 'Muted';

export interface AlertNotificationItem {
  id: string;
  assignmentGroup: string;
  lastSentTime: string; 
  natureOfAlert: string; 
  mappedRisk: string; 
  objective: string; 
  status: AlertStatus; 
  severity: AlertSeverity; 
  description?: string; 
  triggerCondition?: string; 
  recipients?: string[]; 
  escalationPath?: string; 
  dialogDetails?: {
    fullDescription?: string;
    recommendedActions?: string[];
    historicalDataLink?: string; 
    notes?: string;
  };
}

export type FeedItemStatus = 'New' | 'Pending AI Analysis' | 'AI Processing' | 'AI Analyzed - No Risk' | 'AI Analyzed - Risk Flagged' | 'Action Required';
export type FeedItemCategory = 'Regulatory Update' | 'Geopolitical Event' | 'Market News' | 'Cybersecurity Alert' | 'Compliance Advisory' | 'Financial Crime' | 'Internal Finding';

export interface FeedItem {
  id: string;
  timestamp: string; 
  source: string;
  title: string;
  snippet: string;
  category: FeedItemCategory;
  status: FeedItemStatus;
  link?: string; 
  relevanceScore?: number; 
  flaggedKeywords?: string[];
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo?: string; 
}


// Define ChartConfig more broadly if it's used by different chart types
export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
    icon?: React.ComponentType;
  };
};


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
  changeType?: 'positive' | 'negative';
  icon?: LucideIcon;
  description?: string;
  breakdown?: MetricBreakdownItem[];
  breakdownDetailsUrl?: string; // Renamed from detailsUrl
  navUrl?: string; // New: URL for card navigation
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
  field: string; // e.g., 'status', 'associatedRisks', 'typeOfReport'
  oldValue: string | string[] | undefined;
  newValue: string | string[] | undefined;
  changedBy: string;
  changeReason?: string;
}

export interface ReportVersionMetadata {
  version: number; // e.g., 1, 2, 3
  timestamp: string; // Date of this version
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
  lastSentTime: string; // ISO string or formatted date string
  natureOfAlert: string; // e.g., 'Compliance Deadline', 'Risk Threshold Exceeded'
  mappedRisk: string; // e.g., 'RISK-CYBER-001'
  objective: string; // Purpose of the alert
  status: AlertStatus; // Current status
  severity: AlertSeverity; // Severity level
  description?: string; // More detailed description of the alert itself
  triggerCondition?: string; // What condition triggers this alert
  recipients?: string[]; // Who receives this alert
  escalationPath?: string; // What's the escalation procedure
  // Additional details specific to the alert to be shown in the dialog
  dialogDetails?: {
    fullDescription?: string;
    recommendedActions?: string[];
    historicalDataLink?: string; // Link to historical occurrences
    notes?: string;
  };
}


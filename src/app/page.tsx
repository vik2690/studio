
"use client";

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { 
  AlertTriangle, ShieldCheck, BarChartHorizontalBig, FileWarning, 
  Bot, Zap, Coffee, Loader2, AlertTriangle as AlertTriangleIcon, PowerOff, Activity as ActivityIcon, ChevronRight, Brain, Database, ListChecks as ListChecksIcon, StopCircle, Download, TrendingUp, Coins // Added Coins for cost forecasting
} from 'lucide-react';
import type { Metric, MetricBreakdownItem, AIAgent, AIAgentStatusValue, WorkloadItem, ActivityLogEntry } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const riskBreakdown: MetricBreakdownItem[] = [
  { category: "Regulatory", value: 30 },
  { category: "Internal Policy", value: 25 },
  { category: "Operational", value: 40 },
  { category: "Cybersecurity", value: 30 },
];

const controlsBreakdown: MetricBreakdownItem[] = [
  { category: "Regulatory", value: 250 },
  { category: "Internal Policy", value: 300 },
  { category: "Operational", value: 150 },
  { category: "Cybersecurity", value: 150 },
];

const riskScoreCalculationBreakdown: MetricBreakdownItem[] = [
  { category: "Formula Hint", value: "Overall score aggregates various risk factors." },
  { category: "Detailed Calculation:", value: "See 'View Details' for specific examples of residual risk." },
];

const amlHitsBreakdown: MetricBreakdownItem[] = [
  { category: "Iran (Sanctioned)", value: 5 },
  { category: "Russia (Sanctioned)", value: 7 },
  { category: "Afghanistan (Watchlist)", value: 3 },
  { category: "Pakistan (Watchlist)", value: 2 },
];

const overviewMetrics: Metric[] = [
  {
    title: "Identified Risks",
    value: "125",
    change: "+12 last month",
    changeType: "negative",
    icon: AlertTriangle,
    description: "Total open risks across the organization.",
    breakdown: riskBreakdown,
  },
  {
    title: "Applied Controls",
    value: "850",
    change: "+50 last month",
    changeType: "positive",
    icon: ShieldCheck,
    description: "Total active compliance controls.",
    breakdown: controlsBreakdown,
  },
  {
    title: "Organization Risk Score",
    value: "68%",
    change: "-3% last month",
    changeType: "positive",
    icon: BarChartHorizontalBig,
    description: "Overall calculated risk exposure.",
    breakdown: riskScoreCalculationBreakdown,
    breakdownDetailsUrl: "/risk-score-details",
  },
  { 
    title: "AML Hits", 
    value: "15", 
    change: "+2 this week", 
    changeType: "negative", 
    icon: FileWarning, 
    description: "Suspicious transactions flagged.",
    breakdown: amlHitsBreakdown,
  },
];

const initialAgents: AIAgent[] = [
  {
    id: 'risk-sentinel',
    emoji: '🕵️‍♂️',
    name: 'Risk Sentinel Agent',
    role: 'Detects new/emerging risks from various internal and external data sources.',
    status: 'Active',
    lastActive: new Date(Date.now() - 2 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}),
    nextRun: 'Continuous',
    details: 'Monitoring news feeds (Reuters, Bloomberg) and internal anomaly detectors (transactions > $1M).',
    llmModel: 'Gemini 1.5 Pro (Vertex AI)',
    workloadQueue: [
      { id: 'news_feed_reuters', description: 'Scan Reuters World News', status: 'Processing', submittedAt: new Date(Date.now() - 1 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}) },
      { id: 'anomaly_tx_high_value', description: 'Check for new transactions > $1M', status: 'Pending', submittedAt: new Date(Date.now() - 0.5 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}) },
    ],
    activityLog: [
      { timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Agent started. Initializing data sources.', type: 'Info' },
      { timestamp: new Date(Date.now() - 3 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Successfully connected to Reuters API.', type: 'Success' },
      { timestamp: new Date(Date.now() - 2 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Processing batch of 50 news articles.', type: 'Info' },
      { timestamp: new Date(Date.now() - 1 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Identified 1 potential geopolitical risk event.', type: 'Warning' },
    ]
  },
  {
    id: 'control-validator',
    emoji: '🛡️',
    name: 'Control Validator Agent',
    role: 'Periodically tests key controls and gathers compliance evidence.',
    status: 'Processing',
    lastActive: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}),
    nextRun: new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}),
    details: 'Validating SOX control C-045: Access Reviews (Batch 3/5 - Users 200-300).',
    llmModel: 'Claude 3 Sonnet (Bedrock)',
    workloadQueue: [
      { id: 'sox_c045_b3', description: 'SOX C-045 Batch 3 (Users 200-300)', status: 'Processing', submittedAt: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}) },
      { id: 'sox_c045_b4', description: 'SOX C-045 Batch 4 (Users 300-400)', status: 'Pending', submittedAt: new Date(Date.now() - 1 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}) },
      { id: 'gdpr_art30_test', description: 'Test GDPR Art.30 RoPA accuracy', status: 'Pending', submittedAt: new Date(Date.now() - 0.5 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}) },
    ],
    activityLog: [
      { timestamp: new Date(Date.now() - 12 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Scheduled run started for Control Validator.', type: 'Info' },
      { timestamp: new Date(Date.now() - 11 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Fetching access logs for batch 3.', type: 'Info' },
      { timestamp: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Cross-referencing 100 user accounts with HR database.', type: 'Processing' },
    ]
  },
  {
    id: 'compliance-watchdog',
    emoji: '🤖',
    name: 'Compliance Watchdog Agent',
    role: 'Tracks regulatory changes from multiple jurisdictions and maps potential gaps.',
    status: 'Idle',
    lastActive: new Date(Date.now() - 60 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}),
    nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}),
    details: 'Awaiting next scheduled scan of ESMA, SEC, FinCEN portals.',
    llmModel: 'Gemini 1.5 Flash (Vertex AI)',
    activityLog: [
      { timestamp: new Date(Date.now() - 65 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Completed scan of 5 regulatory portals.', type: 'Success' },
      { timestamp: new Date(Date.now() - 62 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'No new major updates found. Identified 3 minor clarifications.', type: 'Info' },
      { timestamp: new Date(Date.now() - 60 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Agent entering idle state until next scheduled run.', type: 'Info' },
    ]
  },
  {
    id: 'remediation-planner',
    emoji: '🧑‍⚖️',
    name: 'Remediation Planner Agent',
    role: 'Suggests or initiates automated fixes for identified failed controls or gaps.',
    status: 'Error',
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}),
    details: 'Failed to connect to Jira ticketing system API (Error 503 Service Unavailable). Retrying in 5 mins.',
    llmModel: 'Custom Fine-tuned Model (Internal)',
    workloadQueue: [
       { id: 'failed_ctrl_01', description: 'Create ticket for C-012 failure', status: 'Failed', submittedAt: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}) }
    ],
    activityLog: [
      { timestamp: new Date(Date.now() - 6 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Attempting to create Jira ticket for control C-012.', type: 'Info' },
      { timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Jira API connection failed: 503 Service Unavailable.', type: 'Error' },
    ]
  },
  {
    id: 'crics-copilot',
    emoji: '💬',
    name: 'CRICS Copilot Agent',
    role: 'Answers natural language questions and provides explanations on compliance insights.',
    status: 'Active',
    lastActive: new Date(Date.now() - 30 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}),
    nextRun: 'On-demand',
    details: 'Currently assisting User_JaneS with query: "Summarize MiFID II impact on SME advisory services."',
    llmModel: 'Gemini 1.5 Pro (Vertex AI) with RAG',
  },
  {
    id: 'aml-transaction-screener',
    emoji: '💸',
    name: 'AML Transaction Screener',
    role: 'Monitors all incoming and outgoing transactions to identify potential AML hits based on rules and patterns.',
    status: 'Active',
    lastActive: new Date(Date.now() - 15 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit', second: '2-digit'}),
    nextRun: 'Continuous',
    details: 'Screening live transaction feed. Last hit identified: TXN-SUS-00123 (Large unusual international transfer)',
    llmModel: 'Gemini 1.5 Flash with AML Rule Engine',
    workloadQueue: [
      { id: 'txn_batch_live_001', description: 'Process live transaction stream segment', status: 'Processing', regulatoryBody: 'Internal Stream', submittedAt: new Date(Date.now() - 10 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit', second: '2-digit'}) },
      { id: 'sar_review_txn_00123', description: 'Review flagged transaction TXN-SUS-00123', status: 'Pending', regulatoryBody: 'FinCEN', submittedAt: new Date(Date.now() - 5 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit', second: '2-digit'}) },
    ],
    activityLog: [
      { timestamp: new Date(Date.now() - 1 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Connected to transaction firehose.', type: 'Info' },
      { timestamp: new Date(Date.now() - 45 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Transaction TXN-NORM-58291 cleared. No flags.', type: 'Debug' },
      { timestamp: new Date(Date.now() - 30 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Transaction TXN-SUS-00123 flagged: Large unusual international transfer. Risk Score: 85', type: 'Warning' },
      { timestamp: new Date(Date.now() - 15 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Queued TXN-SUS-00123 for SAR review.', type: 'Info' },
    ]
  },
  {
    id: 'data-ingestion-monitor',
    emoji: '📡',
    name: 'Data Ingestion Monitor',
    role: 'Oversees data feeds and flags anomalies in incoming regulatory or internal data.',
    status: 'Disabled',
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}),
    nextRun: 'N/A',
    details: 'Temporarily disabled for system maintenance on data pipeline (ETL-03).',
  },
  {
    id: 'report-generator',
    emoji: '📊',
    name: 'Insight Reporter Agent',
    role: 'Generates scheduled and on-demand compliance reports.',
    status: 'Idle',
    lastActive: new Date(Date.now() - 120 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    nextRun: '08:00 AM Daily',
    details: 'Awaiting next scheduled report: "Daily AML Transaction Summary".',
    llmModel: 'Gemini 1.5 Flash (Vertex AI)',
    workloadQueue: [
      { id: 'daily_aml_summary_next', description: 'Generate Daily AML Transaction Summary', status: 'Pending', submittedAt: new Date(Date.now() - 1 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), regulatoryBody: 'Internal' },
      { id: 'mifid_q3_compliance_rpt', description: 'MiFID II Q3 Compliance Report', status: 'Completed', submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleTimeString([], { day: '2-digit', month: 'short' }), regulatoryBody: 'ESMA' },
      { id: 'fincen_sar_trends_july', description: 'FinCEN SAR Trends - July', status: 'Completed', submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleTimeString([], { day: '2-digit', month: 'short' }), regulatoryBody: 'FinCEN' },
      { id: 'weekly_risk_overview_prev', description: 'Generate Weekly Risk Overview', status: 'Completed', submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleTimeString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }), regulatoryBody: 'Aggregated' },
    ],
    activityLog: [
      { timestamp: new Date(Date.now() - 125 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Agent started, loaded report templates.', type: 'Info' },
      { timestamp: new Date(Date.now() - 120 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Successfully generated "Ad-hoc KYC Compliance Check Report".', type: 'Success' },
      { timestamp: new Date(Date.now() - 119 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Entering idle state. Next scheduled run at 08:00 AM.', type: 'Info' },
    ],
  },
  {
    id: 'alert-monitor',
    emoji: '🔔',
    name: 'Notification Dispatcher Agent',
    role: 'Monitors thresholds and dispatches periodic alerts/notifications.',
    status: 'Active',
    lastActive: new Date(Date.now() - 15 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    nextRun: 'Continuous',
    details: 'Monitoring 12 active alert rules. No critical alerts triggered in last 5 minutes.',
    llmModel: 'N/A (Rule-based)', 
    workloadQueue: [], 
    activityLog: [
      { timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'System check: All notification channels (Email, SMS) are operational.', type: 'Info' },
      { timestamp: new Date(Date.now() - 3 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Rule "High-Value Transaction" (ID: AVT-001) checked. 0 triggers.', type: 'Debug' },
      { timestamp: new Date(Date.now() - 1 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Dispatched daily digest: "System Health Overview" to admin_group.', type: 'Success' },
      { timestamp: new Date(Date.now() - 30 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Rule "Multiple Failed Logins" (ID: SEC-003) checked. 1 low-priority event logged.', type: 'Info' },
    ],
  },
  {
    id: 'cost-forecaster',
    emoji: '📈',
    name: 'Cost Forecasting Agent',
    role: 'Predicts future spend based on historical trends, risk severity, and upcoming changes.',
    status: 'Active',
    lastActive: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}),
    nextRun: '01:00 AM Daily',
    details: 'Predicts that the Cybersecurity cost center will exceed budget by 15% in Q3 due to increased threat landscape severity and scheduled penetration testing.',
    llmModel: 'CRICS-Forecast-v1.2 (Time Series Model)',
    activityLog: [
      { timestamp: new Date(Date.now() - 20 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Initiated quarterly forecast cycle.', type: 'Info' },
      { timestamp: new Date(Date.now() - 18 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Analyzed Q2 spending data.', type: 'Processing' },
      { timestamp: new Date(Date.now() - 16 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Incorporated upcoming regulatory changes impact.', type: 'Processing' },
      { timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'}), message: 'Generated Q3 cost forecast successfully.', type: 'Success' },
    ]
  },
];

const statusConfig: Record<AIAgentStatusValue, { color: string; icon: LucideIcon, textColor?: string }> = {
  'Active': { color: 'bg-green-100 dark:bg-green-700/30', textColor: 'text-green-700 dark:text-green-300', icon: Zap },
  'Idle': { color: 'bg-blue-100 dark:bg-blue-700/30', textColor: 'text-blue-700 dark:text-blue-300', icon: Coffee },
  'Processing': { color: 'bg-yellow-100 dark:bg-yellow-600/30', textColor: 'text-yellow-700 dark:text-yellow-300', icon: Loader2 },
  'Error': { color: 'bg-red-100 dark:bg-red-700/30', textColor: 'text-red-700 dark:text-red-300', icon: AlertTriangleIcon },
  'Disabled': { color: 'bg-gray-100 dark:bg-gray-700/30', textColor: 'text-gray-600 dark:text-gray-400', icon: PowerOff },
};

export default function OverviewPage() {
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<AIAgent | null>(null);
  const [isAgentDetailDialogOpen, setIsAgentDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const agentUpdateInterval = setInterval(() => {
      setAgents(prevAgents =>
        prevAgents.map(agent => {
          let newLastActive = agent.lastActive;
          if ((agent.status === 'Active' || agent.status === 'Processing') && Math.random() < 0.3) {
            newLastActive = new Date().toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'});
          }
          let newStatus = agent.status;
          if (agent.status === 'Processing' && Math.random() < 0.1) {
            newStatus = Math.random() < 0.5 ? 'Idle' : 'Active'; 
          } else if (agent.status === 'Idle' && Math.random() < 0.05 && agent.id !== 'report-generator' && agent.id !== 'cost-forecaster') { 
            newStatus = 'Processing';
          } else if (agent.status === 'Error' && Math.random() < 0.2) {
            newStatus = 'Active';
          }

          let newActivityLog = agent.activityLog ? [...agent.activityLog] : [];
          if (agent.status === 'Active' && Math.random() < 0.1) {
              const commonMessages = [
                `Rule "${agent.id.split('-')[0]}-Rule-${Math.floor(Math.random()*5+1)}" checked. 0 triggers.`,
                `Processed batch of ${Math.floor(Math.random()*100+10)} events.`,
                `Data stream for ${agent.id.split('-')[0]} nominal.`,
              ];
              newActivityLog.unshift({ 
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                  message: commonMessages[Math.floor(Math.random() * commonMessages.length)],
                  type: 'Debug'
              });
              if (newActivityLog.length > 20) newActivityLog.pop(); 
          }

          let newWorkloadQueue = agent.workloadQueue ? [...agent.workloadQueue] : [];
          if (agent.status === 'Processing' && newWorkloadQueue.find(item => item.status === 'Processing')) {
              const processingItemIndex = newWorkloadQueue.findIndex(item => item.status === 'Processing');
              if (processingItemIndex !== -1 && Math.random() < 0.3) { 
                  newWorkloadQueue[processingItemIndex] = { ...newWorkloadQueue[processingItemIndex], status: 'Completed' };
                  newActivityLog.unshift({
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      message: `Task "${newWorkloadQueue[processingItemIndex].description}" completed.`,
                      type: 'Success'
                  });
                  if (newActivityLog.length > 20) newActivityLog.pop();
                  
                  const pendingItemIndex = newWorkloadQueue.findIndex(item => item.status === 'Pending');
                  if (pendingItemIndex !== -1) {
                      newWorkloadQueue[pendingItemIndex] = { ...newWorkloadQueue[pendingItemIndex], status: 'Processing' };
                  } else if (newWorkloadQueue.every(item => item.status === 'Completed' || item.status === 'Failed')) {
                       newStatus = (agent.id === 'report-generator' || agent.id === 'compliance-watchdog' || agent.id === 'cost-forecaster') ? 'Idle' : 'Active';
                  }
              }
          }
          return { ...agent, lastActive: newLastActive, status: newStatus, activityLog: newActivityLog, workloadQueue: newWorkloadQueue };
        })
      );
    }, 7000); 

    return () => {
      clearInterval(agentUpdateInterval);
    };
  }, []);

  const handleViewAgentDetails = (agent: AIAgent) => {
    setSelectedAgentDetails(agent);
    setIsAgentDetailDialogOpen(true);
  };

  const handleStopAgent = (agentId: string, agentName: string) => {
    toast({
      title: "Agent Stop Command",
      description: `Stop command issued for ${agentName} (ID: ${agentId}). Agent status will update shortly. (Placeholder)`,
      variant: "destructive",
    });
    setAgents(prev => prev.map(a => a.id === agentId ? {...a, status: 'Disabled', nextRun: 'N/A'} : a));
  };

  const handleDownloadReport = (item: WorkloadItem) => {
    toast({
      title: "Download Initiated",
      description: `Preparing report: "${item.description}" for ${item.regulatoryBody || 'N/A'}. (Placeholder)`,
    });
  };

  const getWorkloadStatusBadge = (status: WorkloadItem['status']) => {
    switch (status) {
      case 'Failed':
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-500 text-xs">Completed</Badge>;
      case 'Processing':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border-blue-300 dark:border-blue-500 text-xs">Processing</Badge>;
      case 'Pending':
        return <Badge variant="outline" className="text-xs">Pending</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getActivityLogBadge = (type: ActivityLogEntry['type']) => {
    switch (type) {
      case 'Error':
        return <Badge variant="destructive" className="text-xs mr-2">{type}</Badge>;
      case 'Warning':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500 text-xs mr-2">{type}</Badge>;
      case 'Success':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-500 text-xs mr-2">{type}</Badge>;
      case 'Info':
        return <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-700/30 dark:text-sky-300 border-sky-300 dark:border-sky-500 text-xs mr-2">{type}</Badge>;
      case 'Debug':
        return <Badge variant="outline" className="text-gray-500 dark:text-gray-400 text-xs mr-2">{type}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs mr-2">{type}</Badge>;
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center">
            <ActivityIcon className="mr-3 h-7 w-7 text-primary" />
            AI Agents at Work
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> 
            {agents.map((agent) => {
            const config = statusConfig[agent.status];
            const StatusIcon = config.icon;
            const AgentIcon = agent.id === 'cost-forecaster' ? TrendingUp : (agent.id === 'alert-monitor' ? ActivityIcon : Brain); // Example conditional icon for forecaster
            
            return (
                <Card key={agent.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <span className="text-3xl mr-3">{agent.emoji}</span>
                            <CardTitle className="text-xl leading-tight">{agent.name}</CardTitle>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="outline" className={cn("px-3 py-1 text-sm", config.color, config.textColor, `border-${config.textColor?.replace('text-', '')}/50`)}>
                                        <StatusIcon className={cn("mr-1.5 h-4 w-4", agent.status === 'Processing' ? 'animate-spin' : '')} />
                                        {agent.status}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{agent.status}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <CardDescription className="text-sm">{agent.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm flex-grow">
                    <div>
                    <span className="font-semibold text-muted-foreground">Last Active:</span> {agent.lastActive}
                    </div>
                    <div>
                    <span className="font-semibold text-muted-foreground">Next Run/State:</span> {agent.nextRun || 'N/A'}
                    </div>
                    {agent.details && (
                    <div className="pt-1">
                        <p className="text-xs text-muted-foreground italic leading-snug line-clamp-2" title={agent.details}>
                        <span className="font-semibold not-italic text-muted-foreground/80">Current Activity: </span>{agent.details}
                        </p>
                    </div>
                    )}
                </CardContent>
                <CardFooter className="p-4 pt-2 border-t border-border/50 mt-auto">
                    <Button variant="ghost" size="sm" className="justify-start text-primary hover:text-primary/90 w-full" onClick={() => handleViewAgentDetails(agent)}>
                    View Logs & Details <ChevronRight className="ml-auto h-4 w-4" />
                    </Button>
                </CardFooter>
                </Card>
            );
            })}
        </div>
        {agents.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No AI agents configured or reporting.</p>
        )}
      </div>

      {selectedAgentDetails && (
        <Dialog open={isAgentDetailDialogOpen} onOpenChange={setIsAgentDetailDialogOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {selectedAgentDetails.emoji} <span className="ml-2">{selectedAgentDetails.name} - Details</span>
              </DialogTitle>
              <DialogDescription>
                Operational details, workload, and activity log for the agent.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-3">
              {selectedAgentDetails.llmModel && (
                <Card>
                  <CardHeader className="pb-2 flex-row items-center space-x-2">
                     <Brain className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">LLM Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Model Used:</strong> {selectedAgentDetails.llmModel}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2 flex-row items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Workload Queue ({selectedAgentDetails.workloadQueue?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAgentDetails.workloadQueue && selectedAgentDetails.workloadQueue.length > 0 ? (
                    <ScrollArea className="h-[150px] border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Description</TableHead>
                            {selectedAgentDetails.id === 'report-generator' && <TableHead>Regulatory Body</TableHead>}
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            {selectedAgentDetails.id === 'report-generator' && <TableHead className="text-right">Actions</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedAgentDetails.workloadQueue.map(item => (
                            <TableRow key={item.id}>
                              <TableCell className="font-mono text-xs py-1.5">{item.id.slice(0,12)}</TableCell>
                              <TableCell className="text-xs py-1.5">{item.description}</TableCell>
                              {selectedAgentDetails.id === 'report-generator' && <TableCell className="text-xs py-1.5">{item.regulatoryBody || 'N/A'}</TableCell>}
                              <TableCell className="py-1.5">{getWorkloadStatusBadge(item.status)}</TableCell>
                              <TableCell className="text-xs py-1.5">{item.submittedAt}</TableCell>
                              {selectedAgentDetails.id === 'report-generator' && (
                                <TableCell className="text-right py-1.5">
                                  {item.status === 'Completed' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-auto px-2 py-1"
                                      onClick={() => handleDownloadReport(item)}
                                    >
                                      <Download className="mr-1.5 h-3.5 w-3.5" />
                                      Download
                                    </Button>
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-muted-foreground">Workload queue is empty.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 flex-row items-center space-x-2">
                  <ListChecksIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAgentDetails.activityLog && selectedAgentDetails.activityLog.length > 0 ? (
                    <ScrollArea className="h-[200px] p-3 border rounded-md bg-muted/20">
                      <div className="space-y-2.5">
                        {selectedAgentDetails.activityLog.map((log, index) => ( 
                          <div key={index} className="text-xs flex items-start">
                            <span className="font-semibold text-muted-foreground mr-2 whitespace-nowrap tabular-nums">{log.timestamp}</span>
                            <div className="flex items-center flex-wrap">
                                {getActivityLogBadge(log.type)}
                                <span className="leading-tight">{log.message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-muted-foreground">Activity log is empty.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <DialogFooter className="sm:justify-between">
               <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleStopAgent(selectedAgentDetails.id, selectedAgentDetails.name)}
                  disabled={selectedAgentDetails.status === 'Disabled'}
                >
                  <StopCircle className="mr-1.5 h-4 w-4" /> Stop
                </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    

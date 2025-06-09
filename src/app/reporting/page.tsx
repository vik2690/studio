
"use client";

import { useState, useEffect } from 'react';
import type { ReportItem, ReportVersionMetadata, ReportChange, ChartDataPoint } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, GitCompareArrows, Eye, Settings, Download, Wand2, Loader2, RotateCcw, FileSearch } from 'lucide-react';
import Link from 'next/link';
import { OverviewChart } from '@/components/dashboard/OverviewChart';
import { PieChartCard } from '@/components/dashboard/PieChartCard';
import type { ChartConfig } from '@/components/ui/chart';

const initialReportItems: ReportItem[] = [
  {
    reportId: 'RPT-AML-001',
    status: 'Generated',
    regulatoryBody: 'FinCEN',
    typeOfReport: 'Monthly SAR Activity',
    associatedRisks: ['RISK-002', 'RISK-008'],
    associatedControls: ['CTRL-AML-01', 'CTRL-AML-05'],
    frequency: 'Monthly',
    dateOfGeneration: '2024-07-01',
    lastModifiedDate: '2024-07-01',
    impactedCitations: ['31 CFR § 1020.320'],
    versionHistory: [
      { version: 1, timestamp: '2024-07-01T10:00:00Z', changes: [{ field: 'status', oldValue: 'Draft', newValue: 'Generated', changedBy: 'System' }] },
    ]
  },
  {
    reportId: 'RPT-RISK-005',
    status: 'Draft',
    regulatoryBody: 'Internal Audit',
    typeOfReport: 'Q3 Risk Assessment Summary',
    associatedRisks: ['RISK-001', 'RISK-003', 'RISK-004'],
    associatedControls: ['CTRL-GEN-001', 'CTRL-IT-005'],
    frequency: 'Quarterly',
    dateOfGeneration: 'N/A',
    lastModifiedDate: '2024-07-28',
    impactedCitations: ['Internal Policy 3.2.1'],
    versionHistory: [
      { version: 1, timestamp: '2024-07-25T14:30:00Z', changes: [{ field: 'typeOfReport', oldValue: 'Q3 Risk Overview', newValue: 'Q3 Risk Assessment Summary', changedBy: 'UserA' }] },
      { version: 2, timestamp: '2024-07-28T11:00:00Z', changes: [{ field: 'associatedRisks', oldValue: ['RISK-001', 'RISK-003'], newValue: ['RISK-001', 'RISK-003', 'RISK-004'], changedBy: 'UserB', changeReason: 'Added new operational risk' }] },
    ]
  },
  {
    reportId: 'RPT-CTRL-012',
    status: 'Pending Generation',
    regulatoryBody: 'SOX Compliance Office',
    typeOfReport: 'Control Effectiveness Report (ITGC)',
    associatedControls: ['CTRL-IT-001', 'CTRL-IT-002', 'CTRL-IT-003'],
    frequency: 'Annually',
    dateOfGeneration: 'N/A',
    lastModifiedDate: '2024-07-15',
  },
  {
    reportId: 'RPT-GDPR-003',
    status: 'Archived',
    regulatoryBody: 'DPO Office',
    typeOfReport: 'Data Breach Incident Report (Resolved)',
    associatedRisks: ['RISK-DB-010'],
    frequency: 'Ad-hoc',
    dateOfGeneration: '2023-12-10',
    lastModifiedDate: '2024-01-05',
    impactedCitations: ['GDPR Article 32', 'GDPR Article 34'],
  }
];

const statusVariantMap: Record<ReportItem['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'Generated': 'secondary',
  'Pending Generation': 'default',
  'Failed': 'destructive',
  'Draft': 'outline',
  'Archived': 'outline',
};

const frequencyVariantMap: Record<ReportItem['frequency'], 'default' | 'secondary' | 'outline'> = {
  'Daily': 'default',
  'Weekly': 'default',
  'Monthly': 'secondary',
  'Quarterly': 'secondary',
  'Annually': 'outline',
  'Ad-hoc': 'outline',
};

const regulatoryBodies = [
  { value: 'ESMA', label: 'ESMA (European Securities and Markets Authority)' },
  { value: 'FinCEN', label: 'FinCEN (Financial Crimes Enforcement Network)' },
  { value: 'EC', label: 'European Commission' },
  { value: 'SEC', label: 'SEC (U.S. Securities and Exchange Commission)' },
  { value: 'PRA', label: 'PRA (Prudential Regulation Authority)' },
  { value: 'FCA', label: 'FCA (Financial Conduct Authority)' },
  { value: 'MAS', label: 'MAS (Monetary Authority of Singapore)' },
  { value: 'Internal Audit', label: 'Internal Audit' },
  { value: 'SOX Compliance Office', label: 'SOX Compliance Office' },
  { value: 'DPO Office', label: 'DPO Office' },
  { value: 'Other', label: 'Other/Not Specified' },
];

const reportOptionsByBody: Record<string, { value: string; label: string }[]> = {
  ESMA: [
    { value: 'mifid_ii_q_transparency', label: 'MiFID II Quarterly Transparency Report' },
    { value: 'emr_annual_clearing', label: 'EMIR Annual Clearing Obligation Report' },
    { value: 'sfdr_entity_level', label: 'SFDR Entity-Level Disclosure Report' },
  ],
  FinCEN: [
    { value: 'sar_monthly_summary', label: 'Monthly SAR Activity Summary' },
    { value: 'ctr_batch_filing', label: 'CTR Batch Filing Report' },
    { value: 'fbar_annual_overview', label: 'FBAR Annual Filing Overview' },
  ],
  EC: [
    { value: 'gdpr_dpa_annual', label: 'GDPR Data Protection Authority Annual Report' },
    { value: 'aml_directive_transposition', label: 'AML Directive Transposition Status Report' },
  ],
  SEC: [
    { value: 'form_10k_annual', label: 'Form 10-K Annual Report Summary' },
    { value: 'form_8k_current', label: 'Form 8-K Current Event Report Tracker' },
    { value: 'adv_annual_update', label: 'Form ADV Annual Update Summary' },
  ],
  'Internal Audit': [
    { value: 'q_audit_findings', label: 'Quarterly Internal Audit Findings' },
    { value: 'annual_risk_assessment_summary', label: 'Annual Risk Assessment Summary' },
  ],
  'SOX Compliance Office': [
    { value: 'itgc_effectiveness_report', label: 'ITGC Effectiveness Report' },
    { value: 'management_assertion_report', label: 'Management Assertion Report (SOX 302/404)'},
  ],
  'DPO Office': [
    { value: 'dpia_register_summary', label: 'DPIA Register Summary Report' },
    { value: 'data_subject_request_log', label: 'Data Subject Request Log & Metrics'},
  ],
  Other: [],
};

const reportCitationsByReportValue: Record<string, { value: string; label: string }[]> = {
  // ESMA
  mifid_ii_q_transparency: [
    { value: 'mifid_art_26', label: 'MiFID II Article 26 (Transaction Reporting)' },
    { value: 'rts_22', label: 'RTS 22 (Reporting Obligations)' },
    { value: 'mifid_art_16', label: 'MiFID II Article 16 (Organisational Requirements)' },
  ],
  emr_annual_clearing: [
    { value: 'emir_art_4', label: 'EMIR Article 4 (Clearing Obligation)' },
    { value: 'emir_art_9', label: 'EMIR Article 9 (Reporting Obligation to TRs)' },
    { value: 'emir_art_11', label: 'EMIR Article 11 (Risk Mitigation Techniques)' },
  ],
  sfdr_entity_level: [
    { value: 'sfdr_art_3', label: 'SFDR Article 3 (Transparency of PAI policies)' },
    { value: 'sfdr_art_4', label: 'SFDR Article 4 (Transparency of PAI at product level)' },
    { value: 'sfdr_rts_annex_1', label: 'SFDR RTS Annex I (Template PAI statement)' },
  ],
  // FinCEN
  sar_monthly_summary: [
    { value: '31_cfr_1020_320', label: '31 CFR § 1020.320 (SAR Filing Requirements)' },
    { value: 'fincen_form_111', label: 'FinCEN Form 111 (SAR Form Instructions)' },
    { value: 'bsa_recordkeeping', label: 'BSA Recordkeeping Requirements for SARs' },
  ],
  ctr_batch_filing: [
    { value: '31_cfr_1010_311', label: '31 CFR § 1010.311 (CTR Filing Requirements)' },
    { value: 'fincen_form_112', label: 'FinCEN Form 112 (CTR Form Instructions)' },
    { value: 'ctr_aggregation_rules', label: 'CTR Aggregation Rules' },
  ],
  form_10k_annual: [
    {value: 'sec_item_1a', label: 'SEC Form 10-K Item 1A (Risk Factors)'},
    {value: 'sec_item_7', label: 'SEC Form 10-K Item 7 (MD&A)'},
  ],
  itgc_effectiveness_report: [
    {value: 'sox_302', label: 'SOX Section 302 (Corporate Responsibility)'},
    {value: 'sox_404', label: 'SOX Section 404 (Management Assessment of ICFR)'},
    {value: 'cobit_framework', label: 'COBIT Framework Alignment'},
  ],
};


const riskTrendData: ChartDataPoint[] = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 135 },
  { name: "Mar", value: 110 },
  { name: "Apr", value: 140 },
  { name: "May", value: 125 },
  { name: "Jun", value: 150 },
];

const riskTrendChartConfig = {
  value: {
    label: "Identified Risks",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const controlEffectivenessData: ChartDataPoint[] = [
  { name: "Q1", value: 75 },
  { name: "Q2", value: 82 },
  { name: "Q3", value: 78 },
  { name: "Q4", value: 85 },
];

const controlEffectivenessChartConfig = {
  value: {
    label: "Effectiveness (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const riskDistributionData: ChartDataPoint[] = [
  { name: "Critical", value: 25 },
  { name: "High", value: 40 },
  { name: "Medium", value: 60 },
  { name: "Low", value: 80 },
];

const riskDistributionChartConfig = {
  "Critical": { label: "Critical", color: "hsl(var(--chart-5))" },
  "High": { label: "High", color: "hsl(var(--chart-1))" },
  "Medium": { label: "Medium", color: "hsl(var(--chart-2))" },
  "Low": { label: "Low", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

const controlStatusData: ChartDataPoint[] = [
  { name: "Implemented", value: 650 },
  { name: "Pending", value: 150 },
  { name: "Overdue", value: 50 },
];

const controlStatusChartConfig = {
  "Implemented": { label: "Implemented", color: "hsl(var(--chart-4))" },
  "Pending": { label: "Pending Review", color: "hsl(var(--chart-2))" },
  "Overdue": { label: "Overdue", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;


export default function ReportingHubPage() {
  const [reportItems, setReportItems] = useState<ReportItem[]>(initialReportItems);
  const [selectedReportForComparison, setSelectedReportForComparison] = useState<ReportItem | null>(null);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);
  
  const [manualRegulationInput, setManualRegulationInput] = useState<string | undefined>(undefined);
  const [selectedManualReport, setSelectedManualReport] = useState<string | undefined>(undefined);
  const [availableReports, setAvailableReports] = useState<{ value: string; label: string }[]>([]);
  
  const [selectedManualCitation, setSelectedManualCitation] = useState<string | undefined>(undefined);
  const [availableCitations, setAvailableCitations] = useState<{ value: string; label: string }[]>([]);

  const [isManualCitationEntry, setIsManualCitationEntry] = useState(false);
  const [manualCitationDetailsText, setManualCitationDetailsText] = useState('');
  const MAX_MANUAL_CITATION_LENGTH = 300;

  const [aiSummaryOutputText, setAiSummaryOutputText] = useState<string | null>(null);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);


  const { toast } = useToast();

  useEffect(() => {
    if (!isManualCitationEntry && manualRegulationInput && reportOptionsByBody[manualRegulationInput]) {
      setAvailableReports(reportOptionsByBody[manualRegulationInput]);
    } else if (isManualCitationEntry || !manualRegulationInput) {
      setAvailableReports([]);
    }
    setSelectedManualReport(undefined); // Reset report when body changes or mode changes
  }, [manualRegulationInput, isManualCitationEntry]);

  useEffect(() => {
    if (!isManualCitationEntry && selectedManualReport && reportCitationsByReportValue[selectedManualReport]) {
      setAvailableCitations(reportCitationsByReportValue[selectedManualReport]);
    } else if (isManualCitationEntry || !selectedManualReport) {
      setAvailableCitations([]);
    }
    setSelectedManualCitation(undefined); // Reset citation when report changes or mode changes
  }, [selectedManualReport, isManualCitationEntry]);

  const handleManualCitationCheckboxChange = (checked: boolean) => {
    setIsManualCitationEntry(checked);
    if (checked) {
      setManualRegulationInput(undefined);
      setSelectedManualReport(undefined);
      setSelectedManualCitation(undefined);
      setAvailableReports([]);
      setAvailableCitations([]);
      // Do not clear aiSummaryOutputText here, let reset button do it
    } else {
      setManualCitationDetailsText('');
    }
  };

  const handlePreviewComparison = (report: ReportItem) => {
    if (!report.versionHistory || report.versionHistory.length === 0) {
      toast({
        title: "No History",
        description: "No version history available for this report to compare.",
        variant: "default"
      });
      return;
    }
    setSelectedReportForComparison(report);
    setIsComparisonDialogOpen(true);
  };

  const handleDownloadReport = (reportId: string, reportType: string) => {
    toast({
      title: "Download Initiated",
      description: `Preparing report "${reportType}" (ID: ${reportId}) for download. (Placeholder)`,
    });
  };

  const handleDownloadChartReport = (reportName: string) => {
    toast({
      title: "Download Initiated",
      description: `Preparing to download report for "${reportName}". (Placeholder)`,
    });
  };

  const renderChangeValue = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value || 'N/A';
  };

  const handleAiSummary = () => {
    setIsGeneratingAiSummary(true);
    setAiSummaryOutputText(null);
    let summaryContext = "";
    let baseQuery = "Provide a summary focusing on ";

     if (isManualCitationEntry) {
      if (!manualCitationDetailsText.trim()) {
        toast({ title: "Input Required", description: "Please enter manual citation details for summary.", variant: "destructive"});
        setIsGeneratingAiSummary(false);
        return;
      }
      summaryContext = `manual citation details: "${manualCitationDetailsText.substring(0,100)}..."`;
      baseQuery += `the following manually entered citation: ${manualCitationDetailsText}`;
    } else {
      if (!manualRegulationInput) {
        toast({ title: "Input Required", description: "Please select a regulatory body.", variant: "destructive" });
        setIsGeneratingAiSummary(false);
        return;
      }
      const regBodyLabel = regulatoryBodies.find(b => b.value === manualRegulationInput)?.label || manualRegulationInput;
      summaryContext = `for ${regBodyLabel}`;
      baseQuery += `regulations from ${regBodyLabel}`;
      if (selectedManualReport) {
        const reportLabel = availableReports.find(r => r.value === selectedManualReport)?.label || selectedManualReport;
        summaryContext = `for "${reportLabel}" under ${regBodyLabel}`;
        baseQuery += `, specifically concerning the report '${reportLabel}'`;
      }
      if (selectedManualCitation) {
          const citationLabel = availableCitations.find(c => c.value === selectedManualCitation)?.label || selectedManualCitation;
          summaryContext += ` (focusing on citation: ${citationLabel})`;
          baseQuery += `, with emphasis on citation '${citationLabel}'`;
      }
    }
    
    toast({
      title: "AI Summary Extraction Initiated",
      description: `AI summary extraction started ${summaryContext}. (Placeholder)`,
    });

    // Simulate AI processing
    setTimeout(() => {
      const placeholderSummary = `This is a placeholder AI-generated summary. Based on your selection (${summaryContext}), the key aspects include: A) The primary obligations outlined. B) Potential impacts on current operations. C) Recommended areas for closer review. For a detailed analysis, full document review is advised. The AI model considered factors related to ${baseQuery.substring(baseQuery.indexOf(' ') + 1)}.`;
      setAiSummaryOutputText(placeholderSummary);
      setIsGeneratingAiSummary(false);
      toast({
        title: "AI Summary Generated",
        description: "Summary successfully extracted and displayed below."
      });
    }, 2500);
  };

  const handleResetManualTools = () => {
    setManualRegulationInput(undefined);
    setSelectedManualReport(undefined);
    setAvailableReports([]);
    setSelectedManualCitation(undefined);
    setAvailableCitations([]);
    setIsManualCitationEntry(false);
    setManualCitationDetailsText('');
    setAiSummaryOutputText(null);
    setIsGeneratingAiSummary(false); // Ensure loading state is also reset
    toast({
        title: "Manual Tools Reset",
        description: "All selections and generated summaries have been cleared."
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight flex items-center">
        <FileSpreadsheet className="mr-3 h-8 w-8 text-primary" />
        Analytics and Reporting Hub
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Reporting Dashboards</CardTitle>
          <CardDescription>Visual overview of key risk and control metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Trend Analysis</CardTitle>
                <CardDescription>Monthly trend of identified risks.</CardDescription>
              </CardHeader>
              <CardContent>
                <OverviewChart
                  data={riskTrendData}
                  title=""
                  description=""
                  xAxisKey="name"
                  chartConfig={riskTrendChartConfig}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleDownloadChartReport('Risk Trend Analysis')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution by Severity</CardTitle>
                <CardDescription>Breakdown of risks by their severity level.</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartCard
                  data={riskDistributionData}
                  title=""
                  description=""
                  dataKey="value"
                  nameKey="name"
                  chartConfig={riskDistributionChartConfig}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleDownloadChartReport('Risk Distribution by Severity')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Control Effectiveness</CardTitle>
                <CardDescription>Quarterly control effectiveness score.</CardDescription>
              </CardHeader>
              <CardContent>
                <OverviewChart
                  data={controlEffectivenessData}
                  title=""
                  description=""
                  xAxisKey="name"
                  chartConfig={controlEffectivenessChartConfig}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleDownloadChartReport('Control Effectiveness')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Control Implementation Status</CardTitle>
                <CardDescription>Current status of applied controls.</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartCard
                  data={controlStatusData}
                  title=""
                  description=""
                  dataKey="value"
                  nameKey="name"
                  chartConfig={controlStatusChartConfig}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleDownloadChartReport('Control Implementation Status')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>


      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Report Queue & Archive</CardTitle>
          <CardDescription>
            Manage, track, and review all generated and pending compliance reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Regulatory Body</TableHead>
                <TableHead>Type of Report</TableHead>
                <TableHead>Associated Risks</TableHead>
                <TableHead>Associated Controls</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Impacted Citations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    No reports found.
                  </TableCell>
                </TableRow>
              ) : (
                reportItems.map((item) => (
                  <TableRow key={item.reportId}>
                    <TableCell className="font-medium text-xs">{item.reportId}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[item.status]} 
                       className={item.status === 'Generated' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : 
                                  item.status === 'Pending Generation' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300' :
                                  item.status === 'Archived' ? 'text-muted-foreground' : ''
                                 }>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{item.regulatoryBody}</TableCell>
                    <TableCell className="text-xs min-w-[150px]">{item.typeOfReport}</TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">
                      {item.associatedRisks?.map(risk => <Badge key={risk} variant="outline" className="mr-1 mb-1 text-xs">{risk}</Badge>) ?? 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">
                      {item.associatedControls?.map(ctrl => <Badge key={ctrl} variant="outline" className="mr-1 mb-1 text-xs">{ctrl}</Badge>) ?? 'N/A'}
                    </TableCell>
                    <TableCell><Badge variant={frequencyVariantMap[item.frequency]} className="text-xs">{item.frequency}</Badge></TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{item.dateOfGeneration}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{item.lastModifiedDate}</TableCell>
                    <TableCell className="text-xs max-w-[180px]">
                        {item.impactedCitations?.map(cite => (
                          <Link key={cite} href={`/citations/${encodeURIComponent(cite)}`} passHref legacyBehavior>
                            <a className="inline-block mr-1 mb-1">
                              <Badge variant="secondary" className="text-xs hover:bg-primary/10 hover:text-primary-foreground cursor-pointer">
                                {cite}
                              </Badge>
                            </a>
                          </Link>
                        )) ?? <span className="text-muted-foreground">N/A</span>}
                    </TableCell>
                    <TableCell className="space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handlePreviewComparison(item)} title="Check old report versions">
                        <GitCompareArrows className="mr-1.5 h-4 w-4" /> 
                        <span className="sm:hidden md:inline">Versions</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadReport(item.reportId, item.typeOfReport)} title="Download Report">
                        <Download className="mr-1.5 h-4 w-4" />
                         <span className="sm:hidden md:inline">Download</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-6 w-6 text-primary" />
            Manual Report Tools
          </CardTitle>
          <CardDescription>
            Configure and generate AI summaries based on specific criteria or manual input.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="manualRegulationInput" className="font-semibold">Regulatory Body</Label>
            <Select 
              value={manualRegulationInput} 
              onValueChange={setManualRegulationInput}
              disabled={isManualCitationEntry || isGeneratingAiSummary}
            >
              <SelectTrigger id="manualRegulationInput" className="mt-1">
                <SelectValue placeholder="Select a regulatory body" />
              </SelectTrigger>
              <SelectContent>
                {regulatoryBodies.map(body => (
                  <SelectItem key={body.value} value={body.value}>{body.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manualReportSelect" className="font-semibold">Report Selection</Label>
            <Select 
              value={selectedManualReport} 
              onValueChange={setSelectedManualReport} 
              disabled={isManualCitationEntry || !manualRegulationInput || availableReports.length === 0 || isGeneratingAiSummary}
            >
              <SelectTrigger id="manualReportSelect" className="mt-1">
                <SelectValue placeholder={isManualCitationEntry ? "Disabled for manual citation entry" : !manualRegulationInput ? "First select a regulatory body" : (availableReports.length === 0 ? "No reports for selected body" : "Select a specific report")} />
              </SelectTrigger>
              <SelectContent>
                {availableReports.length > 0 && !isManualCitationEntry ? (
                  availableReports.map(report => (
                    <SelectItem key={report.value} value={report.value}>{report.label}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no_reports" disabled>
                    {isManualCitationEntry ? "Disabled for manual citation entry" : !manualRegulationInput ? "Select a regulatory body first" : "No reports available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manualCitationSelect" className="font-semibold">Citations</Label>
            <Select 
              value={selectedManualCitation} 
              onValueChange={setSelectedManualCitation} 
              disabled={isManualCitationEntry || !selectedManualReport || availableCitations.length === 0 || isGeneratingAiSummary}
            >
              <SelectTrigger id="manualCitationSelect" className="mt-1">
                <SelectValue placeholder={isManualCitationEntry ? "Disabled for manual citation entry" : !selectedManualReport ? "First select a report" : (availableCitations.length === 0 ? "No citations for selected report" : "Select a specific citation")} />
              </SelectTrigger>
              <SelectContent>
                {availableCitations.length > 0 && !isManualCitationEntry ? (
                  availableCitations.map(citation => (
                    <SelectItem key={citation.value} value={citation.value}>{citation.label}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no_citations" disabled>
                     {isManualCitationEntry ? "Disabled for manual citation entry" : !selectedManualReport ? "Select a report first" : "No citations available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="manual-citation-checkbox"
              checked={isManualCitationEntry}
              onCheckedChange={(checked) => handleManualCitationCheckboxChange(checked as boolean)}
              disabled={isGeneratingAiSummary}
            />
            <Label htmlFor="manual-citation-checkbox" className="font-normal text-sm">
              Enter Citation Details Manually
            </Label>
          </div>

          {isManualCitationEntry && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="manualCitationDetailsText" className="font-semibold">Manual Citation Details</Label>
              <Textarea
                id="manualCitationDetailsText"
                value={manualCitationDetailsText}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_MANUAL_CITATION_LENGTH) {
                    setManualCitationDetailsText(e.target.value);
                  }
                }}
                placeholder="Enter citation information (approx. 50 words)..."
                className="min-h-[100px]"
                maxLength={MAX_MANUAL_CITATION_LENGTH}
                disabled={isGeneratingAiSummary}
              />
              <p className="text-xs text-muted-foreground text-right">
                {manualCitationDetailsText.length}/{MAX_MANUAL_CITATION_LENGTH} characters
              </p>
            </div>
          )}

        </CardContent>
        <CardFooter className="gap-2 flex-wrap">
          <Button 
            onClick={handleAiSummary} 
            variant="default" 
            disabled={(isManualCitationEntry ? !manualCitationDetailsText.trim() : !manualRegulationInput) || isGeneratingAiSummary}
          >
            {isGeneratingAiSummary ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            AI Summary
          </Button>
          <Button 
            onClick={handleResetManualTools} 
            variant="outline"
            disabled={isGeneratingAiSummary}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {aiSummaryOutputText && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSearch className="mr-2 h-6 w-6 text-primary" />
              AI Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="aiSummaryOutput" className="font-semibold">Summary Details</Label>
            <Textarea
              id="aiSummaryOutput"
              value={aiSummaryOutputText}
              readOnly
              className="min-h-[150px] mt-1 text-sm bg-muted/50"
            />
          </CardContent>
        </Card>
      )}


      {selectedReportForComparison && isComparisonDialogOpen && (
        <Dialog open={isComparisonDialogOpen} onOpenChange={setIsComparisonDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Change History: {selectedReportForComparison.reportId}</DialogTitle>
              <DialogDescription>
                Comparison of metadata changes for "{selectedReportForComparison.typeOfReport}".
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6 py-4">
                {selectedReportForComparison.versionHistory && selectedReportForComparison.versionHistory.length > 0 ? (
                  selectedReportForComparison.versionHistory.slice().reverse().map((versionMeta, index) => (
                    <Card key={versionMeta.version} className="shadow-md">
                      <CardHeader className="pb-3 pt-4 px-4">
                        <CardTitle className="text-md">
                          Version {versionMeta.version} (Updated: {new Date(versionMeta.timestamp).toLocaleString()})
                        </CardTitle>
                         {index === 0 && selectedReportForComparison.versionHistory && selectedReportForComparison.versionHistory.length > 1 && (
                            <Badge variant="secondary" className="w-fit bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300">Latest Version</Badge>
                        )}
                        {index > 0 && (
                            <Badge variant="outline" className="w-fit">Previous Version</Badge>
                        )}
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        {versionMeta.changes.length > 0 ? (
                          <Table className="text-xs">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Field</TableHead>
                                <TableHead>Old Value</TableHead>
                                <TableHead>New Value</TableHead>
                                <TableHead>Changed By</TableHead>
                                <TableHead>Reason</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {versionMeta.changes.map((change, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-semibold capitalize">{change.field.replace(/([A-Z])/g, ' $1')}</TableCell>
                                  <TableCell className="text-muted-foreground">{renderChangeValue(change.oldValue)}</TableCell>
                                  <TableCell>{renderChangeValue(change.newValue)}</TableCell>
                                  <TableCell>{change.changedBy}</TableCell>
                                  <TableCell>{change.changeReason || 'N/A'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="text-sm text-muted-foreground">Initial version or no changes recorded for this specific update event.</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No version history available for comparison.</p>
                )}
              </div>
            </ScrollArea>
            <DialogFooter>
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


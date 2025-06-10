
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, BarChart2, PieChart as PieChartIcon, TrendingUp, Brain, Loader2, FileText, Users, Building, Download, Link as LinkIcon, TableIcon } from 'lucide-react'; 
import { useToast } from '@/hooks/use-toast';
import type { GenerateCostSummaryInput, GenerateCostSummaryOutput } from '@/ai/schemas/cost-summary-schemas';
import { generateCostSummaryAction, analyzeRiskToCostCorrelationAction } from '@/lib/actions';
import type { AnalyzeRiskToCostInput, AnalyzeRiskToCostOutput } from '@/ai/schemas/risk-cost-correlation-schemas';
import { OverviewChart } from '@/components/dashboard/OverviewChart';
import { PieChartCard } from '@/components/dashboard/PieChartCard'; 
import type { ChartConfig, ChartDataPoint } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';


// Mock data for line chart
const costTrendData: ChartDataPoint[] = [
  { name: "Jan", value: 12000 },
  { name: "Feb", value: 13500 },
  { name: "Mar", value: 11000 },
  { name: "Apr", value: 14000 },
  { name: "May", value: 12500 },
  { name: "Jun", value: 15000 },
];

const costTrendChartConfig = {
  value: { label: "Spend ($)", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

// Mock data for Department Cost Breakdown Pie Chart
const departmentCostData: ChartDataPoint[] = [
  { name: "IT & Security", value: 45000 },
  { name: "Compliance Operations", value: 25000 },
  { name: "Legal & Advisory", value: 15000 },
  { name: "Risk Management Team", value: 12000 },
  { name: "Training & Development", value: 3000 },
];

const departmentCostChartConfig: ChartConfig = {
  "IT & Security": { label: "IT & Security", color: "hsl(var(--chart-1))" },
  "Compliance Operations": { label: "Compliance Ops", color: "hsl(var(--chart-2))" },
  "Legal & Advisory": { label: "Legal", color: "hsl(var(--chart-3))" },
  "Risk Management Team": { label: "Risk Team", color: "hsl(var(--chart-4))" },
  "Training & Development": { label: "Training", color: "hsl(var(--chart-5))" },
};

// Mock data for FTE Allocation Pie Chart
const fteAllocationData: ChartDataPoint[] = [
  { name: "Compliance Analysts", value: 12 },
  { name: "IT Security Specialists", value: 8 },
  { name: "Legal Counsel", value: 4 },
  { name: "Risk Managers", value: 5 },
  { name: "Audit Staff", value: 3 },
];

const fteAllocationChartConfig: ChartConfig = {
  "Compliance Analysts": { label: "Compliance Analysts", color: "hsl(var(--chart-1))" },
  "IT Security Specialists": { label: "IT Security", color: "hsl(var(--chart-2))" },
  "Legal Counsel": { label: "Legal Counsel", color: "hsl(var(--chart-3))" },
  "Risk Managers": { label: "Risk Managers", color: "hsl(var(--chart-4))" },
  "Audit Staff": { label: "Audit Staff", color: "hsl(var(--chart-5))" },
};


interface CostMetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
}

const CostMetricCard: React.FC<CostMetricCardProps> = ({ title, value, description, icon: Icon }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

interface RiskControlCostItem {
  riskId: string;
  riskDescription: string;
  associatedControls: string;
  controlCostAnnual: number;
  potentialRiskExposure: number;
  residualRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  impactArea: string;
}

const illustrativeRiskControlCostData: RiskControlCostItem[] = [
  { riskId: 'RISK-CYB-001', riskDescription: 'Unauthorized access to sensitive customer data.', associatedControls: 'CTRL-IAM-001 (MFA), CTRL-DLP-003 (Data Encryption)', controlCostAnnual: 15000, potentialRiskExposure: 500000, residualRiskLevel: 'Medium', impactArea: 'Customer Data, Reputation, IT Security' },
  { riskId: 'RISK-COMP-005', riskDescription: 'Non-compliance with MiFID II transaction reporting.', associatedControls: 'CTRL-REGREP-002 (Automated Reporting), CTRL-QA-005 (Data Validation)', controlCostAnnual: 25000, potentialRiskExposure: 1000000, residualRiskLevel: 'Low', impactArea: 'Regulatory Compliance, Trading Operations' },
  { riskId: 'RISK-OP-012', riskDescription: 'Third-party vendor failure affecting payment processing.', associatedControls: 'CTRL-TPRM-007 (Vendor Monitoring), CTRL-BCP-003 (Alternative Vendor)', controlCostAnnual: 8000, potentialRiskExposure: 250000, residualRiskLevel: 'Medium', impactArea: 'Operations, Financial Transactions' },
  { riskId: 'RISK-FIN-003', riskDescription: 'Internal fraud leading to financial loss.', associatedControls: 'CTRL-SOD-001 (Segregation of Duties), CTRL-AUDIT-002 (Regular Audits)', controlCostAnnual: 12000, potentialRiskExposure: 150000, residualRiskLevel: 'Low', impactArea: 'Financial Assets, Internal Controls' },
];


export default function CostCenterPage() {
  const { toast } = useToast();
  const [period, setPeriod] = useState<string>("This Quarter");
  const [totalSpend, setTotalSpend] = useState<number>(50000);
  const [spendChangePercentage, setSpendChangePercentage] = useState<number>(25);
  const [reasonForSpendChange, setReasonForSpendChange] = useState<string>("Increased IT investment for new control implementations and cloud security enhancements.");
  const [keyOutcome, setKeyOutcome] = useState<string>("Residual risk dropped by 15% and audit preparedness improved by 30%.");
  
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null);

  const [analysisContext, setAnalysisContext] = useState<string>("Analyze overall compliance spending against identified operational risks for the last quarter.");
  const [isLoadingCorrelation, setIsLoadingCorrelation] = useState<boolean>(false);
  const [correlationResult, setCorrelationResult] = useState<AnalyzeRiskToCostOutput | null>(null);


  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    setExecutiveSummary(null);

    if (!period || totalSpend <=0 || !reasonForSpendChange || !keyOutcome) {
        toast({
            title: "Input Incomplete",
            description: "Please fill all fields for summary generation.",
            variant: "destructive",
        });
        setIsLoadingSummary(false);
        return;
    }

    const input: GenerateCostSummaryInput = {
      period,
      totalSpend,
      spendChangePercentage,
      reasonForSpendChange,
      keyOutcome,
    };

    try {
      const result = await generateCostSummaryAction(input);
      if ('error' in result) {
        toast({ title: "AI Summary Error", description: result.error, variant: "destructive" });
      } else {
        setExecutiveSummary(result.executiveSummary);
        toast({ title: "AI Summary Generated", description: "Executive summary created successfully." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate AI summary.", variant: "destructive" });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleAnalyzeRiskToCost = async () => {
    setIsLoadingCorrelation(true);
    setCorrelationResult(null);
    if (!analysisContext.trim()) {
      toast({
        title: "Input Incomplete",
        description: "Please provide an analysis context.",
        variant: "destructive",
      });
      setIsLoadingCorrelation(false);
      return;
    }

    const input: AnalyzeRiskToCostInput = { analysisContext };
    try {
      const result = await analyzeRiskToCostCorrelationAction(input);
      if ('error' in result) {
        toast({ title: "Risk-Cost Analysis Error", description: result.error, variant: "destructive"});
      } else {
        setCorrelationResult(result);
        toast({ title: "Risk-Cost Analysis Complete", description: "Analysis generated successfully."});
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to perform risk-to-cost analysis.", variant: "destructive" });
    } finally {
      setIsLoadingCorrelation(false);
    }
  };

  const handleDownloadReport = (data: any, filename: string, format: 'json' | 'csv' = 'json') => {
    if (!data) {
        toast({ title: "No Data", description: "No data to export.", variant: "destructive"});
        return;
    }
    let fileString = '';
    let mimeType = '';
    let fileExtension = '';

    if (format === 'json') {
        fileString = JSON.stringify(data, null, 2);
        mimeType = 'text/json';
        fileExtension = 'json';
    } else if (format === 'csv') {
        if (Array.isArray(data) && data.length > 0) {
            const headers = Object.keys(data[0]).join(',');
            const rows = data.map(row => 
                Object.values(row).map(value => {
                    const strValue = String(value);
                    // Escape commas and quotes
                    if (strValue.includes(',') || strValue.includes('"')) {
                        return `"${strValue.replace(/"/g, '""')}"`;
                    }
                    return strValue;
                }).join(',')
            );
            fileString = [headers, ...rows].join('\n');
        } else {
            toast({ title: "CSV Error", description: "Data is not in a suitable format for CSV export.", variant: "destructive"});
            return;
        }
        mimeType = 'text/csv';
        fileExtension = 'csv';
    }

    const fullFilename = `${filename}.${fileExtension}`;
    const blob = new Blob([fileString], { type: `${mimeType};charset=utf-8,` });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fullFilename;
    link.click();
    URL.revokeObjectURL(link.href);
    toast({title: "Download Started", description: `${fullFilename} is being downloaded.`});
  };


  const costMetrics: CostMetricCardProps[] = [
    { title: "Total Compliance Spend (YTD)", value: "$450,800", description: "+5% from last year", icon: DollarSign },
    { title: "Cost Per Control (Avg)", value: "$530", description: "Based on 850 active controls", icon: BarChart2 },
    { title: "Budget Variance", value: "-2.5% (Under Budget)", description: "YTD comparison", icon: PieChartIcon },
    { title: "Estimated ROI on Compliance", value: "2.1x", description: "Fines avoided vs. spend", icon: TrendingUp },
  ];

  const handleDownloadChartReport = (reportName: string) => {
    toast({
      title: "Download Initiated",
      description: `Preparing to download report for "${reportName}". (Placeholder)`,
    });
  };
  
  const getRiskLevelBadgeVariant = (level: RiskControlCostItem['residualRiskLevel']): 'destructive' | 'default' | 'secondary' | 'outline' => {
    switch (level) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <DollarSign className="mr-3 h-8 w-8 text-primary" />
          Cost Center
        </h1>
        <Button variant="outline" onClick={() => window.location.reload()}>Refresh Data</Button>
      </div>

      <p className="text-lg text-muted-foreground">
        Analyze compliance-related expenditures, track budget adherence, and understand the financial impact of risk management activities.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {costMetrics.map(metric => (
          <CostMetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-6 w-6 text-primary" />
            AI-Generated Executive Summary
          </CardTitle>
          <CardDescription>
            Input key cost metrics for the period to generate an AI-powered executive summary.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="period">Period</Label>
              <Input id="period" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="e.g., This Quarter, Q3 2024" />
            </div>
            <div>
              <Label htmlFor="totalSpend">Total Spend ($)</Label>
              <Input id="totalSpend" type="number" value={totalSpend} onChange={(e) => setTotalSpend(Number(e.target.value))} placeholder="e.g., 50000" />
            </div>
            <div>
              <Label htmlFor="spendChangePercentage">Spend Change from Previous Period (%)</Label>
              <Input id="spendChangePercentage" type="number" value={spendChangePercentage} onChange={(e) => setSpendChangePercentage(Number(e.target.value))} placeholder="e.g., 25 for 25% increase" />
            </div>
          </div>
          <div>
            <Label htmlFor="reasonForSpendChange">Primary Reason for Spend Change</Label>
            <Textarea 
              id="reasonForSpendChange" 
              value={reasonForSpendChange} 
              onChange={(e) => setReasonForSpendChange(e.target.value)} 
              placeholder="e.g., IT spent 25% more due to two high-priority control implementations." 
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="keyOutcome">Key Outcome / Benefit Achieved</Label>
            <Textarea 
              id="keyOutcome" 
              value={keyOutcome} 
              onChange={(e) => setKeyOutcome(e.target.value)} 
              placeholder="e.g., Residual risk dropped by 40%." 
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button onClick={handleGenerateSummary} disabled={isLoadingSummary}>
            {isLoadingSummary ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Brain className="mr-2 h-4 w-4" />
            )}
            Generate Summary
          </Button>
          {executiveSummary && (
            <Card className="w-full bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Generated Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{executiveSummary}</p>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="mr-2 h-6 w-6 text-primary" />
            Risk-to-Cost Correlation Modeling
          </CardTitle>
          <CardDescription>
            Use AI to analyze which risks or controls lead to higher costs and identify optimization opportunities. The table below provides illustrative context.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="analysisContext">Analysis Context / Area for AI</Label>
            <Textarea
              id="analysisContext"
              value={analysisContext}
              onChange={(e) => setAnalysisContext(e.target.value)}
              placeholder="e.g., 'Analyze IT security spending vs. cybersecurity risks for Q3', 'Correlate compliance failure costs in Finance with data privacy regulations.'"
              rows={2}
              disabled={isLoadingCorrelation}
            />
          </div>
           <Button onClick={handleAnalyzeRiskToCost} disabled={isLoadingCorrelation} className="w-full sm:w-auto">
            {isLoadingCorrelation ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Brain className="mr-2 h-4 w-4" />
            )}
            Analyze Risk-to-Cost with AI
          </Button>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
                 <h3 className="text-lg font-semibold flex items-center">
                    <TableIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                    Illustrative Risk, Control & Cost Data
                </h3>
                <Button variant="outline" size="sm" onClick={() => handleDownloadReport(illustrativeRiskControlCostData, "risk_control_cost_overview", "csv")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Overview Data (CSV)
                </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk ID</TableHead>
                  <TableHead>Risk Description</TableHead>
                  <TableHead>Associated Control(s)</TableHead>
                  <TableHead className="text-right">Control Cost (Est. Annual)</TableHead>
                  <TableHead className="text-right">Potential Exposure ($)</TableHead>
                  <TableHead>Residual Risk</TableHead>
                  <TableHead>Impact Area(s)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {illustrativeRiskControlCostData.map((item) => (
                  <TableRow key={item.riskId}>
                    <TableCell className="font-medium text-xs">{item.riskId}</TableCell>
                    <TableCell className="text-xs">{item.riskDescription}</TableCell>
                    <TableCell className="text-xs">{item.associatedControls}</TableCell>
                    <TableCell className="text-right text-xs">${item.controlCostAnnual.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-xs">${item.potentialRiskExposure.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getRiskLevelBadgeVariant(item.residualRiskLevel)} className="text-xs capitalize">
                        {item.residualRiskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{item.impactArea}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {correlationResult && (
            <Card className="w-full bg-muted/50 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  AI-Driven Risk-to-Cost Analysis Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertTitle className="font-semibold">Correlation Analysis:</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap text-sm">
                    {correlationResult.correlationAnalysis}
                  </AlertDescription>
                </Alert>
                {correlationResult.identifiedDrivers && correlationResult.identifiedDrivers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Identified Cost Drivers:</h4>
                    <ul className="list-disc list-inside pl-4 text-sm space-y-0.5">
                      {correlationResult.identifiedDrivers.map((driver, idx) => <li key={`driver-${idx}`}>{driver}</li>)}
                    </ul>
                  </div>
                )}
                {correlationResult.optimizationSuggestions && correlationResult.optimizationSuggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Optimization Suggestions:</h4>
                    <ul className="list-disc list-inside pl-4 text-sm space-y-0.5">
                      {correlationResult.optimizationSuggestions.map((suggestion, idx) => <li key={`suggestion-${idx}`}>{suggestion}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                 <Button variant="outline" onClick={() => handleDownloadReport(correlationResult, "risk_cost_correlation_analysis_ai", "json")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download AI Analysis (JSON)
                </Button>
              </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cost Trend Analysis</CardTitle>
          <CardDescription>Visualize compliance spend over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <OverviewChart
            data={costTrendData}
            title="" 
            description=""
            xAxisKey="name"
            chartConfig={costTrendChartConfig}
            chartType="line"
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <PieChartCard
            data={departmentCostData}
            title="Cost Breakdown by Department"
            description="Distribution of compliance costs across departments."
            dataKey="value"
            nameKey="name"
            chartConfig={departmentCostChartConfig}
        >
          <CardFooter>
            <Button onClick={() => handleDownloadChartReport('Cost Breakdown by Department')}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardFooter>
        </PieChartCard>
        <PieChartCard
            data={fteAllocationData}
            title="Resource Allocation (FTEs)"
            description="Distribution of Full-Time Equivalents in compliance roles."
            dataKey="value"
            nameKey="name"
            chartConfig={fteAllocationChartConfig}
        >
          <CardFooter>
            <Button onClick={() => handleDownloadChartReport('Resource Allocation (FTEs)')}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardFooter>
        </PieChartCard>
      </div>
    </div>
  );
}


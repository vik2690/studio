
"use client";

import { useState, useEffect } from 'react';
import type { ReportItem, ReportVersionMetadata, ReportChange } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, GitCompareArrows, Eye, AlertTriangle, Settings, Workflow, Download, FileOutput, FileSearch } from 'lucide-react';
import Link from 'next/link';

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


export default function ReportingHubPage() {
  const [reportItems, setReportItems] = useState<ReportItem[]>(initialReportItems);
  const [selectedReportForComparison, setSelectedReportForComparison] = useState<ReportItem | null>(null);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);
  const [manualRegulationInput, setManualRegulationInput] = useState('');
  const { toast } = useToast();

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
    // Actual download logic would go here
  };

  const renderChangeValue = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value || 'N/A';
  };

  const handleManualExport = () => {
    if (!manualRegulationInput.trim()) {
      toast({ title: "Input Required", description: "Please enter a regulation name or ID.", variant: "destructive" });
      return;
    }
    toast({
      title: "Export Initiated",
      description: `Report export started for regulation: "${manualRegulationInput}". (Placeholder)`,
    });
    // Actual export logic would go here
  };

  const handleManualSummary = () => {
    if (!manualRegulationInput.trim()) {
      toast({ title: "Input Required", description: "Please enter a regulation name or ID.", variant: "destructive" });
      return;
    }
    toast({
      title: "Summary Extraction Initiated",
      description: `Summary extraction started for regulation: "${manualRegulationInput}". (Placeholder)`,
    });
    // Actual summary logic would go here
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight flex items-center">
        <FileSpreadsheet className="mr-3 h-8 w-8 text-primary" />
        Reporting Hub
      </h1>

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
            Manually export a report or extract a summary for a specific regulation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="manualRegulationInput" className="font-semibold">Regulation Name or ID</Label>
            <Input
              id="manualRegulationInput"
              type="text"
              value={manualRegulationInput}
              onChange={(e) => setManualRegulationInput(e.target.value)}
              placeholder="e.g., MiFID II Article 27, GDPR Article 30"
              className="mt-1"
            />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button onClick={handleManualExport}>
            <FileOutput className="mr-2 h-4 w-4" />
            Export Report for Regulation
          </Button>
          <Button onClick={handleManualSummary} variant="outline">
            <FileSearch className="mr-2 h-4 w-4" />
            Extract Summary for Regulation
          </Button>
        </CardFooter>
      </Card>

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


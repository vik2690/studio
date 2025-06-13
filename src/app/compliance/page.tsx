
"use client";

import * as React from 'react'; 
import { useState } from 'react';
import { suggestControlsAction } from '@/lib/actions';
import type { SuggestControlsInput, SuggestControlsOutput } from '@/ai/flows/suggest-controls';
import type { ExistingControl, AIIdentifiedRiskItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, ThumbsUp, ThumbsDown, ShieldCheck, Library, Eye, Edit3, Scale, MessageSquare, CheckCircle, AlertCircle as AlertCircleIcon, AlertTriangle as AlertTriangleIcon, HelpCircle, ListChecks, Info, FileSearch, Bot, GitBranch, Link as LinkIcon, XCircle } from 'lucide-react'; 
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ControlSuggestion {
  id: string;
  suggestion: string; 
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  similarExistingControls?: ExistingControl[];
}


const initialExistingControls: ExistingControl[] = [
  {
    id: 'CTRL-001',
    controlName: 'Quarterly Access Review',
    status: 'Active',
    riskMitigated: 'Unauthorized access to sensitive systems.',
    mappedPolicyRegulation: 'Internal Access Control Policy A-101, SOX Section 302',
    controlType: 'Detective',
    objective: 'Ensure only authorized personnel have access to critical systems and data.',
    controlCategory: 'IT General Controls',
    frequency: 'Quarterly',
    owner: 'IT Security Department',
    reviewer: 'Internal Audit',
    lastReviewedDate: '2024-06-15',
    controlMaturityLevel: 'Managed',
    effectivenessRating: 'Effective',
    residualRisk: 'Low',
    lastTestDate: '2024-05-20',
    testResult: 'Pass',
    issuesIdentified: ['Minor delay in revoking one terminated employee access.'],
    associatedRiskId: 'RISK-001',
    associatedRiskDetails: 'Potential data breach due to outdated encryption protocols on customer database.',
    latestAICheck: { status: 'Covered', date: '2024-07-28', summary: 'Control aligns with latest data privacy mandates.'}
  },
  {
    id: 'CTRL-002',
    controlName: 'Segregation of Duties - Payments',
    status: 'Active',
    riskMitigated: 'Fraudulent payment processing.',
    mappedPolicyRegulation: 'Financial Control Policy F-203',
    controlType: 'Preventive',
    objective: 'Prevent single individuals from controlling all stages of payment processing.',
    controlCategory: 'Financial Reporting',
    frequency: 'Continuous',
    owner: 'Finance Department',
    reviewer: 'Compliance Officer',
    lastReviewedDate: '2024-07-01',
    controlMaturityLevel: 'Optimized',
    effectivenessRating: 'Highly Effective',
    residualRisk: 'Low',
    lastTestDate: '2024-06-10',
    testResult: 'Pass',
    associatedRiskId: 'RISK-007',
    associatedRiskDetails: 'Risk of unauthorized financial transactions due to lack of SoD.',
    latestAICheck: { status: 'Needs Review', date: '2024-07-25', summary: 'New VASP regulations might impact payment SoD.'}
  },
  {
    id: 'CTRL-003',
    controlName: 'GDPR Data Deletion Process',
    status: 'Under Review',
    riskMitigated: 'Non-compliance with data subject deletion requests.',
    mappedPolicyRegulation: 'GDPR Article 17',
    controlType: 'Corrective',
    objective: 'Ensure timely and complete deletion of personal data upon valid request.',
    controlCategory: 'Data Privacy',
    frequency: 'Event-driven',
    owner: 'Data Protection Officer',
    reviewer: 'Legal Department',
    controlMaturityLevel: 'Developing',
    effectivenessRating: 'Partially Effective',
    residualRisk: 'Medium',
    lastTestDate: '2024-07-05',
    testResult: 'Pass with Exceptions',
    issuesIdentified: ['Process not fully automated for all systems.', 'Average deletion time slightly above target.'],
    associatedRiskId: 'RISK-009',
    associatedRiskDetails: 'Failure to comply with GDPR data subject rights leading to potential fines.',
    latestAICheck: { status: 'Gap Identified', date: '2024-07-20', summary: 'Automated deletion not covering new marketing database.'}
  },
  {
    id: 'CTRL-004',
    controlName: 'Daily System Backup Verification',
    status: 'Active',
    riskMitigated: 'Data loss due to system failure or corruption.',
    mappedPolicyRegulation: 'IT DR/BCP Policy IT-305',
    controlType: 'Detective',
    objective: 'Verify successful completion and integrity of daily system backups.',
    controlCategory: 'Operational',
    frequency: 'Daily',
    owner: 'IT Operations',
    reviewer: 'IT Manager',
    lastReviewedDate: 'N/A - Daily Check',
    controlMaturityLevel: 'Managed',
    effectivenessRating: 'Effective',
    residualRisk: 'Low',
    lastTestDate: 'Daily',
    testResult: 'Pass',
    associatedRiskId: 'RISK-012',
    associatedRiskDetails: 'System outages leading to data loss if backups are not reliable.',
    latestAICheck: { status: 'Not Assessed', date: 'N/A'}
  },
];

function findSimilarExistingControls(suggestionText: string, existingControls: ExistingControl[]): ExistingControl[] {
  const suggestionKeywords = suggestionText.toLowerCase().split(/\s+/).filter(kw => kw.length > 3 && !['the', 'and', 'for', 'with', 'should'].includes(kw));
  if (suggestionKeywords.length === 0) return [];

  const matchedControls: ExistingControl[] = [];
  existingControls.forEach(ec => {
    const controlText = `${ec.controlName} ${ec.objective} ${ec.riskMitigated} ${ec.controlCategory}`.toLowerCase();
    let matchScore = 0;
    suggestionKeywords.forEach(kw => {
      if (controlText.includes(kw)) {
        matchScore++;
      }
    });
    if (matchScore > 1 || (suggestionKeywords.length <= 2 && matchScore > 0) ) {
      const specificKeywords = ["access review", "data deletion", "backup", "segregation of duties", "payment", "encryption", "mfa", "dlp", "vulnerability scan", "incident response"];
      const hasSpecificKeyword = specificKeywords.some(skw => suggestionText.toLowerCase().includes(skw) && controlText.includes(skw));
      if (hasSpecificKeyword || matchScore > 2) {
         matchedControls.push(ec);
      }
    }
  });
  return matchedControls.slice(0, 3); // Return top 3 matches
}

const initialAiIdentifiedRisks: AIIdentifiedRiskItem[] = [
  {
    id: 'AIRISK-001',
    riskDescription: 'Emerging risk of AI-driven social engineering attacks targeting finance department for unauthorized fund transfers.',
    aiSuggestedControls: ['Implement multi-factor authentication for all fund transfer approvals.', 'Conduct mandatory advanced phishing awareness training focused on AI deepfakes.', 'Deploy AI-based email filtering to detect sophisticated spear-phishing attempts.'],
    impactArea: 'Financial Assets, Cybersecurity, Operations',
    dateIdentified: '2024-07-28',
    status: 'New',
    aiConfidence: 85,
    source: 'Risk Sentinel Agent',
    similarExistingControlIds: ['CTRL-001', 'CTRL-002'],
    proposedEffectiveDate: '2024-09-01',
    aiJustification: 'Based on recent threat intelligence reports and an increase in similar attacks in the financial sector. Existing MFA (CTRL-001) is good but needs to be explicitly tied to fund transfer approvals. SoD (CTRL-002) is also relevant for financial process integrity.'
  },
  {
    id: 'AIRISK-002',
    riskDescription: 'Gap in compliance with new ESMA guidelines on algorithmic trading transparency (Directive XYZ-2024).',
    aiSuggestedControls: ['Update algorithmic trading system logging to capture all ESMA-required data points.', 'Develop a pre-trade transparency module for client-facing algorithms.', 'Establish a quarterly review process for algo trading compliance.'],
    impactArea: 'Regulatory Compliance, Trading Operations',
    dateIdentified: '2024-07-22',
    status: 'Under Review',
    aiConfidence: 92,
    source: 'Compliance Watchdog Agent',
    similarExistingControlIds: [], // No direct existing similar control found
    proposedEffectiveDate: '2024-10-15',
    aiJustification: 'New ESMA directive XYZ-2024 published last week mandates specific logging and transparency. Current systems lack these capabilities.'
  },
  {
    id: 'AIRISK-003',
    riskDescription: 'Increased risk of data exfiltration through unsanctioned use of generative AI tools by employees for sensitive document summarization.',
    aiSuggestedControls: ['Implement Data Loss Prevention (DLP) rules for generative AI platforms.', 'Establish an approved list of generative AI tools and usage policy.', 'Provide training on secure use of AI for productivity tasks.'],
    impactArea: 'Data Security, Intellectual Property, Compliance (GDPR)',
    dateIdentified: '2024-07-15',
    status: 'Action Planned',
    aiConfidence: 78,
    source: 'Internal Data Usage Monitor',
    similarExistingControlIds: ['CTRL-003'], 
    proposedEffectiveDate: '2024-08-20',
    aiJustification: 'Analysis of network traffic shows increased usage of non-approved AI tools with sensitive data patterns. Existing GDPR controls (CTRL-003) need extension to cover AI data processing.'
  },
  {
    id: 'AIRISK-004',
    riskDescription: 'New vulnerability identified in core banking system (CBS-VendorPatch-July24) requiring immediate attention.',
    aiSuggestedControls: ['Apply vendor patch immediately across all CBS instances.', 'Perform post-patch vulnerability scan.', 'Monitor system logs for anomalous activity post-patch.'],
    impactArea: 'IT Systems, Financial Data Integrity, Operations',
    dateIdentified: '2024-08-01',
    status: 'New',
    aiConfidence: 99,
    source: 'Threat Intel Feed',
    similarExistingControlIds: undefined, // Simulating no controls identified
    proposedEffectiveDate: '2024-08-02',
    aiJustification: 'Critical vulnerability (CVE-2024-XXXXX) reported by vendor with high exploitability. Immediate patching is crucial.'
  },
];


export default function ComplianceHubPage() {
  const [riskGapReport, setRiskGapReport] = useState('');
  const [currentPolicies, setCurrentPolicies] = useState('');
  const [aiResult, setAiResult] = useState<SuggestControlsOutput | null>(null);
  const [suggestedControls, setSuggestedControls] = useState<ControlSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [existingControlsList, setExistingControlsList] = useState<ExistingControl[]>(initialExistingControls);
  const [selectedControlDetail, setSelectedControlDetail] = useState<ExistingControl | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [aiIdentifiedRiskItems, setAiIdentifiedRiskItems] = useState<AIIdentifiedRiskItem[]>(initialAiIdentifiedRisks);
  const [selectedAiRiskItem, setSelectedAiRiskItem] = useState<AIIdentifiedRiskItem | null>(null);
  const [isAiRiskDetailDialogOpen, setIsAiRiskDetailDialogOpen] = useState(false);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!riskGapReport.trim() || !currentPolicies.trim()) {
      toast({ title: "Input Error", description: "Both risk gap report and current policies are required.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setAiResult(null);
    setSuggestedControls([]);

    try {
      const input: SuggestControlsInput = { 
        riskGapAnalysisReport: riskGapReport,
        currentPolicies: currentPolicies
      };
      const result = await suggestControlsAction(input);
      
      if ('error' in result) {
        toast({ title: "AI Error", description: result.error, variant: "destructive" });
      } else {
        setAiResult(result);
        const controlsArray = result.suggestedControls
            .split('\n')
            .map(line => line.replace(/^-|^\*|^\d+\.\s*/, '').trim()) 
            .filter(line => line.length > 0);
        
        const processedSuggestions = controlsArray.map((controlText, index) => {
          const similar = findSimilarExistingControls(controlText, existingControlsList);
          return {
            id: `ai-control-${Date.now()}-${index}`,
            suggestion: controlText,
            status: 'pending' as ControlSuggestion['status'],
            similarExistingControls: similar,
          };
        });
        setSuggestedControls(processedSuggestions);
        toast({ title: "Analysis Complete", description: "Control suggestions generated. Results are displayed at the top of the page." });
      }
    } catch (e) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleControlValidation = (id: string, newStatus: ControlSuggestion['status']) => {
    setSuggestedControls(prevControls => 
      prevControls.map(control => 
        control.id === id ? { ...control, status: newStatus } : control
      )
    );
    toast({ title: "Control Updated", description: `Suggested control ${id.slice(-6)} status set to ${newStatus}.` });
  };

  const handleViewControlDetails = (control: ExistingControl) => {
    setSelectedControlDetail(control);
    setIsDetailDialogOpen(true);
  };
  
  const handleViewAiRiskDetails = (riskItem: AIIdentifiedRiskItem) => {
    setSelectedAiRiskItem(riskItem);
    setIsAiRiskDetailDialogOpen(true);
  };

  const handleAiRiskItemStatusChange = (riskId: string, newStatus: AIIdentifiedRiskItem['status']) => {
    setAiIdentifiedRiskItems(prev => prev.map(item => item.id === riskId ? {...item, status: newStatus} : item));
    toast({ title: "Risk Status Updated", description: `Status for risk ${riskId} changed to ${newStatus}.` });
  };

  const handleManualUpdate = (controlId: string | undefined) => {
    if (!controlId) return;
    toast({
      title: 'Manual Update',
      description: `Manual update process initiated for control ${controlId}. (Placeholder)`,
    });
  };

  const handleReassessRisk = (controlId: string | undefined) => {
    if (!controlId) return;
    toast({
      title: 'Reassess Risk',
      description: `Risk reassessment initiated for control ${controlId}. (Placeholder)`,
    });
  };

  const handleInitiateDiscussion = (controlId: string | undefined) => {
    if (!controlId) return;
    toast({
      title: 'Initiate Discussion',
      description: `Discussion thread created for control ${controlId}. (Placeholder)`,
    });
  };

  const getAICheckBadgeVariant = (status?: ExistingControl['latestAICheck']['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (!status) return 'outline';
    switch (status) {
      case 'Covered': return 'secondary'; 
      case 'Needs Review': return 'default'; 
      case 'Gap Identified': return 'destructive'; 
      case 'Not Assessed': return 'outline'; 
      default: return 'outline';
    }
  };

  const getAICheckBadgeClassName = (status?: ExistingControl['latestAICheck']['status']): string => {
    if (!status) return 'text-muted-foreground';
    switch (status) {
      case 'Covered': return 'bg-green-100 text-green-700 dark:bg-green-700/80 dark:text-green-100 border-green-300 dark:border-green-600';
      case 'Needs Review': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/80 dark:text-yellow-100 border-yellow-300 dark:border-yellow-600';
      case 'Gap Identified': return 'bg-red-100 text-red-700 dark:bg-red-700/80 dark:text-red-100 border-red-300 dark:border-red-600';
      case 'Not Assessed': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };
  
  const getAICheckIcon = (status?: ExistingControl['latestAICheck']['status']): React.ElementType => {
    if (!status) return HelpCircle;
    switch (status) {
      case 'Covered': return CheckCircle;
      case 'Needs Review': return AlertCircleIcon;
      case 'Gap Identified': return AlertTriangleIcon;
      case 'Not Assessed': return HelpCircle;
      default: return HelpCircle;
    }
  }

  const getAIRiskStatusBadgeVariant = (status: AIIdentifiedRiskItem['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'New': return 'default'; 
      case 'Under Review': return 'secondary';
      case 'Action Planned': return 'default'; 
      case 'Implemented': return 'outline'; 
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };
   const getAIRiskStatusBadgeClass = (status: AIIdentifiedRiskItem['status']): string => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-700/80 dark:text-blue-100 border-blue-300 dark:border-blue-600';
      case 'Under Review': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/80 dark:text-yellow-100 border-yellow-300 dark:border-yellow-600';
      case 'Action Planned': return 'bg-purple-100 text-purple-700 dark:bg-purple-700/80 dark:text-purple-100 border-purple-300 dark:border-purple-600';
      case 'Implemented': return 'bg-green-100 text-green-700 dark:bg-green-700/80 dark:text-green-100 border-green-300 dark:border-green-600';
      case 'Rejected': return ''; 
      default: return 'text-muted-foreground';
    }
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Control Hub</h1>

      {aiResult && suggestedControls.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSearch className="mr-2 h-6 w-6 text-primary" />
              AI Analysis: Suggested Controls for Identified Risk Gaps
            </CardTitle>
            <Alert>
              <AlertTitle className="font-semibold">Overall Justification from AI:</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                {aiResult.justification}
              </AlertDescription>
            </Alert>
            <CardDescription className="pt-2">
              The table below lists AI-suggested controls based on your input (via the form below). Each suggestion includes an analysis against your existing controls library.
              Identified risks and impact areas are derived from the "Risk Gap Analysis Report" you provided.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[600px] w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[250px]">AI Suggested Control</TableHead>
                    <TableHead className="min-w-[300px]">Analysis of Similar Existing Controls</TableHead>
                    <TableHead>Validation Status</TableHead>
                    <TableHead className="min-w-[250px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestedControls.map(control => (
                    <TableRow key={control.id}>
                      <TableCell className="text-sm align-top">{control.suggestion}</TableCell>
                      <TableCell className="align-top">
                        {control.similarExistingControls && control.similarExistingControls.length > 0 ? (
                          <div className="space-y-2">
                            {control.similarExistingControls.map(ec => (
                              <div key={ec.id} className="text-xs p-2 rounded-md border bg-background/70 shadow-sm">
                                <p><strong>ID:</strong> {ec.id} - <strong>Name:</strong> {ec.controlName}</p>
                                <p><strong>Area:</strong> {ec.owner} ({ec.controlCategory})</p>
                                <p><strong>Status:</strong> <Badge variant="outline" className="text-xs h-auto py-0.5 px-1.5">{ec.status}</Badge></p>
                                <p className="mt-0.5"><em>Mitigates: {ec.riskMitigated}</em></p>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-1 text-primary hover:text-primary/80" onClick={() => handleViewControlDetails(ec)}>
                                  View Full Details <Eye className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-700/20 dark:border-blue-600 dark:text-blue-300 whitespace-normal">
                            <Info className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                            No highly similar existing controls found by preliminary check. Manual review recommended.
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={
                          control.status === 'approved' ? 'default' :
                          control.status === 'rejected' ? 'destructive' :
                          control.status === 'implemented' ? 'secondary' :
                          'outline'
                        }
                        className={
                          control.status === 'approved' ? 'bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-500/50' :
                          control.status === 'implemented' ? 'bg-blue-500/20 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border-blue-500/50' : 
                          control.status === 'rejected' ? '' :
                          'text-muted-foreground' 
                        }
                        >
                          {control.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top space-y-2">
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleControlValidation(control.id, 'approved')} disabled={control.status === 'approved' || control.status === 'implemented'}>
                            <ThumbsUp className="mr-1 h-4 w-4" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleControlValidation(control.id, 'rejected')} disabled={control.status === 'rejected'}>
                            <ThumbsDown className="mr-1 h-4 w-4" /> Reject
                            </Button>
                            <Button size="sm" variant="default" onClick={() => handleControlValidation(control.id, 'implemented')} disabled={control.status !== 'approved'}>
                            Mark Implemented
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-6 w-6 text-primary" />
            AI-Driven Risk Mitigation Dashboard
          </CardTitle>
          <CardDescription>
            Proactively identified risks by AI agents, their suggested mitigation controls, and relevant existing organizational controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[600px] w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk ID</TableHead>
                  <TableHead className="min-w-[250px]">Identified Risk Description</TableHead>
                  <TableHead className="min-w-[250px]">AI Suggested Control(s)</TableHead>
                  <TableHead className="min-w-[200px]">Existing Similar Controls</TableHead>
                  <TableHead>Impact Area(s)</TableHead>
                  <TableHead>Date Identified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aiIdentifiedRiskItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No AI-identified risks at the moment.
                    </TableCell>
                  </TableRow>
                ) : (
                  aiIdentifiedRiskItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-xs">{item.id}</TableCell>
                      <TableCell className="text-xs">{item.riskDescription}</TableCell>
                      <TableCell className="text-xs">
                        <ul className="list-disc list-inside space-y-0.5">
                          {item.aiSuggestedControls.map((ctrl, idx) => <li key={idx}>{ctrl}</li>)}
                        </ul>
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.similarExistingControlIds && item.similarExistingControlIds.length > 0 ? (
                          <div className="flex flex-col space-y-1">
                            {item.similarExistingControlIds.slice(0,2).map(id => {
                                const control = existingControlsList.find(ec => ec.id === id);
                                return control ? <Badge key={id} variant="secondary" className="whitespace-normal h-auto py-0.5">{control.id} - {control.controlName.substring(0,20)}...</Badge> : null;
                            })}
                            {item.similarExistingControlIds.length > 2 && (
                                 <Badge variant="outline" className="text-xs">+{item.similarExistingControlIds.length - 2} more</Badge>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-orange-50 border-orange-300 text-orange-600 dark:bg-orange-700/20 dark:border-orange-500 dark:text-orange-300">
                            None identified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{item.impactArea}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{item.dateIdentified}</TableCell>
                      <TableCell>
                        <Badge variant={getAIRiskStatusBadgeVariant(item.status)} className={getAIRiskStatusBadgeClass(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleViewAiRiskDetails(item)}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Library className="mr-2 h-6 w-6 text-primary" />
            Existing Controls Library
          </CardTitle>
          <CardDescription>
            A comprehensive list of currently implemented compliance controls within the organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[600px] w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Mitigated</TableHead>
                  <TableHead>Policy/Regulation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Last Reviewed</TableHead>
                  <TableHead>Risk ID</TableHead>
                  <TableHead>Risk Details</TableHead>
                  <TableHead>Latest AI Check</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingControlsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={15} className="h-24 text-center">
                      No existing controls found.
                    </TableCell>
                  </TableRow>
                ) : (
                  existingControlsList.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell className="font-medium text-xs">{control.id}</TableCell>
                      <TableCell className="font-medium text-xs min-w-[150px]">{control.controlName}</TableCell>
                      <TableCell>
                        <Badge variant={
                          control.status === 'Active' ? 'secondary' :
                          control.status === 'Inactive' ? 'outline' :
                          control.status === 'Draft' ? 'outline' :
                          control.status === 'Under Review' ? 'default' : 
                          'secondary'
                        }
                        className={
                          control.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-700/80 dark:text-green-100 border-green-300 dark:border-green-600' :
                          control.status === 'Inactive' ? 'text-muted-foreground' :
                          control.status === 'Under Review' ? 'border-primary/50 text-primary-foreground' : ''
                        }
                        >
                          {control.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs min-w-[200px]">{control.riskMitigated}</TableCell>
                      <TableCell className="text-xs min-w-[150px]">{control.mappedPolicyRegulation}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{control.controlType}</Badge></TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs whitespace-nowrap">{control.controlCategory}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{control.frequency}</Badge></TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{control.owner}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{control.reviewer}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{control.lastReviewedDate || 'N/A'}</TableCell>
                      <TableCell className="text-xs">{control.associatedRiskId || 'N/A'}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate" title={control.associatedRiskDetails || 'N/A'}>{control.associatedRiskDetails || 'N/A'}</TableCell>
                      <TableCell>
                        {control.latestAICheck ? (
                          <div className="flex flex-col items-start text-xs whitespace-nowrap">
                             <Badge 
                              variant={getAICheckBadgeVariant(control.latestAICheck.status)}
                              className={`${getAICheckBadgeClassName(control.latestAICheck.status)} flex items-center gap-1`}
                            >
                              {React.createElement(getAICheckIcon(control.latestAICheck.status), { className: "h-3 w-3" })}
                              {control.latestAICheck.status}
                            </Badge>
                            <span className="text-muted-foreground mt-1">{control.latestAICheck.date}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleViewControlDetails(control)}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
            Analyze Compliance Gaps &amp; Suggest Controls
          </CardTitle>
          <CardDescription>
            Provide your risk gap analysis report (which outlines identified risks/gaps and impact areas) and current policies to receive AI-powered control suggestions. Results will appear in a table at the top of this page.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="riskGapReport" className="text-base font-semibold">Risk Gap Analysis Report</Label>
              <Textarea
                id="riskGapReport"
                value={riskGapReport}
                onChange={(e) => setRiskGapReport(e.target.value)}
                placeholder="Paste the detailed report on compliance shortfalls and weaknesses..."
                className="min-h-[150px] mt-1 text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="currentPolicies" className="text-base font-semibold">Current Policies</Label>
              <Textarea
                id="currentPolicies"
                value={currentPolicies}
                onChange={(e) => setCurrentPolicies(e.target.value)}
                placeholder="Paste the text of your current relevant policies..."
                className="min-h-[150px] mt-1 text-sm"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Get Control Suggestions
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Dialog for Existing Control Details */}
      {selectedControlDetail && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{selectedControlDetail.controlName} (ID: {selectedControlDetail.id})</DialogTitle>
              <DialogDescription>
                Detailed information for the selected control.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-2">
            <div className="grid gap-3 py-4 text-sm">
              <div className="grid grid-cols-[1fr_2fr] items-center gap-2">
                <span className="font-semibold text-muted-foreground">Maturity Level:</span>
                <span>{selectedControlDetail.controlMaturityLevel || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] items-center gap-2">
                <span className="font-semibold text-muted-foreground">Effectiveness:</span>
                <span>{selectedControlDetail.effectivenessRating || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] items-center gap-2">
                <span className="font-semibold text-muted-foreground">Residual Risk:</span>
                <span>{selectedControlDetail.residualRisk || 'N/A'}</span>
              </div>
               <div className="grid grid-cols-[1fr_2fr] items-center gap-2">
                <span className="font-semibold text-muted-foreground">Last Test Date:</span>
                <span>{selectedControlDetail.lastTestDate || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] items-center gap-2">
                <span className="font-semibold text-muted-foreground">Test Result:</span>
                <Badge variant={
                    selectedControlDetail.testResult === 'Pass' ? 'secondary' :
                    selectedControlDetail.testResult === 'Fail' ? 'destructive' :
                    selectedControlDetail.testResult === 'Pass with Exceptions' ? 'default' :
                    'outline'
                } 
                className={
                    selectedControlDetail.testResult === 'Pass' ? 'bg-green-100 text-green-700 dark:bg-green-700/80 dark:text-green-100 border-green-300 dark:border-green-600 w-fit' :
                    selectedControlDetail.testResult === 'Pass with Exceptions' ? 'border-primary/50 text-primary-foreground w-fit' : 
                    selectedControlDetail.testResult === 'Fail' ? 'w-fit' : 'w-fit'
                }>
                    {selectedControlDetail.testResult || 'N/A'}
                </Badge>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Issues Identified:</span>
                {selectedControlDetail.issuesIdentified && selectedControlDetail.issuesIdentified.length > 0 ? (
                  <ul className="list-disc list-inside pl-4 mt-1">
                    {selectedControlDetail.issuesIdentified.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <span> N/A</span>
                )}
              </div>
              {selectedControlDetail.latestAICheck && (
                 <div className="mt-2">
                  <span className="font-semibold text-muted-foreground">Latest AI Check:</span>
                  <div className="flex flex-col items-start mt-1">
                    <Badge 
                        variant={getAICheckBadgeVariant(selectedControlDetail.latestAICheck.status)}
                        className={`${getAICheckBadgeClassName(selectedControlDetail.latestAICheck.status)} flex items-center gap-1 text-xs`}
                    >
                        {React.createElement(getAICheckIcon(selectedControlDetail.latestAICheck.status), { className: "h-3 w-3" })}
                        {selectedControlDetail.latestAICheck.status}
                    </Badge>
                    <span className="text-muted-foreground text-xs mt-1">{selectedControlDetail.latestAICheck.date}</span>
                    {selectedControlDetail.latestAICheck.summary && (
                        <p className="text-xs mt-1 italic">{selectedControlDetail.latestAICheck.summary}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            </ScrollArea>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => handleManualUpdate(selectedControlDetail?.id)}>
                <Edit3 className="mr-2 h-4 w-4" /> Manual Update
              </Button>
              <Button variant="outline" onClick={() => handleReassessRisk(selectedControlDetail?.id)}>
                <Scale className="mr-2 h-4 w-4" /> Reassess Risk
              </Button>
              <Button variant="outline" onClick={() => handleInitiateDiscussion(selectedControlDetail?.id)}>
                <MessageSquare className="mr-2 h-4 w-4" /> Initiate Discussion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog for AI Identified Risk Details */}
      {selectedAiRiskItem && (
        <Dialog open={isAiRiskDetailDialogOpen} onOpenChange={setIsAiRiskDetailDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>AI Identified Risk: {selectedAiRiskItem.id}</DialogTitle>
              <DialogDescription>
                Detailed view of the AI-identified risk and suggested mitigations.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-2">
              <div className="space-y-4 py-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Risk Description:</h4>
                  <p className="text-muted-foreground">{selectedAiRiskItem.riskDescription}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-1">AI Suggested Controls:</h4>
                  <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                    {selectedAiRiskItem.aiSuggestedControls.map((ctrl, idx) => <li key={idx}>{ctrl}</li>)}
                  </ul>
                </div>
                 {selectedAiRiskItem.aiJustification && (
                  <div>
                    <h4 className="font-semibold mb-1">AI Justification for Suggestions:</h4>
                    <p className="text-muted-foreground italic text-xs bg-muted/50 p-2 rounded-md">{selectedAiRiskItem.aiJustification}</p>
                  </div>
                )}
                <Separator />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <h4 className="font-semibold">Impact Area(s):</h4>
                    <p className="text-muted-foreground">{selectedAiRiskItem.impactArea}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Date Identified:</h4>
                    <p className="text-muted-foreground">{selectedAiRiskItem.dateIdentified}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Current Status:</h4>
                     <Badge variant={getAIRiskStatusBadgeVariant(selectedAiRiskItem.status)} className={getAIRiskStatusBadgeClass(selectedAiRiskItem.status)}>
                        {selectedAiRiskItem.status}
                     </Badge>
                  </div>
                  {selectedAiRiskItem.proposedEffectiveDate && (
                    <div>
                      <h4 className="font-semibold">Proposed Effective Date:</h4>
                      <p className="text-muted-foreground">{selectedAiRiskItem.proposedEffectiveDate}</p>
                    </div>
                  )}
                  {selectedAiRiskItem.aiConfidence !== undefined && (
                     <div>
                      <h4 className="font-semibold">AI Confidence:</h4>
                      <p className="text-muted-foreground">{selectedAiRiskItem.aiConfidence}%</p>
                    </div>
                  )}
                  {selectedAiRiskItem.source && (
                     <div>
                      <h4 className="font-semibold">Source:</h4>
                      <p className="text-muted-foreground">{selectedAiRiskItem.source}</p>
                    </div>
                  )}
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Similar Existing Controls to Consider:</h4>
                  {selectedAiRiskItem.similarExistingControlIds && selectedAiRiskItem.similarExistingControlIds.length > 0 ? (
                    <div className="space-y-2">
                      {selectedAiRiskItem.similarExistingControlIds.map(id => {
                        const control = existingControlsList.find(ec => ec.id === id);
                        return control ? (
                          <Card key={id} className="bg-background/50 text-xs p-3 shadow-sm">
                            <CardTitle className="text-sm mb-1">{control.controlName} (ID: {control.id})</CardTitle>
                            <p><strong>Status:</strong> {control.status}</p>
                            <p><strong>Objective:</strong> {control.objective}</p>
                             <p><strong>Category:</strong> {control.controlCategory}</p>
                            <Button variant="link" size="sm" className="h-auto p-0 mt-1" onClick={() => { setIsAiRiskDetailDialogOpen(false); handleViewControlDetails(control);}}>
                              View Full Details of this Existing Control <Eye className="ml-1 h-3 w-3"/>
                            </Button>
                          </Card>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No specific existing controls were pre-identified as highly similar by AI. Manual review against library recommended.</p>
                  )}
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => { 
                  handleAiRiskItemStatusChange(selectedAiRiskItem.id, 'Action Planned'); 
                  toast({title: "Action Planned", description: "Mitigation planning process initiated."});
                }}
                disabled={selectedAiRiskItem.status === 'Action Planned' || selectedAiRiskItem.status === 'Implemented' }
              >
                <GitBranch className="mr-2 h-4 w-4" /> Plan Mitigation
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast({title: "Placeholder", description: "Functionality to link to existing control."})}>
                <LinkIcon className="mr-2 h-4 w-4" /> Link to Existing
              </Button>
              <Button variant="destructive" size="sm" onClick={() => {
                  handleAiRiskItemStatusChange(selectedAiRiskItem.id, 'Rejected');
                  toast({title: "Suggestion Rejected", description: "AI suggestion marked as rejected."});
                }}
                 disabled={selectedAiRiskItem.status === 'Rejected' || selectedAiRiskItem.status === 'Implemented'}
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject Suggestion
              </Button>
              <DialogClose asChild><Button type="button" size="sm">Close</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

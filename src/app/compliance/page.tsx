
"use client";

import * as React from 'react'; 
import { useState } from 'react';
import { suggestControlsAction } from '@/lib/actions';
import type { SuggestControlsInput, SuggestControlsOutput } from '@/ai/flows/suggest-controls';
import type { ControlSuggestion, ExistingControl } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, ThumbsUp, ThumbsDown, ShieldCheck, Library, Eye, Edit3, Scale, MessageSquare, CheckCircle, AlertCircle as AlertCircleIcon, AlertTriangle as AlertTriangleIcon, HelpCircle } from 'lucide-react'; 
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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


export default function ComplianceHubPage() {
  const [riskGapReport, setRiskGapReport] = useState('');
  const [currentPolicies, setCurrentPolicies] = useState('');
  const [aiResult, setAiResult] = useState<SuggestControlsOutput | null>(null);
  const [suggestedControls, setSuggestedControls] = useState<ControlSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [existingControlsList] = useState<ExistingControl[]>(initialExistingControls);
  const [selectedControlDetail, setSelectedControlDetail] = useState<ExistingControl | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);


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
        const controlsArray = result.suggestedControls.split('\n').filter(line => line.trim() !== '');
        setSuggestedControls(controlsArray.map((controlText, index) => ({
          id: `control-${Date.now()}-${index}`,
          suggestion: controlText,
          justification: result.justification,
          status: 'pending',
        })));
        toast({ title: "Analysis Complete", description: "Control suggestions generated." });
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
    toast({ title: "Control Updated", description: `Control ${id} status set to ${newStatus}.` });
  };

  const handleViewControlDetails = (control: ExistingControl) => {
    setSelectedControlDetail(control);
    setIsDetailDialogOpen(true);
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


  return (
    <div className="space-y-8">
      
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
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
            Analyze Compliance Gaps & Suggest Controls
          </CardTitle>
          <CardDescription>
            Provide your risk gap analysis report and current policies to receive AI-powered control suggestions.
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

      {aiResult && suggestedControls.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-6 w-6 text-primary" />
              AI-Generated Control Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle className="font-semibold">Overall Justification:</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                {aiResult.justification}
              </AlertDescription>
            </Alert>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Suggested Controls for Review:</h3>
            {suggestedControls.map(control => (
              <Card key={control.id} className="bg-muted/50 p-4">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">{control.suggestion}</p>
                  <Badge variant={
                    control.status === 'approved' ? 'default' :
                    control.status === 'rejected' ? 'destructive' :
                    control.status === 'implemented' ? 'secondary' :
                    'outline'
                  }
                  className={
                    control.status === 'approved' ? 'bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-500/50' :
                    control.status === 'implemented' ? 'bg-blue-500/20 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border-blue-500/50' : ''
                  }
                  >
                    {control.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-3 flex space-x-2">
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
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedControlDetail && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{selectedControlDetail.controlName} (ID: {selectedControlDetail.id})</DialogTitle>
              <DialogDescription>
                Detailed information for the selected control.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
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
    </div>
  );
}

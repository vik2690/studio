
"use client";

import { useState } from 'react';
import { suggestControlsAction } from '@/lib/actions';
import type { SuggestControlsInput, SuggestControlsOutput } from '@/ai/flows/suggest-controls';
import type { ControlSuggestion, ExistingControl } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, ThumbsUp, ThumbsDown, ShieldCheck, Library, Eye } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Compliance & Controls Hub</h1>
      
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
                <TableHead>Objective</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Last Reviewed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingControlsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="h-24 text-center">
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
                        control.status === 'Under Review' ? 'default' : // default uses primary color
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
                    <TableCell className="text-xs min-w-[200px]">{control.objective}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs whitespace-nowrap">{control.controlCategory}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{control.frequency}</Badge></TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{control.owner}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{control.reviewer}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{control.lastReviewedDate || 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => toast({title: "View Details", description: `Viewing details for ${control.controlName}`})}>
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

    </div>
  );
}

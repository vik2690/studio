
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { suggestControlOptimizationAction } from '@/lib/actions';
import type { ControlOptimizationInput, ControlOptimizationOutput, SimilarControl } from '@/ai/schemas/control-optimization-schemas';
import type { TargetRiskDetails, SimilarControlForOptimization } from '@/lib/types';
import { ArrowLeft, Brain, Check, Sparkles, Lightbulb, Loader2 } from 'lucide-react';

// Mock data - in a real app, this would be fetched based on riskId
const MOCK_RISK_DATA_LOOKUP: Record<string, TargetRiskDetails> = {
  "RISK-CYB-001": {
    id: "RISK-CYB-001",
    description: "Unauthorized access to sensitive customer data due to weak or compromised user credentials and lack of multi-factor authentication on critical systems.",
    implementedControl: { name: "CTRL-IAM-001 (MFA)", description: "Mandatory Multi-Factor Authentication for all admin access to systems holding PII.", cost: 15000 }
  },
  "RISK-COMP-005": {
    id: "RISK-COMP-005",
    description: "Failure to accurately report all required transaction types under MiFID II leading to potential regulatory fines and reputational damage.",
    implementedControl: { name: "CTRL-REGREP-002 (Automated Reporting)", description: "Automated system for MiFID II transaction reporting with daily reconciliation checks.", cost: 25000 }
  },
  "RISK-OP-012": {
    id: "RISK-OP-012",
    description: "Significant operational disruption if the primary third-party payment processor experiences an extended outage.",
    implementedControl: { name: "CTRL-TPRM-007 (Vendor Monitoring)", description: "Continuous monitoring of primary payment processor's uptime and SLA compliance.", cost: 8000 }
  },
  "RISK-FIN-003": {
    id: "RISK-FIN-003",
    description: "Risk of internal fraud through unauthorized payment initiation and approval by a single individual.",
    implementedControl: { name: "CTRL-SOD-001 (Segregation of Duties)", description: "Segregation of duties for payment initiation and approval processes.", cost: 12000 }
  },
};

const MOCK_SIMILAR_CONTROLS_LOOKUP: Record<string, SimilarControlForOptimization[]> = {
  "RISK-CYB-001": [
    { id: "SC-001", name: "Annual Security Awareness Training", description: "Company-wide training on phishing, password hygiene, and social engineering.", relevancePercentage: 70, estimatedCost: 5000, selected: false },
    { id: "SC-002", name: "Centralized Password Manager Policy", description: "Mandate use of approved password manager with complexity enforcement.", relevancePercentage: 60, estimatedCost: 2000, selected: false },
    { id: "SC-003", name: "Privileged Access Management (PAM) Solution", description: "Full PAM solution for session recording and vaulting of critical credentials.", relevancePercentage: 90, estimatedCost: 30000, selected: false },
  ],
  "RISK-COMP-005": [
    { id: "SC-004", name: "Independent  Pre-Submission Data Validation", description: "Third-party service to validate transaction report data prior to submission.", relevancePercentage: 80, estimatedCost: 12000, selected: false },
    { id: "SC-005", name: "Enhanced Staff Training on Reporting Fields", description: "Detailed training for operations staff on correct data input for MiFID II fields.", relevancePercentage: 65, estimatedCost: 4000, selected: false },
  ],
   "RISK-OP-012": [
    { id: "SC-006", name: "Secondary Payment Processor Integration", description: "Standby integration with an alternative payment processor for failover.", relevancePercentage: 85, estimatedCost: 18000, selected: false },
    { id: "SC-007", name: "Enhanced Contractual SLA with Primary Vendor", description: "Renegotiate SLA for stricter uptime guarantees and penalties.", relevancePercentage: 70, estimatedCost: 3000, selected: false },
  ],
   "RISK-FIN-003": [
    { id: "SC-008", name: "Automated Anomaly Detection in Payments", description: "AI-based tool to detect unusual payment patterns.", relevancePercentage: 75, estimatedCost: 22000, selected: false },
    { id: "SC-009", name: "Periodic Audit of Payment Approvals", description: "Monthly random audit of payment approval logs.", relevancePercentage: 60, estimatedCost: 5000, selected: false },
  ],
};


export default function OptimizeControlsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const riskId = params.riskId as string;

  const [targetRisk, setTargetRisk] = useState<TargetRiskDetails | null>(null);
  const [similarControls, setSimilarControls] = useState<SimilarControlForOptimization[]>([]);
  const [selectedControls, setSelectedControls] = useState<Record<string, boolean>>({});
  const [aiOptimizationResult, setAiOptimizationResult] = useState<ControlOptimizationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (riskId) {
      const foundRisk = MOCK_RISK_DATA_LOOKUP[riskId];
      const foundSimilarControls = MOCK_SIMILAR_CONTROLS_LOOKUP[riskId] || [];
      if (foundRisk) {
        setTargetRisk(foundRisk);
        setSimilarControls(foundSimilarControls.map(sc => ({ ...sc, selected: false })));
        setSelectedControls(foundSimilarControls.reduce((acc, curr) => ({...acc, [curr.id]: false}), {}))
      } else {
        toast({ title: "Error", description: "Target risk not found.", variant: "destructive" });
        router.push('/operations-center'); // Redirect if risk not found
      }
    }
  }, [riskId, router, toast]);

  const handleControlSelectionChange = (controlId: string, isSelected: boolean) => {
    setSelectedControls(prev => ({ ...prev, [controlId]: isSelected }));
    setSimilarControls(prev => prev.map(sc => sc.id === controlId ? {...sc, selected: isSelected} : sc));
  };

  const handleGetAIOptimization = async () => {
    if (!targetRisk) return;
    setIsLoading(true);
    setAiOptimizationResult(null);

    const currentlySelectedSimilarControls = similarControls.filter(sc => selectedControls[sc.id]);
    
    const input: ControlOptimizationInput = {
      targetRiskId: targetRisk.id,
      targetRiskDescription: targetRisk.description,
      implementedControlDetails: `${targetRisk.implementedControl.name}: ${targetRisk.implementedControl.description}`,
      implementedControlCost: targetRisk.implementedControl.cost,
      similarExistingControls: currentlySelectedSimilarControls.map(sc => ({
          id: sc.id,
          name: sc.name,
          description: sc.description,
          relevancePercentage: sc.relevancePercentage,
          estimatedCost: sc.estimatedCost,
      })),
    };

    try {
      const result = await suggestControlOptimizationAction(input);
      if ('error' in result) {
        toast({ title: "AI Optimization Error", description: result.error, variant: "destructive" });
      } else {
        setAiOptimizationResult(result);
        toast({ title: "AI Optimization Suggestion Generated", description: "Scroll down to view the AI's recommendation." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to get AI optimization suggestion.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!targetRisk) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading risk details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Optimize Controls for Risk: {targetRisk.id}</h1>
        <Button variant="outline" onClick={() => router.push('/operations-center')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cost Center
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Target Risk Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>ID:</strong> {targetRisk.id}</p>
          <p><strong>Description:</strong> {targetRisk.description}</p>
          <p><strong>Currently Implemented Control:</strong> {targetRisk.implementedControl.name} ({targetRisk.implementedControl.description})</p>
          <p><strong>Current Control Cost (Est. Annual):</strong> ${targetRisk.implementedControl.cost.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Similar Existing Controls</CardTitle>
          <CardDescription>Select controls to consider for AI optimization analysis. The AI will evaluate these in context of the target risk and the currently implemented control.</CardDescription>
        </CardHeader>
        <CardContent>
          {similarControls.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Control Name/ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Relevance (%)</TableHead>
                  <TableHead className="text-right">Est. Cost (Annual)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {similarControls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell>
                      <Checkbox
                        id={`control-${control.id}`}
                        checked={selectedControls[control.id]}
                        onCheckedChange={(checked) => handleControlSelectionChange(control.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-sm">{control.name}</TableCell>
                    <TableCell className="text-xs">{control.description}</TableCell>
                    <TableCell className="text-right text-sm">{control.relevancePercentage}%</TableCell>
                    <TableCell className="text-right text-sm">${control.estimatedCost.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No similar controls data available for this risk.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGetAIOptimization} disabled={isLoading || similarControls.filter(sc => selectedControls[sc.id]).length === 0}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get AI Optimization Suggestion
          </Button>
        </CardFooter>
      </Card>

      {aiOptimizationResult && (
        <Card className="shadow-xl border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Lightbulb className="mr-2 h-6 w-6" />
              AI Control Optimization Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="bg-primary/5 border-primary/30">
              <Brain className="h-5 w-5 text-primary/80" />
              <AlertTitle className="font-semibold text-primary">Best Suggestion:</AlertTitle>
              <AlertDescription className="text-sm text-primary/90 whitespace-pre-wrap">
                {aiOptimizationResult.bestSuggestion}
              </AlertDescription>
            </Alert>
            
            <Alert variant="default" className="bg-muted/50">
               <Check className="h-5 w-5 text-muted-foreground" />
              <AlertTitle className="font-semibold">Justification:</AlertTitle>
              <AlertDescription className="text-sm whitespace-pre-wrap">
                {aiOptimizationResult.justification}
              </AlertDescription>
            </Alert>

            {aiOptimizationResult.potentialCostSaving !== undefined && aiOptimizationResult.potentialCostSaving !== 0 && (
              <Alert variant="default" className={aiOptimizationResult.potentialCostSaving > 0 ? "bg-green-50 border-green-300 text-green-700" : "bg-yellow-50 border-yellow-300 text-yellow-700"}>
                <Sparkles className="h-5 w-5" />
                <AlertTitle className="font-semibold">
                    {aiOptimizationResult.potentialCostSaving > 0 ? "Potential Cost Saving:" : "Cost Impact Note:"}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {aiOptimizationResult.potentialCostSaving > 0 
                    ? `Estimated potential annual saving of $${aiOptimizationResult.potentialCostSaving.toLocaleString()} by adopting this suggestion.`
                    : `This suggestion may not offer direct cost savings but aims for better risk coverage or efficiency. Cost might be similar or slightly higher, as indicated in justification.`
                  }
                </AlertDescription>
              </Alert>
            )}
             {aiOptimizationResult.potentialCostSaving === 0 && (
                 <Alert variant="default" className="bg-blue-50 border-blue-300 text-blue-700">
                    <Info className="h-5 w-5" />
                    <AlertTitle className="font-semibold">Cost Impact Note:</AlertTitle>
                    <AlertDescription className="text-sm">
                        The suggested optimization is estimated to have a neutral direct cost impact compared to the current control, or cost details are embedded in the justification. Focus is on enhanced effectiveness or relevance.
                    </AlertDescription>
                 </Alert>
             )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

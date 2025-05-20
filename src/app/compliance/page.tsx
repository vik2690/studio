
"use client";

import { useState } from 'react';
import { suggestControlsAction } from '@/lib/actions';
import type { SuggestControlsInput, SuggestControlsOutput } from '@/ai/flows/suggest-controls';
import type { ControlSuggestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, ThumbsUp, ThumbsDown, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function ComplianceHubPage() {
  const [riskGapReport, setRiskGapReport] = useState('');
  const [currentPolicies, setCurrentPolicies] = useState('');
  const [aiResult, setAiResult] = useState<SuggestControlsOutput | null>(null);
  const [suggestedControls, setSuggestedControls] = useState<ControlSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        // Transform AI output into ControlSuggestion objects
        // This is a simplified transformation. Actual parsing might be needed if 'suggestedControls' is a complex string.
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
    <div className="space-y-6">
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
                  }>
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
    </div>
  );
}

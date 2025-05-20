"use client";

import { useState } from 'react';
import { summarizeRegulationAction } from '@/lib/actions';
import type { SummarizeRegulationsInput, type SummarizeRegulationsOutput } from '@/ai/flows/summarize-regulations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RegulationsPage() {
  const [documentText, setDocumentText] = useState('');
  const [summaryResult, setSummaryResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!documentText.trim()) {
      toast({ title: "Input Error", description: "Document text cannot be empty.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setSummaryResult(null);
    try {
      const input: SummarizeRegulationsInput = { documentText };
      const result = await summarizeRegulationAction(input);
      if ('error' in result) {
        toast({ title: "Summarization Error", description: result.error, variant: "destructive" });
      } else {
        setSummaryResult(result);
        toast({ title: "Summarization Complete", description: "Document summary generated successfully." });
      }
    } catch (e) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Regulations Management</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Process Regulatory Document
          </CardTitle>
          <CardDescription>
            Paste the text of a regulatory document below to generate a concise summary using AI.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="documentText" className="text-base font-semibold">Document Text</Label>
              <Textarea
                id="documentText"
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                placeholder="Paste the full text of the regulatory document here..."
                className="min-h-[200px] mt-1 text-sm"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Summary
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {summaryResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wand2 className="mr-2 h-6 w-6 text-primary" />
              AI-Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTitle className="font-semibold">Summary:</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                {summaryResult.summary}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

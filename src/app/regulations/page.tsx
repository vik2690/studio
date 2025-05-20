
"use client";

import { useState, useEffect } from 'react';
import { summarizeRegulationAction } from '@/lib/actions';
import type { SummarizeRegulationsInput, SummarizeRegulationsOutput } from '@/ai/flows/summarize-regulations';
import type { ListedRegulationDocument } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Wand2, BookOpen, Eye, FileSignature } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';

const initialListedDocuments: ListedRegulationDocument[] = [
  {
    id: 'reg_001',
    documentName: 'MiFID II Update Q3 2024',
    regulatoryBody: 'ESMA',
    processedDate: '2024-07-15',
    effectiveDate: '2024-09-01',
    jurisdictions: ['EU', 'UK'],
    shortSummary: 'Enhanced investor protection measures and transparency requirements for derivatives trading.',
    changeCount: 5,
    fullText: 'Full text of MiFID II Update Q3 2024 regarding enhanced investor protection measures, new pre-trade and post-trade transparency requirements for equity and non-equity instruments, particularly focusing on derivatives. Includes updated guidelines on best execution and reporting obligations under RTS 27 and RTS 28.'
  },
  {
    id: 'reg_002',
    documentName: 'BSA/AML Rule Change 2024-5B',
    regulatoryBody: 'FinCEN',
    processedDate: '2024-07-20',
    effectiveDate: '2025-01-01',
    jurisdictions: ['USA'],
    shortSummary: 'New diligence requirements for correspondent accounts and virtual asset service providers.',
    changeCount: 12,
    fullText: 'Full text of BSA/AML Rule Change 2024-5B. This rule imposes stricter due diligence requirements for U.S. financial institutions maintaining correspondent accounts for foreign financial institutions. It also expands the definition of financial institution to include certain Virtual Asset Service Providers (VASPs) and outlines specific AML program requirements for them, including customer identification and transaction monitoring.'
  },
  {
    id: 'reg_003',
    documentName: 'GDPR Article 30 Amendment',
    regulatoryBody: 'European Commission',
    processedDate: '2024-06-10',
    effectiveDate: '2024-08-01',
    jurisdictions: ['EU'],
    shortSummary: 'Clarifications on records of processing activities for small and medium-sized enterprises.',
    changeCount: 3,
    fullText: 'Full text of GDPR Article 30 Amendment. This amendment provides specific clarifications and potential exemptions regarding the obligation to maintain records of processing activities (RoPA) for small and medium-sized enterprises (SMEs) under certain conditions, aiming to reduce administrative burden while maintaining data protection standards.'
  },
];

export default function RegulationsPage() {
  const [documentText, setDocumentText] = useState('');
  const [summaryResult, setSummaryResult] = useState<SummarizeRegulationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listedDocuments, setListedDocuments] = useState<ListedRegulationDocument[]>(initialListedDocuments);
  const [selectedDocumentForSummary, setSelectedDocumentForSummary] = useState<ListedRegulationDocument | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

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

  const handleViewSimplifiedSummary = (doc: ListedRegulationDocument) => {
    if (doc.fullText) {
      setDocumentText(doc.fullText);
      // Clear previous summary and trigger new summarization
      setSummaryResult(null); 
      // Auto-submit for summarization or prompt user? For now, just set text
      toast({ title: "Document Loaded", description: `"${doc.documentName}" loaded for summarization. Click "Generate Summary".` });
      // Scroll to the top or to the summarization card
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast({ title: "No Full Text", description: "Full text is not available for this document to generate a new summary.", variant: "destructive" });
    }
  };

  const handleViewDetail = (doc: ListedRegulationDocument) => {
    setSelectedDocumentForSummary(doc);
    setIsDetailViewOpen(true);
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Regulations Hub</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSignature className="mr-2 h-6 w-6 text-primary" />
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Regulatory Documents Library
          </CardTitle>
          <CardDescription>
            Browse and manage ingested regulatory documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Regulatory Body</TableHead>
                <TableHead>Processed Date</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Jurisdictions</TableHead>
                <TableHead>Change Count</TableHead>
                <TableHead>Short Summary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listedDocuments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No documents found.
                  </TableCell>
                </TableRow>
              )}
              {listedDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.documentName}</TableCell>
                  <TableCell>{doc.regulatoryBody}</TableCell>
                  <TableCell>{doc.processedDate}</TableCell>
                  <TableCell>{doc.effectiveDate}</TableCell>
                  <TableCell>
                    {doc.jurisdictions.map(j => <Badge key={j} variant="secondary" className="mr-1 mb-1">{j}</Badge>)}
                  </TableCell>
                  <TableCell>{doc.changeCount}</TableCell>
                  <TableCell className="text-xs max-w-xs truncate" title={doc.shortSummary}>{doc.shortSummary}</TableCell>
                  <TableCell className="space-x-2 whitespace-nowrap">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetail(doc)}>
                      <Eye className="mr-1 h-4 w-4" /> Detail
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewSimplifiedSummary(doc)}>
                      <Wand2 className="mr-1 h-4 w-4" /> Summarize
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedDocumentForSummary && (
        <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedDocumentForSummary.documentName}</DialogTitle>
              <DialogDescription>
                Full details for the selected regulatory document.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <p><strong>Regulatory Body:</strong> {selectedDocumentForSummary.regulatoryBody}</p>
              <p><strong>Processed Date:</strong> {selectedDocumentForSummary.processedDate}</p>
              <p><strong>Effective Date:</strong> {selectedDocumentForSummary.effectiveDate}</p>
              <p><strong>Jurisdictions:</strong> {selectedDocumentForSummary.jurisdictions.join(', ')}</p>
              <p><strong>Change Count:</strong> {selectedDocumentForSummary.changeCount}</p>
              <p><strong>Short Summary:</strong> {selectedDocumentForSummary.shortSummary}</p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Full Document Text (Excerpt):</h4>
                <Textarea
                  value={selectedDocumentForSummary.fullText || "Full text not available."}
                  readOnly
                  className="min-h-[200px] text-xs bg-muted/50"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

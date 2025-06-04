
"use client";

import { useState, useEffect } from 'react';
import type { FlaggedTransaction } from '@/lib/types';
import { flagAMLTransactionAction } from '@/lib/actions';
import type { FlagAMLTransactionsInput, FlagAMLTransactionsOutput } from '@/ai/flows/flag-aml-transactions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, Loader2, ArrowUpCircle, ListChecks } from 'lucide-react';
import Link from 'next/link';

// Using a slightly larger mock dataset for the full queue page
const initialFullTransactions: FlaggedTransaction[] = [
  { id: 'txn_001', date: '2024-05-01', amount: 15000, currency: 'USD', sender: 'Acc00123', receiver: 'Acc99876', status: 'flagged', riskScore: 85, details: 'Large cash deposit followed by international transfer.', userProfile: 'New customer, high-risk jurisdiction.' },
  { id: 'txn_002', date: '2024-05-03', amount: 500, currency: 'EUR', sender: 'Acc00456', receiver: 'Acc77654', status: 'reviewed', riskScore: 40, details: 'Regular business transaction, previously flagged due to name match.', userProfile: 'Established business, low-risk profile.' },
  { id: 'txn_003', date: '2024-05-05', amount: 25000, currency: 'USD', sender: 'Acc00789', receiver: 'Acc66543', status: 'sar_filed', riskScore: 95, details: 'Structuring multiple small transactions, rapid movement of funds.', userProfile: 'PEP related entity, complex ownership.' },
  { id: 'txn_004', date: '2024-05-06', amount: 7500, currency: 'GBP', sender: 'Acc00111', receiver: 'Acc55443', status: 'flagged', riskScore: 70, details: 'Transfer to an exchange with no clear economic purpose.', userProfile: 'Moderate risk customer, infrequent large transactions.' },
  { id: 'txn_005', date: '2024-05-07', amount: 1200, currency: 'USD', sender: 'Acc00222', receiver: 'Acc66778', status: 'escalated', riskScore: 90, details: 'Series of transactions just below reporting thresholds.', userProfile: 'High-risk jurisdiction, shell company suspected.' },
  { id: 'txn_006', date: '2024-05-08', amount: 300, currency: 'CAD', sender: 'Acc00333', receiver: 'Acc88990', status: 'reviewed', riskScore: 30, details: 'Small online purchase, consistent with profile.', userProfile: 'Low-risk customer, regular activity.' },
  { id: 'txn_007', date: '2024-05-09', amount: 50000, currency: 'USD', sender: 'Acc00444', receiver: 'Acc11221', status: 'sar_filed', riskScore: 98, details: 'Large unexpected wire from offshore account, immediate withdrawal attempt.', userProfile: 'Politically Exposed Person (PEP).' },
  { id: 'txn_008', date: '2024-05-10', amount: 2000, currency: 'EUR', sender: 'Acc00555', receiver: 'Acc33443', status: 'flagged', riskScore: 65, details: 'Unusual pattern of international payments to multiple unrelated individuals.', userProfile: 'Student account with sudden high activity.' },
];


export default function FullTransactionQueuePage() {
  const [transactions, setTransactions] = useState<FlaggedTransaction[]>(initialFullTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<FlaggedTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<FlagAMLTransactionsOutput | null>(null);
  const { toast } = useToast();

  const handleReviewTransaction = async (transaction: FlaggedTransaction) => {
    setSelectedTransaction(transaction);
    setIsLoading(true);
    setAiSuggestions(null);
    try {
      if (transaction.details && transaction.userProfile) {
        const input: FlagAMLTransactionsInput = {
          transactionDetails: transaction.details,
          userProfile: transaction.userProfile,
        };
        const result = await flagAMLTransactionAction(input);
        if ('error' in result) {
          toast({ title: "AI Error", description: result.error, variant: "destructive" });
          setAiSuggestions(null);
        } else {
          setAiSuggestions(result);
        }
      } else {
         setAiSuggestions({ isSuspicious: true, reason: "Details missing for full AI analysis.", suggestedActions: ["Manually verify transaction details.", "Cross-reference with user history."]});
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to get AI suggestions.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Full Flagged Transaction Queue</h1>
        <Link href="/aml" passHref>
            <Button variant="outline">
                Back to AML Hub
            </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-6 w-6 text-primary" />
            All Flagged Transactions
          </CardTitle>
          <CardDescription>Review and take action on all suspicious transactions in the queue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.id}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{txn.amount.toLocaleString()} {txn.currency}</TableCell>
                  <TableCell>
                    <Badge variant={
                        txn.status === 'flagged' ? 'destructive' : 
                        txn.status === 'sar_filed' ? 'default' : 
                        txn.status === 'escalated' ? 'default' : 
                        'secondary'
                      }
                      className={txn.status === 'escalated' ? 'border-primary text-primary-foreground' : ''} 
                    >
                      {txn.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{txn.riskScore || 'N/A'}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleReviewTransaction(txn)}>
                          <Eye className="mr-2 h-4 w-4" /> Review
                        </Button>
                      </DialogTrigger>
                      {selectedTransaction && selectedTransaction.id === txn.id && (
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Transaction: {selectedTransaction.id}</DialogTitle>
                            <DialogDescription>
                              Amount: {selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency} on {selectedTransaction.date}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <p><strong className="font-semibold">Sender:</strong> {selectedTransaction.sender}</p>
                            <p><strong className="font-semibold">Receiver:</strong> {selectedTransaction.receiver}</p>
                            <p><strong className="font-semibold">Details:</strong> {selectedTransaction.details}</p>
                            <p><strong className="font-semibold">User Profile:</strong> {selectedTransaction.userProfile}</p>

                            <hr className="my-4" />
                            <h3 className="font-semibold text-lg">AI Analysis & Suggestions:</h3>
                            {isLoading && <div className="flex items-center space-x-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /><p>Loading AI suggestions...</p></div>}
                            {aiSuggestions && (
                              <div className="space-y-2 text-sm">
                                <p><strong>Suspicious:</strong> <Badge variant={aiSuggestions.isSuspicious ? "destructive" : "secondary"}>{aiSuggestions.isSuspicious ? 'Yes' : 'No'}</Badge></p>
                                <p><strong>Reason:</strong> {aiSuggestions.reason}</p>
                                <div>
                                  <strong>Suggested Actions:</strong>
                                  <ul className="list-disc list-inside ml-4">
                                    {aiSuggestions.suggestedActions.map((action, index) => (
                                      <li key={index}>{action}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                            {!isLoading && !aiSuggestions && <p className="text-muted-foreground">No AI suggestions available or failed to load.</p>}
                          </div>
                          <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => {
                                setTransactions(prev => prev.map(t => t.id === selectedTransaction.id ? {...t, status: 'reviewed', riskScore: t.riskScore ? Math.max(10, t.riskScore - 20) : 30} : t));
                                toast({title: "Status Updated", description: `${selectedTransaction.id} marked as reviewed.`});
                            }}>Mark as Reviewed</Button>
                            <Button variant="outline" onClick={() => {
                                if(selectedTransaction) {
                                    setTransactions(prev => prev.map(t => t.id === selectedTransaction.id ? {...t, status: 'escalated', riskScore: t.riskScore ? Math.min(100, t.riskScore + 15) : 90 } : t));
                                    toast({title: "Transaction Escalated", description: `${selectedTransaction.id} has been escalated.`});
                                }
                            }}>
                              <ArrowUpCircle className="mr-2 h-4 w-4" /> Escalate
                            </Button>
                             <Button variant="destructive" onClick={() => {
                                if(selectedTransaction) {
                                    setTransactions(prev => prev.map(t => t.id === selectedTransaction.id ? {...t, status: 'sar_filed', riskScore: t.riskScore ? Math.min(100, t.riskScore + 20) : 95} : t));
                                    toast({title: "Status Updated", description: `${selectedTransaction.id} marked for SAR filing.`});
                                }
                            }}>File SAR</Button>
                            <DialogClose asChild><Button type="button">Close</Button></DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {transactions.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No flagged transactions at the moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    

"use client";

import { useState, useEffect, useMemo } from 'react';
import type { FlaggedTransaction } from '@/lib/types';
import { flagAMLTransactionAction } from '@/lib/actions';
import type { FlagAMLTransactionsInput, FlagAMLTransactionsOutput } from '@/ai/flows/flag-aml-transactions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Eye, Loader2, FileText, DatabaseZap, AlertTriangle, BadgeCheck, BadgeX, Clock3, ShieldCheck as ShieldCheckIcon, LineChart as LineChartIcon, ArrowUpCircle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { OverviewChart } from '@/components/dashboard/OverviewChart';
import type { ChartConfig } from '@/components/ui/chart';

const initialTransactions: FlaggedTransaction[] = [
  { id: 'txn_001', date: '2024-05-01', amount: 15000, currency: 'USD', sender: 'Acc00123', receiver: 'Acc99876', status: 'flagged', riskScore: 85, details: 'Large cash deposit followed by international transfer.', userProfile: 'New customer, high-risk jurisdiction.' },
  { id: 'txn_002', date: '2024-05-03', amount: 500, currency: 'EUR', sender: 'Acc00456', receiver: 'Acc77654', status: 'reviewed', riskScore: 40, details: 'Regular business transaction, previously flagged due to name match.', userProfile: 'Established business, low-risk profile.' },
  { id: 'txn_003', date: '2024-05-05', amount: 25000, currency: 'USD', sender: 'Acc00789', receiver: 'Acc66543', status: 'sar_filed', riskScore: 95, details: 'Structuring multiple small transactions, rapid movement of funds.', userProfile: 'PEP related entity, complex ownership.' },
];

type ChartTimeView = 'daily' | 'monthly' | 'yearly';

const generateMockTrendData = (granularity: ChartTimeView) => {
  const data = [];
  const now = new Date();
  if (granularity === 'daily') {
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      data.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hits: Math.floor(Math.random() * 20) + 5,
        sars: Math.floor(Math.random() * 5),
      });
    }
  } else if (granularity === 'monthly') {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        hits: Math.floor(Math.random() * 300) + 50,
        sars: Math.floor(Math.random() * 20) + 5,
      });
    }
  } else { // yearly
    for (let i = 4; i >= 0; i--) {
      data.push({
        name: (now.getFullYear() - i).toString(),
        hits: Math.floor(Math.random() * 1000) + 200,
        sars: Math.floor(Math.random() * 100) + 20,
      });
    }
  }
  return data;
};

const amlTrendChartConfig = {
  hits: { label: "AML Hits", color: "hsl(var(--chart-1))" },
  sars: { label: "SARs Filed", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export default function AMLDashboardPage() {
  const [transactions, setTransactions] = useState<FlaggedTransaction[]>(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<FlaggedTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<FlagAMLTransactionsOutput | null>(null);
  const { toast } = useToast();

  // Form state for manual flagging
  const [manualTxnDetails, setManualTxnDetails] = useState('');
  const [manualUserProfile, setManualUserProfile] = useState('');
  const [isManualFlagging, setIsManualFlagging] = useState(false);

  // State for new dashboard metrics
  const [totalProcessed, setTotalProcessed] = useState(125670);
  const [amlHits, setAmlHits] = useState(235);
  const [truePositives, setTruePositives] = useState(45);
  const [falsePositives, setFalsePositives] = useState(190);
  const [pendingReview, setPendingReview] = useState(30);
  const [sarsFiled, setSarsFiled] = useState(initialTransactions.filter(t => t.status === 'sar_filed').length);
  const [closedCases, setClosedCases] = useState(150);

  // State for chart
  const [chartTimeView, setChartTimeView] = useState<ChartTimeView>('monthly');
  const [trendData, setTrendData] = useState(generateMockTrendData('monthly'));

  useEffect(() => {
    setTrendData(generateMockTrendData(chartTimeView));
  }, [chartTimeView]);

  useEffect(() => {
    // Update SARs filed count if transactions list changes (e.g. after table actions)
    setSarsFiled(transactions.filter(t => t.status === 'sar_filed').length);
    // Mock updates for other metrics based on table changes for demonstration
    setAmlHits(transactions.filter(t => t.status === 'flagged' || t.status === 'sar_filed' || t.status === 'escalated').length);
    // This is a very rough estimation for demo. Real logic would be more complex.
    setPendingReview(transactions.filter(t => t.status === 'flagged' || t.status === 'escalated').length);

  }, [transactions]);


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

  const handleManualFlagSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!manualTxnDetails || !manualUserProfile) {
      toast({ title: "Missing Information", description: "Please provide both transaction details and user profile.", variant: "destructive" });
      return;
    }
    setIsManualFlagging(true);
    try {
      const input: FlagAMLTransactionsInput = {
        transactionDetails: manualTxnDetails,
        userProfile: manualUserProfile,
      };
      const result = await flagAMLTransactionAction(input);
      if ('error' in result) {
        toast({ title: "AI Flagging Error", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Transaction Flagged by AI", description: `Suspicious: ${result.isSuspicious}. Reason: ${result.reason}`, variant: result.isSuspicious ? "default" : "destructive" });
        const newFlaggedTxn: FlaggedTransaction = {
          id: `manual_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: 0, 
          currency: 'N/A',
          sender: 'Manual Input',
          receiver: 'Manual Input',
          status: result.isSuspicious ? 'flagged' : 'reviewed',
          details: manualTxnDetails,
          userProfile: manualUserProfile,
          riskScore: result.isSuspicious ? 90 : 20,
        };
        setTransactions(prev => [newFlaggedTxn, ...prev]);
        setManualTxnDetails('');
        setManualUserProfile('');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit for manual flagging.", variant: "destructive" });
    } finally {
      setIsManualFlagging(false);
    }
  };
  
  const amlMetrics = useMemo(() => [
    { title: "Total Transactions Processed", value: totalProcessed.toLocaleString(), icon: DatabaseZap, description: "All transactions analyzed." },
    { title: "AML Hits", value: amlHits.toString(), icon: AlertTriangle, description: "Transactions flagged as potentially suspicious." },
    { title: "True Positives", value: truePositives.toString(), icon: BadgeCheck, description: "Confirmed suspicious activities." },
    { title: "False Positives", value: falsePositives.toString(), icon: BadgeX, description: "Incorrectly flagged transactions." },
    { title: "Pending Review", value: pendingReview.toString(), icon: Clock3, description: "Flagged cases awaiting analyst review." },
    { title: "SARs Filed", value: sarsFiled.toString(), icon: FileText, description: "Suspicious Activity Reports submitted." },
    { title: "Closed (Resolved)", value: closedCases.toString(), icon: ShieldCheckIcon, description: "Cases reviewed and closed without SAR." },
  ], [totalProcessed, amlHits, truePositives, falsePositives, pendingReview, sarsFiled, closedCases]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">AML Hub</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChartIcon className="mr-2 h-6 w-6 text-primary" />
            AML Interactive Dashboard
          </CardTitle>
          <CardDescription>Overview of AML screening activities and trends.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {amlMetrics.map(metric => (
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-1">AML Trends</h3>
            <p className="text-sm text-muted-foreground mb-3">Track AML Hits and SARs Filed over time.</p>
            <div className="flex space-x-2 mb-4">
              {(['daily', 'monthly', 'yearly'] as ChartTimeView[]).map(view => (
                <Button
                  key={view}
                  variant={chartTimeView === view ? 'default' : 'outline'}
                  onClick={() => setChartTimeView(view)}
                  size="sm"
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </Button>
              ))}
            </div>
            <OverviewChart
              data={trendData}
              title="" // Title is handled above
              description="" // Description is handled above
              xAxisKey="name"
              chartConfig={amlTrendChartConfig}
              chartType="line"
            />
          </div>
        </CardContent>
      </Card>
      

      <Card>
        <CardHeader>
          <CardTitle>Manually Flag Transaction</CardTitle>
          <CardDescription>Enter transaction details and user profile to get an AI assessment.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualFlagSubmit} className="space-y-4">
            <div>
              <Label htmlFor="manualTxnDetails">Transaction Details</Label>
              <Textarea id="manualTxnDetails" value={manualTxnDetails} onChange={(e) => setManualTxnDetails(e.target.value)} placeholder="e.g., Sender: Acc123, Receiver: Acc456, Amount: 10000 USD, Date: 2024-07-29, Type: International Wire" rows={3} />
            </div>
            <div>
              <Label htmlFor="manualUserProfile">User Profile</Label>
              <Textarea id="manualUserProfile" value={manualUserProfile} onChange={(e) => setManualUserProfile(e.target.value)} placeholder="e.g., New customer, high net worth, history of similar transactions, located in high-risk country." rows={3} />
            </div>
            <Button type="submit" disabled={isManualFlagging}>
              {isManualFlagging && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assess Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Transactions Queue</CardTitle>
          <CardDescription>Review and take action on suspicious transactions.</CardDescription>
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
                        txn.status === 'escalated' ? 'default' : // Using default (primary color) for escalated
                        'secondary'
                      }
                      className={txn.status === 'escalated' ? 'border-primary text-primary-foreground' : ''} // Custom styling if needed, or rely on variant
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


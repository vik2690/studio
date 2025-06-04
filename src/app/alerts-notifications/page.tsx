
"use client";

import { useState, useEffect } from 'react';
import type { AlertNotificationItem, AlertSeverity, AlertStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bell, Eye, AlertTriangle, Send, Info, Zap, Activity, BellOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialAlerts: AlertNotificationItem[] = [
  {
    id: 'ALERT-001',
    assignmentGroup: 'Compliance Team',
    lastSentTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    natureOfAlert: 'Regulatory Deadline Approaching',
    mappedRisk: 'RISK-REG-003',
    objective: 'Ensure timely submission of MiFID II Q3 report.',
    status: 'Active',
    severity: 'High',
    description: 'MiFID II Q3 transparency report due in 7 days.',
    triggerCondition: 'Report submission deadline < T-7 days.',
    recipients: ['compliance-leads@example.com', 'trading-desk-supervisor@example.com'],
    escalationPath: 'Compliance Officer -> Head of Compliance -> CRO',
    dialogDetails: {
      fullDescription: 'The quarterly MiFID II transparency report for Q3 is approaching its submission deadline. All relevant data must be compiled and validated. Failure to submit on time can lead to regulatory penalties.',
      recommendedActions: ['Verify data completeness from all trading systems.', 'Review draft report with Legal team.', 'Obtain final sign-off from Head of Compliance.'],
      historicalDataLink: '/reports/archive/mifid?q=Q3',
      notes: 'Last quarter submission was delayed by 1 day due to data validation issues.'
    }
  },
  {
    id: 'ALERT-002',
    assignmentGroup: 'IT Security',
    lastSentTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    natureOfAlert: 'Critical System Anomaly',
    mappedRisk: 'RISK-CYBER-001',
    objective: 'Investigate and remediate potential security breach on payment gateway.',
    status: 'Acknowledged',
    severity: 'Critical',
    description: 'Unusual outbound traffic detected from payment gateway server PGW-02.',
    triggerCondition: 'Outbound traffic > 500MB/hr from non-standard ports on PGW-02.',
    recipients: ['soc@example.com', 'it-security-manager@example.com'],
    escalationPath: 'SOC Lead -> CISO -> CTO',
    dialogDetails: {
      fullDescription: 'The monitoring system flagged anomalous outbound network activity on payment gateway server PGW-02. This could indicate a compromised system or data exfiltration attempt. Immediate investigation is required.',
      recommendedActions: ['Isolate server PGW-02 from the network.', 'Perform forensic analysis of server logs.', 'Check for known vulnerabilities.'],
      notes: 'Similar activity pattern observed last year during a minor incident.'
    }
  },
  {
    id: 'ALERT-003',
    assignmentGroup: 'Risk Management',
    lastSentTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    natureOfAlert: 'AML Threshold Breach',
    mappedRisk: 'RISK-AML-007',
    objective: 'Review high-value transaction flagged by AML system.',
    status: 'Active',
    severity: 'Medium',
    description: 'Transaction TXN-8439201 ($150,000 USD) flagged for review.',
    triggerCondition: 'Single transaction amount > $100,000 USD to high-risk jurisdiction.',
    recipients: ['aml-analysts@example.com'],
    escalationPath: 'Senior AML Analyst -> MLRO',
    dialogDetails: {
      fullDescription: 'A large value transaction (TXN-8439201) has been automatically flagged by the AML monitoring system due to exceeding the defined threshold for transactions involving a high-risk jurisdiction. Analyst review is required to determine if a SAR filing is necessary.',
      recommendedActions: ['Review customer KYC profile.', 'Analyze transaction history for patterns.', 'Verify source of funds if possible.'],
    }
  },
  {
    id: 'ALERT-004',
    assignmentGroup: 'Operations Team',
    lastSentTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    natureOfAlert: 'Data Feed Interruption',
    mappedRisk: 'RISK-OP-012',
    objective: 'Restore and validate FATF sanctions list data feed.',
    status: 'Resolved',
    severity: 'Low',
    description: 'FATF sanctions data feed was interrupted for 30 mins. Now restored.',
    triggerCondition: 'No new data received from FATF feed for > 15 minutes.',
    recipients: ['data-ops@example.com'],
    escalationPath: 'Data Ops Lead -> Head of Operations',
    dialogDetails: {
        fullDescription: 'The automated data feed for FATF sanctions list updates experienced an interruption. The feed has since been restored and data integrity checks are underway.',
        recommendedActions: ['Monitor feed for stability.', 'Confirm no sanctions updates were missed during the outage.'],
        notes: 'Root cause identified as a temporary network hiccup at the provider side.'
    }
  },
];

const severityVariantMap: Record<AlertSeverity, 'destructive' | 'default' | 'secondary' | 'outline'> = {
  'Critical': 'destructive',
  'High': 'default',
  'Medium': 'secondary',
  'Low': 'outline',
  'Informational': 'outline',
};

const statusVariantMap: Record<AlertStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'Active': 'default',
  'Acknowledged': 'secondary',
  'Resolved': 'outline',
  'Muted': 'outline',
};

const getSeverityIcon = (severity: AlertSeverity): React.ElementType => {
  switch (severity) {
    case 'Critical': return AlertTriangle;
    case 'High': return AlertTriangle;
    case 'Medium': return Zap;
    case 'Low': return Info;
    case 'Informational': return Info;
    default: return Activity;
  }
};

export default function AlertsNotificationsPage() {
  const [alerts, setAlerts] = useState<AlertNotificationItem[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<AlertNotificationItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleViewDetails = (alert: AlertNotificationItem) => {
    setSelectedAlert(alert);
    setIsDetailDialogOpen(true);
  };

  const handleManualTrigger = (alertId: string) => {
    toast({
      title: "Manual Trigger Initiated",
      description: `Manually triggering alert ${alertId}. (Placeholder action)`,
      variant: "default",
    });
    // In a real app, this would call an API to re-trigger the alert/notification
  };

  const handleMuteAlert = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, status: 'Muted' as AlertStatus } : alert
      )
    );
    toast({
      title: "Alert Muted",
      description: `Alert ${alertId} has been muted.`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight flex items-center">
        <Bell className="mr-3 h-8 w-8 text-primary" />
        Alerts &amp; Notifications Hub
      </h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Alerts Queue</CardTitle>
          <CardDescription>
            Manage and review system-generated alerts and notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Assignment Group</TableHead>
                  <TableHead>Last Sent</TableHead>
                  <TableHead>Nature of Alert</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mapped Risk</TableHead>
                  <TableHead className="min-w-[200px]">Objective</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No alerts or notifications at the moment.
                    </TableCell>
                  </TableRow>
                ) : (
                  alerts.map((alert) => {
                    const SeverityIcon = getSeverityIcon(alert.severity);
                    return (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium text-xs">{alert.id}</TableCell>
                      <TableCell className="text-xs">{alert.assignmentGroup}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{new Date(alert.lastSentTime).toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{alert.natureOfAlert}</TableCell>
                      <TableCell>
                        <Badge variant={severityVariantMap[alert.severity]} className="text-xs capitalize">
                           <SeverityIcon className="mr-1 h-3.5 w-3.5" />
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[alert.status]} className={`text-xs capitalize ${alert.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : ''} ${alert.status === 'Muted' ? 'text-muted-foreground border-muted-foreground/50' : ''}`}>
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{alert.mappedRisk}</TableCell>
                      <TableCell className="text-xs">{alert.objective}</TableCell>
                      <TableCell className="space-x-1 whitespace-nowrap">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(alert)} title="View Details">
                          <Eye className="mr-1.5 h-4 w-4" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMuteAlert(alert.id)}
                          disabled={alert.status === 'Muted' || alert.status === 'Resolved'}
                          title="Mute Alert"
                        >
                          <BellOff className="mr-1.5 h-4 w-4" /> Mute
                        </Button>
                      </TableCell>
                    </TableRow>
                  )})
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedAlert && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Alert Details: {selectedAlert.id}
              </DialogTitle>
              <DialogDescription>
                {selectedAlert.natureOfAlert} - Objective: {selectedAlert.objective}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-[1fr_3fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Severity:</span>
                  <Badge variant={severityVariantMap[selectedAlert.severity]} className="w-fit capitalize">
                     {React.createElement(getSeverityIcon(selectedAlert.severity), { className: "mr-1 h-3.5 w-3.5" })}
                    {selectedAlert.severity}
                  </Badge>
                </div>
                <div className="grid grid-cols-[1fr_3fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Status:</span>
                  <Badge variant={statusVariantMap[selectedAlert.status]} className={`w-fit capitalize ${selectedAlert.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : ''} ${selectedAlert.status === 'Muted' ? 'text-muted-foreground border-muted-foreground/50' : ''}`}>
                    {selectedAlert.status}
                  </Badge>
                </div>
                 <div className="grid grid-cols-[1fr_3fr] items-start gap-2">
                  <span className="font-semibold text-muted-foreground pt-0.5">Description:</span>
                  <span>{selectedAlert.description || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-[1fr_3fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Assignment Group:</span>
                  <span>{selectedAlert.assignmentGroup}</span>
                </div>
                <div className="grid grid-cols-[1fr_3fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Last Sent:</span>
                  <span>{new Date(selectedAlert.lastSentTime).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-[1fr_3fr] items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Mapped Risk ID:</span>
                  <span>{selectedAlert.mappedRisk}</span>
                </div>
                 <div className="grid grid-cols-[1fr_3fr] items-start gap-2">
                  <span className="font-semibold text-muted-foreground pt-0.5">Trigger Condition:</span>
                  <span>{selectedAlert.triggerCondition || 'N/A'}</span>
                </div>
                 <div className="grid grid-cols-[1fr_3fr] items-start gap-2">
                  <span className="font-semibold text-muted-foreground pt-0.5">Recipients:</span>
                  <span>{selectedAlert.recipients?.join(', ') || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-[1fr_3fr] items-start gap-2">
                  <span className="font-semibold text-muted-foreground pt-0.5">Escalation Path:</span>
                  <span>{selectedAlert.escalationPath || 'N/A'}</span>
                </div>

                {selectedAlert.dialogDetails && (
                  <>
                    <hr className="my-2" />
                    <h4 className="font-semibold text-md col-span-full">Additional Details:</h4>
                    {selectedAlert.dialogDetails.fullDescription && (
                      <div className="grid grid-cols-[1fr_3fr] items-start gap-2">
                        <span className="font-semibold text-muted-foreground pt-0.5">Full Description:</span>
                        <span className="whitespace-pre-wrap">{selectedAlert.dialogDetails.fullDescription}</span>
                      </div>
                    )}
                    {selectedAlert.dialogDetails.recommendedActions && selectedAlert.dialogDetails.recommendedActions.length > 0 && (
                       <div className="grid grid-cols-[1fr_3fr] items-start gap-2">
                        <span className="font-semibold text-muted-foreground pt-0.5">Recommended Actions:</span>
                        <ul className="list-disc list-inside pl-1 space-y-1">
                          {selectedAlert.dialogDetails.recommendedActions.map((action, i) => <li key={i}>{action}</li>)}
                        </ul>
                      </div>
                    )}
                    {selectedAlert.dialogDetails.historicalDataLink && (
                       <div className="grid grid-cols-[1fr_3fr] items-center gap-2">
                        <span className="font-semibold text-muted-foreground">Historical Data:</span>
                        <a href={selectedAlert.dialogDetails.historicalDataLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          View History
                        </a>
                      </div>
                    )}
                    {selectedAlert.dialogDetails.notes && (
                      <div className="grid grid-cols-[1fr_3fr] items-start gap-2">
                        <span className="font-semibold text-muted-foreground pt-0.5">Notes:</span>
                        <span className="whitespace-pre-wrap">{selectedAlert.dialogDetails.notes}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="sm:justify-between mt-4 gap-2">
              <Button variant="outline" onClick={() => handleManualTrigger(selectedAlert.id)}>
                <Send className="mr-2 h-4 w-4" /> Manual Trigger
              </Button>
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


    
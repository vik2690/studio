
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
    natureOfAlert: 'Regulatory Deadline Approaching: MiFID II Q3 Report Submission',
    mappedRisk: 'RISK-REG-003',
    objective: 'Ensure timely submission of MiFID II Q3 report to avoid penalties and maintain regulatory standing.',
    status: 'Active',
    severity: 'High',
    description: 'MiFID II Q3 transparency report due in 7 days.',
    triggerCondition: 'Report submission deadline < T-7 days and status is not "Submitted".',
    recipients: ['compliance-leads@example.com', 'trading-desk-supervisor@example.com', 'head.compliance@example.com'],
    escalationPath: 'Compliance Officer -> Head of Compliance -> Chief Risk Officer (CRO)',
    dialogDetails: {
      fullDescription: 'The quarterly MiFID II transparency report for Q3 is approaching its submission deadline of [Deadline Date]. All relevant trading data must be compiled, validated, and cross-referenced with internal policies. Failure to submit on time can lead to significant regulatory penalties and reputational damage.',
      recommendedActions: ['Verify data completeness from all trading systems (e.g., OMS, EMS).', 'Perform reconciliation with custodian records.', 'Review draft report with Legal and Senior Management.', 'Obtain final sign-off from Head of Compliance at least 2 days prior to deadline.'],
      historicalDataLink: '/reports/archive/mifid?q=Q3&year=previous',
      notes: 'Last quarter submission (Q2) was delayed by 1 day due to data validation issues in the non-equity instruments section. Ensure extra scrutiny there.'
    }
  },
  {
    id: 'ALERT-002',
    assignmentGroup: 'IT Security Operations Center',
    lastSentTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    natureOfAlert: 'Critical System Anomaly: Payment Gateway Compromise Suspected',
    mappedRisk: 'RISK-CYBER-001',
    objective: 'Immediately investigate and remediate potential security breach on payment gateway PGW-02 to prevent financial loss and data exfiltration.',
    status: 'Acknowledged',
    severity: 'Critical',
    description: 'Unusual outbound traffic (approx. 1.2 GB/hr) detected from payment gateway server PGW-02 to multiple unknown IP addresses in a high-risk region.',
    triggerCondition: 'Outbound traffic > 500MB/hr from non-standard ports on PGW-02 OR communication with blacklisted IPs.',
    recipients: ['soc@example.com', 'it-security-manager@example.com', 'incident-response-team@example.com'],
    escalationPath: 'SOC Lead -> CISO -> CTO -> CEO (if confirmed breach with major impact)',
    dialogDetails: {
      fullDescription: 'The Security Information and Event Management (SIEM) system flagged highly anomalous outbound network activity on critical payment gateway server PGW-02. This pattern is consistent with potential data exfiltration following a system compromise. Immediate investigation and containment are required as per IRP-004.',
      recommendedActions: ['Isolate server PGW-02 from the network immediately.', 'Initiate forensic analysis of server logs, network traffic, and memory dumps.', 'Check for known vulnerabilities (e.g., CVEs) on PGW-02 and related systems.', 'Notify legal and compliance teams of potential data breach.'],
      notes: 'Similar activity pattern (though smaller scale) observed last year during a minor incident involving malware on an adjacent server. Check if related IOCs are present.'
    }
  },
  {
    id: 'ALERT-003',
    assignmentGroup: 'AML Analytics Unit',
    lastSentTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    natureOfAlert: 'High-Risk AML Transaction Threshold Breach',
    mappedRisk: 'RISK-AML-007',
    objective: 'Conduct enhanced due diligence on transaction TXN-8439201 to determine legitimacy and file SAR if necessary.',
    status: 'Active',
    severity: 'Medium',
    description: 'Transaction TXN-8439201 ($150,000 USD) from Customer CUST-5872 to a VASP in a high-risk jurisdiction has been flagged by the AML monitoring system.',
    triggerCondition: 'Single transaction amount > $100,000 USD to high-risk jurisdiction OR cumulative daily transactions > $250,000 to VASPs.',
    recipients: ['aml-analysts@example.com', 'mlro-office@example.com'],
    escalationPath: 'Senior AML Analyst -> Money Laundering Reporting Officer (MLRO)',
    dialogDetails: {
      fullDescription: 'A large value transaction (TXN-8439201 for $150,000 USD) has been automatically flagged by the AML monitoring system. The transaction involves Customer ID CUST-5872 (risk rating: High) sending funds to a Virtual Asset Service Provider located in a jurisdiction flagged as high-risk for money laundering (Jurisdiction ID: J-HR-012). Analyst review is required within 4 business hours to determine if a Suspicious Activity Report (SAR) filing is necessary.',
      recommendedActions: ['Review customer KYC/CDD profile and source of wealth documentation.', 'Analyze historical transaction patterns for CUST-5872.', 'Verify the legitimacy of the recipient VASP if possible.', 'Document findings and decision rationale thoroughly in the case management system.'],
      historicalDataLink: '/aml/cases?customerId=CUST-5872',
    }
  },
  {
    id: 'ALERT-004',
    assignmentGroup: 'Data Operations Team',
    lastSentTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    natureOfAlert: 'Data Feed Interruption: FATF Sanctions List Update',
    mappedRisk: 'RISK-OP-012',
    objective: 'Restore and validate FATF sanctions list data feed to ensure up-to-date screening capabilities.',
    status: 'Resolved',
    severity: 'Low',
    description: 'The automated data feed for FATF sanctions list updates was interrupted for 30 minutes. The feed has now been restored and data integrity checks are complete.',
    triggerCondition: 'No new data received from FATF feed for > 15 minutes during expected update window.',
    recipients: ['data-ops@example.com', 'compliance-systems-support@example.com'],
    escalationPath: 'Data Ops Lead -> Head of Operations -> Head of Compliance (if outage > 2 hours)',
    dialogDetails: {
        fullDescription: 'The automated data feed for FATF sanctions list updates (Source ID: FATF-XML-FEED-01) experienced an interruption from 02:15 AM to 02:45 AM UTC. The feed has since been restored. Data integrity checks have been performed against a control file, and no sanctions updates were missed during the outage.',
        recommendedActions: ['Continue monitoring feed stability for the next 24 hours.', 'Document the incident and resolution in the operational log.', 'Review provider SLA for potential credits if applicable.'],
        notes: 'Root cause identified as a temporary network hiccup at the data provider\'s end. Provider has confirmed resolution and stability.'
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
          <ScrollArea className="max-h-[600px] w-full">
            <div className="min-w-max">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">ID</TableHead>
                    <TableHead className="min-w-[200px]">Assignment Group</TableHead>
                    <TableHead className="min-w-[180px]">Last Sent</TableHead>
                    <TableHead className="min-w-[300px]">Nature of Alert</TableHead>
                    <TableHead className="min-w-[120px]">Severity</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[150px]">Mapped Risk</TableHead>
                    <TableHead className="min-w-[350px]">Objective</TableHead>
                    <TableHead className="min-w-[220px]">Actions</TableHead>
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
            </div>
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
                  <span className="whitespace-pre-wrap">{selectedAlert.triggerCondition || 'N/A'}</span>
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

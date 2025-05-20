
"use client";

import { useState, useEffect } from 'react';
import type { RiskIssueItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, ShieldCheck, AlertTriangle, FileText, Activity, ExternalLink, Settings2, PlayCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialRiskItems: RiskIssueItem[] = [
  {
    id: 'RISK-001',
    description: 'Potential data breach due to outdated encryption protocols on customer database.',
    impactedArea: 'IT Infrastructure, Customer Data Management',
    focusArea: 'Data Security',
    identifiedDate: '2024-07-15',
    severity: 'Critical',
    riskType: 'Cybersecurity',
    status: 'Open',
  },
  {
    id: 'ISSUE-002',
    description: 'Inadequate KYC procedures for high-risk clients identified during internal audit.',
    impactedArea: 'Client Onboarding, AML Compliance',
    focusArea: 'AML/CFT',
    identifiedDate: '2024-06-20',
    severity: 'High',
    riskType: 'Compliance',
    status: 'In Progress',
  },
  {
    id: 'RISK-003',
    description: 'Vendor for payment processing has experienced frequent outages, impacting service delivery.',
    impactedArea: 'Payment Operations, Customer Experience',
    focusArea: 'Third-Party Risk',
    identifiedDate: '2024-07-01',
    severity: 'Medium',
    riskType: 'Operational',
    status: 'Requires Attention',
  },
  {
    id: 'RISK-004',
    description: 'Lack of documented disaster recovery plan for critical trading systems.',
    impactedArea: 'Trading Operations, Business Continuity',
    focusArea: 'Operational Resilience',
    identifiedDate: '2024-05-10',
    severity: 'High',
    riskType: 'Operational',
    status: 'Open',
  },
  {
    id: 'ISSUE-005',
    description: 'Customer complaints regarding misleading marketing material for new investment product.',
    impactedArea: 'Marketing, Sales, Legal',
    focusArea: 'Market Conduct',
    identifiedDate: '2024-07-25',
    severity: 'Medium',
    riskType: 'Reputational',
    status: 'Open',
  },
   {
    id: 'RISK-006',
    description: 'Insufficient training for staff on new anti-phishing measures.',
    impactedArea: 'All Departments, Human Resources',
    focusArea: 'Employee Awareness',
    identifiedDate: '2024-08-01',
    severity: 'Low',
    riskType: 'Operational',
    status: 'Mitigated',
  },
];

const severityVariantMap: Record<RiskIssueItem['severity'], 'destructive' | 'default' | 'secondary' | 'outline'> = {
  'Critical': 'destructive',
  'High': 'default', // Will use primary color
  'Medium': 'secondary',
  'Low': 'outline',
};

export default function RiskIssuesHubPage() {
  const [riskItems, setRiskItems] = useState<RiskIssueItem[]>(initialRiskItems);
  const { toast } = useToast();

  const handleAction = (actionType: string, itemId: string) => {
    toast({
      title: `Action: ${actionType}`,
      description: `Performing '${actionType}' for item ${itemId}. (Placeholder)`,
    });
    // Implement actual action logic here, e.g., open dialog, call API
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Risk &amp; Issues Hub</h1>

      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-primary" />
            Identified Risks &amp; Issues
          </CardTitle>
          <CardDescription>
            Track, manage, and mitigate identified risks and operational issues across the organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="min-w-[250px]">Description</TableHead>
                <TableHead>Impacted Area</TableHead>
                <TableHead>Focus Area</TableHead>
                <TableHead>Identified Date</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Risk Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No risks or issues identified.
                  </TableCell>
                </TableRow>
              ) : (
                riskItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="text-xs">{item.description}</TableCell>
                    <TableCell className="text-xs">{item.impactedArea}</TableCell>
                    <TableCell><Badge variant="outline">{item.focusArea}</Badge></TableCell>
                    <TableCell>{item.identifiedDate}</TableCell>
                    <TableCell>
                      <Badge variant={severityVariantMap[item.severity]}>
                        {item.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <Badge variant="secondary" className="whitespace-nowrap">{item.riskType}</Badge>
                    </TableCell>
                     <TableCell>
                       <Badge 
                        variant={
                            item.status === 'Open' ? 'default' :
                            item.status === 'In Progress' ? 'secondary' :
                            item.status === 'Mitigated' ? 'outline' : // A more neutral or positive one
                            item.status === 'Closed' ? 'outline' :
                            item.status === 'Requires Attention' ? 'destructive':
                            'secondary'
                        }
                        className={
                            item.status === 'Mitigated' ? 'border-green-500 text-green-700 dark:border-green-400 dark:text-green-300' :
                            item.status === 'Closed' ? 'border-gray-400 text-gray-600 dark:border-gray-500 dark:text-gray-400': ''
                        }
                       >
                        {item.status}
                       </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleAction('View Details', item.id)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('Explore Regulatory Implications', item.id)}>
                            <ExternalLink className="mr-2 h-4 w-4" /> Regulatory Implications
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('Suggest Controls', item.id)}>
                            <ShieldCheck className="mr-2 h-4 w-4" /> Suggest Controls
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleAction('Assign Task', item.id)}>
                            <Activity className="mr-2 h-4 w-4" /> Assign Task
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => handleAction('Update Status', item.id)}>
                            <Settings2 className="mr-2 h-4 w-4" /> Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('Initiate Mitigation', item.id)} className="text-primary">
                            <PlayCircle className="mr-2 h-4 w-4" /> Initiate Mitigation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

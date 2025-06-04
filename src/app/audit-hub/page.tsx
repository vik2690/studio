
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck, ListTree, ShieldCheck, UserCheck, DatabaseZap, FileOutput, 
  ExternalLink, FolderSearch
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditToolCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  actionLabel?: string;
  onActionClick?: () => void;
  linkUrl?: string; 
}

const AuditToolCard: React.FC<AuditToolCardProps> = ({ title, description, icon: Icon, actionLabel, onActionClick, linkUrl }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="h-7 w-7 text-primary" />
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground italic">
          Specific audit tools and data views would be accessible here.
        </div>
      </CardContent>
      {(actionLabel || linkUrl) && (
        <div className="p-4 pt-0 border-t mt-auto">
          {linkUrl ? (
            <Button variant="outline" className="w-full justify-start" asChild>
              {/* Use Next.js Link for internal navigation if these were real pages */}
              <a href={linkUrl} target="_blank" rel="noopener noreferrer"> 
                {actionLabel || "Go to Tool"}
                <ExternalLink className="ml-auto h-4 w-4" />
              </a>
            </Button>
          ) : actionLabel && onActionClick && (
            <Button variant="outline" className="w-full" onClick={onActionClick}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default function AuditHubPage() {
  const { toast } = useToast();

  const handlePlaceholderAction = (toolName: string) => {
    toast({
      title: "Action Triggered",
      description: `Auditor action for: ${toolName}. (This is a placeholder).`,
    });
  };

  const auditTools: AuditToolCardProps[] = [
    {
      title: "Audit Log Explorer",
      description: "Access and search system-wide activity logs, including access, changes, and critical system events. Filter by date, user, event type, and more.",
      icon: ListTree,
      actionLabel: "Explore Logs",
      onActionClick: () => handlePlaceholderAction("Audit Log Explorer"),
    },
    {
      title: "Compliance & Control Review",
      description: "Review internal policies, regulatory mappings, control documentation, and evidence of control effectiveness.",
      icon: ShieldCheck,
      actionLabel: "Review Controls",
      onActionClick: () => handlePlaceholderAction("Compliance & Control Review"),
    },
    {
      title: "User Access & Permissions Audit",
      description: "Analyze user roles, permissions, access history, and segregation of duties (SoD) conflicts.",
      icon: UserCheck,
      actionLabel: "Audit User Access",
      onActionClick: () => handlePlaceholderAction("User Access & Permissions Audit"),
    },
    {
      title: "Data Integrity Dashboard",
      description: "Monitor data validation processes, reconciliation reports, data lineage, and data quality metrics.",
      icon: DatabaseZap,
      actionLabel: "View Data Integrity",
      onActionClick: () => handlePlaceholderAction("Data Integrity Dashboard"),
    },
    {
      title: "Audit Reporting Toolkit",
      description: "Generate standard and custom audit reports, evidence packages, and export data extracts for offline analysis.",
      icon: FileOutput,
      actionLabel: "Generate Reports",
      onActionClick: () => handlePlaceholderAction("Audit Reporting Toolkit"),
    },
    {
      title: "Incident & Case Review",
      description: "Review documented security incidents, compliance breaches, investigation trails, and their resolution.",
      icon: FolderSearch,
      actionLabel: "Review Cases",
      onActionClick: () => handlePlaceholderAction("Incident & Case Review"),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <ClipboardCheck className="mr-3 h-8 w-8 text-primary" />
          Audit Hub
        </h1>
      </div>

      <p className="text-lg text-muted-foreground">
        A centralized platform for auditors to access necessary tools, logs, and documentation for comprehensive system audits.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {auditTools.map((tool) => (
          <AuditToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            actionLabel={tool.actionLabel}
            onActionClick={tool.onActionClick}
            linkUrl={tool.linkUrl}
          />
        ))}
      </div>
    </div>
  );
}

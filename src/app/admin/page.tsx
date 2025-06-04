
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, Brain, ListChecks, DatabaseZap, Mail, Settings2, ExternalLink } from 'lucide-react';

interface AdminDashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  actionLabel?: string;
  onActionClick?: () => void;
  linkUrl?: string;
}

const AdminDashboardCard: React.FC<AdminDashboardCardProps> = ({ title, description, icon: Icon, actionLabel, onActionClick, linkUrl }) => {
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
        {/* Placeholder for future content or stats */}
        <div className="text-sm text-muted-foreground italic">
          Further details and controls for this section would appear here.
        </div>
      </CardContent>
      {(actionLabel || linkUrl) && (
        <div className="p-4 pt-0 border-t mt-auto">
          {linkUrl ? (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                {actionLabel || "Go to Section"}
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

export default function AdminHubPage() {
  const handlePlaceholderAction = (section: string) => {
    alert(`Placeholder action for: ${section}`);
  };

  const adminSections: AdminDashboardCardProps[] = [
    {
      title: "User Management",
      description: "Manage user accounts, roles, permissions, and authentication settings.",
      icon: Users,
      actionLabel: "Manage Users",
      onActionClick: () => handlePlaceholderAction("User Management"),
    },
    {
      title: "System Configuration",
      description: "Adjust global system settings, integrations, and operational parameters.",
      icon: Settings,
      actionLabel: "Configure System",
      onActionClick: () => handlePlaceholderAction("System Configuration"),
    },
    {
      title: "AI Model Management",
      description: "Oversee AI models, their versions, performance, and configurations.",
      icon: Brain,
      actionLabel: "Manage Models",
      onActionClick: () => handlePlaceholderAction("AI Model Management"),
    },
    {
      title: "Audit Log Viewer",
      description: "Review system-wide activity logs, track changes, and monitor critical events.",
      icon: ListChecks,
      actionLabel: "View Audit Logs",
      onActionClick: () => handlePlaceholderAction("Audit Log Viewer"),
    },
    {
      title: "Data & Integration Status",
      description: "Monitor data feeds, ETL processes, and third-party integrations for health and errors.",
      icon: DatabaseZap,
      actionLabel: "Check Integrations",
      onActionClick: () => handlePlaceholderAction("Data & Integration Status"),
    },
    {
      title: "Notification Settings",
      description: "Manage system notification templates, delivery channels, and recipient groups.",
      icon: Mail,
      actionLabel: "Configure Notifications",
      onActionClick: () => handlePlaceholderAction("Notification Settings"),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Settings2 className="mr-3 h-8 w-8 text-primary" />
          Admin Hub
        </h1>
      </div>

      <p className="text-lg text-muted-foreground">
        Centralized dashboard for system administration, configuration, and monitoring.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <AdminDashboardCard
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
            actionLabel={section.actionLabel}
            onActionClick={section.onActionClick}
            linkUrl={section.linkUrl}
          />
        ))}
      </div>
    </div>
  );
}

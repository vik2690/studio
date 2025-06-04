
"use client";

import { useState, useEffect } from 'react';
import type { AIAgent, AIAgentStatusValue } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, Coffee, Loader2, AlertTriangle as AlertTriangleIcon, PowerOff, Activity as ActivityIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const initialAgents: AIAgent[] = [
  {
    id: 'risk-sentinel',
    emoji: '🕵️‍♂️',
    name: 'Risk Sentinel Agent',
    role: 'Detects new/emerging risks from various internal and external data sources.',
    status: 'Active',
    lastActive: new Date(Date.now() - 2 * 60 * 1000).toLocaleTimeString(), // 2 minutes ago
    nextRun: 'Continuous',
    details: 'Monitoring news feeds and internal anomaly detectors.'
  },
  {
    id: 'control-validator',
    emoji: '🛡️',
    name: 'Control Validator Agent',
    role: 'Periodically tests key controls and gathers compliance evidence.',
    status: 'Processing',
    lastActive: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString(), // 10 minutes ago
    nextRun: new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString(), // In 30 minutes
    details: 'Validating SOX control C-045: Access Reviews (Batch 3/5).'
  },
  {
    id: 'compliance-watchdog',
    emoji: '🤖',
    name: 'Compliance Watchdog Agent',
    role: 'Tracks regulatory changes from multiple jurisdictions and maps potential gaps.',
    status: 'Idle',
    lastActive: new Date(Date.now() - 60 * 60 * 1000).toLocaleTimeString(), // 1 hour ago
    nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString(), // In 2 hours
    details: 'Awaiting next scheduled scan of regulatory portals.'
  },
  {
    id: 'remediation-planner',
    emoji: '🧑‍⚖️',
    name: 'Remediation Planner Agent',
    role: 'Suggests or initiates automated fixes for identified failed controls or gaps.',
    status: 'Error',
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString(), // 5 minutes ago
    details: 'Failed to connect to ticketing system API (Error 503). Retrying...'
  },
  {
    id: 'crics-copilot',
    emoji: '💬',
    name: 'CRICS Copilot Agent',
    role: 'Answers natural language questions and provides explanations on compliance insights.',
    status: 'Active',
    lastActive: new Date(Date.now() - 30 * 1000).toLocaleTimeString(), // 30 seconds ago
    nextRun: 'On-demand',
    details: 'Currently assisting User_JohnD with risk assessment query.'
  },
  {
    id: 'data-ingestion-monitor',
    emoji: '📡',
    name: 'Data Ingestion Monitor',
    role: 'Oversees data feeds and flags anomalies in incoming regulatory or internal data.',
    status: 'Disabled',
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleTimeString(), // 1 day ago
    nextRun: 'N/A',
    details: 'Temporarily disabled for system maintenance.'
  }
];

const statusConfig: Record<AIAgentStatusValue, { color: string; icon: LucideIcon, textColor?: string }> = {
  'Active': { color: 'bg-green-100 dark:bg-green-700/30', textColor: 'text-green-700 dark:text-green-300', icon: Zap },
  'Idle': { color: 'bg-blue-100 dark:bg-blue-700/30', textColor: 'text-blue-700 dark:text-blue-300', icon: Coffee },
  'Processing': { color: 'bg-yellow-100 dark:bg-yellow-600/30', textColor: 'text-yellow-700 dark:text-yellow-300', icon: Loader2 },
  'Error': { color: 'bg-red-100 dark:bg-red-700/30', textColor: 'text-red-700 dark:text-red-300', icon: AlertTriangleIcon },
  'Disabled': { color: 'bg-gray-100 dark:bg-gray-700/30', textColor: 'text-gray-600 dark:text-gray-400', icon: PowerOff },
};


export default function OperationsCenterPage() {
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents =>
        prevAgents.map(agent => {
          let newLastActive = agent.lastActive;
          // Simulate 'Active' and 'Processing' agents updating their last active time more frequently
          if ((agent.status === 'Active' || agent.status === 'Processing') && Math.random() < 0.3) {
            newLastActive = new Date().toLocaleTimeString();
          }
          // Simulate some status changes for dynamism
          let newStatus = agent.status;
          if (agent.status === 'Processing' && Math.random() < 0.1) {
            newStatus = 'Idle'; // Finished processing
          } else if (agent.status === 'Idle' && Math.random() < 0.05) {
            newStatus = 'Processing'; // Started new task
          } else if (agent.status === 'Error' && Math.random() < 0.2) {
            newStatus = 'Active'; // Error resolved
          }


          return {
            ...agent,
            lastActive: newLastActive,
            status: newStatus,
            // Potentially update nextRun or details here too
          };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <ActivityIcon className="mr-3 h-8 w-8 text-primary" />
          AI Operations Center
        </h1>
         <Button variant="outline" size="sm">
            Refresh All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const config = statusConfig[agent.status];
          const StatusIcon = config.icon;
          return (
            <Card key={agent.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <span className="text-3xl mr-3">{agent.emoji}</span>
                        <CardTitle className="text-xl leading-tight">{agent.name}</CardTitle>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="outline" className={cn("px-3 py-1 text-sm", config.color, config.textColor, `border-${config.textColor?.replace('text-', '')}/50`)}>
                                    <StatusIcon className={cn("mr-1.5 h-4 w-4", agent.status === 'Processing' ? 'animate-spin' : '')} />
                                    {agent.status}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{agent.status}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <CardDescription className="text-sm">{agent.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm flex-grow">
                <div>
                  <span className="font-semibold text-muted-foreground">Last Active:</span> {agent.lastActive}
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Next Run/State:</span> {agent.nextRun || 'N/A'}
                </div>
                {agent.details && (
                  <div className="pt-1">
                    <p className="text-xs text-muted-foreground italic leading-snug line-clamp-2" title={agent.details}>
                      <span className="font-semibold not-italic text-muted-foreground/80">Current Activity: </span>{agent.details}
                    </p>
                  </div>
                )}
              </CardContent>
              <div className="p-4 pt-2 border-t border-border/50 mt-auto">
                <Button variant="ghost" size="sm" className="w-full justify-start text-primary hover:text-primary/90">
                    View Logs & Details <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
       {agents.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No AI agents configured or reporting.</p>
      )}
    </div>
  );
}

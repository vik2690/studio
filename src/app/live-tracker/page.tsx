
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { FeedItem, FeedItemStatus, FeedItemCategory } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Globe, Gavel, ScrollText, Landmark, Newspaper, Megaphone, CircleDollarSign, ShieldAlert, AlertTriangle, Eye, Activity, Brain, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialFeedItems: FeedItem[] = [
  {
    id: 'feed-001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    source: 'Reuters World',
    title: 'New Sanctions Proposed on Nordland Banking Sector',
    snippet: 'Global finance ministers are considering new sanctions targeting financial institutions in Nordland following recent geopolitical tensions. The proposal includes asset freezes and restrictions on international transactions.',
    category: 'Geopolitical Event',
    status: 'Pending AI Analysis',
    link: '#',
    relevanceScore: 85,
    flaggedKeywords: ['sanctions', 'Nordland', 'banking sector'],
    priority: 'High',
  },
  {
    id: 'feed-002',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    source: 'ESMA Official Portal',
    title: 'ESMA Publishes Updated Guidelines on MiFID II Reporting Standards',
    snippet: 'The European Securities and Markets Authority (ESMA) has released revised technical standards for transaction reporting under MiFID II, effective Q4 2024. Key changes address data field validation and reporting timelines.',
    category: 'Regulatory Update',
    status: 'AI Analyzed - Risk Flagged',
    link: '#',
    relevanceScore: 92,
    flaggedKeywords: ['MiFID II', 'ESMA', 'transaction reporting', 'Q4 2024'],
    priority: 'Critical',
    assignedTo: 'Compliance Team Lead',
  },
  {
    id: 'feed-003',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    source: 'CyberSec Today',
    title: 'Major Financial Institutions Targeted by Sophisticated Phishing Campaign',
    snippet: 'A new wave of phishing attacks is targeting employees at several large banks, using deepfake voice technology to impersonate senior executives and request urgent fund transfers.',
    category: 'Cybersecurity Alert',
    status: 'AI Analyzed - No Risk', // Assuming our org is not directly impacted or already has controls
    link: '#',
    relevanceScore: 70,
    priority: 'Medium',
  },
];

const categoryIcons: Record<FeedItemCategory, React.ElementType> = {
  'Regulatory Update': Gavel,
  'Geopolitical Event': Landmark,
  'Market News': Newspaper,
  'Cybersecurity Alert': ShieldAlert,
  'Compliance Advisory': Megaphone,
  'Financial Crime': CircleDollarSign,
  'Internal Finding': AlertTriangle,
};

const statusConfig: Record<FeedItemStatus, { color: string; icon?: React.ElementType, textColor?: string }> = {
  'New': { color: 'bg-blue-100 dark:bg-blue-700/30', textColor: 'text-blue-700 dark:text-blue-300', icon: Activity },
  'Pending AI Analysis': { color: 'bg-yellow-100 dark:bg-yellow-600/30', textColor: 'text-yellow-700 dark:text-yellow-300', icon: Brain },
  'AI Processing': { color: 'bg-purple-100 dark:bg-purple-600/30', textColor: 'text-purple-700 dark:text-purple-300', icon: Loader2 },
  'AI Analyzed - No Risk': { color: 'bg-green-100 dark:bg-green-700/30', textColor: 'text-green-700 dark:text-green-300', icon: ShieldAlert },
  'AI Analyzed - Risk Flagged': { color: 'bg-red-100 dark:bg-red-700/30', textColor: 'text-red-700 dark:text-red-300', icon: AlertTriangle },
  'Action Required': { color: 'bg-orange-100 dark:bg-orange-600/30', textColor: 'text-orange-700 dark:text-orange-300', icon: Gavel },
};


export default function LiveTrackerPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Simulate adding a new item
      if (Math.random() < 0.25) { // Add new item 25% of the time
        const newItemId = `feed-${Date.now().toString().slice(-5)}`;
        const sources = ['Bloomberg', 'Financial Times', 'SEC Filing', 'Internal Alert System', 'OCC Bulletin'];
        const categories: FeedItemCategory[] = ['Market News', 'Regulatory Update', 'Compliance Advisory', 'Financial Crime', 'Internal Finding'];
        const titles = [
          'Breaking: New Crypto Regulation Bill Passes Senate',
          'Volatility Spikes in Commodity Markets After [Event]',
          'AI in Finance: FinCEN Issues Guidance on Model Risk Management',
          'Quarterly Compliance Review Identifies Gap in Trade Surveillance',
          'Updated AML Act of 2024: Key Changes for FIs',
        ];
        const snippets = [
          'The bill introduces stricter licensing and reporting for crypto exchanges...',
          'Oil and gas futures experience significant swings following supply chain disruptions...',
          'The guidance emphasizes robust validation and ongoing monitoring for AI/ML models used in financial crime detection...',
          'Automated trade surveillance parameters require adjustment to capture new market manipulation tactics...',
          'Institutions must update their AML programs by end of year to comply with enhanced CDD requirements...',
        ];

        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const newItem: FeedItem = {
          id: newItemId,
          timestamp: new Date().toISOString(),
          source: sources[Math.floor(Math.random() * sources.length)],
          title: titles[Math.floor(Math.random() * titles.length)],
          snippet: snippets[Math.floor(Math.random() * snippets.length)],
          category: randomCategory,
          status: 'New',
          relevanceScore: Math.floor(Math.random() * 50) + 50,
          priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as FeedItem['priority'],
        };
        setFeedItems(prevItems => [newItem, ...prevItems.slice(0, 19)]); // Keep max 20 items
      }

      // Simulate status updates for existing items
      setFeedItems(prevItems =>
        prevItems.map(item => {
          if (item.status === 'New' && Math.random() < 0.4) {
            return { ...item, status: 'Pending AI Analysis' as FeedItemStatus };
          }
          if (item.status === 'Pending AI Analysis' && Math.random() < 0.3) {
            return { ...item, status: 'AI Processing' as FeedItemStatus };
          }
          if (item.status === 'AI Processing' && Math.random() < 0.5) {
            const isRisk = Math.random() < 0.6;
            return {
              ...item,
              status: (isRisk ? 'AI Analyzed - Risk Flagged' : 'AI Analyzed - No Risk') as FeedItemStatus,
              flaggedKeywords: isRisk ? ['update', 'critical', 'action'] : undefined,
              assignedTo: isRisk ? ['Compliance Team', 'Risk Officers', 'Legal Dept.'][Math.floor(Math.random()*3)] : undefined,
            };
          }
          if (item.status === 'AI Analyzed - Risk Flagged' && Math.random() < 0.15) {
            return { ...item, status: 'Action Required' as FeedItemStatus };
          }
          return item;
        })
      );

      setLastUpdated(new Date().toLocaleTimeString());
    }, 7000); // Update every 7 seconds

    return () => clearInterval(intervalId);
  }, []);

  const getPriorityBadgeVariant = (priority?: FeedItem['priority']): 'destructive' | 'default' | 'secondary' | 'outline' => {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };
  
  const getPriorityClass = (priority?: FeedItem['priority']): string => {
    switch (priority) {
      case 'Critical': return 'border-red-500 dark:border-red-400';
      case 'High': return 'border-orange-500 dark:border-orange-400';
      case 'Medium': return 'border-yellow-500 dark:border-yellow-400';
      default: return 'border-border';
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center">
          <Globe className="mr-3 h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Live Risk & Regulatory Tracker</h1>
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          Last Updated: {lastUpdated}
        </div>
      </div>

      <Card className="bg-muted/30 shadow-inner">
        <CardContent className="pt-6">
        <p className="text-sm text-center text-muted-foreground">
          This live feed provides data inputs for AI-driven risk assessment and regulatory change monitoring models. 
          Status updates reflect the automated analysis pipeline.
        </p>
        </CardContent>
      </Card>

      <ScrollArea className="h-[calc(100vh-260px)] pr-3"> {/* Adjust height as needed */}
        <div className="space-y-4">
          {feedItems.map((item) => {
            const CategoryIcon = categoryIcons[item.category] || Activity;
            const currentStatusConfig = statusConfig[item.status];
            const StatusIcon = currentStatusConfig.icon || Activity;

            return (
              <Card key={item.id} className={cn("shadow-lg hover:shadow-xl transition-shadow border-l-4", getPriorityClass(item.priority))}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="h-7 w-7 text-primary flex-shrink-0" />
                      <div>
                        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          Source: {item.source} | Published: {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                     {item.priority && (
                      <Badge variant={getPriorityBadgeVariant(item.priority)} className="ml-auto capitalize whitespace-nowrap text-xs h-fit">
                        {item.priority} Priority
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3 space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">{item.snippet}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs capitalize">{item.category}</Badge>
                    <Badge variant="outline" className={cn("text-xs capitalize", currentStatusConfig.color, currentStatusConfig.textColor, `border-${currentStatusConfig.textColor?.replace('text-', '')}/30`)}>
                      <StatusIcon className={cn("mr-1.5 h-3.5 w-3.5", item.status === 'AI Processing' && 'animate-spin')} />
                      {item.status}
                    </Badge>
                    {item.relevanceScore && <Badge variant="outline" className="text-xs">Relevance: {item.relevanceScore}%</Badge>}
                  </div>
                  {item.flaggedKeywords && item.flaggedKeywords.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <strong>AI Flagged Keywords:</strong> {item.flaggedKeywords.join(', ')}
                    </div>
                  )}
                   {item.assignedTo && (
                    <p className="text-xs text-muted-foreground">
                      <strong>Assigned To:</strong> <Badge variant="outline" className="text-xs">{item.assignedTo}</Badge>
                    </p>
                  )}
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  {item.link && item.link !== '#' && (
                     <Button variant="outline" size="sm" asChild>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                           <ExternalLink className="mr-1.5 h-4 w-4" /> View Source
                        </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Eye className="mr-1.5 h-4 w-4" /> View Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
          {feedItems.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No new items in the feed currently. Waiting for updates...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}


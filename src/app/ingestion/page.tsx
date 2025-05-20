
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Webhook, FileCheck2, Orbit, AlertOctagon, SlidersHorizontal, ListChecks, RefreshCw, Zap, Archive, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ProcessingQueueItem } from '@/lib/types';

const initialQueueItems: ProcessingQueueItem[] = [
  { id: 'gdpr_ev_001', fileName: 'gdpr_events_stream_chunk_123.json', sourceSystem: 'GDPR Stream', status: 'Processing', submittedAt: '10:35 AM', progress: 75 },
  { id: 'fatf_san_002', fileName: 'fatf_sanctions_list_2024_q3.xml', sourceSystem: 'FATF Bulk Upload', status: 'Completed', submittedAt: '10:30 AM' },
  { id: 'internal_003', fileName: 'customer_update_batch_0729.csv', sourceSystem: 'Internal System', status: 'Failed', submittedAt: '10:15 AM', failureReason: 'Incompatible Date Format' },
  { id: 'gdpr_ev_004', fileName: 'gdpr_events_stream_chunk_124.json', sourceSystem: 'GDPR Stream', status: 'Pending', submittedAt: '10:40 AM' },
  { id: 'fatf_upd_005', fileName: 'fatf_watchlist_delta_0728.json', sourceSystem: 'FATF Bulk Upload', status: 'Pending', submittedAt: '10:42 AM' },
];

interface ApiHealth {
  status: 'Nominal' | 'Degraded' | 'Offline';
  color: 'bg-green-500' | 'bg-yellow-500' | 'bg-red-500';
  icon: React.ElementType;
}

export default function IngestionProcessingPage() {
  const [queueItems, setQueueItems] = useState<ProcessingQueueItem[]>(initialQueueItems);
  const [failureCount, setFailureCount] = useState(5);
  const [isRefreshingQueue, setIsRefreshingQueue] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [apiHealth, setApiHealth] = useState<ApiHealth>({ status: 'Nominal', color: 'bg-green-500', icon: CheckCircle });
  const { toast } = useToast();

  const updateTimestamps = () => {
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  useEffect(() => {
    updateTimestamps();
    // Simulate API health check
    // In a real app, this would be an API call
    setApiHealth({ status: 'Nominal', color: 'bg-green-500', icon: CheckCircle });

    const failureInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setFailureCount(prev => prev + 1);
      }
    }, 7000);
    return () => clearInterval(failureInterval);
  }, []);

  const handleRefreshQueue = () => {
    setIsRefreshingQueue(true);
    toast({ title: "Refreshing Queue...", description: "Fetching latest file statuses." });
    updateTimestamps(); 
    setTimeout(() => {
      const newStatusOptions: ProcessingQueueItem['status'][] = ['Pending', 'Processing', 'Completed', 'Failed'];
      const updatedItems = queueItems.map(item => {
        const newStatus = Math.random() > 0.3 ? item.status : newStatusOptions[Math.floor(Math.random() * newStatusOptions.length)];
        return {
        ...item,
        status: newStatus,
        progress: newStatus === 'Processing' ? Math.floor(Math.random() * 101) : undefined,
        failureReason: newStatus === 'Failed' && !item.failureReason ? 'New random error' : item.failureReason,
        submittedAt: new Date(Date.now() - Math.random() * 10000000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }});
      
      if (Math.random() > 0.5) {
        updatedItems.unshift({
          id: `file-${Date.now().toString().slice(-5)}`,
          fileName: `new_data_package_${Math.floor(Math.random() * 1000)}.zip`,
          sourceSystem: Math.random() > 0.5 ? 'GDPR Stream' : 'FATF Bulk Upload',
          status: 'Pending',
          submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      setQueueItems(updatedItems.slice(0, 6)); 
      setIsRefreshingQueue(false);
      toast({ title: "Queue Refreshed", description: "File statuses updated." });
    }, 1500);
  };

  return (
    <div className="space-y-8 p-1 md:p-2">
      <h1 className="text-3xl font-bold tracking-tight">Ingestion & Processing Hub</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">GDPR Data Stream</CardTitle>
            <Webhook className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Real-time event ingestion from GDPR compliance systems.</p>
            <Badge variant="default" className="mt-2 bg-primary/10 text-primary-foreground hover:bg-primary/20">Active</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">FATF Sanctions Feeds</CardTitle>
            <FileCheck2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Periodic updates from global FATF watchlists and advisories.</p>
            <Badge variant="default" className="mt-2 bg-primary/10 text-primary-foreground hover:bg-primary/20">Active</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            <Orbit className="h-5 w-5 text-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">System Operational</div>
            <p className="text-xs text-muted-foreground mt-1">Last Sync: {lastSyncTime || 'N/A'}</p>
            <div className="flex items-center mt-2">
              <p className="text-xs text-muted-foreground mr-2">API Health:</p>
              <Badge className={`${apiHealth.color} text-white text-xs`}>
                <apiHealth.icon className="h-3 w-3 mr-1" />
                {apiHealth.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingestion Failures</CardTitle>
            <AlertOctagon className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failureCount} <span className="text-sm text-muted-foreground">files failed</span></div>
            <p className="text-xs text-muted-foreground mt-1">Primary reason: <Badge variant="destructive" className="text-xs">Incompatible Format</Badge></p>
            <Button variant="outline" size="sm" className="mt-3">View Error Logs</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing Modes</CardTitle>
            <SlidersHorizontal className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-sm">Real-time Processing</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
               <div className="flex items-center">
                <Archive className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm">Batch Processing</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100">Available</Badge>
            </div>
             <p className="text-xs text-muted-foreground pt-2">System adapts to data velocity and volume requirements.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ListChecks className="h-6 w-6 mr-2 text-primary" />
              <CardTitle>File Processing Queue</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefreshQueue} disabled={isRefreshingQueue}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshingQueue ? 'animate-spin' : ''}`} />
              Refresh Queue
            </Button>
          </div>
          <CardDescription>Overview of files currently being processed or awaiting processing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">File ID</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Source System</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Progress</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Failure Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queueItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                    Processing queue is currently empty.
                  </TableCell>
                </TableRow>
              )}
              {queueItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell className="truncate max-w-xs" title={item.fileName}>{item.fileName}</TableCell>
                  <TableCell>{item.sourceSystem}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === 'Completed' ? 'default' : 
                        item.status === 'Failed' ? 'destructive' : 
                        item.status === 'Processing' ? 'secondary' :
                        'outline' 
                      }
                      className={
                        item.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                        item.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100' : ''
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status === 'Processing' && typeof item.progress === 'number' ? (
                      <div className="flex items-center gap-2">
                        <Progress value={item.progress} className="h-2 w-[60px]" /> 
                        <span className="text-xs text-muted-foreground">{item.progress}%</span>
                      </div>
                    ) : (
                      item.status === 'Completed' ? '100%' : 'N/A'
                    )}
                  </TableCell>
                  <TableCell>{item.submittedAt}</TableCell>
                  <TableCell className="text-destructive text-xs">{item.failureReason || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


    
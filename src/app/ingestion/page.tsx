
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Webhook, FileCheck2, Orbit, AlertOctagon, SlidersHorizontal, 
  ListChecks, RefreshCw, Zap, Archive, CheckCircle, AlertTriangle, XCircle,
  DatabaseZap, ArrowDownCircle, Share2, Eye
} from 'lucide-react';
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
      <h1 className="text-3xl font-bold tracking-tight">Ingestion &amp; Processing Hub</h1>

      <div>
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

      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-muted-foreground">
            <Share2 className="mr-2 h-5 w-5" /> System Architecture &amp; Health
          </CardTitle>
          <CardDescription>Visual overview of system connections and operational status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Central Hub */}
          <div className="flex justify-center">
            <div className="p-4 border-2 border-primary rounded-lg shadow-lg bg-background w-auto max-w-md text-center">
              <DatabaseZap className="h-10 w-10 mx-auto text-primary mb-2" />
              <h3 className="text-xl font-semibold text-primary">Ingestion &amp; Processing Hub</h3>
              <p className="text-md text-muted-foreground">Central Data Pipeline</p>
              <Badge className="mt-3 text-sm py-1 px-3 bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 border border-green-300 dark:border-green-500">Operational</Badge>
            </div>
          </div>

          {/* Connection Visual */}
          <div className="flex justify-center items-center space-x-4 text-muted-foreground py-4">
            <div className="h-px flex-grow bg-border max-w-xs"></div>
            <ArrowDownCircle className="h-8 w-8 text-primary" />
            <div className="h-px flex-grow bg-border max-w-xs"></div>
          </div>

          {/* Connected Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AML Module */}
            <Card className="relative shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
              <div className="absolute top-3 right-3 p-1.5 bg-green-100 dark:bg-green-700 rounded-full shadow">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-200" />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">AML Module</CardTitle>
                <CardDescription>Anti-Money Laundering Analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-1">Status: <span className="font-semibold text-green-600">Healthy</span></p>
                <p className="text-xs text-muted-foreground">Connection: Real-time</p>
              </CardContent>
            </Card>
            
            {/* Risk Module - Warning */}
            <Card className="relative shadow-md hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
              <div className="absolute top-3 right-3 p-1.5 bg-yellow-100 dark:bg-yellow-700 rounded-full shadow">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-200" />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Risk Module</CardTitle>
                <CardDescription>Risk Gap &amp; Assessment Engine</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-1">Status: <span className="font-semibold text-yellow-600">Warning</span></p>
                <p className="text-xs text-muted-foreground">Details: High processing latency detected.</p>
                <p className="text-xs text-muted-foreground">Last Update: 2 mins ago</p>
              </CardContent>
            </Card>
            
            {/* Controls Module - Error */}
            <Card className="relative shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500">
               <div className="absolute top-3 right-3 p-1.5 bg-red-100 dark:bg-red-700 rounded-full shadow">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-200" />
               </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Controls Module</CardTitle>
                <CardDescription>Compliance Control Suggestion</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-1">Status: <span className="font-semibold text-red-600">Error</span></p>
                <p className="text-xs text-muted-foreground">Details: Control suggestion API unresponsive.</p>
                <p className="text-xs text-muted-foreground">Last Attempt: 1 min ago</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <TableHead>Review &amp; Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queueItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
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
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1.5 h-4 w-4" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


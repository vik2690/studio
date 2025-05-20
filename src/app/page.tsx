"use client";

import { MetricCard } from '@/components/dashboard/MetricCard';
import { OverviewChart } from '@/components/dashboard/OverviewChart';
import { AlertTriangle, ShieldCheck, BarChartHorizontalBig, FileWarning, Users, Activity } from 'lucide-react';
import type { Metric, ChartDataPoint } from '@/lib/types';
import type { ChartConfig } from '@/components/ui/chart';

// Sample Data (replace with actual data fetching or state)
const overviewMetrics: Metric[] = [
  { title: "Identified Risks", value: "125", change: "+12 last month", changeType: "negative", icon: AlertTriangle, description: "Total open risks across the organization." },
  { title: "Applied Controls", value: "850", change: "+50 last month", changeType: "positive", icon: ShieldCheck, description: "Total active compliance controls." },
  { title: "Organization Risk Score", value: "68%", change: "-3% last month", changeType: "positive", icon: BarChartHorizontalBig, description: "Overall calculated risk exposure." },
  { title: "AML Hits", value: "15", change: "+2 this week", changeType: "negative", icon: FileWarning, description: "Suspicious transactions flagged." },
];

const riskTrendData: ChartDataPoint[] = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 135 },
  { name: "Mar", value: 110 },
  { name: "Apr", value: 140 },
  { name: "May", value: 125 },
  { name: "Jun", value: 150 },
];

const riskTrendChartConfig = {
  risks: {
    label: "Identified Risks",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const controlEffectivenessData: ChartDataPoint[] = [
  { name: "Q1", value: 75 },
  { name: "Q2", value: 82 },
  { name: "Q3", value: 78 },
  { name: "Q4", value: 85 },
];

const controlEffectivenessChartConfig = {
  effectiveness: {
    label: "Control Effectiveness (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview Dashboard</h1>
        {/* Add any global actions like "Generate Report" here */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <OverviewChart 
          data={riskTrendData} 
          title="Risk Trend Analysis"
          description="Monthly trend of identified risks."
          dataKey="value"
          xAxisKey="name"
          chartConfig={riskTrendChartConfig}
        />
        <OverviewChart 
          data={controlEffectivenessData} 
          title="Control Effectiveness"
          description="Quarterly control effectiveness score."
          dataKey="value"
          xAxisKey="name"
          chartConfig={controlEffectivenessChartConfig}
        />
      </div>
      
      {/* Placeholder for future sections */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Alerts will be displayed here.</p>
        </CardContent>
      </Card> */}
    </div>
  );
}

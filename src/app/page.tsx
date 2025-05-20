
"use client";

import { MetricCard } from '@/components/dashboard/MetricCard';
import { OverviewChart } from '@/components/dashboard/OverviewChart';
import { PieChartCard } from '@/components/dashboard/PieChartCard';
import { AlertTriangle, ShieldCheck, BarChartHorizontalBig, FileWarning } from 'lucide-react';
import type { Metric, ChartDataPoint } from '@/lib/types';
import type { ChartConfig } from '@/components/ui/chart';

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
  value: { 
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
  value: { 
    label: "Effectiveness (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const riskDistributionData: ChartDataPoint[] = [
  { name: "Critical", value: 25 },
  { name: "High", value: 40 },
  { name: "Medium", value: 60 },
  { name: "Low", value: 80 },
];

const riskDistributionChartConfig = {
  "Critical": { label: "Critical", color: "hsl(var(--chart-5))" }, 
  "High": { label: "High", color: "hsl(var(--chart-1))" },     
  "Medium": { label: "Medium", color: "hsl(var(--chart-2))" }, 
  "Low": { label: "Low", color: "hsl(var(--chart-3))" },      
} satisfies ChartConfig;

const controlStatusData: ChartDataPoint[] = [
  { name: "Implemented", value: 650 },
  { name: "Pending", value: 150 },
  { name: "Overdue", value: 50 },
];

const controlStatusChartConfig = {
  "Implemented": { label: "Implemented", color: "hsl(var(--chart-4))" }, 
  "Pending": { label: "Pending Review", color: "hsl(var(--chart-2))" }, 
  "Overdue": { label: "Overdue", color: "hsl(var(--chart-1))" },     
} satisfies ChartConfig;


export default function OverviewPage() {
  return (
    <div className="space-y-6"> 
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview Dashboard</h1>
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
        <PieChartCard
          data={riskDistributionData}
          title="Risk Distribution by Severity"
          description="Breakdown of risks by their severity level."
          dataKey="value"
          nameKey="name"
          chartConfig={riskDistributionChartConfig}
        />
        <OverviewChart 
          data={controlEffectivenessData} 
          title="Control Effectiveness"
          description="Quarterly control effectiveness score."
          dataKey="value"
          xAxisKey="name"
          chartConfig={controlEffectivenessChartConfig}
        />
        <PieChartCard
          data={controlStatusData}
          title="Control Implementation Status"
          description="Current status of applied controls."
          dataKey="value"
          nameKey="name"
          chartConfig={controlStatusChartConfig}
        />
      </div>
      
    </div>
  );
}


"use client"

import type { ChartDataPoint } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface OverviewChartProps {
  data: ChartDataPoint[];
  title: string;
  description?: string;
  dataKey: string; // Key for Y-axis values in the data objects
  xAxisKey: string; // Key for X-axis categories in the data objects
  chartConfig: ChartConfig; // Config where keys might represent series or aspects of the chart
}

export function OverviewChart({ data, title, description, dataKey, xAxisKey, chartConfig }: OverviewChartProps) {
  // Determine the fill color for the bar.
  // Assumes chartConfig might have a key matching dataKey or the first key in chartConfig is the relevant series.
  const seriesKey = Object.keys(chartConfig)[0]; // Get the first key from chartConfig as the series identifier
  const barFillColor = chartConfig[seriesKey]?.color || "hsl(var(--chart-1))"; // Fallback color

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border border-border/60 hover:border-primary/60">
      <CardHeader>
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} stroke="hsl(var(--foreground))" fontSize={12} />
              <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--foreground))" fontSize={12} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend 
                formatter={(value, entry, index) => {
                     // 'value' here is the dataKey of the Bar ('value' in our case)
                     // We want the label from the chartConfig for this series
                     const configEntry = chartConfig[value]; // or chartConfig[seriesKey]
                     return configEntry?.label || value;
                }}
              />
              <Bar 
                dataKey={dataKey} 
                fill={barFillColor} // Use the determined fill color
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

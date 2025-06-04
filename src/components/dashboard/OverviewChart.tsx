
"use client"

import type { ChartDataPoint } from '@/lib/types'; // Assuming ChartDataPoint might need adjustment if not already { name: string, [key: string]: number }
import { LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ViewBox } from 'recharts/types/util/types';

interface OverviewChartProps {
  data: any[]; // More generic data type
  title: string;
  description?: string;
  xAxisKey: string; // Key for X-axis categories in the data objects
  chartConfig: ChartConfig; // Config where keys map to series dataKeys and their visual properties
  chartType?: 'line' | 'bar'; // Optional: to specify chart type, default to line
}

export function OverviewChart({ data, title, description, xAxisKey, chartConfig, chartType = 'line' }: OverviewChartProps) {
  // Dynamically determine series keys from chartConfig that are present in the data
  // This assumes data objects might have various keys corresponding to series
  const seriesKeys = data.length > 0 
    ? Object.keys(chartConfig).filter(key => key in data[0]) 
    : [];

  // Custom legend payload formatter
  const legendFormatter = (value: string, entry: any) => {
    const configEntry = chartConfig[value as keyof ChartConfig];
    return configEntry?.label || value;
  };
  
  // Custom Tooltip formatter
  const renderTooltipContent = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {label}
              </span>
            </div>
            {payload.map((item: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-2 items-center gap-1.5 @apply [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground"
               >
                <div className="flex items-center">
                  <span
                    className="mr-1.5 h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: item.color || item.stroke }}
                  />
                  <span>{chartConfig[item.dataKey as keyof ChartConfig]?.label || item.name}</span>
                </div>
                <span className="font-bold text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null;
  }


  return (
    <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border border-border/60 hover:border-primary/60">
      <CardHeader>
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--foreground))" fontSize={12} />
                <Tooltip content={renderTooltipContent} />
                <Legend formatter={legendFormatter} />
                {seriesKeys.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={chartConfig[key]?.color || "hsl(var(--chart-1))"} // Fallback to chart-1 if color not in config
                    strokeWidth={2}
                    dot={{ r: 4, fill: chartConfig[key]?.color || "hsl(var(--chart-1))" }}
                    activeDot={{ r: 6 }}
                    name={chartConfig[key]?.label || key}
                  />
                ))}
              </LineChart>
            ) : (
              // Fallback or BarChart implementation (current one, might need similar multi-series adaptation if used)
              // For now, focusing on LineChart as requested for trends
              <div>BarChart to be implemented for multi-series or use existing logic if single series.</div>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

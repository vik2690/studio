
"use client"

import type { ChartDataPoint } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface PieChartCardProps {
  data: ChartDataPoint[];
  title: string;
  description?: string;
  dataKey: string; // Key in data objects for the slice value
  nameKey: string; // Key in data objects for the slice name/label
  chartConfig: ChartConfig;
}

export function PieChartCard({ data, title, description, dataKey, nameKey, chartConfig }: PieChartCardProps) {
  // Ensure chartConfig provides a color for each data point name.
  // Recharts' <Cell> component expects a 'fill' prop for each slice.
  // We map data to include the fill color from chartConfig.
  const chartDataWithColors = data.map((entry) => ({
    ...entry,
    fill: chartConfig[entry.name as string]?.color || '#8884d8', // Fallback color
  }));

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent hideLabel />} // hideLabel since legend shows names
              />
              <Pie
                data={chartDataWithColors}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                // label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                //   const RADIAN = Math.PI / 180;
                //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
                //   const y = cy + radius * Math.sin(-midAngle * RADIAN);
                //   return (
                //     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10px">
                //       {`${(percent * 100).toFixed(0)}%`}
                //     </text>
                //   );
                // }}
              >
                {chartDataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => {
                    const configEntry = chartConfig[value as string];
                    return configEntry?.label || value;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


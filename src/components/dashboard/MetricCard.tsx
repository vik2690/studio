
"use client";

import { useState } from 'react';
import type { Metric } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps extends Metric {}

export function MetricCard({ title, value, change, changeType, icon: Icon, description, breakdown }: MetricCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Define a minimum height for the card. This helps maintain layout stability during animations
  // and ensures enough space for typical content. Adjust as needed.
  const cardMinHeight = "170px";

  return (
    <Card
      className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-border/60 hover:border-primary/60 relative overflow-hidden"
      style={{ minHeight: cardMinHeight }}
      onMouseEnter={breakdown && breakdown.length > 0 ? () => setShowBreakdown(true) : undefined}
      onMouseLeave={breakdown && breakdown.length > 0 ? () => setShowBreakdown(false) : undefined}
    >
      {/* Main Metric View - This will slide out */}
      <div
        className={cn(
          "absolute inset-0 transition-transform duration-300 ease-in-out bg-card p-6 flex flex-col",
          {
            "-translate-x-full": showBreakdown && breakdown && breakdown.length > 0, // Slides out to the left
            "translate-x-0": !showBreakdown || !breakdown || breakdown.length === 0, // Visible
          }
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 !p-0"> {/* Padding reset as parent div has p-6 */}
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        </CardHeader>
        <CardContent className="!p-0 !pt-2"> {/* Padding reset, custom top padding */}
          <div className="text-3xl font-bold text-foreground">{value}</div>
          {change && (
            <p className={cn(
              "text-xs mt-1",
              changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
            )}>
              {change}
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </div>

      {/* Breakdown View - This will slide in */}
      {breakdown && breakdown.length > 0 && (
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-300 ease-in-out bg-card p-6 flex flex-col",
            {
              "translate-x-0": showBreakdown, // Slides in to be visible
              "translate-x-full": !showBreakdown, // Starts off-screen to the right
            }
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 !p-0"> {/* Padding reset */}
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title} Breakdown
            </CardTitle>
            {/* Optional: Icon for breakdown view title */}
          </CardHeader>
          <CardContent className="flex-grow !p-0 !pt-2 overflow-y-auto"> {/* Padding reset, custom top padding, scroll for long lists */}
            <ul className="space-y-1 text-sm">
              {breakdown.map((item) => (
                <li key={item.category} className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground">{item.category}:</span>
                  <span className="font-semibold text-card-foreground ml-2">{item.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </div>
      )}
    </Card>
  );
}


"use client";

import { useState } from 'react';
import type { Metric } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface MetricCardProps extends Metric {}

export function MetricCard({ title, value, change, changeType, icon: Icon, description, breakdown, detailsUrl }: MetricCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const cardMinHeight = detailsUrl ? "200px" : "170px";

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
            "-translate-x-full": showBreakdown && breakdown && breakdown.length > 0,
            "translate-x-0": !showBreakdown || !breakdown || breakdown.length === 0,
          }
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 !p-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        </CardHeader>
        <CardContent className="!p-0 !pt-2 flex-grow flex flex-col">
          <div className="flex-grow">
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
          </div>
          {/* "View Details" link removed from here */}
        </CardContent>
      </div>

      {/* Breakdown View - This will slide in */}
      {breakdown && breakdown.length > 0 && (
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-300 ease-in-out bg-card p-6 flex flex-col",
            {
              "translate-x-0": showBreakdown,
              "translate-x-full": !showBreakdown,
            }
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 !p-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title} Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow !p-0 !pt-2 overflow-y-auto flex flex-col">
            <ul className="space-y-1 text-sm flex-grow">
              {breakdown.map((item) => (
                <li key={item.category} className="flex justify-between items-start py-0.5">
                  <span className="text-muted-foreground whitespace-nowrap mr-2">{item.category}:</span>
                  <span className="font-semibold text-card-foreground text-right">{item.value}</span>
                </li>
              ))}
            </ul>
            {detailsUrl && ( // Show link if detailsUrl is provided when breakdown IS shown
              <div className="mt-2 pt-2 border-t border-border">
                <Link href={detailsUrl} passHref legacyBehavior>
                  <a className="text-xs text-primary hover:underline flex items-center">
                    View Details <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Link>
              </div>
            )}
          </CardContent>
        </div>
      )}
    </Card>
  );
}

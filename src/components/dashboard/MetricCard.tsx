
"use client";

import { useState } from 'react';
import type { Metric } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MetricCardProps extends Metric {}

export function MetricCard({ title, value, change, changeType, icon: Icon, description, breakdown }: MetricCardProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const cardElement = (
    <Card 
      className="shadow-xl hover:shadow-2xl transition-all duration-300 border border-border/60 hover:border-primary/60"
      onMouseEnter={breakdown && breakdown.length > 0 ? () => setIsPopoverOpen(true) : undefined}
      onMouseLeave={breakdown && breakdown.length > 0 ? () => setIsPopoverOpen(false) : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
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
    </Card>
  );

  if (breakdown && breakdown.length > 0) {
    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          {/* The cardElement itself is the trigger */}
          {cardElement}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 shadow-lg" side="bottom" align="center">
          <div className="text-sm">
            <p className="font-semibold mb-2 text-popover-foreground">{title} Breakdown:</p>
            <ul className="space-y-1">
              {breakdown.map((item) => (
                <li key={item.category} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{item.category}:</span>
                  <span className="font-semibold text-popover-foreground ml-2">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return cardElement;
}

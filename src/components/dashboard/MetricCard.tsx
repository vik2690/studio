
"use client";

import { useState } from 'react';
import type { Metric, MetricBreakdownItem } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface MetricCardProps extends Metric {}

export function MetricCard({ title, value, change, changeType, icon: Icon, description, breakdown, breakdownDetailsUrl, navUrl, breakdownAction }: MetricCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const cardMinHeight = "170px"; 

  const hasIndividualItemActions = breakdown?.some(item => !!item.action);
  const canShowBreakdown = (breakdown && breakdown.length > 0) || breakdownAction;

  const MainViewInnerContent = () => (
    <>
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
      </CardContent>
    </>
  );

  const mainViewClasses = cn(
    "absolute inset-0 transition-transform duration-300 ease-in-out bg-card p-6 flex flex-col",
    {
      "-translate-x-full": showBreakdown && canShowBreakdown,
      "translate-x-0": !showBreakdown || !canShowBreakdown,
    }
  );
  
  const mainViewLinkClasses = cn(mainViewClasses, "no-underline text-current focus:outline-none cursor-pointer");


  return (
    <Card
      className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-border/60 hover:border-primary/60 relative overflow-hidden"
      style={{ minHeight: cardMinHeight }}
      onMouseEnter={canShowBreakdown ? () => setShowBreakdown(true) : undefined}
      onMouseLeave={canShowBreakdown ? () => setShowBreakdown(false) : undefined}
    >
      {navUrl ? (
        <Link href={navUrl} legacyBehavior>
          <a className={mainViewLinkClasses}>
            <MainViewInnerContent />
          </a>
        </Link>
      ) : (
        <div className={mainViewClasses}>
          <MainViewInnerContent />
        </div>
      )}

      {/* Breakdown View - This will slide in */}
      {canShowBreakdown && (
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
              {title} {breakdown && breakdown.length > 0 ? "Breakdown" : "Details"}
            </CardTitle>
          </CardHeader>

          {breakdownDetailsUrl && showBreakdown && (
            <div className="py-1.5"> 
              <Link href={breakdownDetailsUrl} passHref legacyBehavior>
                <a className="text-xs text-primary hover:underline flex items-center">
                  View Details <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Link>
            </div>
          )}

          <CardContent className={cn(
            "flex-grow !p-0 overflow-y-auto flex flex-col",
            { "!pt-2": !(breakdownDetailsUrl && showBreakdown) } 
          )}>
            {breakdown && breakdown.length > 0 && (
              <ul className="space-y-1 text-sm flex-grow">
                {breakdown.map((item: MetricBreakdownItem) => (
                  <li key={item.category} className="flex justify-between items-center py-0.5">
                    <div className="flex-grow">
                      <span className="text-muted-foreground whitespace-nowrap mr-2">{item.category}:</span>
                      <span className="font-semibold text-card-foreground text-right">{item.value}</span>
                    </div>
                    {item.action && item.action.icon && (
                       <Button 
                         onClick={item.action.onClick} 
                         size="sm" 
                         variant="ghost" 
                         className="ml-2 px-1.5 py-1 h-auto"
                         title={item.action.label}
                         disabled={item.action.disabled}
                       >
                         <item.action.icon className="h-4 w-4" />
                       </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {showBreakdown && breakdownAction && !hasIndividualItemActions && (
              <div className={cn("mt-auto", breakdown && breakdown.length > 0 ? "pt-2" : "pt-0 flex-grow flex items-end")}>
                <Button onClick={breakdownAction.onClick} size="sm" className="w-full">
                  {breakdownAction.icon && <breakdownAction.icon className="mr-2 h-4 w-4" />}
                  {breakdownAction.label}
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      )}
    </Card>
  );
}

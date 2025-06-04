"use client";

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock3, MessageSquareWarning, ListTodo, FileClock, HelpCircle, CheckSquare as CheckSquareIcon } from 'lucide-react';
import type { Metric } from '@/lib/types';

export default function ReviewApprovalsPage() {
  const [completedApprovals, setCompletedApprovals] = useState(128);
  const [pendingApprovals, setPendingApprovals] = useState(23);
  const [approvalsNeedDiscussion, setApprovalsNeedDiscussion] = useState(7);

  const [completedReviews, setCompletedReviews] = useState(345);
  const [pendingReviews, setPendingReviews] = useState(42);
  const [reviewsNeedDiscussion, setReviewsNeedDiscussion] = useState(11);

  // Simulate dynamic updates for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedApprovals(prev => prev + Math.floor(Math.random() * 3));
      setPendingApprovals(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2));
      setApprovalsNeedDiscussion(prev => Math.max(0, prev + (Math.random() > 0.7 ? 1 : -1)));
      
      setCompletedReviews(prev => prev + Math.floor(Math.random() * 5));
      setPendingReviews(prev => Math.max(0, prev + Math.floor(Math.random() * 7) - 3));
      setReviewsNeedDiscussion(prev => Math.max(0, prev + (Math.random() > 0.6 ? 1 : -1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const approvalMetrics: Metric[] = [
    {
      title: "Completed Approvals",
      value: completedApprovals.toString(),
      icon: CheckCircle2,
      description: "Total items successfully approved.",
      changeType: "positive",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.toString(),
      icon: Clock3,
      description: "Items awaiting approval.",
      changeType: pendingApprovals > 20 ? "negative" : "default",
    },
    {
      title: "Approvals Needing Discussion",
      value: approvalsNeedDiscussion.toString(),
      icon: MessageSquareWarning,
      description: "Approvals flagged for further discussion or clarification.",
       changeType: approvalsNeedDiscussion > 5 ? "negative" : "default",
    },
  ];

  const reviewMetrics: Metric[] = [
    {
      title: "Completed Reviews",
      value: completedReviews.toString(),
      icon: ListTodo,
      description: "Total items successfully reviewed.",
      changeType: "positive",
    },
    {
      title: "Pending Reviews",
      value: pendingReviews.toString(),
      icon: FileClock,
      description: "Items awaiting review.",
      changeType: pendingReviews > 30 ? "negative" : "default",
    },
    {
      title: "Reviews Needing Discussion",
      value: reviewsNeedDiscussion.toString(),
      icon: HelpCircle,
      description: "Reviews flagged for discussion or requiring more information.",
      changeType: reviewsNeedDiscussion > 10 ? "negative" : "default",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <CheckSquareIcon className="mr-3 h-8 w-8 text-primary" />
          Review & Approvals Hub
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Approvals Dashboard</CardTitle>
          <CardDescription>Overview of current approval statuses.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {approvalMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Reviews Dashboard</CardTitle>
          <CardDescription>Overview of current review task statuses.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviewMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

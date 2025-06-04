
"use client";

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Clock3, MessageSquareWarning, ListTodo, FileClock, HelpCircle, CheckSquare as CheckSquareIcon, UserCheck, Eye } from 'lucide-react';
import type { Metric } from '@/lib/types';

const mockUsers = [
  { id: 'user_alice', name: 'Alice Wonderland' },
  { id: 'user_bob', name: 'Bob The Builder' },
  { id: 'user_charlie', name: 'Charlie Chaplin' },
  { id: 'user_diana', name: 'Diana Prince' },
];

export default function ReviewApprovalsPage() {
  const [completedApprovals, setCompletedApprovals] = useState(128);
  const [pendingApprovals, setPendingApprovals] = useState(23);
  const [approvalsNeedDiscussion, setApprovalsNeedDiscussion] = useState(7);

  const [completedReviews, setCompletedReviews] = useState(345);
  const [pendingReviews, setPendingReviews] = useState(42);
  const [reviewsNeedDiscussion, setReviewsNeedDiscussion] = useState(11);

  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined);
  const [selectedUserName, setSelectedUserName] = useState<string>("All Users");

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
  
  useEffect(() => {
    if (selectedUser && selectedUser !== 'all') {
      setSelectedUserName(mockUsers.find(u => u.id === selectedUser)?.name || "Selected User");
    } else {
      setSelectedUserName("All Users");
    }
  }, [selectedUser]);

  const approvalMetrics: Metric[] = [
    {
      title: "Completed Approvals",
      value: completedApprovals.toString(),
      icon: CheckCircle2,
      description: "Total items successfully approved.",
      changeType: "positive",
      navUrl: `/review-approvals/queue/completed-approvals${selectedUser && selectedUser !== 'all' ? '?user=' + selectedUser : ''}`,
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.toString(),
      icon: Clock3,
      description: "Items awaiting approval.",
      changeType: pendingApprovals > 20 ? "negative" : "default",
      navUrl: `/review-approvals/queue/pending-approvals${selectedUser && selectedUser !== 'all' ? '?user=' + selectedUser : ''}`,
    },
    {
      title: "Approvals Needing Discussion",
      value: approvalsNeedDiscussion.toString(),
      icon: MessageSquareWarning,
      description: "Approvals flagged for further discussion or clarification.",
       changeType: approvalsNeedDiscussion > 5 ? "negative" : "default",
       navUrl: `/review-approvals/queue/discussion-approvals${selectedUser && selectedUser !== 'all' ? '?user=' + selectedUser : ''}`,
    },
  ];

  const reviewMetrics: Metric[] = [
    {
      title: "Completed Reviews",
      value: completedReviews.toString(),
      icon: ListTodo,
      description: "Total items successfully reviewed.",
      changeType: "positive",
      navUrl: `/review-approvals/queue/completed-reviews${selectedUser && selectedUser !== 'all' ? '?user=' + selectedUser : ''}`,
    },
    {
      title: "Pending Reviews",
      value: pendingReviews.toString(),
      icon: FileClock,
      description: "Items awaiting review.",
      changeType: pendingReviews > 30 ? "negative" : "default",
      navUrl: `/review-approvals/queue/pending-reviews${selectedUser && selectedUser !== 'all' ? '?user=' + selectedUser : ''}`,
    },
    {
      title: "Reviews Needing Discussion",
      value: reviewsNeedDiscussion.toString(),
      icon: HelpCircle,
      description: "Reviews flagged for discussion or requiring more information.",
      changeType: reviewsNeedDiscussion > 10 ? "negative" : "default",
      navUrl: `/review-approvals/queue/discussion-reviews${selectedUser && selectedUser !== 'all' ? '?user=' + selectedUser : ''}`,
    },
  ];
  
  const myTasksMetrics: Metric[] = [
     {
      title: selectedUser && selectedUser !== 'all' ? "My Pending Approvals" : "Total Pending Approvals",
      value: pendingApprovals.toString(),
      icon: Clock3,
      description: selectedUser && selectedUser !== 'all' ? `Approvals assigned to you awaiting action.` : "All pending approvals system-wide.",
      changeType: pendingApprovals > 20 && (selectedUser && selectedUser !== 'all') ? "negative" : "default",
      navUrl: `/review-approvals/queue/pending-approvals${selectedUser && selectedUser !== 'all' ? '?user=' + selectedUser : ''}`,
    },
    {
      title: selectedUser && selectedUser !== 'all' ? "My Pending Reviews" : "Total Pending Reviews",
      value: pendingReviews.toString(),
      icon: FileClock,
      description: selectedUser && selectedUser !== 'all' ? `Review tasks assigned to you awaiting completion.` : "All pending reviews system-wide.",
      changeType: pendingReviews > 30 && (selectedUser && selectedUser !== 'all') ? "negative" : "default",
      navUrl: `/review-approvals/queue/pending-reviews${selectedUser && selectedUser !== 'all' ? '?user=' + selectedUser : ''}`,
    },
  ];

  // Update navUrls when selectedUser changes
  const metricsWithUserFilter = (metrics: Metric[]): Metric[] => {
    return metrics.map(metric => ({
      ...metric,
      navUrl: metric.navUrl?.split('?')[0] + (selectedUser && selectedUser !== 'all' ? `?user=${selectedUser}` : ''),
    }));
  };
  
  const currentApprovalMetrics = metricsWithUserFilter(approvalMetrics);
  const currentReviewMetrics = metricsWithUserFilter(reviewMetrics);
  const currentMyTasksMetrics = metricsWithUserFilter(myTasksMetrics);


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
          <CardTitle className="text-xl flex items-center">
            {selectedUser && selectedUser !== 'all' ? <UserCheck className="mr-2 h-6 w-6 text-primary" /> : <Eye className="mr-2 h-6 w-6 text-primary" />}
            {selectedUser && selectedUser !== 'all' ? `${selectedUserName}'s Open Tasks` : "Overview of All Open Tasks"}
          </CardTitle>
          <CardDescription>
            A summary of open approval and review tasks {selectedUser && selectedUser !== 'all' ? `for ${selectedUserName}` : 'across the system'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {currentMyTasksMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </CardContent>
      </Card>

      <div className="my-6"> {/* Moved user filter here */}
        <Label htmlFor="user-filter-select" className="text-base font-semibold mb-2 block">Filter by User</Label>
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger id="user-filter-select" className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a user to filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {mockUsers.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedUser && selectedUser !== 'all' && (
          <p className="text-sm text-muted-foreground mt-2">
            Showing tasks for: {mockUsers.find(u => u.id === selectedUser)?.name || 'Selected User'}. 
            Clear selection to see all tasks.
          </p>
        )}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">My Dashboard</CardTitle>
          <CardDescription>Overview of current approval and review statuses{selectedUser && selectedUser !== 'all' ? ` for ${selectedUserName}` : ''}.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentApprovalMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
          {currentReviewMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </CardContent>
      </Card>

    </div>
  );
}


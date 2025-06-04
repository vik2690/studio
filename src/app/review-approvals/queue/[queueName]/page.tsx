
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

// Helper function to generate a readable title from the queueName
const generateTitle = (queueName: string): string => {
  if (!queueName) return "Queue";
  return queueName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + ' Queue';
};

export default function QueuePage() {
  const params = useParams();
  const queueName = params.queueName as string;
  const title = generateTitle(queueName);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <Link href="/review-approvals" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Review & Approvals Hub
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            This is a placeholder page for the {title.toLowerCase()}. 
            In a real application, this page would display a list of items relevant to this queue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Specific queue items and management tools would be implemented here.
          </p>
          {/* Placeholder for table or list of queue items */}
          <div className="mt-4 p-8 border border-dashed rounded-md flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground">Queue items would appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CitationDetailsPage() {
  const params = useParams();
  const citationId = params.citationId ? decodeURIComponent(params.citationId as string) : "Unknown Citation";

  // In a real app, you would fetch detailed information about the citationId here.
  // For now, we'll display some placeholder content.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Citation Details</h1>
        <Link href="/reporting" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reporting Hub
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Citation: {citationId}</CardTitle>
          <CardDescription>
            Detailed information and context for the selected regulatory citation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This page provides detailed information about the regulatory citation: <strong>{citationId}</strong>.
          </p>
          <p>
            In a complete application, this section would contain:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>The full text of the citation.</li>
            <li>Interpretations and official guidance related to it.</li>
            <li>Links to the source regulatory document.</li>
            <li>Historical amendments or versions.</li>
            <li>Related internal policies and controls mapped to this citation.</li>
            <li>Any enforcement actions or case law associated with it.</li>
            <li>AI-generated summaries or key takeaways.</li>
          </ul>
          <p className="text-muted-foreground">
            (This is placeholder content. Functionality to fetch and display real citation details would be implemented here.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

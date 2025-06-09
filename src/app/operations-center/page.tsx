
"use client";

import { Button } from '@/components/ui/button';
import { Activity as ActivityIcon } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OperationsCenterPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <ActivityIcon className="mr-3 h-8 w-8 text-primary" />
          AI Operations Center
        </h1>
         <Button variant="outline" size="sm" onClick={() => window.location.reload()}> 
            Refresh All
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>AI Agent Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            AI Agent status and operational details have been moved to the main <a href="/" className="text-primary hover:underline">Overview Dashboard</a>.
          </p>
        </CardContent>
      </Card>

      {/* Other non-agent related content for Operations Center could go here in the future */}
      
    </div>
  );
}

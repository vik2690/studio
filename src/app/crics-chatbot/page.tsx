
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function CricsChatbotPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Bot className="mr-3 h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">CRICS Chatbot</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cognitive Risk Intelligence & Control System Chatbot</CardTitle>
          <CardDescription>
            Interact with the CRICS AI to get insights, ask questions, and navigate compliance data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed rounded-md p-8">
            <Bot className="h-24 w-24 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground text-center">
              Chatbot interface will be implemented here.
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              You'll be able to ask questions like: "What are the latest updates to MiFID II?" or "Summarize the key risks in Q3."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

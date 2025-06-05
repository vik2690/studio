
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const detailedRiskDataInput = [
  { riskId: 'R1', description: 'Data breach due to phishing', likelihood: 4, impact: 5, controlEffectiveness: 0.6 },
  { riskId: 'R2', description: 'Regulatory non-compliance', likelihood: 3, impact: 4, controlEffectiveness: 0.5 },
  { riskId: 'R3', description: 'Loan default rate spike', likelihood: 2, impact: 4, controlEffectiveness: 0.4 },
  { riskId: 'R4', description: 'Vendor service interruption', likelihood: 3, impact: 3, controlEffectiveness: 0.8 },
  { riskId: 'R5', description: 'IT system failure', likelihood: 5, impact: 4, controlEffectiveness: 0.5 },
];

const processedDetailedRiskData = detailedRiskDataInput.map(item => {
  const scoreValue = item.likelihood * item.impact * (1 - item.controlEffectiveness);
  return {
    ...item,
    residualRiskScoreFormula: `${item.likelihood} × ${item.impact} × (1 – ${item.controlEffectiveness.toFixed(1)})`,
    residualRiskScoreValue: scoreValue.toFixed(1),
  };
});

export default function RiskScoreDetailsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Residual Risk Score Details</h1>
        <Link href="/" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Overview
          </Button>
        </Link>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Residual Risk Calculation Table</CardTitle>
          <CardDescription>
            This table breaks down the calculation for individual residual risks based on their likelihood, impact, and the effectiveness of controls in place.
            The formula used for each item is: 
            <br />
            <code className="font-mono text-sm p-1 bg-muted rounded">
              Residual Risk Score = Likelihood × Impact × (1 – Control Effectiveness)
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk ID</TableHead>
                <TableHead>Risk Description</TableHead>
                <TableHead className="text-right">Likelihood (1–5)</TableHead>
                <TableHead className="text-right">Impact (1–5)</TableHead>
                <TableHead className="text-right">Control Effectiveness (0–1)</TableHead>
                <TableHead className="text-right">Residual Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedDetailedRiskData.map((item) => (
                <TableRow key={item.riskId}>
                  <TableCell className="font-medium">{item.riskId}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.likelihood}</TableCell>
                  <TableCell className="text-right">{item.impact}</TableCell>
                  <TableCell className="text-right">{item.controlEffectiveness.toFixed(1)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    <span className="font-mono text-xs text-muted-foreground block">{item.residualRiskScoreFormula} =</span>
                    {item.residualRiskScoreValue}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p><strong>Note:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li><strong>Likelihood:</strong> Estimated probability of the risk occurring (1=Very Low, 5=Very High).</li>
              <li><strong>Impact:</strong> Potential severity if the risk materializes (1=Negligible, 5=Catastrophic).</li>
              <li><strong>Control Effectiveness:</strong> Assessed effectiveness of existing controls in mitigating the risk (0=No effective controls, 1=Fully effective controls).</li>
              <li>The "Organization Risk Score" (e.g., 68%) seen on the overview dashboard is a high-level aggregation. This page provides a detailed look at how individual residual risks might be calculated and contribute to the overall profile.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

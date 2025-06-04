
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample data based on the user's request format
const riskScoreTableData = [
  { riskType: "Cybersecurity", likelihood: 4, impact: 5, weight: 0.25 },
  { riskType: "Compliance", likelihood: 2, impact: 4, weight: 0.20 },
  { riskType: "Financial", likelihood: 3, impact: 3, weight: 0.15 },
  { riskType: "Operational", likelihood: 3, impact: 2, weight: 0.20 },
  { riskType: "Reputational", likelihood: 2, impact: 4, weight: 0.20 },
];

// Calculate score for each item and the total
const processedRiskScoreData = riskScoreTableData.map(item => ({
  ...item,
  score: item.likelihood * item.impact * item.weight,
}));

const totalCalculatedScore = processedRiskScoreData.reduce((acc, item) => acc + item.score, 0);

export default function RiskScoreDetailsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Detailed Organization Risk Score</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Weighted Risk Score Table</CardTitle>
          <CardDescription>
            The overall organization risk score is derived from various weighted risk types.
            The formula used is: <span className="font-mono">Risk Score = Σ(Likelihoodᵢ × Impactᵢ × Weightᵢ)</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk Type</TableHead>
                <TableHead className="text-right">Likelihood (1–5)</TableHead>
                <TableHead className="text-right">Impact (1–5)</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="text-right">Score (L × I × W)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedRiskScoreData.map((item) => (
                <TableRow key={item.riskType}>
                  <TableCell className="font-medium">{item.riskType}</TableCell>
                  <TableCell className="text-right">{item.likelihood}</TableCell>
                  <TableCell className="text-right">{item.impact}</TableCell>
                  <TableCell className="text-right">{item.weight.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">{item.score.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableRow className="border-t-2 border-primary bg-muted/30">
              <TableCell colSpan={4} className="text-right font-bold text-lg">Total Weighted Score</TableCell>
              <TableCell className="text-right font-bold text-lg">{totalCalculatedScore.toFixed(2)}</TableCell>
            </TableRow>
          </Table>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p><strong>Note:</strong> The percentage-based "Organization Risk Score" (e.g., 68%) seen on the overview dashboard is typically a normalized representation of this Total Weighted Score, often scaled or compared against a maximum possible score or organizational risk appetite thresholds.</p>
            <div>
              <h4 className="font-semibold text-card-foreground mb-1">Definitions:</h4>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li><strong>Likelihood (Lᵢ):</strong> Probability of the risk event occurring (typically on a 1–5 scale, where 5 is highest).</li>
                <li><strong>Impact (Iᵢ):</strong> Severity of the consequences if the risk event occurs (typically on a 1–5 scale, where 5 is highest).</li>
                <li><strong>Weight (Wᵢ):</strong> Relative importance or contribution of the risk type or specific risk item to the overall risk profile. The sum of weights for all considered risk types usually equals 1.00 (or 100%).</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck, ListTree, ShieldCheck, UserCheck, DatabaseZap, FileOutput, 
  ExternalLink, FolderSearch, Brain as ResponsibleAIIcon, BrainCircuit 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditToolCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  actionLabel?: string;
  onActionClick?: () => void;
  linkUrl?: string; 
}

const AuditToolCard: React.FC<AuditToolCardProps> = ({ title, description, icon: Icon, actionLabel, onActionClick, linkUrl }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="h-7 w-7 text-primary" />
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground italic">
          Specific audit tools and data views would be accessible here.
        </div>
      </CardContent>
      {(actionLabel || linkUrl) && (
        <div className="p-4 pt-0 border-t mt-auto">
          {linkUrl ? (
            <Button variant="outline" className="w-full justify-start" asChild>
              {/* Use Next.js Link for internal navigation if these were real pages */}
              <a href={linkUrl} target="_blank" rel="noopener noreferrer"> 
                {actionLabel || "Go to Tool"}
                <ExternalLink className="ml-auto h-4 w-4" />
              </a>
            </Button>
          ) : actionLabel && onActionClick && (
            <Button variant="outline" className="w-full" onClick={onActionClick}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default function AuditHubPage() {
  const { toast } = useToast();

  const handlePlaceholderAction = (toolName: string) => {
    toast({
      title: "Action Triggered",
      description: `Auditor action for: ${toolName}. (This is a placeholder).`,
    });
  };

  const handleDownloadResponsibleAIReport = () => {
    const reportContent = `
# Responsible AI in Risk & AML - Audit Report

## Key Parameters of Responsible AI in Risk & AML

| Dimension                       | Description                                                               | AML/Risk Example                                                                                           |
|---------------------------------|---------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| Fairness & Non-Discrimination   | Avoid biases based on race, gender, geography, etc.                       | Ensuring SAR (Suspicious Activity Reports) aren't disproportionately generated for certain ethnic groups.      |
| Explainability (XAI)            | Models should offer understandable rationales for decisions.              | When a transaction is flagged, the reason (e.g., "Unusual volume pattern vs. peer benchmark") should be clear. |
| Transparency & Auditability     | AI decisions must be traceable and open to audit.                         | Model logs, version control, input/output documentation must be accessible to auditors and regulators.       |
| Accountability                  | Defined roles for AI design, use, monitoring, and remediation.            | Business unit must review flagged transactions and override or accept AI decisions with justification.       |
| Robustness & Security           | Models must perform reliably and withstand manipulation.                  | Prevent adversarial attacks like generating synthetic identities to fool KYC/AML systems.                    |
| Privacy & Data Protection       | Respect for customer privacy and adherence to data protection laws.       | Avoid using unnecessary PII or storing transaction history longer than regulatory limits.                    |
| Human-in-the-Loop (HITL)        | Humans must review critical decisions, especially in high-risk scenarios. | Compliance analysts reviewing AI-generated alerts before reporting to FINCEN.                                |
| Continuous Monitoring & Governance | Ongoing assessment for drift, bias, and performance.                      | Periodically check if false positives are increasing in specific segments or geographies.                      |
| Regulatory Alignment            | Alignment with local and international AML and compliance regulations.    | AI must comply with FATF recommendations, EU AML directives, OCC, or MAS guidelines.                       |

## Additional Considerations

### Model Documentation & Fact Sheets (e.g., Model Cards)
- Include intended use, assumptions, performance metrics.

### Ethical Risk Taxonomy
- Identify and manage ethical risks at each stage (data ingestion, model training, deployment).

### Scenario Testing
- Use adversarial testing and synthetic data to evaluate robustness and edge cases.

## Example Use Case Breakdown

**Scenario:** AI system flags a transaction for AML review

| Step             | Responsible AI Check                                                 |
|------------------|----------------------------------------------------------------------|
| Data Ingestion   | Ensure training data isn’t biased toward specific customer demographics. |
| Model Prediction | Ensure model can justify why the transaction was flagged.              |
| Alert Review     | Provide analysts with reasons and confidence scores.                   |
| Feedback Loop    | Analyst feedback updates model performance.                            |
| Audit            | Logs, justifications, and overrides are stored for regulators.       |
`;

    const blob = new Blob([reportContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Responsible_AI_Audit_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Initiated",
      description: "Responsible AI Audit Report (Responsible_AI_Audit_Report.txt) download has started.",
    });
  };

  const handleDownloadAIModelReport = () => {
    const reportContent = `
# CRICS AI Model Inventory & Details - Audit Report

## Model: Risk Sentinel Agent (ID: risk-sentinel)
-   **Purpose:** Detects new/emerging risks from various internal and external data sources.
-   **Type:** Natural Language Processing (NLP), Classification
-   **LLM/Base Model:** Gemini 1.5 Pro (Vertex AI)
-   **Version:** 1.2.3
-   **Deployment Date:** 2024-05-10
-   **Training Data Summary:** Mix of public news articles (Reuters, Bloomberg archives - 1M articles), anonymized internal incident reports (10k records), regulatory publications (5k documents). Last updated: 2024-07-01.
-   **Key Parameters/Configuration:**
    -   Input Text Length: Max 8192 tokens
    -   Output Categories: Geopolitical, Market, Operational, Cybersecurity, Regulatory
    -   Confidence Threshold for Alerting: 0.75
    -   Risk Scoring Algorithm: Proprietary weighted model v2.1
-   **Performance Metrics (Last Evaluation: 2024-07-15):**
    -   Accuracy (Risk Identification): 92%
    -   Precision (High-Impact Risks): 88%
    -   Recall (High-Impact Risks): 85%
    -   Bias Assessment: Passed (Fairness score: 0.95 across demographic proxies)
-   **Monitoring:** Continuous monitoring via Vertex AI Model Monitoring. Alerts set for performance drift > 5%.
-   **Data Retention for Logs:** 12 months for input/output, 24 months for audit logs.

## Model: Control Validator Agent (ID: control-validator)
-   **Purpose:** Periodically tests key controls and gathers compliance evidence.
-   **Type:** Rule-Based System with NLP for evidence parsing.
-   **LLM/Base Model (for NLP):** Claude 3 Sonnet (Bedrock)
-   **Version:** 2.0.1
-   **Deployment Date:** 2024-06-01
-   **Training Data Summary (for NLP parser):** 5000 sample compliance documents, control descriptions, and evidence logs.
-   **Key Parameters/Configuration:**
    -   Control Test Frequency: As per control definition (e.g., SOX C-045: Monthly)
    -   Evidence Matching Threshold: 0.85 (semantic similarity)
-   **Performance Metrics (Last Evaluation: 2024-07-20):**
    -   Control Test Accuracy: 99.5%
    -   Evidence Parsing Accuracy: 90%
-   **Monitoring:** Rule execution logs, NLP parser accuracy checks quarterly.

## Model: AML Transaction Screener (ID: aml-transaction-screener)
-   **Purpose:** Monitors transactions for potential AML hits.
-   **Type:** Hybrid (Rule-Based + Anomaly Detection ML)
-   **LLM/Base Model (for pattern analysis):** Gemini 1.5 Flash (with custom AML Rule Engine)
-   **Version:** 3.1.0
-   **Deployment Date:** 2024-03-15
-   **Key Parameters/Configuration:**
    -   Rule Sets: FATF, OFAC, EU Sanctions, Internal Risk Typologies
    -   Anomaly Detection Sensitivity: Medium-High
    -   Transaction Thresholds: Configurable per jurisdiction
-   **Performance Metrics (Last Evaluation: 2024-07-01):**
    -   True Positive Rate (SARs): 75%
    -   False Positive Rate: 5%
-   **Monitoring:** Real-time alert volume, rule performance metrics, model drift for anomaly detection.

---
*This report is generated for audit purposes. Details are based on the latest available information.*
    `;
    const blob = new Blob([reportContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AI_Model_Details_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Initiated",
      description: "AI Model Details Report (AI_Model_Details_Report.txt) download has started.",
    });
  };


  const auditTools: AuditToolCardProps[] = [
    {
      title: "Audit Log Explorer",
      description: "Access and search system-wide activity logs, including access, changes, and critical system events. Filter by date, user, event type, and more.",
      icon: ListTree,
      actionLabel: "Explore Logs",
      onActionClick: () => handlePlaceholderAction("Audit Log Explorer"),
    },
    {
      title: "Compliance & Control Review",
      description: "Review internal policies, regulatory mappings, control documentation, and evidence of control effectiveness.",
      icon: ShieldCheck,
      actionLabel: "Review Controls",
      onActionClick: () => handlePlaceholderAction("Compliance & Control Review"),
    },
    {
      title: "User Access & Permissions Audit",
      description: "Analyze user roles, permissions, access history, and segregation of duties (SoD) conflicts.",
      icon: UserCheck,
      actionLabel: "Audit User Access",
      onActionClick: () => handlePlaceholderAction("User Access & Permissions Audit"),
    },
    {
      title: "Data Integrity Dashboard",
      description: "Monitor data validation processes, reconciliation reports, data lineage, and data quality metrics.",
      icon: DatabaseZap,
      actionLabel: "View Data Integrity",
      onActionClick: () => handlePlaceholderAction("Data Integrity Dashboard"),
    },
    {
      title: "Audit Reporting Toolkit",
      description: "Generate standard and custom audit reports, evidence packages, and export data extracts for offline analysis.",
      icon: FileOutput,
      actionLabel: "Generate Reports",
      onActionClick: () => handlePlaceholderAction("Audit Reporting Toolkit"),
    },
    {
      title: "Incident & Case Review",
      description: "Review documented security incidents, compliance breaches, investigation trails, and their resolution.",
      icon: FolderSearch,
      actionLabel: "Review Cases",
      onActionClick: () => handlePlaceholderAction("Incident & Case Review"),
    },
    {
      title: "Responsible AI Audit",
      description: "Review AI model fairness, bias, transparency, accountability, and adherence to ethical AI principles and policies.",
      icon: ResponsibleAIIcon,
      actionLabel: "Download Report",
      onActionClick: handleDownloadResponsibleAIReport,
    },
    {
      title: "AI Model Inventory",
      description: "Review details of AI models used in CRICS, including configurations, parameters, versions, and performance metrics.",
      icon: BrainCircuit,
      actionLabel: "Download Model Report",
      onActionClick: handleDownloadAIModelReport,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <ClipboardCheck className="mr-3 h-8 w-8 text-primary" />
          Audit Hub
        </h1>
      </div>

      <p className="text-lg text-muted-foreground">
        A centralized platform for auditors to access necessary tools, logs, and documentation for comprehensive system audits.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {auditTools.map((tool) => (
          <AuditToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            actionLabel={tool.actionLabel}
            onActionClick={tool.onActionClick}
            linkUrl={tool.linkUrl}
          />
        ))}
      </div>
    </div>
  );
}


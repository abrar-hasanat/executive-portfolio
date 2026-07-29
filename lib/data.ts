import { Award, LineChart, TerminalSquare, type LucideIcon } from "lucide-react";

export interface CredentialItem {
  name: string;
  badge?: string;
}

export interface CredentialCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  items: CredentialItem[];
}

export const credentialCategories: CredentialCategory[] = [
  {
    id: "certifications",
    title: "Earned & Target Certifications",
    icon: Award,
    items: [
      { name: "Microsoft Power BI Data Analyst (PL-300)" },
      { name: "Lean Six Sigma Green Belt (CSSC)" },
      { name: "Professional Scrum Master I (PSM I)" },
      { name: "Google Project Management Professional" },
      { name: "IBM Business Analyst Professional" },
      { name: "PMI CAPM Certification (In Progress)" },
      { name: "AWS Certified AI Practitioner (In Progress)" },
    ],
  },
  {
    id: "strategy-operations",
    title: "Strategy & Operations",
    icon: LineChart,
    items: [
      { name: "Financial Modeling & Valuation" },
      { name: "Agile (Scrum) & DMAIC Frameworks" },
      { name: "Enterprise Analysis & Business Cases" },
      { name: "Pricing Optimization & Market Research" },
      { name: "Project Lifecycle & Risk Management" },
      { name: "UAT Testing & Change Management" },
    ],
  },
  {
    id: "technical-stack",
    title: "Data & Technical Stack",
    icon: TerminalSquare,
    items: [
      { 
        name: "Microsoft Power BI", 
        badge: "https://img.shields.io/badge/Power_BI-112240?style=flat-square&logo=powerbi&logoColor=3B82F6" 
      },
      { 
        name: "Advanced Excel", 
        badge: "https://img.shields.io/badge/Excel-112240?style=flat-square&logo=microsoftexcel&logoColor=3B82F6" 
      },
      { 
        name: "SQL & R", 
        badge: "https://img.shields.io/badge/SQL_&_R-112240?style=flat-square&logo=sqlite&logoColor=3B82F6" 
      },
      { 
        name: "AWS Cloud", 
        badge: "https://img.shields.io/badge/AWS_Cloud-112240?style=flat-square&logo=amazonwebservices&logoColor=3B82F6" 
      },
      { 
        name: "Workday ERP", 
        badge: "https://img.shields.io/badge/Workday_ERP-112240?style=flat-square&logo=workday&logoColor=3B82F6" 
      },
      { 
        name: "Next.js & Tailwind", 
        badge: "https://img.shields.io/badge/Next.js-112240?style=flat-square&logo=nextdotjs&logoColor=3B82F6" 
      },
    ],
  },
];

export interface CaseStudy {
  id: string;
  title: string;
  company?: string;
  client?: string;
  eyebrow?: string;
  role?: string;
  period?: string;
  summary?: string;
  problem?: string;
  problemStatement?: string;
  methodology?: string;
  methodologies?: string[];
  techStack?: string[];
  impact?: string;
  strategicSolution?: string;
  metrics?: { label: string; value: string }[];
  impactMetrics?: { label: string; value: string }[];
  techStack?: string[];
  outcomes?: string[];
  dashboardUrl?: string;
  liveDashboardUrl?: string;
  repoUrl?: string;
  githubRepoUrl?: string;
  mockupPath?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "bay-oceania-gtm",
    title: "Commercial Construction & Tender Pipeline Analytics",
    company: "Bay Oceania C&T Ltd.",
    role: "Business Development Summer Analyst",
    period: "Summer 2026",
    impactMetrics: [
      { label: "Tender Value Captured", value: "$15M+" },
      { label: "Turnaround Reduction", value: "20%" },
      { label: "Opportunities Secured", value: "15+" },
    ],
    summary:
      "Spearheaded go-to-market strategy across the commercial construction and government procurement sectors by engineering automated Power BI pipeline trackers and financial models to capture 15+ high-value tender opportunities.",
    methodologies: ["Lean Six Sigma (DMAIC)", "Agile (Scrum)", "Financial Modeling"],
    techStack: ["Power BI", "Excel / DAX", "SQL", "Python"],
    problemStatement:
      "Legacy tender tracking relied on fragmented spreadsheets, causing proposal bottlenecks, delayed leadership reporting, and missed high-value government procurement cycles.",
    strategicSolution:
      "Designed an automated Power BI pipeline tracker integrated with custom financial models to standardize cross-functional proposal workflows and provide real-time visibility for operational leadership.",
    outcomes: [
      "Captured 15+ high-value tender opportunities valued at $15M+.",
      "Accelerated proposal preparation turnaround time by 20% using Lean Six Sigma (DMAIC) workflow optimization.",
      "Deployed automated executive dashboard for weekly pipeline review cycles.",
    ],
    githubRepoUrl: "https://github.com/abrar-hasanat/tender-pipeline-analytics",
  },
  {
    id: "taa-services",
    eyebrow: "Operations · Lean Six Sigma",
    client: "TAA Services / Carleton ERP",
    title: "Operational Team Capacity & Backlog Optimization",
    problem:
      "Ticket backlog and uneven team capacity were slowing service delivery, with no structured process for isolating root causes or validating fixes before rollout.",
    methodology:
      "Applied DMAIC methodology to map the intake-to-resolution process, identify capacity constraints, and lead structured Workday ERP user acceptance testing ahead of go-live.",
    impact:
      "Backlog volume and cycle time dropped as capacity was reallocated to verified bottlenecks, and UAT findings prevented several defects from reaching production.",
    metrics: [
      { label: "Methodology", value: "DMAIC" },
      { label: "ERP UAT cycles led", value: "Workday" },
    ],
    repoUrl: "https://github.com/abrar-hasanat",
  },
  {
    id: "market-entry",
    eyebrow: "Valuation · Quantitative Modeling",
    client: "Independent Research",
    title: "Economic Strategy & Valuation: Quantitative Market Entry Model",
    problem:
      "Entering a new market requires weighing demand signals, competitive positioning, and capital requirements together, but most public models treat these in isolation.",
    methodology:
      "Built a quantitative valuation model combining market-sizing, discounted cash flow, and sensitivity analysis to stress-test entry scenarios under different demand and pricing assumptions.",
    impact:
      "Produced a defensible, scenario-tested recommendation framework for market entry timing and investment sizing, grounded in transparent, auditable assumptions.",
    metrics: [
      { label: "Scenarios modeled", value: "Multi-case" },
      { label: "Core method", value: "DCF + Sensitivity" },
    ],
    repoUrl: "https://github.com/abrar-hasanat",
  },
];

export const socials = {
  email: "abrar@abrarhasanat.com",
  linkedin: "https://linkedin.com/in/ahasanat",
  github: "https://github.com/abrar-hasanat",
};

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
  eyebrow: string;
  client: string;
  title: string;
  problem: string;
  methodology: string;
  impact: string;
  metrics: { label: string; value: string }[];
  dashboardUrl: string;
  repoUrl: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "bay-oceania",
    eyebrow: "Commercial Strategy · Power BI",
    client: "Bay Oceania C&T Ltd.",
    title: "Commercial Tender Pipeline & Power BI Analytics",
    problem:
      "Tender opportunities were tracked across disconnected spreadsheets, making it difficult for the commercial team to prioritize high-value bids or spot bottlenecks before deadlines.",
    methodology:
      "Designed a centralized data model in Power BI, built DAX measures to score opportunities by value and win-probability, and automated a refreshed pipeline view for weekly leadership reviews.",
    impact:
      "The new pipeline surfaced high-value opportunities early and cut proposal turnaround time, giving the commercial team a single source of truth for prioritization.",
    metrics: [
      { label: "High-value opportunities captured", value: "$15M+" },
      { label: "Turnaround time reduction", value: "20%" },
    ],
    dashboardUrl: "https://novypro.com/",
    repoUrl: "https://github.com/abrar-hasanat",
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
    dashboardUrl: "https://novypro.com/",
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
    dashboardUrl: "https://novypro.com/",
    repoUrl: "https://github.com/abrar-hasanat",
  },
];

export const socials = {
  email: "abrar@abrarhasanat.com",
  linkedin: "https://linkedin.com/in/ahasanat",
  github: "https://github.com/abrar-hasanat",
};

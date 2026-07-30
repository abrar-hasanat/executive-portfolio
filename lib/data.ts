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
      { label: "Tender Value Captured", value: "$150K+" },
      { label: "Turnaround Reduction", value: "20%" },
      { label: "Opportunities Secured", value: "15+" },
    ],
    summary:
      "Spearheaded go-to-market strategy across the commercial construction and government procurement sectors by engineering automated Power BI pipeline trackers and financial models to capture 15+ tender opportunities.",
    methodologies: ["Lean Six Sigma (DMAIC)", "Agile (Scrum)", "Financial Modeling"],
    techStack: ["Power BI", "Excel / DAX", "SQL", "Python"],
    problemStatement:
      "Legacy tender tracking relied on fragmented spreadsheets, causing proposal bottlenecks, delayed leadership reporting, and missed high-value government procurement cycles.",
    strategicSolution:
      "Designed an automated Power BI pipeline tracker integrated with custom financial models to standardize cross-functional proposal workflows and provide real-time visibility for operational leadership.",
    outcomes: [
      "Captured 15+ tender opportunities valued at $150K+.",
      "Accelerated proposal preparation turnaround time by 20% using Lean Six Sigma (DMAIC) workflow optimization.",
      "Deployed automated dashboard for weekly pipeline review cycles.",
    ],
    mockupPath: "/mockups/dashboard-mockup.svg",
    liveDashboardUrl: "/dashboards/tender-pipeline",
    githubRepoUrl: "https://github.com/abrar-hasanat/tender-pipeline-analytics",
  },
  {
    id: "carleton-erp-migration",
    title: "Enterprise ERP Migration & Capacity Optimization",
    company: "Carleton College / TAA Services",
    role: "Operations & ERP Migration Analyst",
    period: "Workday ERP Cutover",
    impactMetrics: [
      { label: "Processing Backlog", value: "-20%" },
      { label: "UAT Pass Rate", value: "98%" },
      { label: "Scaling Support", value: "3x Team" },
    ],
    summary:
      "Led Workday ERP cutover readiness analytics, UAT validation, and Lean Six Sigma capacity modeling to reduce processing backlog while supporting a 3x team expansion strategy.",
    methodologies: ["Lean Six Sigma (DMAIC)", "Agile (Scrum) UAT", "Capacity Modeling"],
    techStack: ["Power BI", "DAX", "SQL", "Python", "Workday ERP"],
    problemStatement:
      "High administrative backlogs and registration bottlenecks created service-delivery risk during the migration from legacy Colleague ERP workflows to Workday ERP operations.",
    strategicSolution:
      "Mapped baseline cycle times, executed structured UAT scripts, standardized DMAIC improvements, and modeled FTE allocation required to sustain SLA coverage under 3x growth.",
    outcomes: [
      "Reduced peak-volume processing backlog by 20% through DMAIC cycle-time optimization.",
      "Verified 150+ UAT scripts with a 98% pass rate before Workday ERP cutover.",
      "Built capacity allocation logic to support 3x team expansion without SLA degradation.",
    ],
    githubRepoUrl: "https://github.com/abrar-hasanat/operations-capacity-forecasting",
    liveDashboardUrl: "/dashboards/operations-capacity",
    mockupPath: "/mockups/carleton-erp-tablet.svg",
  },
  {
    id: "economic-valuation-model",
    title: "Quantitative Market Entry & Multi-Variable Valuation Model",
    company: "Carleton Economics Department",
    role: "Econometrics & Market Strategy Researcher",
    period: "Case Study #3",
    impactMetrics: [
      { label: "Variance Explained (R²)", value: "0.89" },
      { label: "Sample Evaluated", value: "50K+" },
      { label: "Confidence Interval", value: "95%" },
    ],
    summary:
      "Built an econometric valuation system connecting multivariate OLS regression, synthetic emerging-market enterprise observations, and Monte Carlo policy-shock simulations for cross-border market entry decisions.",
    methodologies: ["Multivariate OLS", "Monte Carlo Simulation", "Policy Stress Testing"],
    techStack: ["Python", "R", "SQL", "Next.js", "Tailwind CSS"],
    problemStatement:
      "C-suite market-entry decisions require defensible links between macro risk, sector fixed effects, policy uncertainty, and valuation multiples, yet most diligence artifacts are static and scenario-light.",
    strategicSolution:
      "Generated a 50,000+ observation macro-valuation dataset, estimated valuation-multiple sensitivities with OLS, and embedded a real-time dashboard to stress-test interest-rate and regulatory shocks.",
    outcomes: [
      "Explained 89% of valuation-multiple variance through macroeconomic and sector covariates.",
      "Simulated 10,000 policy-shock paths to compare baseline and high-risk valuation confidence intervals.",
      "Translated econometric coefficients into an executive dashboard for investment timing and risk-adjusted entry prioritization.",
    ],
    githubRepoUrl: "https://github.com/abrar-hasanat/economic-market-valuation",
    liveDashboardUrl: "/dashboards/economic-valuation",
    mockupPath: "/mockups/dashboard-mockup.svg",
  },
];

export const socials = {
  email: "abrar@abrarhasanat.com",
  linkedin: "https://linkedin.com/in/ahasanat",
  github: "https://github.com/abrar-hasanat",
};

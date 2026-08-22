import { Award, LineChart, TerminalSquare, type LucideIcon } from "lucide-react";

export interface CredentialItem { name: string; badge?: string; }
export interface CredentialCategory { id: string; title: string; icon: LucideIcon; items: CredentialItem[]; }

export const credentialCategories: CredentialCategory[] = [
  { id: "certifications", title: "Credentials", icon: Award, items: [
    { name: "Lean Six Sigma Green Belt (CSSC)" },
    { name: "Professional Scrum Master I (PSM I)" },
    { name: "Google Project Management Professional Certificate" },
    { name: "IBM Business Analyst Professional Certificate" },
    { name: "Microsoft Power BI Data Analyst" },
    { name: "PMI Certified Associate in Project Management (CAPM), in progress" },
    { name: "AWS Certified AI Practitioner (AIF-C01), in progress" },
  ] },
  { id: "operations", title: "Operations", icon: LineChart, items: [
    { name: "Financial modeling and valuation" }, { name: "UAT and data validation" },
    { name: "Process mapping" }, { name: "Vendor SLA scoring" },
  ] },
  { id: "tools", title: "Tools", icon: TerminalSquare, items: [
    { name: "Next.js and TypeScript" }, { name: "Python and PostgreSQL" },
    { name: "IBM Cognos and Power BI" }, { name: "Workday ERP" },
  ] },
];

export interface CaseStudy {
  id: string; title: string; company?: string; client?: string; role?: string; period?: string; summary?: string;
  problem?: string; problemStatement?: string; methodology?: string; methodologies?: string[]; techStack?: string[];
  strategicSolution?: string; metrics?: { label: string; value: string }[]; impactMetrics?: { label: string; value: string }[];
  outcomes?: string[]; dashboardUrl?: string; liveDashboardUrl?: string; repoUrl?: string; githubRepoUrl?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "valuation-engine", title: "Enterprise Financial Valuation Engine", period: "June 2026",
    summary: "Built a valuation tool with sensitivity analysis and equity research memo export.",
    techStack: ["Next.js", "TypeScript", "Python", "DCF Modeling"],
    impactMetrics: [{ label: "Valuation scenarios", value: "$23B+" }, { label: "Sensitivity grid", value: "5x5" }, { label: "Memo export", value: "1-click" }],
    outcomes: ["Validated across $23B+ in valuation scenarios.", "Built 5x5 WACC and growth sensitivity grids.", "Added 1-click equity research memo export."],
    liveDashboardUrl: "/dashboards/valuation-engine", githubRepoUrl: "https://github.com/abrar-hasanat/enterprise-valuation-engine",
  },
  {
    id: "agile-velocity", title: "Agile Velocity and Probabilistic Capacity Forecaster", period: "August 2026",
    summary: "Built a delivery forecaster using Monte Carlo trials and RICE scoring.",
    techStack: ["Python", "Monte Carlo", "RICE Framework"],
    impactMetrics: [{ label: "Monte Carlo trials", value: "10,000" }, { label: "Forecasts", value: "P50, P80, P90" }],
    outcomes: ["Ran 10,000 Monte Carlo trials.", "Forecasted P50, P80, and P90 release milestones.", "Applied RICE feature prioritization scoring."],
    liveDashboardUrl: "/dashboards/agile-velocity", githubRepoUrl: "https://github.com/abrar-hasanat/executive-portfolio",
  },
  {
    id: "demand-forecast", title: "Demand Forecasting Model", period: "January 2026",
    summary: "Analyzed order history to forecast demand and identify inventory risks.",
    techStack: ["Python", "PostgreSQL", "IBM Cognos"],
    impactMetrics: [{ label: "Order history", value: "42 months" }, { label: "Forecast accuracy", value: "91%" }, { label: "Stockout warning", value: "3 weeks" }],
    outcomes: ["Analyzed 42 months of order history.", "Reached 91% forecast accuracy.", "Flagged stockout risks 3 weeks ahead of peak Q4 volume."],
    githubRepoUrl: "https://github.com/abrar-hasanat/wishing-star-demand-forecast",
  },
  {
    id: "bay-oceania", title: "Tender Pipeline", company: "Bay Oceania C&T Ltd.", role: "Business Development", period: "June 2026 to August 2026",
    summary: "Tracked tender opportunities and prospective enterprise clients.", techStack: ["Power BI", "Excel"],
    impactMetrics: [{ label: "Tender opportunities", value: "15+" }, { label: "Enterprise clients", value: "50+" }, { label: "Turnaround reduction", value: "20%" }],
    outcomes: ["Identified 15+ tender opportunities.", "Managed 50+ prospective enterprise clients.", "Reduced turnaround time by 20%."],
    liveDashboardUrl: "/dashboards/tender-pipeline", githubRepoUrl: "https://github.com/abrar-hasanat/executive-portfolio",
  },
  {
    id: "taa-services", title: "Research Team Planning", company: "TAA Services", period: "October 2025 to December 2025",
    summary: "Developed a phased research team hiring plan and vendor evaluation tools.", techStack: ["Excel", "Vendor SLA scoring"],
    impactMetrics: [{ label: "Research team expansion", value: "3x" }],
    outcomes: ["Planned a 3x research team expansion.", "Built a cost-benefit model for in-house hiring and agency partnerships.", "Created a vendor SLA performance scoring framework."],
  },
  {
    id: "carleton", title: "Workday ERP Migration Support", company: "Carleton College Registrar and Provost Office", period: "September 2023 to Present",
    summary: "Supported the migration from Colleague to Workday ERP.", techStack: ["Workday ERP", "UAT", "Data validation"],
    impactMetrics: [{ label: "Transcript backlog reduction", value: "15%" }],
    outcomes: ["Supported the Colleague to Workday ERP migration.", "Performed UAT and backend data validation.", "Reduced the transcript processing backlog by 15%."],
    liveDashboardUrl: "/dashboards/operations-capacity", githubRepoUrl: "https://github.com/abrar-hasanat/executive-portfolio",
  },
  {
    id: "wishing-star", title: "Fulfillment Workflow", company: "Wishing Star by Shantu", period: "June 2021 to Present",
    summary: "Adjusted fulfillment workflows using Lean Six Sigma.", techStack: ["Lean Six Sigma"],
    impactMetrics: [{ label: "Year-over-year revenue expansion", value: "45%" }, { label: "Revenue increase", value: "+$17,500" }],
    outcomes: ["Expanded year-over-year revenue by 45% (+$17,500).", "Adjusted fulfillment workflows using Lean Six Sigma."],
  },
  {
    id: "stargate", title: "Executive Reporting", company: "Stargate TechMax Limited", period: "May 2021 to June 2023",
    summary: "Mapped finance and administration processes to improve executive reporting.", techStack: ["Process mapping"],
    impactMetrics: [{ label: "Reporting turnaround reduction", value: "25%" }],
    outcomes: ["Reduced executive reporting turnaround by 25%.", "Mapped processes across finance and administration divisions."],
  },
];

export interface InteractiveDashboard { id: string; title: string; subtitle: string; tag: string; category: "Finance" | "Operations"; href: string; githubUrl: string; features: string[]; }
export const interactiveDashboards: InteractiveDashboard[] = [
  { id: "valuation-engine", title: "Enterprise Financial Valuation Engine", subtitle: "DCF modeling with 5x5 WACC and growth sensitivity grids and memo export.", tag: "Finance", category: "Finance", href: "/dashboards/valuation-engine", githubUrl: "https://github.com/abrar-hasanat/enterprise-valuation-engine", features: ["5x5 sensitivity grids", "1-click memo export", "$23B+ scenarios"] },
  { id: "agile-velocity", title: "Agile Velocity and Capacity Forecaster", subtitle: "Monte Carlo release forecasts with RICE prioritization.", tag: "Operations", category: "Operations", href: "/dashboards/agile-velocity", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio", features: ["10,000 trials", "P50, P80, P90", "RICE scoring"] },
  { id: "tender-pipeline", title: "Tender Pipeline", subtitle: "Tender opportunity and client tracking.", tag: "Operations", category: "Operations", href: "/dashboards/tender-pipeline", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio", features: ["15+ opportunities", "50+ clients", "20% reduction"] },
  { id: "operations-capacity", title: "Workday Migration Support", subtitle: "UAT and backend data validation for the Colleague to Workday migration.", tag: "Operations", category: "Operations", href: "/dashboards/operations-capacity", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio", features: ["15% backlog reduction", "UAT", "Data validation"] },
];

export const socials = { email: "abrar@abrarhasanat.com", linkedin: "https://linkedin.com/in/ahasanat", github: "https://github.com/abrar-hasanat" };

import { Award, LineChart, TerminalSquare, type LucideIcon } from "lucide-react";

export interface CredentialItem { name: string; badge?: string; }
export interface CredentialCategory { id: string; title: string; icon: LucideIcon; items: CredentialItem[]; }

export const credentialCategories: CredentialCategory[] = [
  { id: "certifications", title: "Credentials", icon: Award, items: [
    { name: "Lean Six Sigma Green Belt (CSSC)" },
    { name: "Professional Scrum Master I (PSM I)" },
    { name: "Google Project Management Professional Certificate" },
    { name: "IBM Business Analyst Professional Certificate" },
    { name: "Microsoft Power BI Data Analyst Professional Certificate" },
    { name: "PMI Certified Associate in Project Management (CAPM) (In Progress)" },
    { name: "AWS Certified AI Practitioner (In Progress)" },
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
    impactMetrics: [{ label: "Valuation test cases", value: "$23B+" }, { label: "Sensitivity grid", value: "25 cells" }, { label: "Equity memo export", value: "1-click" }],
    outcomes: ["Scoped $23B+ across valuation test cases.", "Automated 25-cell WACC and growth sensitivity grids.", "Added 1-click equity memo export."],
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
    impactMetrics: [{ label: "Order history", value: "42 months" }, { label: "Stockout warning", value: "3 weeks" }],
    outcomes: ["Trained the forecast on 42 months of order history.", "Flagged stockout risk 3 weeks before peak Q4 demand."],
    githubRepoUrl: "https://github.com/abrar-hasanat/wishing-star-demand-forecast",
  },
  {
    id: "bay-oceania", title: "Tender Pipeline", company: "Bay Oceania C&T Ltd.", role: "Business Development Analyst", period: "June 2026 to August 2026",
    summary: "Tracked tender opportunities and prospective enterprise clients.", techStack: ["Power BI", "Excel"],
    impactMetrics: [{ label: "Tender opportunities", value: "15+" }, { label: "Enterprise clients", value: "50+" }, { label: "Turnaround reduction", value: "20%" }],
    outcomes: ["Added 15+ priority tender opportunities after screening for bid feasibility.", "Created pipeline visibility across 50+ enterprise prospects.", "Reduced proposal turnaround time by 20%."],
    liveDashboardUrl: "/dashboards/tender-pipeline", githubRepoUrl: "https://github.com/abrar-hasanat/executive-portfolio",
  },
  {
    id: "taa-services", title: "Research Team Planning", company: "TAA Services", role: "Consulting Analyst Extern", period: "October 2025 to December 2025",
    summary: "Developed a phased research team hiring plan and vendor evaluation tools.", techStack: ["Excel", "Vendor SLA scoring"],
    impactMetrics: [{ label: "Research team expansion", value: "3x" }],
    outcomes: ["Converted a planned 3x expansion into a phased staffing roadmap.", "Modeled annual cost and time-to-fill for internal hiring and agency support.", "Used an SLA scoring framework to shortlist 3 agency partners."],
  },
  {
    id: "carleton", title: "Workday ERP Migration Support", company: "Carleton College Registrar’s and Provost’s Office", period: "September 2023 to Present",
    summary: "Supported the migration from Colleague to Workday ERP.", techStack: ["Workday ERP", "UAT", "Data validation"],
    impactMetrics: [{ label: "Transcript backlog reduction", value: "15%" }],
    outcomes: ["Supported the Colleague to Workday ERP migration.", "Performed UAT and backend data validation.", "Reduced the transcript processing backlog by 15%."],
    liveDashboardUrl: "/dashboards/operations-capacity", githubRepoUrl: "https://github.com/abrar-hasanat/executive-portfolio",
  },
  {
    id: "wishing-star", title: "Cross-Border E-Commerce Operations", company: "Wishing Star by Shantu", role: "Founder", period: "June 2021 to Present",
    summary: "Built supplier partnerships and managed procurement and fulfillment from order receipt through delivery.", techStack: ["Demand Forecasting", "DMAIC"],
    impactMetrics: [{ label: "Year-over-year revenue growth", value: "45%" }, { label: "Revenue increase", value: "+$18.9k" }, { label: "Stockout warning", value: "3 weeks" }],
    outcomes: ["Increased year-over-year revenue by 45% (+$18.9k).", "Flagged stockout risk 3 weeks before peak Q4 demand.", "Analyzed 42 months of order history to adjust replenishment controls."],
  },
  {
    id: "stargate", title: "Executive Reporting", company: "Stargate TechMax LTD.", role: "Executive Assistant to the CEO", period: "May 2021 to June 2023",
    summary: "Mapped reporting workflows across finance and administration departments.", techStack: ["Process Mapping"],
    impactMetrics: [{ label: "Previous reporting cycle", value: "3.5 weeks" }, { label: "Updated reporting cycle", value: "11 days" }],
    outcomes: ["Reduced the reporting cycle from 3.5 weeks to 11 days.", "Trimmed product processing times by 15% by standardizing workflows and handoffs."],
  },
];

export interface InteractiveDashboard { id: string; title: string; subtitle: string; tag: string; category: "Finance" | "Operations"; kind: "Interactive tool" | "Case study"; href: string; githubUrl: string; features: string[]; }
export const interactiveDashboards: InteractiveDashboard[] = [
  { id: "valuation-engine", kind: "Interactive tool", title: "Enterprise Financial Valuation Engine", subtitle: "DCF modeling with 5x5 WACC and growth sensitivity grids and memo export.", tag: "Finance", category: "Finance", href: "/dashboards/valuation-engine", githubUrl: "https://github.com/abrar-hasanat/enterprise-valuation-engine", features: ["25-cell sensitivity grid", "1-click memo export", "$23B+ test cases"] },
  { id: "agile-velocity", kind: "Interactive tool", title: "Agile Velocity and Capacity Forecaster", subtitle: "Monte Carlo release forecasts with RICE prioritization.", tag: "Operations", category: "Operations", href: "/dashboards/agile-velocity", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio", features: ["10,000 trials", "P50, P80, P90", "RICE scoring"] },
  { id: "tender-pipeline", kind: "Case study", title: "Tender Pipeline", subtitle: "Tender opportunity and client tracking.", tag: "Operations", category: "Operations", href: "/dashboards/tender-pipeline", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio", features: ["15+ opportunities", "50+ clients", "20% reduction"] },
  { id: "operations-capacity", kind: "Case study", title: "Workday Migration Support", subtitle: "UAT and backend data validation for the Colleague to Workday migration.", tag: "Operations", category: "Operations", href: "/dashboards/operations-capacity", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio", features: ["15% backlog reduction", "UAT", "Data validation"] },
];

export const socials = { email: "abrar@abrarhasanat.com", linkedin: "https://linkedin.com/in/abrarhasanat", github: "https://github.com/abrar-hasanat" };

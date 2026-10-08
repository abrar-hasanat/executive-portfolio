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
    { name: "AWS Certified AI Practitioner" },
    { name: "CFA Program Level I Candidate (May 2027)" },
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
  outcomes?: string[]; dashboardUrl?: string; liveDashboardUrl?: string; repoUrl?: string; githubRepoUrl?: string; metricsLabel?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "bangladesh-rmg", title: "Bangladesh Apparel Trade and Worker Protection", period: "May 2026 - Present",
    summary: "Examines US apparel sourcing after Rana Plaza using 120 UN Comtrade records. Connects the trade results to published research on worker protection.",
    techStack: ["Python", "UN Comtrade", "Policy Research", "Recharts"],
    metricsLabel: "Research scope",
    impactMetrics: [{ label: "Official trade records", value: "120" }, { label: "Calendar years", value: "2010-2019" }, { label: "Apparel chapters", value: "HS 61 + 62" }],
    outcomes: ["Validated real US-reported import data and documented historical preference exposure.", "Decomposed the change in Bangladesh's US apparel market share.", "Separated sourcing patterns from causal and worker welfare claims."],
    dashboardUrl: "/projects/bangladesh-rmg", githubRepoUrl: "https://github.com/abrar-hasanat/executive-portfolio/tree/main/research/bangladesh-rmg",
  },
  {
    id: "valuation-engine", title: "Enterprise Financial Valuation Engine", period: "June 2026",
    summary: "Built a valuation tool with sensitivity analysis and equity research memo export.",
    techStack: ["Next.js", "TypeScript", "Python", "DCF Modeling"],
    impactMetrics: [{ label: "Sensitivity grid", value: "25 cells" }, { label: "Equity memo export", value: "PDF" }],
    outcomes: ["Calculated a 25-cell sensitivity grid for discount rates and terminal growth.", "Added a downloadable memo with the scenario inputs and valuation results."],
    liveDashboardUrl: "/dashboards/valuation-engine", githubRepoUrl: "https://github.com/abrar-hasanat/enterprise-valuation-engine",
  },
  {
    id: "agile-velocity", title: "Agile Velocity and Probabilistic Capacity Forecaster", period: "August 2026",
    summary: "Built a release-planning demonstration with synthetic sprint history and RICE feature scoring.",
    techStack: ["Python", "Monte Carlo", "RICE Framework"],
    impactMetrics: [{ label: "Monte Carlo trials", value: "10,000" }, { label: "Forecasts", value: "P50, P80, P90" }],
    outcomes: ["Ran 10,000 Monte Carlo trials to estimate release milestones from synthetic sprint data.", "Ranked candidate features using RICE scores."],
    liveDashboardUrl: "/dashboards/agile-velocity", githubRepoUrl: "https://github.com/abrar-hasanat/executive-portfolio",
  },
  {
    id: "demand-forecast", title: "Synthetic Demand Forecasting Model", period: "January 2026",
    summary: "Built a weekday demand baseline using synthetic e-commerce orders. Tested each forecast against later observations and compared expected demand with a reorder threshold.",
    techStack: ["Python", "PostgreSQL", "IBM Cognos"],
    impactMetrics: [{ label: "Synthetic order history", value: "42 months" }, { label: "Supplier lead time", value: "21 days" }],
    outcomes: ["Analyzed 42 months of synthetic order history.", "Calculated forecasts using only earlier observations, with measured error and a 21-day reorder-threshold check."],
    githubRepoUrl: "https://github.com/abrar-hasanat/wishing-star-demand-forecast",
  },
  {
    id: "bay-oceania", title: "Tender Pipeline", company: "Bay Oceania C&T Ltd.", role: "Business Development Analyst", period: "June 2026 to August 2026",
    summary: "Completed an unpaid, supervised remote internship in tender qualification, pipeline analysis, and market-risk assessment, supported by Carleton College Career Center funding.", techStack: ["Power BI", "Excel"],
    impactMetrics: [{ label: "Tender opportunities reviewed", value: "15+" }, { label: "Enterprise prospects organized", value: "50+" }, { label: "Turnaround reduction", value: "20%" }],
    outcomes: ["Reviewed 15+ commercial construction and public-procurement opportunities using contract value, expected margin, and bid-feasibility criteria.", "Built an Excel and Power BI tracker to organize 50+ enterprise prospects and support pipeline review.", "Mapped the tender workflow and presented recommendations associated with a 20% shorter proposal turnaround."],
    liveDashboardUrl: "/dashboards/tender-pipeline", githubRepoUrl: "https://github.com/abrar-hasanat/executive-portfolio",
  },
  {
    id: "taa-services", title: "Research Team Planning", company: "TAA Services", role: "Consulting Analyst Extern", period: "October 2025 to December 2025",
    summary: "Completed an unpaid Carleton Career Center externship focused on supervised training in workforce planning, cost analysis, and vendor evaluation.", techStack: ["Excel", "Vendor SLA scoring"],
    impactMetrics: [{ label: "Planned research team expansion", value: "3x" }],
    outcomes: ["Translated a planned 3x research-team expansion into phased staffing scenarios.", "Modeled annual cost and time-to-fill across internal-hiring and agency-support options.", "Applied an SLA scoring framework to compare agencies and identify 3 potential partners."],
  },
  {
    id: "carleton", title: "Workday ERP Migration Support", company: "Carleton College Registrar’s and Provost’s Office", period: "September 2023 to Present",
    summary: "Supported the migration from Colleague to Workday ERP.", techStack: ["Workday ERP", "UAT", "Data validation"],
    impactMetrics: [{ label: "Transcript backlog reduction", value: "15%" }],
    outcomes: ["Supported the Colleague to Workday ERP migration.", "Performed UAT and backend data validation.", "Reduced the transcript processing backlog by 15%."],
    liveDashboardUrl: "/dashboards/operations-capacity", githubRepoUrl: "https://github.com/abrar-hasanat/executive-portfolio",
  },
  {
    id: "wishing-star", title: "Cross-Border E-Commerce Operations", company: "Wishing Star by Shantu", role: "Founder", period: "June 2021 to August 2023",
    summary: "Founded a cross-border e-commerce business and managed procurement and fulfillment through August 2023.", techStack: ["Supplier Management", "Order Fulfillment"],
    impactMetrics: [{ label: "Year-over-year revenue growth", value: "45%" }, { label: "Revenue increase", value: "+$18.9k" }],
    outcomes: ["Increased year-over-year revenue by 45% (+$18.9k).", "Retain passive ownership; day-to-day operations are independently managed by the local team."],
  },
  {
    id: "stargate", title: "Executive Reporting", company: "Stargate TechMax LTD.", role: "Executive Assistant to the CEO", period: "May 2021 to June 2023",
    summary: "Mapped reporting workflows across finance and administration departments.", techStack: ["Process Mapping"],
    impactMetrics: [{ label: "Previous reporting cycle", value: "3.5 working weeks" }, { label: "Updated reporting cycle", value: "11 working days" }],
    outcomes: ["Reduced the reporting cycle from 3.5 working weeks to 11 working days.", "Trimmed product processing times by 15% by standardizing workflows and handoffs."],
  },
];

export interface InteractiveDashboard { id: string; title: string; subtitle: string; tag: string; category: "Finance" | "Operations" | "Research"; kind: "Interactive tool" | "Case study"; href: string; githubUrl: string; features: string[]; }
export const interactiveDashboards: InteractiveDashboard[] = [
  { id: "bangladesh-rmg", kind: "Interactive tool", title: "Bangladesh Apparel Sourcing", subtitle: "Observed US import trends, supplier comparisons and chapter composition after Rana Plaza. Descriptive evidence with documented limits.", tag: "Research", category: "Research", href: "/dashboards/bangladesh-rmg", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio/tree/main/research/bangladesh-rmg", features: ["120 official records", "2010-2019", "Reproducible analysis"] },
  { id: "valuation-engine", kind: "Interactive tool", title: "Enterprise Financial Valuation Engine", subtitle: "DCF modeling with 5x5 WACC and growth sensitivity grids and memo export.", tag: "Finance", category: "Finance", href: "/dashboards/valuation-engine", githubUrl: "https://github.com/abrar-hasanat/enterprise-valuation-engine", features: ["25-cell sensitivity grid", "PDF memo export"] },
  { id: "agile-velocity", kind: "Interactive tool", title: "Agile Velocity and Capacity Forecaster", subtitle: "Monte Carlo release forecasts with RICE prioritization.", tag: "Operations", category: "Operations", href: "/dashboards/agile-velocity", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio", features: ["10,000 trials", "P50, P80, P90", "RICE scoring"] },
  { id: "tender-pipeline", kind: "Case study", title: "Tender Pipeline", subtitle: "Unpaid, supervised remote internship project in tender qualification and pipeline analysis.", tag: "Operations", category: "Operations", href: "/dashboards/tender-pipeline", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio", features: ["15+ opportunities reviewed", "50+ prospects organized", "20% shorter turnaround"] },
  { id: "operations-capacity", kind: "Case study", title: "Workday Migration Support", subtitle: "UAT and backend data validation for the Colleague to Workday migration.", tag: "Operations", category: "Operations", href: "/dashboards/operations-capacity", githubUrl: "https://github.com/abrar-hasanat/executive-portfolio", features: ["15% backlog reduction", "UAT", "Data validation"] },
];

export const socials = { email: "abrar@abrarhasanat.com", linkedin: "https://linkedin.com/in/abrarhasanat", github: "https://github.com/abrar-hasanat" };

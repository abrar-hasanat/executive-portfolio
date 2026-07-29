# Commercial Construction & Tender Pipeline Analytics | Bay Oceania C&T Ltd.

## Executive Summary

Bay Oceania C&T Ltd. requires a more disciplined analytics operating model for enterprise commercial construction and government procurement tender management. This standalone repository demonstrates a complete, executive-ready analytics case study for quantifying tender pipeline value, prioritizing C-suite deal focus, and validating process efficiency gains through Lean Six Sigma and Agile delivery practices.

The synthetic case study models 60 tender opportunities across Commercial Construction, Government Procurement, and Infrastructure. It is designed to show how a high-performing bid management function can use structured data, SQL analysis, statistical validation, and Power BI measures to create a single source of truth for pipeline governance.

Headline outcomes demonstrated in this case study:

- **$15M+ captured tender value threshold** assessed through Monte Carlo simulation.
- **20%+ proposal turnaround reduction** validated through pre/post DMAIC workflow analysis.
- **15+ secured or high-priority opportunities** identified for executive pursuit, deal review, and resource allocation.
- **Risk-adjusted revenue visibility** across sector, stage, client, probability, margin, and risk rating.

## Business Problem Statement

Bay Oceania C&T Ltd. historically managed commercial construction and public-sector tender pursuits through fragmented spreadsheet trackers, informal status updates, and manual executive reporting. During high-pressure government procurement rounds, this created four recurring management issues:

1. **Delayed executive decision cycles** because opportunity value, win probability, and proposal readiness were not consolidated into a single analytical view.
2. **Proposal turnaround bottlenecks** caused by sequential handoffs across estimating, technical, commercial, compliance, and executive review teams.
3. **Inconsistent pursuit prioritization** where high-value opportunities did not always receive proportionate leadership focus or bid resources.
4. **Limited revenue forecasting confidence** because pipeline reports reflected raw contract value rather than statistically informed, risk-adjusted expected revenue.

The result was a preventable gap between market opportunity and execution capacity. The organization needed a lightweight but robust analytics framework capable of supporting weekly bid governance, board-level commercial reporting, and continuous improvement of proposal operations.

## Methodology

### Lean Six Sigma DMAIC Workflow Streamlining

The analytics model is structured around the DMAIC improvement cycle:

- **Define:** Establish the tender pipeline as the primary value stream from lead identification through award or loss.
- **Measure:** Capture baseline turnaround days, contract value, win probability, profit margin, stage, sector, and risk rating for each tender.
- **Analyze:** Use SQL and Python to identify bottlenecks, quantify weighted expected revenue, and isolate high-ROI opportunities.
- **Improve:** Simulate an optimized proposal workflow that reduces submission turnaround from a 15-35 day baseline to a 10-22 day optimized operating window.
- **Control:** Monitor Power BI measures for total value, weighted revenue, win rate, and average turnaround reduction.

### Agile Scrum Proposal Sprint Boards

In parallel with DMAIC, the case study assumes that tender teams operate through Agile proposal sprint boards:

- Sprint backlog: required technical, commercial, legal, compliance, and estimating tasks.
- Daily standups: blocker escalation for dependencies and approvals.
- Sprint reviews: executive review gates before submission.
- Retrospectives: lessons learned from won/lost tenders and process bottlenecks.

This combination of Lean Six Sigma and Agile practices helps leadership compress cycle time without weakening governance quality.

## Tech Stack & System Architecture

### Core Technologies

- **Python:** Synthetic data generation, Monte Carlo simulation, statistical hypothesis testing, and executive summary logging.
- **Pandas and NumPy:** Dataframe construction, metric calculation, reproducible random sampling, and revenue simulation.
- **SciPy:** Welch two-sample t-test for validating DMAIC improvement significance.
- **SQL:** PostgreSQL/SQLite-compatible pipeline analysis queries for stage value, weighted revenue, bottleneck analysis, and high-ROI account targeting.
- **Power BI / DAX:** Executive dashboard measures for total pipeline value, weighted expected revenue, win rate, and turnaround reduction.
- **Advanced Excel:** Optional stakeholder-facing workbook layer for scenario planning and procurement committee review.

### Architecture Flow

```text
Synthetic Tender Inputs
        |
        v
data_generator.py  --->  tender_pipeline_data.csv
        |
        +----------------------+
        |                      |
        v                      v
schema_queries.sql       pipeline_analytics.py
        |                      |
        v                      v
SQL Reporting Layer      Monte Carlo + t-test Outputs
        |                      |
        +----------+-----------+
                   |
                   v
dax_measures.dax ---> Power BI Executive Dashboard
```

## Repository Files

| File | Purpose |
| --- | --- |
| `data_generator.py` | Generates `tender_pipeline_data.csv` with 60 realistic tender opportunities. |
| `schema_queries.sql` | Provides production-ready SQL analysis for pipeline value, bottlenecks, and high-ROI targets. |
| `pipeline_analytics.py` | Runs Monte Carlo simulation and statistical testing for executive decision support. |
| `dax_measures.dax` | Defines Power BI measures for dashboarding. |
| `README.md` | Documents the business context, methodology, architecture, and results. |

## Quick Start

### 1. Install Python dependencies

```bash
pip install pandas numpy scipy
```

### 2. Generate the tender dataset

```bash
python data_generator.py
```

Expected output:

```text
Generated 60 tender records: tender_pipeline_data.csv
Average baseline turnaround: ... days
Average DMAIC-optimized turnaround: ... days
Observed turnaround reduction: ...%
```

### 3. Run executive analytics

```bash
python pipeline_analytics.py
```

The script prints:

- Total raw pipeline value.
- Risk-adjusted expected revenue.
- 90% confidence interval for simulated captured revenue.
- Probability of crossing the $15M captured value threshold.
- Welch two-sample t-test results for DMAIC turnaround improvement.

### 4. Load into SQL

Create a table named `tenders`, import `tender_pipeline_data.csv`, and execute the queries in `schema_queries.sql`.

### 5. Load into Power BI

Import the CSV as table `Tenders`, then add the measures from `dax_measures.dax`.

## Key Results & Executive Takeaways

### 1. Risk-Adjusted Pipeline Governance

The case study moves leadership reporting beyond raw pipeline value by applying tender-level win probability to contract value. This enables executives to distinguish optimistic pipeline volume from realistic expected revenue.

### 2. Faster Proposal Turnaround

The DMAIC-optimized workflow compresses tender submission turnaround from the legacy 15-35 day range to an optimized 10-22 day operating window. The Python t-test validates whether this reduction is statistically significant at the p < 0.05 level.

### 3. C-Suite Deal Prioritization

The high-ROI SQL query identifies opportunities above $1M in expected contract value, above 50% win probability, and above 18% margin. These opportunities should receive priority executive sponsorship, senior estimator capacity, and proactive client engagement.

### 4. Procurement Round Readiness

By combining stage-level visibility, risk ratings, and weighted expected revenue, Bay Oceania C&T Ltd. can run weekly procurement war rooms with a clear view of pursuit quality, bottleneck risk, and likely revenue capture.

### 5. Scalable Analytics Operating Model

The repository demonstrates a practical analytics foundation that can be extended into CRM integration, estimator capacity planning, bid/no-bid scoring, supplier risk analysis, and Power BI executive scorecards.

## Recommended Executive Dashboard Pages

1. **Pipeline Overview:** Total value, weighted expected revenue, win rate, and stage distribution.
2. **Sector Performance:** Commercial Construction vs. Government Procurement vs. Infrastructure.
3. **Proposal Operations:** Baseline vs. optimized turnaround and bottleneck trends.
4. **High-ROI Targets:** C-suite opportunity list with margin, value, probability, and risk.
5. **Monte Carlo Forecast:** Confidence interval for captured revenue and probability of meeting the $15M threshold.

## Governance Notes

This repository uses synthetic data only. It is designed for portfolio demonstration, stakeholder education, analytics architecture review, and management consulting case study presentation. No confidential client, procurement, or commercial data is included.

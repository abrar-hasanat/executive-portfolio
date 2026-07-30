# Enterprise ERP Migration & Operational Capacity Optimization

## Executive Highlights

- **-20% Processing Backlog:** Lean Six Sigma DMAIC standardization reduced peak-volume processing cycle time from legacy operating baselines.
- **98% UAT Script Pass Rate:** 150+ Workday ERP cutover scripts were validated with disciplined defect triage and release-readiness controls.
- **Supported 3x Team Expansion Strategy:** Capacity allocation models translated workload growth into FTE requirements by department.

## Define Phase

Administrative units faced high service backlogs and registration bottlenecks during the transition from the legacy Colleague ERP environment to Workday ERP. The operating problem was not merely system replacement; it was a cross-functional throughput challenge spanning Registrar, Academic Advising, Student Finance, and Admissions workflows.

## Measure & Analyze

The project measures workflow process maps, baseline cycle-time tracking, weekly request volumes, FTE allocation, and UAT bug frequency. The synthetic dataset supports repeatable analysis of task turnaround, pass/fail/flagged script integrity, and bottleneck concentration by department.

## Improve & Control

The improvement system combines Workday UAT execution, Lean Six Sigma DMAIC task standardization, and capacity allocation models. Control metrics focus on sustained backlog reduction, SLA-safe turnaround time, 98%+ pass-rate readiness, and staffing scenarios for 3x growth without degrading service reliability.

## Repository Assets

- `data_generator.py` creates `capacity_uat_data.csv` with deterministic synthetic operational logs.
- `dmaic_capacity_analysis.py` prints executive-ready DMAIC, UAT, and FTE forecasting summaries.
- `schema_queries.sql` provides PostgreSQL-compatible operating analytics queries.
- `dax_measures.dax` defines Power BI measures for dashboard replication.

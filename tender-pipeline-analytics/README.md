# Tender Pipeline Analytics Demonstration

A synthetic example of tender prioritization and pipeline forecasting, inspired by the kind of analysis used in business development. The 60 records are invented and do not reproduce Bay Oceania's pipeline or establish results from Abrar's internship.

## What it calculates

- Expected contract value, using an assumed win probability for each opportunity.
- A distribution of total won contract value from 1,000 independent win/loss simulations.
- The share of simulations above a $15 million target.
- A comparison of turnaround times between two groups of generated records.

The simulated range is a predictive interval under the supplied probabilities. It is not a confidence interval for actual revenue. The independence assumption also excludes correlated wins or losses.

## Run

```bash
python -m pip install pandas numpy scipy
python data_generator.py
python pipeline_analytics.py
```

Run from this directory. SQL queries operate on a `tenders` table populated from the CSV. The DAX file provides corresponding Power BI measures.

## Limits

The generator deliberately gives the comparison group shorter turnaround times. A t-test on those generated groups illustrates the calculation; it cannot show that a real process change improved performance. Contract values are potential awards, not recognized revenue or money secured.

The portfolio's internship summary reports Abrar's experience separately. Its 15+ reviewed opportunities and 50+ prospects are not counts from this synthetic dataset.

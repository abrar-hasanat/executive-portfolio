# Capacity and UAT demonstration

This example uses 150 synthetic workflow records to calculate processing-time changes and UAT pass rates. It is separate from Abrar's work at Carleton and contains no institutional records.

The generator explicitly assigns 147 passing records out of 150. Its 98% pass rate is an input to the demonstration. It also assigns shorter processing times to the comparison scenario. Neither result validates an actual Workday rollout or a workplace improvement.

## Run

```bash
python -m pip install pandas numpy
python data_generator.py
python dmaic_capacity_analysis.py
```

Run these commands from this directory. The analysis reports mean processing time and UAT status. Its staffing scenario multiplies workload and FTE by the same factor, assuming constant productivity.

## Interpretation

Processing time is measured in hours per record. A percentage decrease in that measure is not a measured reduction in the number of backlogged requests. The sample has no backlog-count time series.

SQL queries and DAX measures reproduce the summary calculations. The FTE figures are illustrative allocations on synthetic records, not staff counts from Carleton.

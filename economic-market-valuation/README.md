# Synthetic Macro-Valuation Demonstration

An example of regression and scenario analysis using 50,000 generated observations across four sectors. No observations are actual company valuations. The data generator assigns the relationships between macro variables and valuation multiples.

## Method

The R script fits an ordinary least-squares regression in levels, with sector indicators. It does not fit a log-linear model. Its R-squared measures fit to the generated data, not predictive performance on real companies.

The Python simulation applies assumed changes in interest rates and regulation to the synthetic panel. Its results illustrate how the chosen coefficients affect outcomes. They do not establish how a real policy change would affect investment or market-entry success.

## Run

```bash
python -m pip install numpy pandas
python data_generator.py
python monte_carlo_valuation.py
Rscript econometric_model.R
```

Run from this directory. The R script requires `lmtest`, `ggplot2`, `broom` and `readr`. It prints regression diagnostics and writes residual plots. SQL queries provide additional summaries of the generated panel.

## Browser scenario

The economic-valuation page on the portfolio uses illustrative formulas and fixed display weights. It does not run the R regression or the Python Monte Carlo simulation. Its scores have no calibrated probability interpretation.

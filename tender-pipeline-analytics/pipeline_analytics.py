"""Tender pipeline analytics for Bay Oceania C&T Ltd. data.

Run after generating the dataset:
    python data_generator.py
    python pipeline_analytics.py
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

DATA_FILE = Path(__file__).resolve().parent / "tender_pipeline_data.csv"
RANDOM_SEED = 20260729
N_ITERATIONS = 1_000
CAPTURED_THRESHOLD_USD = 15_000_000


def load_data() -> pd.DataFrame:
    """Load generated tender data and validate required columns."""
    required_columns = {
        "Tender_ID",
        "Expected_Contract_Value_USD",
        "Win_Probability_Pct",
        "Submission_Turnaround_Days",
        "DMAIC_Optimized",
    }
    data = pd.read_csv(DATA_FILE)
    missing_columns = required_columns.difference(data.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(f"Missing required columns in {DATA_FILE.name}: {missing}")
    return data


def run_monte_carlo(data: pd.DataFrame) -> dict[str, float]:
    """Simulate won/lost outcomes to estimate total captured pipeline revenue."""
    rng = np.random.default_rng(RANDOM_SEED)
    values = data["Expected_Contract_Value_USD"].to_numpy(dtype=float)
    win_probabilities = data["Win_Probability_Pct"].to_numpy(dtype=float) / 100.0

    simulated_wins = rng.random((N_ITERATIONS, len(data))) < win_probabilities
    simulated_revenue = simulated_wins @ values

    lower_bound, upper_bound = np.percentile(simulated_revenue, [5, 95])
    probability_above_threshold = np.mean(simulated_revenue >= CAPTURED_THRESHOLD_USD) * 100

    return {
        "mean_revenue": float(np.mean(simulated_revenue)),
        "median_revenue": float(np.median(simulated_revenue)),
        "ci_90_lower": float(lower_bound),
        "ci_90_upper": float(upper_bound),
        "probability_above_threshold": float(probability_above_threshold),
    }


def run_turnaround_t_test(data: pd.DataFrame) -> dict[str, float]:
    """Run a Welch two-sample t-test for pre/post DMAIC turnaround days."""
    baseline = data.loc[~data["DMAIC_Optimized"].astype(bool), "Submission_Turnaround_Days"]
    optimized = data.loc[data["DMAIC_Optimized"].astype(bool), "Submission_Turnaround_Days"]
    t_statistic, p_value = stats.ttest_ind(baseline, optimized, equal_var=False, alternative="greater")

    baseline_avg = float(baseline.mean())
    optimized_avg = float(optimized.mean())
    reduction_pct = (baseline_avg - optimized_avg) / baseline_avg * 100

    return {
        "baseline_avg": baseline_avg,
        "optimized_avg": optimized_avg,
        "reduction_pct": float(reduction_pct),
        "t_statistic": float(t_statistic),
        "p_value": float(p_value),
    }


def format_currency(value: float) -> str:
    """Format a numeric value as USD thousands for student-friendly reporting."""
    if value >= 1000:
        return f"${value / 1_000:,.1f}K"
    return f"${value:,.0f}"


def main() -> None:
    """Execute analytics and print summary logs."""
    data = load_data()
    risk_adjusted_revenue = (
        data["Expected_Contract_Value_USD"] * (data["Win_Probability_Pct"] / 100.0)
    ).sum()
    monte_carlo = run_monte_carlo(data)
    t_test = run_turnaround_t_test(data)

    print("=" * 78)
    print("Bay Oceania C&T Ltd. | Tender Pipeline Analytics Summary")
    print("=" * 78)
    print(f"Tender opportunities analyzed: {len(data):,}")
    print(f"Raw pipeline value: {format_currency(data['Expected_Contract_Value_USD'].sum())}")
    print(f"Risk-adjusted expected revenue: {format_currency(risk_adjusted_revenue)}")
    print("-" * 78)
    print("Monte Carlo Simulation: 1,000 pipeline outcome iterations")
    print(f"Mean captured revenue: {format_currency(monte_carlo['mean_revenue'])}")
    print(f"Median captured revenue: {format_currency(monte_carlo['median_revenue'])}")
    print(
        "90% confidence interval: "
        f"{format_currency(monte_carlo['ci_90_lower'])} to {format_currency(monte_carlo['ci_90_upper'])}"
    )
    print(
        f"Probability of capturing at least {format_currency(CAPTURED_THRESHOLD_USD)}: "
        f"{monte_carlo['probability_above_threshold']:.1f}%"
    )
    print("-" * 78)
    print("DMAIC Proposal Turnaround Hypothesis Test: Welch two-sample t-test")
    print(f"Pre-DMAIC average turnaround: {t_test['baseline_avg']:.1f} days")
    print(f"Post-DMAIC average turnaround: {t_test['optimized_avg']:.1f} days")
    print(f"Observed efficiency gain: {t_test['reduction_pct']:.1f}%")
    print(f"t-statistic: {t_test['t_statistic']:.3f}")
    print(f"p-value: {t_test['p_value']:.6f}")
    print(
        "Statistical conclusion: "
        + (
            "DMAIC turnaround improvement is statistically significant (p < 0.05)."
            if t_test["p_value"] < 0.05
            else "DMAIC turnaround improvement is not statistically significant at p < 0.05."
        )
    )
    print("=" * 78)


if __name__ == "__main__":
    main()

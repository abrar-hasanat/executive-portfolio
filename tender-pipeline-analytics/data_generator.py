"""Generate synthetic tender pipeline analytics data for Bay Oceania C&T Ltd.

Run:
    python data_generator.py

Output:
    tender_pipeline_data.csv
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

OUTPUT_FILE = Path(__file__).resolve().parent / "tender_pipeline_data.csv"
RANDOM_SEED = 20260729
N_TENDERS = 60

CLIENTS = [
    "Auckland Transport Authority",
    "Bay Metro Council",
    "Crown Facilities Directorate",
    "Harbourview Commercial Group",
    "Pacific Health Infrastructure",
    "Southern Ports Commission",
    "North Island Education Trust",
    "Trans-Tasman Logistics Park",
    "Oceania Defence Estate",
    "Te Moana Housing Authority",
    "Capital Civic Works",
    "Kauri Retail Developments",
    "Waikato Utilities Board",
    "Bluewater Airport Corporation",
    "Greenline Rail Alliance",
    "Regional Justice Precinct",
    "Meridian Data Campus",
    "Atlas Industrial Holdings",
    "Seabright University Consortium",
    "National Procurement Office",
]

SECTORS = ["Commercial Construction", "Government Procurement", "Infrastructure"]
STAGES = ["Lead", "Technical Evaluation", "Commercial Proposal", "Final Negotiation", "Won", "Lost"]
RISK_RATINGS = ["Low", "Medium", "High"]


def build_dataset(n_tenders: int = N_TENDERS) -> pd.DataFrame:
    """Build a reproducible synthetic tender pipeline dataset."""
    rng = np.random.default_rng(RANDOM_SEED)

    dmaic_optimized = np.array([False] * (n_tenders // 2) + [True] * (n_tenders - n_tenders // 2))
    rng.shuffle(dmaic_optimized)

    baseline_turnaround = rng.integers(15, 36, size=n_tenders)
    optimized_turnaround = np.maximum(10, np.round(baseline_turnaround * rng.uniform(0.62, 0.80, size=n_tenders))).astype(int)
    non_optimized_turnaround = baseline_turnaround + rng.integers(-2, 4, size=n_tenders)
    submission_turnaround = np.where(dmaic_optimized, optimized_turnaround, non_optimized_turnaround)
    submission_turnaround = np.clip(submission_turnaround, 10, 35)

    values = rng.triangular(left=250_000, mode=1_200_000, right=3_500_000, size=n_tenders)
    values = np.round(values / 10_000) * 10_000

    win_probabilities = rng.beta(a=2.2, b=2.0, size=n_tenders) * 80 + 10
    win_probabilities = np.round(win_probabilities).astype(int)

    profit_margins = rng.uniform(12, 28, size=n_tenders)
    profit_margins = np.round(profit_margins, 1)

    risk_rating = rng.choice(RISK_RATINGS, size=n_tenders, p=[0.35, 0.45, 0.20])
    stage = rng.choice(STAGES, size=n_tenders, p=[0.18, 0.22, 0.22, 0.15, 0.13, 0.10])
    sector = rng.choice(SECTORS, size=n_tenders, p=[0.40, 0.35, 0.25])

    data = pd.DataFrame(
        {
            "Tender_ID": [f"TND-2026-{i:03d}" for i in range(1, n_tenders + 1)],
            "Client_Name": rng.choice(CLIENTS, size=n_tenders),
            "Sector": sector,
            "Expected_Contract_Value_USD": values.astype(int),
            "Win_Probability_Pct": win_probabilities,
            "Stage": stage,
            "Baseline_Turnaround": baseline_turnaround,
            "Submission_Turnaround_Days": submission_turnaround.astype(int),
            "DMAIC_Optimized": dmaic_optimized.astype(bool),
            "Profit_Margin_Pct": profit_margins,
            "Risk_Rating": risk_rating,
        }
    )

    return data.sort_values("Tender_ID").reset_index(drop=True)


def main() -> None:
    """Generate and persist the CSV file."""
    dataset = build_dataset()
    dataset.to_csv(OUTPUT_FILE, index=False)

    baseline_avg = dataset.loc[~dataset["DMAIC_Optimized"], "Submission_Turnaround_Days"].mean()
    optimized_avg = dataset.loc[dataset["DMAIC_Optimized"], "Submission_Turnaround_Days"].mean()
    reduction_pct = (baseline_avg - optimized_avg) / baseline_avg * 100

    print(f"Generated {len(dataset)} tender records: {OUTPUT_FILE.name}")
    print(f"Average baseline turnaround: {baseline_avg:.1f} days")
    print(f"Average DMAIC-optimized turnaround: {optimized_avg:.1f} days")
    print(f"Observed turnaround reduction: {reduction_pct:.1f}%")


if __name__ == "__main__":
    main()

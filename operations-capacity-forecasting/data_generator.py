"""Generate synthetic Workday ERP cutover capacity and UAT data."""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

OUTPUT_PATH = Path(__file__).with_name("capacity_uat_data.csv")
RANDOM_SEED = 20260730
ROW_COUNT = 150
DEPARTMENTS = ["Registrar", "Academic Advising", "Student Finance", "Admissions"]
PHASES = ["Legacy Colleague ERP", "Workday ERP Cutover"]


def build_dataset(row_count: int = ROW_COUNT) -> pd.DataFrame:
    """Build a deterministic synthetic operational dataset for portfolio analytics."""
    rng = np.random.default_rng(RANDOM_SEED)
    baseline_hours = rng.uniform(4.5, 12.0, row_count).round(2)
    reduction = rng.uniform(0.18, 0.22, row_count)
    optimized_hours = np.clip(baseline_hours * (1 - reduction), 3.0, 8.5).round(2)

    statuses = np.array(["Passed"] * 147 + ["Flagged"] * 2 + ["Failed"] * 1)
    rng.shuffle(statuses)

    data = pd.DataFrame(
        {
            "Task_ID": [f"UAT-2026-{index:03d}" for index in range(1, row_count + 1)],
            "Department": rng.choice(DEPARTMENTS, row_count, p=[0.28, 0.27, 0.23, 0.22]),
            "System_Phase": rng.choice(PHASES, row_count, p=[0.42, 0.58]),
            "UAT_Script_Pass_Status": statuses,
            "Baseline_Processing_Hours": baseline_hours,
            "DMAIC_Optimized_Hours": optimized_hours,
            "Backlog_Reduction_Pct": (1 - optimized_hours / baseline_hours).round(4),
            "Team_Member_FTE_Allocation": rng.uniform(0.5, 2.0, row_count).round(2),
            "Weekly_Volume_Handled": rng.integers(50, 301, row_count),
        }
    )
    return data


def main() -> None:
    dataset = build_dataset()
    dataset.to_csv(OUTPUT_PATH, index=False)
    print(f"Generated {len(dataset):,} operational and UAT records at {OUTPUT_PATH}")
    print(f"UAT pass rate: {(dataset['UAT_Script_Pass_Status'].eq('Passed').mean() * 100):.1f}%")
    print(f"Average backlog reduction: {(dataset['Backlog_Reduction_Pct'].mean() * 100):.1f}%")


if __name__ == "__main__":
    main()

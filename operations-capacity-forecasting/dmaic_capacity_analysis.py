"""Executive analytics for ERP migration UAT and capacity optimization."""

from __future__ import annotations

from pathlib import Path

import pandas as pd

DATA_PATH = Path(__file__).with_name("capacity_uat_data.csv")
TARGET_PASS_RATE = 0.98
TARGET_BACKLOG_REDUCTION = 0.20
BASELINE_SLA_HOURS = 10.0


def load_data(path: Path = DATA_PATH) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError("Run data_generator.py before executing the DMAIC analysis.")
    return pd.read_csv(path)


def analyze_cycle_time(data: pd.DataFrame) -> dict[str, float]:
    baseline_mean = data["Baseline_Processing_Hours"].mean()
    optimized_mean = data["DMAIC_Optimized_Hours"].mean()
    reduction = (baseline_mean - optimized_mean) / baseline_mean
    return {
        "baseline_mean": baseline_mean,
        "optimized_mean": optimized_mean,
        "reduction": reduction,
        "target_delta": reduction - TARGET_BACKLOG_REDUCTION,
    }


def analyze_uat(data: pd.DataFrame) -> dict[str, float]:
    total_scripts = len(data)
    passed_scripts = int(data["UAT_Script_Pass_Status"].eq("Passed").sum())
    pass_rate = passed_scripts / total_scripts
    return {"total_scripts": total_scripts, "passed_scripts": passed_scripts, "pass_rate": pass_rate}


def simulate_scaling(data: pd.DataFrame, scale_factor: float = 3.0) -> pd.DataFrame:
    department = (
        data.groupby("Department", as_index=False)
        .agg(
            current_fte=("Team_Member_FTE_Allocation", "sum"),
            weekly_volume=("Weekly_Volume_Handled", "sum"),
            optimized_hours=("DMAIC_Optimized_Hours", "mean"),
        )
        .assign(
            forecasted_volume=lambda frame: frame["weekly_volume"] * scale_factor,
            requests_per_fte=lambda frame: frame["weekly_volume"] / frame["current_fte"],
            required_fte_3x=lambda frame: frame["forecasted_volume"] / frame["requests_per_fte"],
            sla_status=lambda frame: frame["optimized_hours"].le(BASELINE_SLA_HOURS).map({True: "Within SLA", False: "At Risk"}),
        )
    )
    return department


def print_executive_summary(data: pd.DataFrame) -> None:
    cycle = analyze_cycle_time(data)
    uat = analyze_uat(data)
    scaling = simulate_scaling(data)

    print("\n=== Executive DMAIC Capacity Summary ===")
    print(f"Baseline mean processing hours: {cycle['baseline_mean']:.2f}")
    print(f"DMAIC optimized mean hours: {cycle['optimized_mean']:.2f}")
    print(f"Peak-volume backlog reduction: {cycle['reduction']:.1%}")
    print(f"Target proof point vs. 20% benchmark: {cycle['target_delta']:+.1%}")
    print("\n=== UAT Script Integrity ===")
    print(f"Scripts verified: {uat['total_scripts']:,}")
    print(f"Scripts passed: {uat['passed_scripts']:,}")
    print(f"UAT pass rate: {uat['pass_rate']:.1%} (target: {TARGET_PASS_RATE:.0%})")
    print("\n=== 3x Team Growth Capacity Forecast ===")
    for row in scaling.itertuples(index=False):
        print(
            f"{row.Department}: current FTE {row.current_fte:.1f}, "
            f"required 3x FTE {row.required_fte_3x:.1f}, "
            f"forecasted weekly volume {row.forecasted_volume:,.0f}, {row.sla_status}"
        )


if __name__ == "__main__":
    print_executive_summary(load_data())

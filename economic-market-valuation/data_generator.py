"""Generate a synthetic macro-valuation panel for emerging-market enterprise valuation."""
from __future__ import annotations

import numpy as np
import pandas as pd

SEED = 20260730
N_OBSERVATIONS = 50_000
SECTORS = ["Clean Energy", "Enterprise Tech", "Logistics & Infrastructure", "Healthcare Analytics"]
SECTOR_EFFECTS = {
    "Clean Energy": 1.1,
    "Enterprise Tech": 2.0,
    "Logistics & Infrastructure": -0.2,
    "Healthcare Analytics": 1.4,
}


def clipped_normal(rng: np.random.Generator, mean: float, sd: float, low: float, high: float, n: int) -> np.ndarray:
    values = rng.normal(mean, sd, n)
    return np.clip(values, low, high)


def main() -> None:
    rng = np.random.default_rng(SEED)
    sectors = rng.choice(SECTORS, N_OBSERVATIONS, p=[0.26, 0.30, 0.22, 0.22])

    country_risk = clipped_normal(rng, 5.4, 1.9, 1.0, 10.0, N_OBSERVATIONS)
    inflation = clipped_normal(rng, 4.7 + 0.14 * (country_risk - 5), 1.15, 1.5, 8.5, N_OBSERVATIONS)
    interest = clipped_normal(rng, 3.2 + 0.36 * inflation + 0.08 * country_risk, 0.55, 2.0, 7.0, N_OBSERVATIONS)
    regulatory = clipped_normal(rng, 44 + 4.6 * country_risk + 1.4 * inflation, 13.5, 0.0, 100.0, N_OBSERVATIONS)

    ebitda = rng.lognormal(mean=np.log(6_800_000), sigma=0.62, size=N_OBSERVATIONS)
    ebitda = np.clip(ebitda, 1_200_000, 25_000_000)

    sector_effect = np.array([SECTOR_EFFECTS[sector] for sector in sectors])
    quality_signal = rng.normal(0, 0.36, N_OBSERVATIONS)
    valuation_multiple = (
        16.95
        + sector_effect
        - 0.43 * country_risk
        - 0.050 * regulatory
        - 0.71 * interest
        + 0.10 * inflation
        + 0.000000045 * ebitda
        + quality_signal
    )
    valuation_multiple = np.clip(valuation_multiple, 3.5, 18.2)

    roi_index = (
        0.34 * valuation_multiple
        + 0.00000011 * ebitda
        - 0.23 * country_risk
        - 0.018 * regulatory
        - 0.30 * interest
        + rng.normal(0, 0.28, N_OBSERVATIONS)
    )
    market_entry_success = roi_index > np.quantile(roi_index, 0.58)

    df = pd.DataFrame(
        {
            "Observation_ID": [f"OBS-2026-{i:05d}" for i in range(1, N_OBSERVATIONS + 1)],
            "Sector": sectors,
            "Country_Risk_Score": np.round(country_risk, 2),
            "Inflation_Rate_Pct": np.round(inflation, 2),
            "Interest_Rate_Pct": np.round(interest, 2),
            "Regulatory_Index": np.round(regulatory, 2),
            "Enterprise_EBITDA_USD": np.round(ebitda, 2),
            "Actual_Valuation_Multiple": np.round(valuation_multiple, 2),
            "Market_Entry_Success": market_entry_success,
        }
    )
    df.to_csv("macro_valuation_dataset.csv", index=False)
    print(f"Generated macro_valuation_dataset.csv with {len(df):,} observations")
    print(df.describe(include="all"))


if __name__ == "__main__":
    main()

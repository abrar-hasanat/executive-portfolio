"""Monte Carlo policy-shock valuation model for executive market-entry decisions."""
from __future__ import annotations

import numpy as np
import pandas as pd
import statsmodels.formula.api as smf

ITERATIONS = 10_000
SEED = 20260730


def confidence_interval(values: np.ndarray) -> tuple[float, float, float]:
    return float(np.mean(values)), float(np.percentile(values, 2.5)), float(np.percentile(values, 97.5))


def simulate_regime(model, base: pd.DataFrame, rng: np.random.Generator, high_risk: bool) -> np.ndarray:
    samples = base.sample(n=ITERATIONS, replace=True, random_state=int(rng.integers(1, 1_000_000))).copy()
    rate_shock = rng.normal(1.25 if high_risk else 0.0, 0.85, ITERATIONS)
    rate_shock = np.clip(rate_shock, -2.0, 2.0)
    regulatory_shock = rng.normal(12 if high_risk else 0, 8 if high_risk else 5, ITERATIONS)
    samples["Interest_Rate_Pct"] = np.clip(samples["Interest_Rate_Pct"] + rate_shock, 2.0, 9.0)
    samples["Regulatory_Index"] = np.clip(samples["Regulatory_Index"] + regulatory_shock, 0, 100)
    return model.predict(samples).to_numpy()


def main() -> None:
    rng = np.random.default_rng(SEED)
    df = pd.read_csv("macro_valuation_dataset.csv")
    model = smf.ols(
        "Actual_Valuation_Multiple ~ Country_Risk_Score + Regulatory_Index + Interest_Rate_Pct + C(Sector)",
        data=df,
    ).fit()

    baseline = simulate_regime(model, df, rng, high_risk=False)
    high_risk = simulate_regime(model, df, rng, high_risk=True)
    b_mean, b_low, b_high = confidence_interval(baseline)
    h_mean, h_low, h_high = confidence_interval(high_risk)
    downside = (b_mean - h_mean) / b_mean

    print("\nEXECUTIVE MONTE CARLO POLICY RISK SUMMARY")
    print("=" * 56)
    print(f"OLS fit R-squared: {model.rsquared:.3f}")
    print(f"Simulation iterations per regime: {ITERATIONS:,}")
    print(f"Baseline valuation multiple: {b_mean:.2f}x EBITDA (95% CI: {b_low:.2f}x - {b_high:.2f}x)")
    print(f"High-risk policy regime:     {h_mean:.2f}x EBITDA (95% CI: {h_low:.2f}x - {h_high:.2f}x)")
    print(f"Expected multiple compression under stress: {downside:.1%}")
    print("Strategic readout: prioritize sectors whose unit economics remain above hurdle rates after +200 bps rate shocks and adverse regulatory shifts.")


if __name__ == "__main__":
    main()

-- 1. Sector Quantile Valuation Query: medians by sector and country risk tier.
WITH tiered AS (
  SELECT
    sector,
    CASE
      WHEN country_risk_score < 3.5 THEN 'Low Risk'
      WHEN country_risk_score < 6.5 THEN 'Moderate Risk'
      ELSE 'High Risk'
    END AS country_risk_tier,
    actual_valuation_multiple,
    enterprise_ebitda_usd,
    actual_valuation_multiple * enterprise_ebitda_usd AS implied_enterprise_value_usd
  FROM macro_valuation_dataset
)
SELECT
  sector,
  country_risk_tier,
  COUNT(*) AS observation_count,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY actual_valuation_multiple) AS median_valuation_multiple,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY enterprise_ebitda_usd) AS median_ebitda_usd,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY implied_enterprise_value_usd) AS median_enterprise_value_usd
FROM tiered
GROUP BY sector, country_risk_tier
ORDER BY sector, country_risk_tier;

-- 2. High-ROI Market Entry Identifier: top decile success candidates below sector medians.
WITH sector_medians AS (
  SELECT
    sector,
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY actual_valuation_multiple) AS sector_median_multiple
  FROM macro_valuation_dataset
  GROUP BY sector
), scored AS (
  SELECT
    m.*,
    s.sector_median_multiple,
    NTILE(10) OVER (
      ORDER BY
        (enterprise_ebitda_usd / 1000000.0)
        - country_risk_score
        - (regulatory_index / 20.0)
        - interest_rate_pct DESC
    ) AS attractiveness_decile
  FROM macro_valuation_dataset m
  JOIN sector_medians s USING (sector)
)
SELECT
  observation_id,
  sector,
  country_risk_score,
  regulatory_index,
  interest_rate_pct,
  enterprise_ebitda_usd,
  actual_valuation_multiple,
  sector_median_multiple,
  market_entry_success
FROM scored
WHERE attractiveness_decile = 1
  AND regulatory_index <= 45
  AND actual_valuation_multiple < sector_median_multiple
ORDER BY enterprise_ebitda_usd DESC
LIMIT 250;

-- 3. Macro Stress Test Query: market-entry success rates by interest-rate bracket.
SELECT
  CASE
    WHEN interest_rate_pct < 3.0 THEN '<3.0%'
    WHEN interest_rate_pct < 4.0 THEN '3.0%-3.9%'
    WHEN interest_rate_pct < 5.0 THEN '4.0%-4.9%'
    WHEN interest_rate_pct < 6.0 THEN '5.0%-5.9%'
    ELSE '>=6.0%'
  END AS interest_rate_bracket,
  COUNT(*) AS observation_count,
  AVG(CASE WHEN market_entry_success THEN 1.0 ELSE 0.0 END) AS market_entry_success_rate,
  AVG(actual_valuation_multiple) AS avg_valuation_multiple,
  AVG(regulatory_index) AS avg_regulatory_index
FROM macro_valuation_dataset
GROUP BY interest_rate_bracket
ORDER BY MIN(interest_rate_pct);

# Data dictionary

Unit: US reporter × calendar year × origin × HS chapter. There are 120 rows: ten years, six origins including world, and two chapters. World is a denominator, not an additional supplier to sum with country rows.

| Field | Definition |
| --- | --- |
| year | Calendar year, 2010-2019 |
| partner_code | UN Comtrade code: world 0, Bangladesh 50, Cambodia 116, China 156, India 699, Vietnam 704 |
| country | Human-readable origin label |
| hs | 61 knitted/crocheted apparel and accessories; 62 other apparel and accessories |
| hs_revision | Original source revision: H3 in 2010-2011, H4 in 2012-2016, H5 in 2017-2019 |
| is_reported | Source reports this aggregate directly |
| is_aggregate | Source flags an aggregate generated in its processing |
| legacy_estimation_flag | Source metadata preserved without recoding; values 0 or 4 |
| value_usd | `primaryValue`, equal to `cifvalue` in every retrieved record; current USD |

`annual_summary.csv` has 60 year-origin rows. `value_usd` sums the two chapters; `share_pct` divides by world; `index_2012` fixes each origin's 2012 total at 100; `knit_usd` and `nonknit_usd` retain chapter values; `knit_share_pct` describes own composition; the two chapter market shares use their respective world chapter denominators.

`contrasts.csv` contains the four planned endpoint comparisons. Growth is percent; changes and contributions are percentage points. `dashboard.json` contains the same annual rows, contrasts, scope, interpretation, version, retrieval time and snapshot hash. Rounded display values never replace full precision in calculations.

All observations are positive and present; no missing values were converted into zero. No quantities, weights, unit values, constant-dollar series, seasonal adjustment, imputation, or synthetic observations are used. HS revisions change within the sample; broad chapter labels remain comparable, but this project does not establish a tariff-line concordance or perfectly constant product mix.

Source methodology describes quantity estimation flags and pre-aggregation. Flags are retained; 48 records are source aggregates, so `isReported=false` is not evidence of fabricated data. No inference about physical quantity is made from legacy flag 4. Its detailed code meaning is not required for a value-only analysis and is not silently reclassified as observed quantity.

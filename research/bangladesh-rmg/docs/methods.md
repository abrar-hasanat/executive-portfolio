# Methods and interpretation

The estimand is an observed change in Bangladesh's share of US apparel import value between two years. It is not an average treatment effect. The primary comparison is 2012 to 2018. Planned alternatives use 2013 and/or 2019. All ten years remain visible. This is a dated working plan, not a formally registered study.

Let B_ht be US imports from Bangladesh in chapter h and W_ht imports from the world, with h in {61,62}. Let b_ht = B_ht/W_ht and w_ht = W_ht/(W_61t+W_62t). Bangladesh's total share is s_t = sum_h(w_ht b_ht). For endpoints 0 and 1:

`s_1 - s_0 = sum_h [(w_h1+w_h0)/2 * (b_h1-b_h0)] + sum_h [(b_h1+b_h0)/2 * (w_h1-w_h0)]`

The first term is the within-chapter contribution. The second is the market-composition contribution. This symmetric identity splits the interaction equally and closes exactly. Multiply by 100 for percentage points. It supplies an accounting explanation, not an intervention or a feasible policy counterfactual. Product shifts inside each chapter remain in the within term.

Growth is `100*(value_end/value_start-1)`. Share is `100*country_value/world_value`. The index is `100*value_year/value_2012`, with the denominator recalculated within the selected country and chapter on the dashboard. Chapter composition is chapter 61 divided by chapters 61+62 for the same country and year.

## Why there is no causal regression

A GSP difference-in-differences model assigning all garments a tariff increase has invalid treatment exposure. A genuinely eligible-product model would need historical tariff-line eligibility, actual claims, origin rules, program expiry and renewal coding, and credible unaffected comparisons. These requirements are not met by a two-chapter apparel panel.

Rana Plaza, buyer agreements, changes in enforcement, wage changes, and reputational responses overlap. Other suppliers may gain displaced orders and share multinational buyers. Neither a competing supplier nor the EU is automatically an untreated control. A synthetic control does not resolve those spillovers. Two product chapters do not create independent country-level treatment assignments. No fixed effects, covariates, weighting for estimation, PPML, p-values, or confidence intervals are used. Descriptive shares already incorporate observed expenditure weights. Measurement and identification uncertainty remain even when arithmetic is exact.

## Scope

The main endpoint precedes 2019, when US-China trade measures further complicate interpretation. The 2019 extension is descriptive. Ending in 2019 avoids mixing the historical question with COVID-era disruption. This is not an assessment of present-day Bangladesh or current tariff law.

No exporter-reported series, EU aggregate, firm linkage, labor-force microdata, or incident denominator is in the analysis. Export values include imported inputs and are not domestic value added. Changes in dollars combine quantity, price, quality, exchange-rate and valuation changes. Chapter 61 covers knitted or crocheted apparel and clothing accessories; chapter 62 covers apparel and accessories not knitted or crocheted. This definition is broader than individual garment factory output and excludes upstream yarn, fabric, footwear and other industries.

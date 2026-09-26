# Analysis plan

Dated 26 September 2026 before downloading the analysis panel or computing changes. This is a dated working plan, not a preregistration. A feasibility query viewed four US import records for 2012 only (Bangladesh and world, chapters 61 and 62).

Question: How did Bangladesh's position in US apparel sourcing change after Rana Plaza, and what do actual preference exposure and published worker evidence imply for trade-based labor governance?

Primary dataset: UN Comtrade final annual US-reported imports, reporter 842, calendar years 2010 through 2019, HS chapters 61 and 62 separately, origins Bangladesh (50), China (156), Vietnam (704), Cambodia (116), India (356), and world (0). Comparators describe competing suppliers and are not counterfactual controls. The two-digit chapter boundaries are used across original HS revisions; no detailed tariff-line concordance is implied.

Measures: nominal current US dollar import value, supplier share of world apparel imports, chapter composition, and 2012=100 indices. Values are not physical export volumes. Use primaryValue and document the source's valuation field. Exclude quantities and weights because aggregation does not support consistent physical units.

Primary contrast: 2012 (last complete pre-disaster year) to 2018, with 2019 extension and 2013 baseline as explicitly planned sensitivities. Display all annual observations including 2013. Annual resolution cannot separate announcement, implementation, or order lags. End the sample before the pandemic. Interpret 2019 cautiously because US-China tariffs can redirect sourcing.

Methods: descriptive levels and shares; exact symmetric decomposition of the change in Bangladesh's apparel market share into within-chapter supplier-share changes and changing world chapter weights. For chapter h, w_ht=M_world,h,t / sum_h M_world,h,t and b_ht=M_BGD,h,t/M_world,h,t. Then delta s=sum_h mean(w_h)*delta b_h + sum_h mean(b_h)*delta w_h. Report percentage points. No regressions, standard errors, causal effects, or unobserved welfare measures are inferred from this panel.

Validation: exact expected year-origin-chapter grid; unique keys; nonnegative values; reported versus converted status; declared HS revisions; component totals; source hashes; sums and shares; no blank-to-zero conversion; coverage below the public endpoint limit; independent comparison with published USITC/OTEXA evidence where definitions align. Stop acquisition on rate-limit responses. Do not bypass service limits.

Rejected designs: garment-wide US GSP tariff difference-in-differences (invalid exposure); direct eligible-product DiD (historical eligibility/use plus common 2013-15 lapse complicate treatment and counterfactual); synthetic control (small aggregate panel and simultaneous global buyer responses do not establish an unaffected donor pool).

Scope limits: no EU aggregate, no destination diversification conclusion, no direct labor or safety outcome dataset. EU preferences are institutional context only. The primary contribution combines a reproducible sourcing diagnostic, exposure audit, and evidence-based policy interpretation.

Implementation correction before estimation: the initial India code 356 returned no observations; UN Comtrade reporter-country documentation identifies current India as 699 and 356 as India through 1974. Use 699 throughout, preserving the planned country sample. The failed 2010 completeness assertion prevented analysis of an incomplete panel.

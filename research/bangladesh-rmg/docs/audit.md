# Research design audit

This audit checks whether the policy mechanism, data and method support the project's claims.

| Issue | Evidence and design choice |
| --- | --- |
| GSP exposure | Historical USTR guidance excludes most apparel. The analysis does not assign a garment-wide tariff increase to the 2013 suspension. Illustrative tariff lines and actual aggregate preference use are documented in the policy notes. |
| Unit of observation | US-reported annual imports by origin and apparel chapter, with HS 61 and 62 over 2010-2019. World totals are denominators, not additional supplier observations. |
| Data provenance | The frozen UN Comtrade responses contain 120 records. Query parameters, actual retrieval times, source flags and hashes are preserved. |
| Method | Descriptive trends, four endpoint contrasts and an exact symmetric market-share decomposition. Comparator suppliers provide context without being treated as validated counterfactuals. |
| Worker outcomes | Wages, employment and safety are assessed through published research. The trade panel contains no worker-level outcomes. |
| Reproduction | Python performs acquisition, validation and accounting. Paper figures and website charts use the same JSON. No database or regression infrastructure is required. |

See the [analysis plan](analysis_plan.md), [methods](methods.md), [policy timeline](policy_timeline.md) and [validation report](validation.json). Private writing remains outside public version control.

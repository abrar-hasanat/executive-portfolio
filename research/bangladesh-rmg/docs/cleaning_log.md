# Acquisition and cleaning log

26 September 2026:

1. A four-record 2012 feasibility query established anonymous access to final UN Comtrade records. It preceded the dated analysis plan and is disclosed there.
2. Initial India code 356 yielded an incomplete response. The completeness check stopped acquisition. Official Comtrade code documentation identifies 699 for current India and 356 for the historical territory through 1974. Correcting the identifier preserved the prespecified country sample.
3. Retrieved ten annual responses, twelve records each, below the public endpoint's row cap. Recorded exact queries, retrieval times and SHA-256 hashes. No API credentials, paid subscriptions or restricted records were used.
4. An initial requirement that every record be directly reported failed. Inspection showed 72 reported and 48 pre-aggregated records, all in original classifications. Validation now accepts source-reported or source-aggregated records and preserves both flags. No observations were deleted to obtain results.
5. Confirmed exact key grid, unique rows, finite nonnegative values, consistent metadata, world denominators, source hashes and decomposition closure. Sort order is deterministic.
6. Retained `primaryValue` because it equals the source `cifvalue` in every record. No assertion of equality with Census customs value is made.
7. External check: USITC publication 5543, Table 5.5 (p.132), reports Bangladesh apparel imports for consumption of $4.791bn in 2013, $5.304bn in 2018 and $5.848bn in 2019. The frozen Comtrade series reports $5.037bn, $5.429bn and $5.929bn. The definitions and vintages differ. This confirms broad scale and growth, not exact independent replication. No ad hoc adjustment was applied. The residual difference has not been decomposed into valuation, customs coverage and revision components.
8. Census's anonymous API attempt returned a Missing Key HTML page, not trade observations. No Census API series was used. No Eurostat or labor microdata panel was acquired because the selected question did not require it.

No observations were excluded from the planned 120-row panel. No favorable-result sample search was performed. Source records may be revised after this retrieval date; the snapshot fixes a reproducible vintage.

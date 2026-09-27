# Bangladesh apparel trade and worker protection

Independent descriptive research by Abrar Mohammad Hasanat on apparel sourcing, trade preferences and worker protection.

**Question:** How did Bangladesh's position in US apparel sourcing change after Rana Plaza, and what can that evidence contribute to policy on worker protection?

The project combines an audit of historical preference exposure, a reproducible analysis of UN Comtrade records, and a critical reading of worker research. Most apparel was already excluded from US GSP. A garment-wide tariff treatment in 2013 would therefore misstate the policy mechanism.

## Findings

US-reported apparel imports from Bangladesh increased from $4.521 billion in 2012 to $5.429 billion in 2018, a 20.1% nominal increase. Bangladesh's share rose from 5.60% to 6.26%, or 0.657 percentage points. An exact accounting decomposition attributes +0.804 points to gains within knit and non-knit apparel, offset by -0.147 points from the changing composition of the US import market. Using 2013 instead of 2012 gives a smaller 0.245-point gain through 2018.

These are observed sourcing patterns, **not causal effects of GSP suspension, factory reforms, or buyer agreements**. The data do not measure wages, worker welfare, factory closures, or injuries. See [methods](docs/methods.md), [policy exposure](docs/policy_timeline.md), and the [claim ledger](docs/claim_ledger.csv).

[Project page](https://abrarhasanat.com/projects/bangladesh-rmg) | [Interactive dashboard](https://abrarhasanat.com/dashboards/bangladesh-rmg)

## Reproduce

Run from this directory. Python 3.12 was used. Acquisition, validation, tables, and website exports use only the Python standard library. Plotting has pinned dependencies.

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python src/acquire.py
.venv/bin/python src/analyze.py
.venv/bin/python -m unittest discover -s tests -v
.venv/bin/python src/figures.py
.venv/bin/python src/export_website.py
```

The 120-record source snapshot is included. Acquisition reuses it without network access. To acquire a new vintage, copy the project, remove only the ten raw JSON responses and their metadata from that copy, and rerun acquisition. This changes the snapshot and may revise results. Never overwrite the release snapshot while claiming an exact replication. The public endpoint needs no key; acquisition stops on errors and does not evade service limits.

`analyze.py` writes the panel, annual summary, four planned contrasts, dashboard JSON, and validation report. Figures and the website both consume `outputs/dashboard.json`. No stochastic estimation is used, so no seed applies. Figure timestamps are suppressed; plot bytes can still vary by platform and font environment. Numerical outputs are deterministic for the frozen inputs. Export copies validated outputs into the existing portfolio, checking their source hash first.

## Files

| Location | Contents |
| --- | --- |
| `data/raw/` | Original API responses and retrieval metadata |
| `data/processed/` | Validated year-origin-chapter panel |
| `src/` | Acquisition, analysis, plotting, website export |
| `outputs/` | Machine-readable results and figures |
| `docs/` | Audit, dated plan, methods, data dictionary, sources, literature, validation |
| `tests/` | Arithmetic, coverage, corruption, and website consistency checks |

The full private paper, application sample, author guide, and downloaded research papers are deliberately outside this public repository. The research pipeline is organized under `research/bangladesh-rmg/` in the portfolio repository. Its relative paths allow it to run independently of the website.

## Data and rights

Source: United Nations Statistics Division, UN Comtrade, retrieved 26 September 2026. US reporter 842; import flow M; HS 61 and 62; 2010-2019; Bangladesh, Cambodia, China, India, Vietnam, and world. Current US dollars from the source's CIF-type field, not physical volume or Census customs value. Small data extracts and analytical redistribution fall within the published UN Comtrade exceptions; see [data terms](DATA_TERMS.md). The MIT license covers original code only. No endorsement by the UN, Carleton College, or any other institution is claimed.

For release hashes, exact commands, verification, and rollback, see [reproducibility](docs/reproducibility.md).

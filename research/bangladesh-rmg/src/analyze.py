"""Validate the observed panel and generate every analytical output."""
from pathlib import Path
import csv
import hashlib
import itertools
import json
import math
from acquire import ROOT, PARTNERS

def build():
    rows = []
    files = [ROOT / f"data/raw/us_imports_{y}.json" for y in range(2010, 2020)]
    manifest = json.loads((ROOT / "docs/source_manifest.json").read_text())
    for path, meta in zip(files, manifest):
        assert hashlib.sha256(path.read_bytes()).hexdigest() == meta["sha256"], path
        obj = json.loads(path.read_text())
        assert len(obj["data"]) == obj["count"] == 12
        for r in obj["data"]:
            assert r["reporterCode"] == 842 and r["flowCode"] == "M"
            assert r["partner2Code"] == 0 and r["customsCode"] == "C00" and r["motCode"] == 0
            assert r["isOriginalClassification"], "Unexpected classification conversion"
            assert r["isReported"] or r["isAggregate"], "Neither reported nor aggregated record"
            assert r["primaryValue"] is not None and math.isfinite(r["primaryValue"]) and r["primaryValue"] >= 0
            assert r["primaryValue"] == r["cifvalue"], "Valuation convention changed"
            rows.append({"year": r["refYear"], "partner_code": r["partnerCode"],
                         "country": PARTNERS[r["partnerCode"]], "hs": r["cmdCode"],
                         "hs_revision": r["classificationCode"], "is_reported": r["isReported"],
                         "is_aggregate": r["isAggregate"], "legacy_estimation_flag": r["legacyEstimationFlag"], "value_usd": r["primaryValue"]})
    rows.sort(key=lambda r: (r["year"], r["partner_code"], r["hs"]))
    keys = [(r["year"], r["partner_code"], r["hs"]) for r in rows]
    expected = set(itertools.product(range(2010, 2020), PARTNERS, ["61", "62"]))
    assert len(keys) == len(set(keys)) == 120
    assert set(keys) == expected, "Missing observations are not zeros"
    values = {k: r["value_usd"] for k, r in zip(keys, rows)}
    for y, h in itertools.product(range(2010, 2020), ["61", "62"]):
        assert sum(values[y, c, h] for c in PARTNERS if c) <= values[y, 0, h]
    processed = ROOT / "data/processed"
    outputs = ROOT / "outputs"
    processed.mkdir(parents=True, exist_ok=True)
    outputs.mkdir(exist_ok=True)
    def write_csv(path, data):
        with path.open("w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=list(data[0]), lineterminator="\n");w.writeheader();w.writerows(data)
    write_csv(processed / "us_apparel_panel.csv", rows)
    annual = []
    for y, c in itertools.product(range(2010, 2020), PARTNERS):
        total = sum(values[y, c, h] for h in ["61", "62"])
        world = sum(values[y, 0, h] for h in ["61", "62"])
        base = sum(values[2012, c, h] for h in ["61", "62"])
        annual.append({"year": y, "country": PARTNERS[c], "value_usd": total,
                       "share_pct": total/world*100, "index_2012": total/base*100,
                       "knit_usd": values[y,c,"61"], "nonknit_usd": values[y,c,"62"],
                       "knit_share_pct": values[y,c,"61"]/total*100,
                       "knit_market_share_pct": values[y,c,"61"]/values[y,0,"61"]*100,
                       "nonknit_market_share_pct": values[y,c,"62"]/values[y,0,"62"]*100})
    write_csv(outputs / "annual_summary.csv", annual)
    lookup = {(r["year"],r["country"]):r for r in annual}
    contrasts = []
    for y0,y1 in [(2012,2018),(2012,2019),(2013,2018),(2013,2019)]:
        b0,b1 = lookup[y0,"Bangladesh"],lookup[y1,"Bangladesh"]
        within=composition=0
        for h in ["61","62"]:
            w0=values[y0,0,h]/lookup[y0,"World"]["value_usd"]
            w1=values[y1,0,h]/lookup[y1,"World"]["value_usd"]
            s0=values[y0,50,h]/values[y0,0,h]
            s1=values[y1,50,h]/values[y1,0,h]
            within+=(w0+w1)/2*(s1-s0)*100
            composition+=(s0+s1)/2*(w1-w0)*100
        change=b1["share_pct"]-b0["share_pct"]
        assert abs(change-within-composition)<1e-10
        contrasts.append({"start":y0,"end":y1,"bd_growth_pct":(b1["value_usd"]/b0["value_usd"]-1)*100,
                          "world_growth_pct":(lookup[y1,"World"]["value_usd"]/lookup[y0,"World"]["value_usd"]-1)*100,
                          "share_change_pp":change,"within_chapter_pp":within,"composition_pp":composition})
    write_csv(outputs / "contrasts.csv", contrasts)
    snapshot=hashlib.sha256(''.join(m["sha256"] for m in manifest).encode()).hexdigest()
    data={"schema_version":1,"analysis_version":"1.0.0","snapshot_sha256":snapshot,
          "retrieved_at":max(m["retrieved_at"] for m in manifest),"source":"UN Comtrade",
          "source_url":"https://comtradeplus.un.org/","units":"current US dollars; source CIF-type field",
          "scope":"US-reported imports, HS 61 and 62, calendar years 2010-2019",
          "interpretation":"Descriptive observed data. No causal treatment effects or labor outcomes.",
          "countries":[v for k,v in PARTNERS.items() if k],"annual":annual,"contrasts":contrasts}
    (outputs / "dashboard.json").write_text(json.dumps(data,indent=2)+"\n")
    report={"status":"passed","records":len(rows),"missing_keys":0,"duplicate_keys":0,
            "negative_values":0,"reported_records":sum(r["is_reported"] for r in rows),
            "aggregate_records":sum(r["is_aggregate"] for r in rows),"original_classification_records":120,
            "legacy_estimation_flags":{str(f):sum(r["legacy_estimation_flag"]==f for r in rows) for f in sorted({r["legacy_estimation_flag"] for r in rows})},
            "hs_revisions":{str(y):sorted(set(r['hs_revision'] for r in rows if r['year']==y)) for y in range(2010,2020)},
            "snapshot_sha256":snapshot,"decomposition_residual_tolerance":1e-10,
            "notes":["Source primaryValue equals cifvalue in all 120 records. No claim that it equals Census customs value.",
                     "No quantities/weights, imputation, conversion, deflation, or synthetic observations used.",
                     "World totals used once as denominators, never added to individual countries.",
                     "No sample-based confidence intervals: uncertainty is about measurement and interpretation."]}
    (ROOT/"docs/validation.json").write_text(json.dumps(report,indent=2)+"\n")
    print(json.dumps({"validation":report,"Bangladesh":[r for r in annual if r['country']=='Bangladesh'],"contrasts":contrasts},indent=2))
    return data

if __name__=="__main__":
    build()

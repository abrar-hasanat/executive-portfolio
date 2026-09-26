"""Fetch the prespecified, small UN Comtrade panel without credentials.

Uses the documented public preview API for final data. Stops on any HTTP
error, including rate limiting. Cached successful responses are not refetched.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
PARTNERS = {0: "World", 50: "Bangladesh", 116: "Cambodia", 156: "China", 699: "India", 704: "Vietnam"}

def main():
    raw = ROOT / "data/raw"
    raw.mkdir(parents=True, exist_ok=True)
    manifest = []
    for year in range(2010, 2020):
        params = {"reporterCode": "842", "period": str(year), "cmdCode": "61,62",
                  "flowCode": "M", "partnerCode": ",".join(map(str, PARTNERS)),
                  "partner2Code": "0", "customsCode": "C00", "motCode": "0", "maxRecords": "500"}
        url = "https://comtradeapi.un.org/public/v1/preview/C/A/HS?" + urllib.parse.urlencode(params)
        path = raw / f"us_imports_{year}.json"
        meta_path = raw / f"us_imports_{year}.meta.json"
        if not path.exists():
            req = urllib.request.Request(url, headers={"User-Agent": "BangladeshApparelResearch/1.0"})
            with urllib.request.urlopen(req, timeout=60) as response:
                payload = response.read()
            obj = json.loads(payload)
            assert len(obj.get("data", [])) == 12, f"Unexpected coverage for {year}: {obj.get('count')}"
            path.write_bytes(payload)
            meta_path.write_text(json.dumps({"retrieved_at": datetime.now(timezone.utc).isoformat(), "url": url}, indent=2))
        payload = path.read_bytes()
        obj = json.loads(payload)
        meta = json.loads(meta_path.read_text())
        manifest.append({"file": str(path.relative_to(ROOT)), **meta, "parameters": params,
                         "sha256": hashlib.sha256(payload).hexdigest(), "records": len(obj["data"]),
                         "source": "UN Comtrade", "flow": "US-reported imports", "units": "current US dollars",
                         "terms": "https://uncomtrade.org/docs/policy-on-use-and-re-dissemination/"})
        print(year, len(obj["data"]), flush=True)
    (ROOT / "docs/source_manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")

if __name__ == "__main__":
    main()

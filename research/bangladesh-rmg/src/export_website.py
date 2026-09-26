"""Copy only validated public outputs into the existing portfolio."""
import hashlib
import json
from pathlib import Path
import shutil
from acquire import ROOT

def main():
    data = json.loads((ROOT / 'outputs/dashboard.json').read_text())
    report = json.loads((ROOT / 'docs/validation.json').read_text())
    manifest = json.loads((ROOT / 'docs/source_manifest.json').read_text())
    for m in manifest:
        assert hashlib.sha256((ROOT / m['file']).read_bytes()).hexdigest() == m['sha256']
    assert report['status'] == 'passed' and data['snapshot_sha256'] == report['snapshot_sha256']
    site = ROOT.parents[1]
    assert (site / 'package.json').exists(), 'Run export inside the portfolio repository'
    public = site / 'public/data/bangladesh-rmg'
    public.mkdir(parents=True, exist_ok=True)
    for name in ['dashboard.json', 'annual_summary.csv', 'contrasts.csv']:
        shutil.copyfile(ROOT / 'outputs' / name, public / name)
    shutil.copyfile(ROOT / 'data/processed/us_apparel_panel.csv', public / 'us_apparel_panel.csv')
    print('Exported four validated public files to', public.relative_to(site))

if __name__ == '__main__':
    main()

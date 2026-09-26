"""Independent release checks, including source corruption and grid failure."""
import contextlib
import hashlib
import io
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src'))
import analyze

class ResearchTests(unittest.TestCase):
    def test_headline_from_raw_values(self):
        totals = {}
        for year in [2012, 2018]:
            raw = json.loads((ROOT / f'data/raw/us_imports_{year}.json').read_text())['data']
            totals[year] = {p: sum(r['primaryValue'] for r in raw if r['partnerCode'] == p) for p in [0, 50]}
        expected = 100 * (totals[2018][50] / totals[2018][0] - totals[2012][50] / totals[2012][0])
        data = json.loads((ROOT / 'outputs/dashboard.json').read_text())
        primary = data['contrasts'][0]
        self.assertAlmostEqual(expected, primary['share_change_pp'], places=12)
        self.assertEqual(totals[2012][50], 4520972350)
        self.assertEqual(totals[2018][50], 5429199687)
        self.assertAlmostEqual(primary['within_chapter_pp'] + primary['composition_pp'], expected, places=12)

    def test_frozen_outputs_reproduce(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            shutil.copytree(ROOT / 'data/raw', root / 'data/raw')
            (root / 'docs').mkdir()
            shutil.copyfile(ROOT / 'docs/source_manifest.json', root / 'docs/source_manifest.json')
            with patch.object(analyze, 'ROOT', root), contextlib.redirect_stdout(io.StringIO()):
                analyze.build()
            for name in ['annual_summary.csv', 'contrasts.csv', 'dashboard.json']:
                self.assertEqual((root / 'outputs' / name).read_bytes(), (ROOT / 'outputs' / name).read_bytes())

    def test_duplicate_record_is_rejected_even_with_matching_hash(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            shutil.copytree(ROOT / 'data/raw', root / 'data/raw')
            (root / 'docs').mkdir()
            manifest = json.loads((ROOT / 'docs/source_manifest.json').read_text())
            p = root / manifest[0]['file']
            raw = json.loads(p.read_text())
            raw['data'][1] = raw['data'][0].copy()
            p.write_text(json.dumps(raw))
            manifest[0]['sha256'] = hashlib.sha256(p.read_bytes()).hexdigest()
            (root / 'docs/source_manifest.json').write_text(json.dumps(manifest))
            with patch.object(analyze, 'ROOT', root), self.assertRaises(AssertionError):
                analyze.build()

    def test_source_corruption_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            shutil.copytree(ROOT / 'data/raw', root / 'data/raw')
            (root / 'docs').mkdir()
            shutil.copyfile(ROOT / 'docs/source_manifest.json', root / 'docs/source_manifest.json')
            p = root / 'data/raw/us_imports_2010.json'
            p.write_text(p.read_text() + ' ')
            with patch.object(analyze, 'ROOT', root), self.assertRaises(AssertionError):
                analyze.build()

    def test_website_export_matches(self):
        public = ROOT.parents[1] / 'public/data/bangladesh-rmg'
        if not public.exists():
            self.skipTest('Standalone research copy has no website export')
        self.assertEqual((public / 'dashboard.json').read_bytes(), (ROOT / 'outputs/dashboard.json').read_bytes())

if __name__ == '__main__':
    unittest.main()

# Reproducibility and release record

Analysis version: 1.0.0. Completed research snapshot: 26 September 2026.

Data snapshot SHA-256: `df213feefd54664fd2fbd0875d6bcbe187b8d7104c1b646d44e93dd016c25f57`. This is SHA-256 over the ordered concatenation of the ten raw-file hashes in `source_manifest.json`. Each individual response is independently hashed there.

## Verified locally

- Python 3.12 in a newly created virtual environment, with the complete pinned plotting dependency list installed from `requirements.txt`.
- Cached acquisition reads all ten source responses without a network request.
- Rebuilding in an empty temporary output directory produces byte-identical annual CSV, contrast CSV and dashboard JSON.
- Five unit tests pass: independent headline arithmetic, clean output reproduction, duplicate-grid rejection, corrupted-source rejection, and equality of website and research JSON.
- Both publication figures regenerate from the dashboard JSON.
- Existing website `npm ci --ignore-scripts --no-audit --no-fund`, `npm run lint` and `npm run build` pass. Next.js also completes TypeScript checks and generates both new routes.
- `git diff --check` passes. Public paths contain data, code, figures and source documentation. Private paper/sample/guide sources and third-party PDFs are outside the repository.

Command sequence is in the project README. Numerical checks can run without installing plotting packages: `python3 src/analyze.py` and `python3 -m unittest discover -s tests -v`.

## Release procedure

Work uses the branch `research/bangladesh-rmg-2026-09` in the existing portfolio repository. The baseline main commit is `8274a6798431df440f224e7a05ceef3ea3bcc530`. Review the branch diff before merge. Existing Vercel deployment is triggered through GitHub; no hosting migration is needed. A commit, a successful build, a deployment and a live interaction check are distinct milestones.

The production project and dashboard were verified at their public URLs after PR 14 merged. Branch preview required Vercel authentication, so browser testing used the authorized production release. See [release verification](release_verification.md) for commits, deployment milestones, byte-level live-data checks, interaction checks, mobile-testing limits and the follow-up interface fixes.

Rollback preserves history: revert the eventual merge commit (using `git revert -m 1 <merge_sha>` for a two-parent merge) and let the existing deployment rebuild. Do not force-reset the shared main branch. The profile update is a separate reversible commit.

## Remaining analytical limits

No causal treatment effect is identified. No labor or safety microdata were replicated. HTS checks are illustrative and GSP use is aggregate, with no complete historical preference-utilization panel. The CBP/HTS implementation-date discrepancy is documented. UN Comtrade and USITC levels differ; this project does not fully reconcile valuation, customs coverage and vintage effects. The 2010-2019 window is historical and does not establish current conditions.

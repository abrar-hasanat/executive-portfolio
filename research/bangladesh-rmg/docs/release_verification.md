# Release verification

Verified 26 September 2026. Research analysis version 1.0.0.

## Code and deployment milestones

- Baseline website main: `8274a6798431df440f224e7a05ceef3ea3bcc530`.
- Research and initial interface commit: `4415d5c6a67707d2787da72807651448eddfa25b`.
- [Research PR 14](https://github.com/abrar-hasanat/executive-portfolio/pull/14) merged as `ef97e1728fee3c4df3a826a8e9966b7b658854ff`.
- Vercel reported successful branch and production deployments. The production check links to deployment `ESDgpriW7NFWB4fPdaqDn8pui3UL` in the existing project.
- Both public routes were then opened and exercised in the browser: [project](https://abrarhasanat.com/projects/bangladesh-rmg) and [dashboard](https://abrarhasanat.com/dashboards/bangladesh-rmg). The canonical host redirects to `www.abrarhasanat.com`.
- Profile [PR 3](https://github.com/abrar-hasanat/abrar-hasanat/pull/3) merged as `0340bebd1b406f4ee2bd0017859c2868ad5b6a99`, adding only a research section and public links.

[PR 15](https://github.com/abrar-hasanat/executive-portfolio/pull/15), merged as `20a7e8995e84f8e7a7818b94ccb83e10ccec8489`, records the live-check fixes: native CSV download links, a project-specific homepage link label, and a research-scope label for dataset facts. Its pull-request description records the subsequent production checks. These presentation changes do not alter the data or analytical results.

## Reproduction and consistency

A fresh Python 3.12 virtual environment installed all pinned requirements. The cached official responses regenerated the numerical outputs, including a byte-identical rebuild in an empty temporary directory. Five tests passed: independent raw-data headline arithmetic, output reproduction, duplicate-grid rejection, corrupt-source rejection, and equality with the website JSON. Publication figures regenerated from the same JSON. No stochastic estimator is used.

Data snapshot SHA-256: `df213feefd54664fd2fbd0875d6bcbe187b8d7104c1b646d44e93dd016c25f57`.

The production files were fetched independently and matched the local validated exports byte for byte:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `us_apparel_panel.csv` | 5909 | `2bff42d2349274a14c4e507397039afb2eee347389db274baa482788d2911252` |
| `dashboard.json` | 24410 | `63eef2053de3da4beff88882d7ae97e05433f46215a89d23254996aa43cc052d` |
| `annual_summary.csv` | 8333 | `bfa4261c16999eee72e82b8494812563fb92ed99773e14ba767e3e469e30054b` |
| `contrasts.csv` | 509 | `f92a222adb1a8e536e384e7c8461233251d8143dadba5cc50b3991c0858d8dab` |

## Website checks and limits

The existing lint, TypeScript and production-build gates passed. Local HTTP checks returned 200 for the homepage, dashboard listing, new project and dashboard, existing valuation and agile dashboards, and the source CSV. No new dependency or host was introduced.

Live browser checks verified the headline values, table disclosure, share/value/index choices, both apparel chapters, 2018/2019 endpoints, the 2012 index baseline of 100, supplier selection, empty-selection message and disabled export, reset, and the 2019 interpretation note. The Research and Finance listing filters worked. Navigation from the dashboard to the project and back to the homepage worked; the existing valuation dashboard loaded. The full source CSV download returned a browser download path, and its public bytes were independently verified above.

The original selected-data button produced a 40-observation download confirmation, but the browser's download-event capture timed out. PR 15 replaced its transient programmatic anchor with a visible native download link. All 36 default share rows and all 40 filtered knit-index rows, including units and snapshot hashes, matched the validated analysis. The browser still timed out on delivery of the data-URL download, so a further follow-up serves the same CSV through a regular same-origin HTTP response with an attachment header. Its endpoint validates the requested chapter, measure, years and suppliers and uses only the frozen JSON. The final download follow-up PR records live verification. Browser extension metadata errors were observed; they originated from the browser extension, not the site's source.

Desktop layout was visually inspected at a 1363 CSS-pixel viewport without page-wide horizontal overflow. Responsive breakpoints, wrapping controls, fluid chart sizing and the table's horizontal scroll container were reviewed in code. The available browser exposes no viewport-resize or device-emulation capability, and zoom shortcuts did not change the CSS viewport. Actual narrow-viewport and mobile-device behavior was therefore not verified. No mobile test pass is claimed.

The local browser preview was blocked by its environment. Vercel's branch preview required authentication. Production release was authorized in the task and followed local gates; live checks were performed immediately after the existing host reported a successful deployment. Preview protection was not disabled.

## Privacy and rollback

Public files are original code, the small redistributable Comtrade extract, derived results and documentation. The full paper, application sample, author guide and third-party research PDFs are outside the public repository and have no website download links.

Revert follow-up presentation merges first, then the research merge if the entire addition must be removed. For a two-parent merge use `git revert -m 1 <merge_sha>` on a review branch and merge the revert; the existing Vercel integration will rebuild. Revert profile merge `0340bebd1b406f4ee2bd0017859c2868ad5b6a99` separately. Preserve shared history; do not force-reset main.

A standalone research repository was not created because available GitHub actions did not expose repository creation and the browser was not signed in. The complete reproducible project is public under this repository's `research/bangladesh-rmg/` directory. The old repository's status remains unknown.

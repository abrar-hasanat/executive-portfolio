# Release verification

Research analysis version 1.0.0. Validation records refer to the frozen source snapshot and the deployed interface.

## Published releases

- Initial research release: [PR 14](https://github.com/abrar-hasanat/executive-portfolio/pull/14), merge `ef97e1728fee3c4df3a826a8e9966b7b658854ff`.
- Interface labels and export link: [PR 15](https://github.com/abrar-hasanat/executive-portfolio/pull/15), merge `20a7e8995e84f8e7a7818b94ccb83e10ccec8489`.
- CSV attachment response: [PR 16](https://github.com/abrar-hasanat/executive-portfolio/pull/16), merge `14da1e81a96ac19bb53fcaf8b72b5d6b4ab8eab9`.
- Profile research entry: [PR 3](https://github.com/abrar-hasanat/abrar-hasanat/pull/3), merge `0340bebd1b406f4ee2bd0017859c2868ad5b6a99`.

The existing Vercel production deployment succeeded. The [project page](https://abrarhasanat.com/projects/bangladesh-rmg) and [dashboard](https://abrarhasanat.com/dashboards/bangladesh-rmg) were verified at their public URLs. Subsequent text revisions are recorded in their review pull requests; numerical outputs and data version are unchanged.

## Reproduction and consistency

A fresh Python 3.12 environment installed the pinned requirements. Five tests passed: source arithmetic, output reproduction, duplicate-grid rejection, corrupt-source rejection and equality with the website JSON. An empty-directory rebuild produced byte-identical numerical outputs. Publication figures use the same JSON. No stochastic estimator is used.

Data snapshot SHA-256: `df213feefd54664fd2fbd0875d6bcbe187b8d7104c1b646d44e93dd016c25f57`.

Production exports matched the validated local files byte for byte:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `us_apparel_panel.csv` | 5909 | `2bff42d2349274a14c4e507397039afb2eee347389db274baa482788d2911252` |
| `dashboard.json` | 24410 | `63eef2053de3da4beff88882d7ae97e05433f46215a89d23254996aa43cc052d` |
| `annual_summary.csv` | 8333 | `bfa4261c16999eee72e82b8494812563fb92ed99773e14ba767e3e469e30054b` |
| `contrasts.csv` | 509 | `f92a222adb1a8e536e384e7c8461233251d8143dadba5cc50b3991c0858d8dab` |

## Interface verification

Lint, TypeScript and production-build checks passed. Live checks covered share, nominal-value and index measures; both chapters; 2018 and 2019 endpoints; supplier selection; empty state; reset; the accessible table; listing filters; and navigation. Existing dashboard routes returned HTTP 200. Desktop layout was visually inspected without page-wide horizontal overflow.

The selected-data CSV downloaded successfully in the browser. Independent production checks verified 36 share rows, 40 knit-index rows and 10 China non-knit nominal-value rows against the validated chapter panel. Units, snapshot hashes, content types and attachment filenames matched. Four invalid requests returned HTTP 400. The full source-panel download also passed.

Responsive breakpoints, wrapping controls, fluid charts and table scrolling were reviewed in code. Actual narrow-viewport and mobile-device behavior has not been verified. No mobile test pass is claimed.

## Privacy and rollback

Public files contain original code, the small redistributable Comtrade extract, derived results and documentation. The paper, writing sample, author guide and third-party full-text papers remain outside the public repository and have no public download links.

Revert relevant merges in reverse order on a review branch. For a two-parent merge, use `git revert -m 1 <merge_sha>`, then merge the revert so the existing deployment rebuilds. Revert the profile separately. Preserve shared history rather than force-resetting main.

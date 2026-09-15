# SAP ECC 2027 Landscape

A public, self-serve visual tracker of the SAP ECC end-of-support deadline
(December 31, 2027): who's exposed, how fast the industry is actually moving,
what delay costs, and a short honest self-check of your own risk.

**This is a work-sample project, not an official Conduct product.** It was
built independently by Garima as a public application piece for Conduct's
first Brand & Marketing hire role — an exercise in building something in
Conduct's own market (SAP ECC migration) with the same standard of honesty
about sourcing that a company like Conduct would need to hold itself to.

**Live:** https://sap-ecc-2027-landscape.vercel.app
**Repo:** https://github.com/garima0901-source/sap-ecc-2027-landscape

## Design principle

Every number on the page is sourced and dated, in the UI itself — not buried
in a single footnote. Source confidence is labeled honestly in three tiers
(see below), because a survey-derived stat and a directly reported fact are
not the same kind of claim, and treating them as interchangeable would be
dishonest regardless of how the page looks.

## Data sources

### High confidence — direct reporting

- **SAP ECC mainstream maintenance ends December 31, 2027** (EhP6–8 / Business
  Suite 7; EhP0–5 already lost mainstream support Dec 31, 2025) —
  [Sifted](https://sifted.eu/articles/conduct-60m-series-a),
  [Rimini Street](https://www.riministreet.com/blog/no-extension-to-ecc-support-2027-deadline/)
- **17,000 of SAP's 35,000 ECC customers have not yet migrated** — Gartner,
  via [Sifted](https://sifted.eu/articles/conduct-60m-series-a) and
  [TechFundingNews](https://techfundingnews.com/conduct-60m-series-a-iconiq-index-ventures-sap-2027-deadline/)
- **Conduct facts** (founded 2024 by Jan Philipp Haas, Philipp Hoefer and
  Henry Thompson, all ex-Palantir; $60M Series A on June 17, 2026, co-led by
  Index Ventures and ICONIQ with SAP as strategic investor, plus Creandum,
  Lucid Capital and Booom; ~$72M total raised; customers include Daimler
  Truck, DHL, Fraport and Heidelberg Materials; transformations reported
  30%+ faster) —
  [Sifted](https://sifted.eu/articles/conduct-60m-series-a),
  [TechFundingNews](https://techfundingnews.com/conduct-60m-series-a-iconiq-index-ventures-sap-2027-deadline/),
  [Silicon Canals](https://siliconcanals.com/conduct-breaks-cover-with-10-1m/),
  [EU-Startups](https://www.eu-startups.com/2026/06/ex-palantir-team-behind-conduct-raises-e51-million-to-make-enterprise-systems-ai-ready/)

  > The original project brief stated Conduct was founded in 2026. That was
  > re-checked during the build and corrected to 2024 — the company spent
  > about 18 months in stealth before its September 2025 launch. Flagging
  > and fixing this is the point of the sourcing discipline described above.

### Reasonable confidence — industry survey data, cited by original survey name

- **59% of companies fully or partially live on S/4HANA, Nov 2025** (up 13pp
  from 2024) — Precisely/ASUG survey, "Transforming SAP Processes Through
  Automation: 2026 Trends and Challenges," via
  [PR Newswire](https://www.prnewswire.com/news-releases/new-research-reveals-sap-s4hana-migration-momentum-despite-ongoing-automation-challenges-302603235.html)
- **35% of organizations intend to be on S/4HANA before end of 2026** —
  Abacus 2026 migration guide, citing SAPinsider benchmark research, via
  [SAPinsider](https://sapinsider.org/blogs/sap-ecc-to-s4hana-migration-abacus-2026/)
- **60%+ of S/4HANA migrations exceed budget or timeline**; **consultant
  day-rates projected to rise 30–50% in 2026–2027** — Tachyon Technologies,
  via [Kagool](https://kagool.com/sap-ecc-to-s-4hana-migration-path-a-strategic-roadmap-for-enterprise-leaders-in-2026/)
  and [Tachyon's own site](https://www.tachyontech.com/sap-s-4hana-migration-costs-in-2026-what-mid-market-enterprises-should-actually-budget/)

### Directional analysis (explicitly labeled as such in the UI)

- **Regional/industry adoption shares** (North America ~38–45%, Europe
  ~35–40%, Asia-Pacific fastest-growing from a smaller base; manufacturing
  and retail together over half of documented case studies) —
  [wmsspl.com](https://wmsspl.com/sap-s-4hana-adoption-rate-by-region/). This
  source presents ranges, not exact figures, and is treated that way on the
  page — no fabricated precision.

All source data lives in [`src/data/landscape.json`](src/data/landscape.json).

## How the weekly refresh works

A [Vercel Cron Job](vercel.json) hits `/api/refresh-check` every Monday. It
does **not** re-scrape the survey numbers — most of them come from periodic
industry reports, not sources that change daily, so pretending to re-derive
them weekly would be dishonest theater rather than real freshness. Instead it:

1. Re-checks that every cited source URL still resolves (HTTP 200).
2. If every source is reachable, bumps `meta.lastVerified` to today.
3. If any source is broken, leaves `lastVerified` alone and records the break
   in `meta.lastChecked.broken` so a human can find a replacement source or
   remove the claim — the same standard the original build spec asked for.
4. If `GITHUB_TOKEN` and `GITHUB_REPO` are set as Vercel environment
   variables, commits the updated data file back to the repo with a
   timestamped message. Without them, the check still runs and returns its
   result — it just can't persist it.

This is a scheduled-and-cited page, not a claim of real-time data — that
distinction is stated on the page itself, not just here.

### Enabling the auto-commit (optional)

The cron endpoint works without this — it just won't be able to persist its
result. To let it commit back to the repo, add these in the Vercel project's
Settings → Environment Variables (never commit a token to the repo itself):

- `GITHUB_TOKEN` — a fine-grained GitHub personal access token scoped to
  **Contents: Read and write** on this repo only
- `GITHUB_REPO` — `garima0901-source/sap-ecc-2027-landscape`
- `CRON_SECRET` (optional) — if set, the endpoint only responds to requests
  carrying `Authorization: Bearer <CRON_SECRET>`, which Vercel Cron sends
  automatically when this variable exists

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for the adoption chart
- Hosted on [Vercel](https://vercel.com/) (free tier), with a Vercel Cron Job
  for the weekly source check

## Run locally

```bash
npm install
npm run dev
```

## Contact

Built by Garima. [GitHub](https://github.com/garima0901-source) ·
[LinkedIn](https://www.linkedin.com/in/garima-1676141b4/)

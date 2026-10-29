# Growth and search plan (Nov 2026 – Jul 2027)

How HisabBD gets indexed, ranks for what people in Bangladesh actually search, and grows repeat visitors. Written 28 October 2026 against the live site `https://bd-hisab.vercel.app`.

Items are numbered so agents can pick one up ("implement C2", "do Q1"). Shipped items are marked ✅ and listed under Status. Every new calculator must still follow the hard rules in [`../AGENTS.md`](../AGENTS.md): privacy, both languages, pure logic, and no guessed regulations.

## Status (updated 28 Oct 2026)

### Shipped: merged in PR #1 and live on bd-hisab.vercel.app (verified 28 Oct 2026)

| Item | What is live | Where |
| --- | --- | --- |
| N1 | Government Job Age Calculator: age on the circular date, BCS (21–32) / other jobs (18–32) / custom presets, relaxation years, eligible birth-date window, borderline warning, "Rules last reviewed" date | `/calculators/government-job-age-calculator`, `/bn/…` |
| N2 | SSC & HSC GPA Calculator: 5.00 board scale, 4th-subject bonus, 5.00 cap, fail on a main-subject F | `/calculators/ssc-hsc-gpa-calculator`, `/bn/…` |
| N3 | Land Area Calculator: decimal/katha/bigha/acre/sq ft/… conversion, area from sides (rectangle, four sides, triangle), editable katha size | `/calculators/land-calculator`, `/bn/…` |
| N4 | Taka Amount in Words: English (lakh/crore and million) and Bangla words, Bangla digits, copy per line | `/calculators/amount-in-words`, `/bn/…` |
| T3 | One root layout per locale: Bangla pages ship `<html lang="bn">` in the server HTML | `src/app/(en)/layout.tsx`, `src/app/bn/layout.tsx` |
| T4 | Unknown URLs (English and `/bn`) return a real 404, `noindex`, with a Bangla line and a link to `/bn` | `src/app/global-not-found.tsx` |
| T5 | Optional `updatedOn` in meta → "Rules last reviewed" line + sitemap `lastModified` | job-age calculator uses it |
| T7 (part) | `Organization` JSON-LD linked from `WebSite` as `publisher` | home pages |
| T8 | Embeddable calculators for other websites: `noindex`, no analytics, frameable only there, shares link to the full page; embed code under "Add this calculator to your website" on every calculator page | `/embed/<en\|bn>/<slug>` |
| T9 | Web app manifest (add to home screen) | `/manifest.webmanifest` |
| C1 (part) | Age Calculator Bangla title targets "জন্ম তারিখ দিয়ে সঠিক বয়স বের করুন" | `/bn/calculators/age-calculator` |
| – | Related links: Age → Job Age; GPA → SSC/HSC GPA; GPA pages point SSC/HSC students to the new calculator | |
| – | Sitemap grew from 40 to 48 URLs (24 pages × 2 locales) | `/sitemap.xml` |

### Shipped: merged in PR #2 and live (verified: `/guides` 200, sitemap 56 URLs)

| Item | What is live | Where |
| --- | --- | --- |
| C2 (1–3) | Guides hub + three guides (Bangla-first, English too): government job age limit, SSC/HSC GPA with 4th subject, land measurement units. `Article` JSON-LD, sitemap entries, "Guides" in header and footer nav, "Read the guide" links on their calculators. | `/guides`, `/guides/<slug>`, `/bn/guides/…`; code in `src/guides/` |
| Q1 | Browser smoke tests (Playwright 1.64.1, Chromium): every calculator in both locales, home search, embeds and framing headers, guides, 404s, sitemap: `docker compose run --rm e2e` | `e2e/`, `playwright.config.ts` |
| Q2 | Stray `hisabbd-bangla-i18n.patch` removed | |

### Shipped: merged in PR #3

N9 Bangla date converter, N11 VAT calculator, guides 4–7 and Q4 CI (details below).

### Shipped: merged in PR #4 (personalization)

### Built on branch `feat/zakat-gold-guides-seo` (not yet merged)

| Item | What | Where |
| --- | --- | --- |
| N6 | Zakat Calculator: all common assets minus debts, silver or gold nisab (user choice, user-entered BAJUS prices), 2.5%, careful non-fatwa wording; live ~3 months before Ramadan 1448 | `/calculators/zakat-calculator` |
| N7 | Gold Price & Bhori Calculator: bhori/ana/roti/point ↔ grams, price with making charge, VAT included by default (fixed ৳2,500/bhori since FY2026-27) | `/calculators/gold-calculator` |
| C2 (8–14) | 7 more guides: Sanchayapatra profit, FDR vs DPS, bKash cash-out charge, VAT calculation, zakat nisab, BMI explained, Bangla calendar (14 in total) | `/guides/…` |
| Q7 | SEO criteria as tests (`seo-criteria.test.ts`): title and description lengths, unique titles, Bangla keywords, FAQs in both languages, at least 2 *shown* inbound links. Fixed what it found (Bangla date converter had 0 inbound links; BMI, land, amount in words and VAT had 1; some reverse links were hidden past the 3 shown) | `src/calculators/seo-criteria.test.ts` |

### Shipped: merged in PR #5 (share, savings, MFS)

### Built on branch `feat/share-savings-mfs` (merged as PR #5)

| Item | What | Where |
| --- | --- | --- |
| N5 | Sanchayapatra Profit Calculator: official IRD/NSD tiered rates (effective 1 Jul 2025, still in force Oct 2026), source tax 10% editable; FDR and DPS calculators with user-entered bank rates, source tax (Income Tax Act 2023) and FY2026-27 excise bands | `/calculators/sanchayapatra-calculator`, `/calculators/fdr-calculator`, `/calculators/dps-calculator` |
| N10 | bKash & Nagad Cash Out Charge Calculator: presets from the providers' own pages (checked 28 Oct 2026), two modes (charge for an amount, max cash for a balance) | `/calculators/mfs-cash-out-charge-calculator` |
| T6 | Per-page social preview images (1200×630, EN + BN) for every calculator, guide and home, rendered with real Chromium so Bangla shapes correctly; a test fails if one is missing | `public/og/`, `scripts/og/`, `npm run og` |
| S1 | "Share as image": a branded 1080×1080 result card drawn on the device, shared through the share sheet or downloaded | `src/lib/result-card.ts`, `ResultActions` |
| S2 | "Print or save as PDF" with a print stylesheet (calculator, inputs, result and page address only) | `ResultActions`, `print:hidden`, `globals.css` |
| Q6 | Age and Date Difference Bangla text converted to Western digits | |
| – | SEO landing-page criteria made a standing rule (AGENTS.md hard rule 10); new calculators linked from at least two existing pages (EMI, salary, VAT, amount in words) | |

### Built on branch `feat/personalization` (merged as PR #4)

| Item | What | Where |
| --- | --- | --- |
| P1 | Remembered settings per calculator: units, modes, scales, presets, katha size. Settings only, never personal values. Reset keeps them. | `src/lib/preferences.ts`, `usePreference` |
| P2 | "Your recent calculations" under every calculator (last 5: summary, time ago, Use again, remove, clear, save on/off) and on the homepage (latest 4). On by default; stays on the device. | `src/lib/calculation-history.ts`, `components/calculator/recent-calculations.tsx`, `components/home/home-recent-calculations.tsx` |
| P3 | Privacy pages (EN/BN) rewritten for local history and settings, with controls: save on/off and "Clear everything saved on this device" | `/privacy`, `components/layout/local-data-controls.tsx` |
| – | Browser tests: a unit survives a reload; history saved, used again, shown on home, cleared; turning saving off stops new entries | `e2e/personalization.spec.ts` |

### PR #3 details

| Item | What | Where |
| --- | --- | --- |
| N9 | Bangla Date Converter: today's Bangla date (আজকের বাংলা তারিখ), Gregorian ↔ Bangla on the revised 2019 calendar, season, weekday, Bangla-digit and Western forms; sourced (Dhaka Tribune 2019, Daily Star 2020) | `/calculators/bangla-date-converter`, `/bn/…` |
| N11 | VAT Calculator: add or remove VAT, Standard 15% plus reduced 10/7.5/5% presets for some goods and services (NBR VAT FAQ; PwC Tax Summaries reviewed 31 Jul 2026) or custom; paisa-exact; warns about the "15% of gross" mistake | `/calculators/vat-calculator`, `/bn/…` |
| C2 (4–7) | Four more guides: age from date of birth, CGPA, how EMI is calculated (with a full amortisation example and a flat-rate comparison), percentages. Worked numbers checked against the calculators. Seven guides in total. | `/guides/…` |
| Q4 | GitHub Actions CI on every pull request and push to `main`: `npm run check` plus the Playwright suite in the pinned image; traces uploaded on failure | `.github/workflows/ci.yml` |
| – | Smoke suite now 42 tests (16 calculators × 2 locales + site checks); pre-filled fields are cleared before the empty-submit check | `e2e/` |
| – | Docs: VAT and Bangla date specs, CI section, the digit convention corrected (older Age and Date Difference Bangla pages still use Bangla digits; convert them on next edit) | `docs/` |

### Open

| Item | Status / blocker |
| --- | --- |
| T1 Search Console / Bing, T2 custom domain, D1–D6 distribution | ⏳ **Owner action** (accounts, domain, posting) |
| T7 contact page + methodology | ⏳ Needs a public contact email from the owner |
| N8 Income tax | ⏳ Needs the official Finance Act 2026 / NBR slab text by ~10 Nov 2026, else July 2027 |
| N13 Admission score calculators (new) | ⏳ Blocked: 2026-27 circulars not yet confirmed (checked 28 Oct, see §6 N13 notes) |
| Guides for the remaining calculators without one (discount, profit/loss, salary, date difference, amount in words, gold, job-age variants) | ⏳ Next |
| N12 (electricity) | ⏳ Needs verified BERC tariff figures |
| Q5 Branch protection on `main` requiring the CI checks | ⏳ **Owner action** (GitHub → Settings → Branches) |

## 1. Summary

The site is technically sound but **not yet visible in search**. A `site:` search returned nothing. Demand in its space is strong and seasonal, and it is crowded with new, often inaccurate calculator sites. HisabBD's edge is **accuracy with cited sources, full Bangla, speed and privacy**. The plan has four steps:

1. **Get indexed this week** (Phase 0).
2. **Ship calculators timed to Bangladesh's calendar**: BCS circular (1 Nov), HSC results and university admissions (Oct–Feb), tax deadline (30 Nov), Ramadan/zakat (~Feb 2027), Pohela Boishakh (14 Apr), SSC results and the budget (May–Jul).
3. **Win Bangla queries first.** Bangla search results have fewer good answers than English ones.
4. **Distribute where Bangladeshi users actually are**: Facebook groups, WhatsApp shares, university and job-prep communities.

### Next steps, in order (as of 28 Oct 2026)

N1–N4 and T3 shipped, so the bottleneck is now **getting indexed and getting the first links**.

| # | Action | Who | Item |
| --- | --- | --- | --- |
| 1 | Verify Google Search Console and Bing, submit `/sitemap.xml`, request indexing for `/`, `/bn` and the 4 new calculators in both locales | Owner | T1 |
| 2 | On BCS circular day (~1 Nov) post the job-age calculator in BCS-prep Facebook groups; post the SSC/HSC GPA calculator in HSC/admission groups now | Owner | D1 |
| 3 | Decide on a custom domain **before** outreach builds more links to `vercel.app` | Owner | T2 |
| 4 | Get the official AY 2026-27 slab text, or decide to skip tax until July 2027 (decide by ~10 Nov) | Owner → agent | N8 |
| 5 | ✅ Guides 1–3 + hub and smoke tests (PR #2, live); ✅ guides 4–7, Bangla date converter, VAT calculator and CI (branch `feat/date-vat-guides-ci`) | Agent | C2, Q1, N9, N11, Q4 |
| 6 | Admission score calculators: researched 28 Oct; ⏳ blocked until the 2026-27 circulars publish (see §6 N13 notes) | Agent | N13 |
| 7 | Next agent batch: T6 social images; savings certificates/FDR/DPS (N5) and MFS charges (N10) with dated official sources; Q6 digit cleanup | Agent | T6, N5, N10, Q6 |
| 8 | Require the CI checks before merging to `main` | Owner | Q5 |

## 2. Current state (audited 28 Oct 2026; re-checked after PR #1 deployed)

| Check | Status |
| --- | --- |
| Pages live, 200, static, cached on Vercel | ✅ |
| `robots.txt` allows everything and points to the sitemap | ✅ |
| `sitemap.xml`: 48 URLs (24 pages × 2 locales) with hreflang alternates; embeds excluded | ✅ (was 40) |
| Canonical + hreflang `en-BD` / `bn-BD` / `x-default` on every page | ✅ |
| JSON-LD: `Organization` + `WebSite` (home); `WebApplication`, `BreadcrumbList`, `FAQPage` (calculators) | ✅ (`Organization` added) |
| Bangla titles and descriptions on `/bn` pages | ✅ |
| `<html lang>` on `/bn` pages in the server HTML | ✅ `"bn"` (was `"en"`) |
| Unknown URLs | ✅ HTTP 404, `noindex` |
| Web app manifest | ✅ `/manifest.webmanifest` |
| GA4 loaded | ✅ (not loaded in embeds) |
| `google-site-verification` / `msvalidate.01` meta tags | ❌ absent (unless verified another way): T1 |
| Appears in search results (`site:bd-hisab.vercel.app`) | ❌ no results as of 28 Oct: T1 |
| Domain | ⚠️ `*.vercel.app` subdomain: weak brand, and moving later costs ranking: T2 |
| Contact / author / methodology info (trust signals for money and health topics) | ⚠️ About page only; no contact: T7 |
| Per-calculator social images | ⚠️ one shared `og.png`: T6 |

## 3. Demand analysis

> **Limits:** I had no access to keyword-volume tools, Google Trends data or Search Console for this site. The demand below is inferred from news cycles, the official calendar and how many competing calculator sites have appeared. **Validate it with Google Trends (region: Bangladesh, last 12 months)** by comparing the pairs in §3.4, and with Search Console data after about 4 weeks of indexing.

### 3.1 Calendar-driven spikes (verified dates)

| When | Event | Searches it drives | HisabBD response |
| --- | --- | --- | --- |
| 29 Oct 2026 | HSC 2026 results published | "HSC GPA calculator", "জিপিএ বের করার নিয়ম", 4th-subject rules | N2 |
| ~1 Nov 2026 | 50th BCS circular expected; government job entry age limit is 32 (2026 law) | "BCS age calculator", "চাকরির বয়স ক্যালকুলেটর", "age on circular date" | N1 + existing Age Calculator |
| Nov 2026 – Feb 2027 | University admission season | GPA requirements, GPA/CGPA conversions | N2, guides |
| 30 Nov 2026 | Individual income tax return deadline, AY 2026-27 | "income tax calculator 2026-27", "আয়কর ক্যালকুলেটর", rebate | N8 (only if sourced in time) |
| ~8 Feb 2027 (approx.) | Ramadan 1448 begins | "zakat calculator", "যাকাত হিসাব", nisab, gold price per bhori | N6, N7 (ship by 15 Jan) |
| 14 Apr 2027 | Pohela Boishakh 1434 | "আজকের বাংলা তারিখ", Bangla date converter | N9 (ship by 1 Apr) |
| May – Jul 2027 | SSC results | SSC GPA | N2 refresh |
| Early Jun 2027 | National budget / Finance Act; new rates from 1 Jul | Tax slabs 2027-28, savings certificate rates | N8 for AY 2027-28, N5 rate refresh |

### 3.2 Evergreen Bangladesh-specific demand

These are searches people make all year. Competitors already target all of them, which shows demand, but their quality is uneven.

- **Land measurement** (জমির হিসাব: শতাংশ, কাঠা, বিঘা, একর, বর্গফুট; area from side lengths). Large and stable demand, mostly in Bangla. → N3
- **Amount in words** (টাকা কথায়, for cheques, invoices and stamps; lakh/crore wording). → N4
- **Savings schemes** (Sanchayapatra/সঞ্চয়পত্র, FDR, DPS). Rates change by government order, and competitors disagree on current figures. → N5
- **Mobile financial service charges** (bKash/Nagad/Rocket cash-out per Tk 1,000). The reported mid-2026 bKash rate is Tk 14.90 via a Priyo Agent up to a Tk 25,000 monthly limit, otherwise Tk 18.50. → N10
- **Gold** (bhori ↔ gram, karat, value at the current BAJUS price). → N7
- **VAT** (15% standard, inclusive/exclusive). → N11
- **Age** ("জন্ম তারিখ দিয়ে বয়স বের করা"), **CGPA**, **EMI** are already covered. Improve these through titles and guides (C1, C2).

### 3.3 Competition

Many new Bangladesh calculator sites have appeared in 2026, several of them on `vercel.app`: bdmoneycalculator.online, costnest.site, tool.teamzlab.com/bd, arthonitee.com, taxhishab.com, emicalculator.bd, bdtaxguide.com, ayakor.com, rebat.vercel.app and others. Observations:

- **They contradict each other on rule-dependent numbers.** Some income tax calculators use a ৳3,75,000 tax-free threshold and others ৳4,00,000 for AY 2026-27. Savings certificate rates differ by source and date.
- Most are English-first, with Bangla added as an afterthought.
- Few cite primary sources or show an "as of" date.

**Positioning:** "The calculator that shows its source." Every rule-dependent number shows an *as-of date and a link to the official order*, and the user can override it. This follows the existing AGENTS rule ("no guessed regulations") and earns trust that thin sites can't.

### 3.4 Google Trends comparisons to run (Bangladesh, 12 months)

1. `বয়স ক্যালকুলেটর` vs `age calculator` (which language dominates)
2. `জমির হিসাব` vs `land calculator` vs `শতাংশ`
3. `cgpa calculator` vs `সিজিপিএ`
4. `income tax calculator` vs `আয়কর` (Nov peak size)
5. `যাকাত ক্যালকুলেটর` vs `zakat calculator` (Ramadan lead time)
6. `সঞ্চয়পত্র` vs `fdr calculator` vs `dps calculator`
7. `টাকা কথায়` vs `number to words`

Record the peak weeks. Shift the ship dates in §8 so each page is live **4–6 weeks before** its peak, which is roughly how long indexing and initial ranking take for a young domain.

## 4. Phase 0: indexing foundations (this week)

**T1. Search engines.**
- Google Search Console: add a URL-prefix property for the production URL. Verify via the HTML tag by setting the `GOOGLE_SITE_VERIFICATION` env var (the code already supports it) and redeploying, or use a DNS Domain property once a custom domain exists.
- Submit `/sitemap.xml`. Use URL Inspection → Request indexing for `/`, `/bn`, `/calculators`, and the age, CGPA, GPA, EMI and percentage pages in both locales.
- Bing Webmaster Tools: import from GSC (also feeds DuckDuckGo and Yahoo) and set `BING_SITE_VERIFICATION`.
- After 7 days, check GSC → Pages for "Discovered – currently not indexed". A young site often needs external links (§6) before Google crawls it.

**T2. Custom domain (decide now).**
- Options: a `.com` (e.g. hisabbd.com, if available) or `.com.bd` (local trust signal, but registration requires paperwork). Pick one you'll keep for years.
- In Vercel, add the domain as primary and set `bd-hisab.vercel.app` to **redirect (308)** to it. Set `NEXT_PUBLIC_SITE_URL`, redeploy, and add the new GSC property. Use GSC's Change of Address tool only if the old property was verified.
- Every link and share made before the move points at `vercel.app`, so move **before** distribution (§6).

## 5. Technical SEO backlog

| ID | Change | Why | Where |
| --- | --- | --- | --- |
| T3 ✅ | **Shipped.** Each locale has its own root layout (`src/app/(en)/layout.tsx`, `src/app/bn/layout.tsx`) rendering `<html lang>` through `RootDocument`; `src/app/layout.tsx` and `SetHtmlLang` are gone. | Bangla pages shipped `lang="en"`. Fixes screen readers before JS runs and removes a mixed language signal. | `src/app/**/layout.tsx`, `components/layout/root-document.tsx` |
| T4 ✅ | **Shipped** as one bilingual `global-not-found.tsx` (`experimental.globalNotFound`), since a 404 can't know the requested locale | Unknown `/bn` URLs fell back to the English-only 404 | `src/app/global-not-found.tsx` |
| T5 ✅ | **Shipped.** Optional `updatedOn` in `CalculatorMeta` (validated ≥ `addedOn`), used as sitemap `lastModified` and shown as "Rules last reviewed: <date>". Set it on every rule-dependent calculator. | Freshness signal; trust on finance pages | `types.ts`, `registry.ts`, `sitemap.ts`, `CalculatorPage` |
| T6 | Per-calculator social images. Use static 1200×630 PNGs in `public/og/<slug>.png` wired through `calculatorMetadata`. **Don't** render Bangla text with `next/og`: its renderer (Satori) doesn't shape Bengali conjuncts correctly. | Facebook and WhatsApp are the main sharing channels; a specific preview gets more clicks than a generic one | `metadata.ts`, `public/og/` |
| T7 (part ✅) | `Organization` schema **shipped** (name, url, logo, linked from `WebSite`). **Open:** `/contact` (needs a public email from the owner; then add `contactPoint` to the schema) and a methodology section on About ("how we check formulas; sources; how to report an error"). | Google weighs who is behind money and health advice | `src/app/(en)/…`, `src/app/bn/…`, `structured-data.ts` |
| T8 ✅ | **Shipped** at `/embed/<en\|bn>/<slug>`: widget plus attribution link, `noindex` with a canonical to the full page, no analytics, `Content-Security-Policy: frame-ancestors *` only on `/embed/*`; Copy/Share link to the full page (`shareablePath`). The embed code appears under "Add this calculator to your website" on each calculator page. | Bloggers and coaching sites can embed a calculator, which earns links (D3). Privacy is unchanged because inputs stay in the iframe. | `src/app/embed/`, `next.config.ts`, `components/calculator/embed-code.tsx` |
| T9 ✅ | **Shipped:** web app manifest with the SVG icon. Add 192/512 PNG icons if install prompts matter. | Repeat visits from the phone home screen | `src/app/manifest.ts` |
| T10 | IndexNow ping on deploy (Bing/Yandex) | Faster recrawl after updates | Optional build step |
| T11 | Keep `FAQPage` markup, but don't count on FAQ rich results | Google limits FAQ rich results to authoritative government and health sites, so the markup rarely shows | Info only |

## 6. New calculators (backlog)

Scoring: **Demand** (H/M/L, to be confirmed in Trends), **Timing** (when it must be live), **Effort** (S/M/L), **Rule risk** (whether it depends on rates or laws that change).

| ID | Calculator (EN / BN) | Demand | Live by | Effort | Rule risk | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| N1 ✅ | Government Job Age Eligibility / সরকারি চাকরির বয়স ক্যালকুলেটর | H | **Shipped 28 Oct 2026** | S | Medium | `src/calculators/job-age/` |
| N2 ✅ | SSC/HSC GPA / এসএসসি ও এইচএসসি জিপিএ ক্যালকুলেটর | H | **Shipped 28 Oct 2026** | M | Low–Med | `src/calculators/ssc-hsc-gpa/` |
| N3 ✅ | Land Area / জমির পরিমাপ ক্যালকুলেটর | H | **Shipped 28 Oct 2026** | M | Low | `src/calculators/land/` |
| N4 ✅ | Amount in Words / টাকা কথায় | H | **Shipped 28 Oct 2026** | M | None | `src/calculators/amount-in-words/` |
| N5 | Savings: Sanchayapatra / FDR / DPS | H | Dec 2026 | M | **High** | User-entered rate; dated, sourced presets |
| N6 | Zakat / যাকাত ক্যালকুলেটর | H (seasonal) | **15 Jan 2027** | M | Medium | Nisab basis selectable |
| N7 | Gold Value & Units / সোনার দাম ও ভরি | M | 15 Jan 2027 | S | Medium | Pairs with N6 |
| N8 | Income Tax (salaried) / আয়কর ক্যালকুলেটর | H (Nov peak) | 10 Nov 2026 or July 2027 | L | **Very high** | Only from the Finance Act text |
| N9 ✅ | Bangla Date Converter / বাংলা তারিখ রূপান্তর | M–H (daily "আজকের বাংলা তারিখ") | **Built 28 Oct 2026** (moved up from Apr 2027) | M | Low | `src/calculators/bangla-date/` |
| N10 | MFS Cash-Out Charge / বিকাশ-নগদ চার্জ | M | Dec 2026 | S | High | Presets with as-of dates |
| N11 ✅ | VAT / ভ্যাট ক্যালকুলেটর | M | **Built 28 Oct 2026** | S | Low | `src/calculators/vat/`; review presets after each budget |
| N12 | Electricity Bill / বিদ্যুৎ বিল | M | Later | M | High | Tariff slabs as data with BERC source |
| N13 | Admission Score / ভর্তি স্কোর ক্যালকুলেটর (medical, university units) | H (Nov–Feb, after HSC results) | Dec 2026 | M | **High** | New. Each admission circular publishes how SSC/HSC GPA marks combine with exam marks, and the formulas change yearly. Build from the 2026-27 circulars only, one dated, sourced preset per exam, user-overridable. Related: N2. |

### N13 notes (new)

- Demand follows HSC results (29 Oct 2026) and runs through the admission season (Nov 2026 – Feb 2027).
- Inputs: SSC GPA, HSC GPA (optionally 4th-subject-excluded GPA where a circular asks for it), expected exam marks; preset = exam/unit with its weightings and minimum GPA requirements.
- Output: GPA-based marks, total score, whether the minimum GPA requirement is met.
- Rules: no preset without a link to the circular and an as-of date; set `updatedOn`; say "the circular's wording wins".
- **Research, 28 Oct 2026 (not yet buildable):**
  - Medical (MBBS) 2026-27: no official DGHS circular yet. Third-party sites describe 300 marks = 100 written + SSC GPA × 15 + HSC GPA × 25, but they conflict on the minimum combined GPA (8.50 vs 9.00) and the Biology minimum (3.50 vs 4.00).
  - Dhaka University 2026-27: applications open 11–25 Nov 2026 across five units (MCQ + written). Eligibility GPAs are known only from the 2025-26 notice, and no GPA-to-marks formula for 2026-27 was found.
  - Re-check when the circulars are published, and build only from them.

### Specs for the first four (shipped)

These shipped in PR #1. The authoritative description of what was built is now [calculators.md](calculators.md). Differences from the specs below: N2's board scale lives in `ssc-hsc-gpa/logic.ts` (`BD_BOARD_5_SCALE`), not `education/grading-scales.ts`; N1 counts "aged 32 years 11 months" as meeting a 32 maximum and shows a borderline warning because the official convention couldn't be verified; N3 is in the `everyday` category.

**N1 Government Job Age Eligibility.** Inputs: date of birth, the circular's reference date ("age as of"), minimum age, maximum age, and optional extra years for a quota or relaxation (user-entered). Output: age on the reference date (years/months/days, via `calendarDifference`); eligible / too young / too old; and the **date-of-birth window** that qualifies ("born between X and Y"). Preset: "Government job / BCS (direct recruitment): maximum 32", citing the 2026 act and the circular-date convention, with an as-of date, and editable. Category `date-time`; related: age-calculator. A guide (C2) explains "age on circular date" in Bangla.

**N2 SSC/HSC GPA.** 5.00 scale. Default grade table: A+ 5 (80–100), A 4 (70–79), A− 3.5 (60–69), B 3 (50–59), C 2 (40–49), D 1 (33–39), F 0 (0–32). Rule: GPA = (sum of compulsory subjects' GP + max(0, optional subject GP − 2)) ÷ number of compulsory subjects, capped at 5.00. An F in any compulsory subject means fail (GPA 0); an F in the optional subject does not. **Verify the table and the 4th-subject rule against an education board publication and cite it in `logic.ts` and on the page before shipping.** Add it to `education/grading-scales.ts` as data. Remove "SSC/HSC not supported" from the docs once it ships.

**N3 Land Area.** Two modes: (a) convert between শতাংশ/ডেসিমাল, কাঠা, বিঘা, একর, বর্গফুট, বর্গমিটার, অযুতাংশ; (b) area from measurements (rectangle, average-of-opposite-sides quadrilateral, triangle by three sides with Heron's formula) in ফুট, হাত or গজ. Standard values: 1 acre = 100 decimal = 43,560 sq ft; 1 decimal = 435.6 sq ft; 1 katha = 720 sq ft; 1 bigha = 20 katha = 14,400 sq ft (≈ 33 decimal); 1 হাত = 18 in; 1 গজ = 3 ft. Katha and bigha **vary by region**, so make the katha size an editable setting (default 720 sq ft) and say so. Note on the page: confirm with a government surveyor before buying, selling or registering. Category: new `land` or `everyday`.

**N4 Amount in Words.** Input: a Taka amount up to 2 decimals. Output: English ("One Lakh Twenty-Five Thousand Taka and Fifty Paisa Only") and Bangla ("এক লক্ষ পঁচিশ হাজার টাকা পঞ্চাশ পয়সা মাত্র"), using the crore/lakh/thousand/hundred system, with copy buttons. Bangla 0–99 words are irregular, so they come from a 100-entry table with a test for every entry. Pure logic, no rule risk.

### Rules for rule-dependent calculators (N5, N6, N7, N8, N10, N12)

- Rates and slabs live in a **data file** with `{ value, effectiveFrom, source: { title, url }, checkedOn }`. Logic takes the rate as an argument.
- The UI pre-fills from the data file, shows "As of <date> · Source" and lets the user override it.
- The data file gets a review reminder (§8). Stale data is worse than none.
- **N8 tax:** ship for AY 2026-27 only if the slabs, thresholds (general, women and 65+, disabled, freedom fighter), rebate rules and minimum tax can be confirmed from the Finance Act 2026 / NBR **by 10 Nov 2026**. Otherwise build it in July 2027 for AY 2027-28, right after the Finance Act passes. This is the highest-traffic and highest-liability page on the list.

## 7. On-page content

**C1. Match titles and H1s to real queries (both locales).**
- ✅ Age (bn): shipped. The title is now "বয়স ক্যালকুলেটর: জন্ম তারিখ দিয়ে সঠিক বয়স বের করুন".
- Pick one Bangla term per concept and use it in `nameBn`, `seoBn.title` and H1. For example, Date Difference uses "তারিখের পার্থক্য" in its name but "তারিখের ব্যবধান" in its title. Choose using Trends/GSC data.
- Add the assessment year or "2026" only to rule-dependent pages (tax, savings rates), never to evergreen math.
- Revisit after 4–6 weeks of GSC data: rewrite titles on pages with high impressions but CTR under 2%.

**C2. Guides hub** (`/guides/<slug>` and `/bn/guides/<slug>`, Server Components, linked from each related calculator). These are informational articles that answer the question and then send the reader to the calculator. Write Bangla-first; each 600–1,200 words with worked examples and sources. **Next up: guides 1–3, because their calculators (N1–N3) are now live and in season.** Starting list:

1. সরকারি চাকরির বয়স কীভাবে হিসাব হয় (সার্কুলারের তারিখ অনুযায়ী) → N1 (live)
2. এসএসসি/এইচএসসি জিপিএ কীভাবে হিসাব হয়, চতুর্থ বিষয়সহ → N2 (live)
3. জমি মাপার নিয়ম: শতাংশ, কাঠা, বিঘা → N3 (live)
4. ✅ জন্ম তারিখ দিয়ে বয়স বের করার নিয়ম → Age (`age-from-date-of-birth`)
5. ✅ সিজিপিএ হিসাবের নিয়ম (ক্রেডিট-ওয়েটেড কেন) → CGPA (`cgpa-calculation`)
6. ✅ ইএমআই কীভাবে হিসাব হয় (রিডিউসিং ব্যালান্স বনাম ফ্ল্যাট রেট) → EMI (`how-emi-is-calculated`)
7. ✅ শতাংশ বের করার নিয়ম (5টি সাধারণ হিসাব) → Percentage (`percentage-calculation`)
8. যাকাতের নিসাব ও হিসাব → N6 (publish in January)

Add an `Article` JSON-LD builder with `datePublished` / `dateModified`.

**C3. A few hand-written intent pages, not mass-generated ones.** One page per real use case where the content differs, e.g. "Home loan EMI in Bangladesh" (typical tenures, what banks add). **Don't** generate thousands of near-identical pages such as "EMI for ৳X at Y%". Google treats that as scaled content abuse, and it would undermine the "accurate and sourced" positioning.

**C4. Internal links.** In each content page, link to the related calculator and guide in running text, not only in the related cards.

## 8. Distribution and links

Links from other sites are the main constraint for a new domain. All outreach comes **after T2**.

| ID | Channel | Tactic |
| --- | --- | --- |
| D1 | Facebook groups: university pages (CGPA), BCS/job-prep groups (N1 on circular days), HSC/admission groups (N2 on results day), tax help groups (Nov) | One genuinely helpful post per group, with a worked example and a link. Answer questions. No repeat posting. |
| D2 | WhatsApp / Messenger | Copy and Share already append the page URL, which is good. T6 social images make those shares more clickable. |
| D3 | Embeds (T8, live) | Offer the embed code (under "Add this calculator to your website" on each page) to education bloggers, coaching centres, BCS-prep sites and university clubs. Best candidates: job age, SSC/HSC GPA, CGPA, land. Each embed carries an attribution link. |
| D4 | Community answers | Answer GPA, EMI and land questions on Reddit r/bangladesh and Bangla Q&A sites, linking only when the calculator is the answer. |
| D5 | Developer channels | Open-source the calculation logic (or the whole repo) with a README linking to the site. Post a "how we handle Bangla digits and plain dates" write-up on dev.to or a Bangla tech blog. |
| D6 | Local press / tech blogs | Pitch "free, private, bilingual calculator site" around a seasonal hook (tax week, zakat). |

## 9. Measurement

- **Weekly (first 8 weeks):** GSC indexed pages (target: all 48 sitemap URLs within 4 weeks; `/embed/*` should stay excluded as "noindex"), impressions, top queries by page, CTR, Core Web Vitals.
- **Data-driven loop (from ~4–6 weeks after indexing):** rewrite titles with high impressions but low CTR; strengthen pages ranking 8–20 (content, internal links, a guide); pick new calculators from queries that already show the site but that it doesn't answer.
- **Monthly:** GA4 `calculation_completed` ÷ `calculator_opened` per calculator (does the tool work for people?), plus `related_calculator_clicked` and returning users.
- **Per launch:** impressions 14 and 28 days after launch versus the seasonal peak date. If a page isn't indexed within 14 days, request indexing and add internal links to it.
- **Targets to sanity-check later**, as a direction rather than a promise: full index coverage by end of Nov 2026; first 1,000 monthly organic clicks by Feb 2027 (zakat season); Bangla pages producing at least half of clicks.
- Privacy is unchanged: every metric above uses the existing slug-only events.

## 10. Calendar

| Date | Ship / do |
| --- | --- |
| 28 Oct 2026 | ✅ Shipped N1–N4, T3, T4, T5, T7 (schema), T8, T9, C1 (age) in PR #1 |
| 28 Oct – 1 Nov 2026 | T1 (Search Console/Bing), T2 decision; D1 on BCS circular day and in HSC groups |
| Nov 2026 | ✅ C2 guides 1–3 + guides hub and ✅ Q1 smoke tests built; T7 contact (needs email); N8 only if sourced by 10 Nov; N13 once circulars publish; D1 tax groups |
| 28 Oct 2026 (branch) | ✅ N9 Bangla date, ✅ N11 VAT, ✅ guides 4–7, ✅ Q4 CI |
| Dec 2026 | N13 admission scores (once circulars publish); N5, N10; T6 social images; Q6; D3 embed outreach; first GSC title-rewrite pass |
| 1–15 Jan 2027 | N6, N7, guide 8; check gold, savings, MFS and VAT data |
| Feb – Mar 2027 | Zakat-season distribution; C2 guides 4–7 |
| 1 Apr 2027 | Promote N9 for Pohela Boishakh (14 Apr) |
| May – Jul 2027 | N2 refresh for SSC; after the budget (early Jun) refresh all rate data; N8 for AY 2027-28 in July |

**Data review reminders** (put them in a calendar): Bangla calendar guide (`src/guides/bangla-calendar`) is tied to 1433, so update it to 1434 by early March 2027; gold VAT in `src/calculators/gold/logic.ts` (after each budget); zakat page and guide: re-check for an Islamic Foundation nisab announcement in January 2027; Sanchayapatra rates and source tax in `src/calculators/sanchayapatra/logic.ts` (every Jan and Jul; bump `updatedOn`), bank source tax and excise bands in `src/calculators/fdr/deposit-tax.ts` (after each June budget), MFS charges in `src/calculators/mfs-charge/logic.ts` (quarterly), savings certificate rates (Jan and Jul), MFS charges (quarterly), gold price (the page asks the user for it), tax slabs (July), government job age rule and BCS presets in `src/calculators/job-age/logic.ts` (each new BCS circular, and when the law changes; bump `updatedOn`), admission formulas (each circular).

## 11. Engineering and quality

| ID | Item | Why |
| --- | --- | --- |
| Q1 ✅ | Browser smoke tests (Playwright) built: every calculator in both locales, one valid and one invalid calculation, embeds, guides, 404s, sitemap. Run `docker compose run --rm e2e` before each deploy; when adding a calculator, add its inputs to `e2e/calculator-inputs.ts`. Next: run it in CI (GitHub Actions) on pull requests. | Unit tests only covered logic; the 14 interactive widgets had no UI tests. |
| Q2 ✅ | Removed the stray `hisabbd-bangla-i18n.patch` from the repo root. | Nothing read it; 460 KB of noise. |
| Q3 | Keep `experimental.globalNotFound` under watch on Next.js upgrades. | T4 depends on an experimental flag. |
| Q4 ✅ | CI: `.github/workflows/ci.yml` runs `npm run check` and the Playwright suite on pull requests and pushes to `main`. | Catch breakage before Vercel deploys it. |
| Q5 | Branch protection on `main` requiring the `check` and `e2e` jobs (owner, GitHub settings). | Makes CI blocking, not just advisory. |
| Q6 | Convert Bangla-digit prose in the Age and Date Difference Bangla content and meta to Western digits. | Consistency with the documented convention. |

## 12. What not to do

- Mass-generated near-duplicate pages, keyword stuffing, or hidden text.
- Buying links, link exchanges or spammy directory submissions.
- Fake reviews, ratings or `AggregateRating` markup.
- Hard-coded tax, rate or fee numbers without a source and date.
- Any growth feature that sends inputs or results anywhere, including "share your result as a URL with parameters".

## Sources

Researched 28 Oct 2026. Re-check before shipping anything that depends on these.

- HSC 2026 results date: [Prothom Alo](https://en.prothomalo.com/youth/education/s133co1qkz), [Dhaka Tribune](https://www.dhakatribune.com/bangladesh/education/422687/hsc-results-likely-between-october-25-and-29)
- 50th BCS circular and age limit: [Prothom Alo](https://en.prothomalo.com/youth/er1f8bugw9), [Jago News (age limit 32 bill)](https://www.jagonews24.com/en/national/news/91510), [Dhaka Tribune (BCS age 32 gazette)](https://www.dhakatribune.com/bangladesh/367871/gazette-published-increasing-the-maximum-age-for)
- Tax AY 2026-27 deadline and conflicting slabs: [bdtaxguide.com](https://bdtaxguide.com/tax-slabs-2026-27), [hsa.com.bd](https://hsa.com.bd/tax-calculator), [ayakor.com](https://ayakor.com/)
- Savings certificate rates: [Ittefaq](https://en.ittefaq.com.bd/10518/sanchayapatra-interest-rate-revised), [UNB](https://unb.com.bd/category/Bangladesh/5-year-bangladesh-sanchayapatra-2025-revised-profit-rates/153636), [teamzlab calculator](https://tool.teamzlab.com/bd/sanchayapatra-calculator/)
- MFS cash-out charges: [Daily Observer, Jun 2026](https://observerbd.com/news/564792)
- Gold prices (BAJUS): [Ittefaq, Jun 2026](https://en.ittefaq.com.bd/16899/bajus-slashes-gold-prices-for-2nd-time-this-month)
- Land units: [Katha (Wikipedia)](https://en.wikipedia.org/wiki/Katha_(unit)), [bdservicerules.info land calculator](https://bdservicerules.info/?p=50405)
- Competitors: [bdmoneycalculator.online](https://bdmoneycalculator.online/), [costnest.site](https://costnest.site/), [arthonitee.com](https://www.arthonitee.com/), [taxhishab.com](https://taxhishab.com/?lang=en), [emicalculator.bd](https://emicalculator.bd/bkash-cash-out-charge-calculator/)

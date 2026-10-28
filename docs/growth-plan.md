# Growth and search plan (Nov 2026 – Jul 2027)

How HisabBD gets indexed, ranks for what people in Bangladesh actually search, and grows repeat visitors. Written 28 October 2026 against the live site `https://bd-hisab.vercel.app`.

Items are numbered so agents can pick one up ("implement C2", "do T3"). Every new calculator must still follow the hard rules in [`../AGENTS.md`](../AGENTS.md): privacy, both languages, pure logic, and no guessed regulations.

## Status (updated 28 Oct 2026)

| Item | Status |
| --- | --- |
| N1 Government Job Age, N2 SSC/HSC GPA, N3 Land, N4 Amount in Words | ✅ Built (not yet deployed) |
| T3 `<html lang="bn">` in server HTML, T4 404 for `/bn` (bilingual global 404) | ✅ Built |
| T5 `updatedOn` + "Rules last reviewed", T7 `Organization` schema, T8 embeds, T9 manifest | ✅ Built |
| C1 Age Bangla title ("জন্ম তারিখ দিয়ে…") | ✅ Built; other title changes wait for Search Console data |
| T1 Search Console / Bing, T2 custom domain, D1–D6 distribution | ⏳ **Owner action** (accounts, domain, posting) |
| T7 contact page | ⏳ Needs a public contact email from the owner |
| T6 per-calculator social images | ⏳ Not started (needs designed PNGs; don't render Bangla with `next/og`) |
| C2 guides hub, C3 intent pages | ⏳ Not started |
| N5–N8, N10–N12 (rate- or law-dependent) | ⏳ Blocked on verified official figures (see rules in §6) |
| N9 Bangla date converter | ⏳ Not started (target 1 Apr 2027) |

## 1. Summary

The site is technically sound but **not yet visible in search**. A `site:` search returned nothing. Demand in its space is strong and seasonal, and it is crowded with new, often inaccurate calculator sites. HisabBD's edge is **accuracy with cited sources, full Bangla, speed and privacy**. The plan has four steps:

1. **Get indexed this week** (Phase 0).
2. **Ship calculators timed to Bangladesh's calendar**: BCS circular (1 Nov), HSC results and university admissions (Oct–Feb), tax deadline (30 Nov), Ramadan/zakat (~Feb 2027), Pohela Boishakh (14 Apr), SSC results and the budget (May–Jul).
3. **Win Bangla queries first.** Bangla search results have fewer good answers than English ones.
4. **Distribute where Bangladeshi users actually are**: Facebook groups, WhatsApp shares, university and job-prep communities.

### Next 7 days, in order

| # | Action | Item |
| --- | --- | --- |
| 1 | Verify Google Search Console and Bing, submit the sitemap, request indexing of the top 10 URLs | T1 |
| 2 | Decide on a custom domain **before** any outreach builds links to `vercel.app` | T2 |
| 3 | Ship the **Government Job Age Eligibility Calculator** (50th BCS circular expected 1 Nov) | N1 |
| 4 | Ship the **SSC/HSC GPA Calculator** (HSC results 29 Oct; admissions run to February) | N2 |
| 5 | Serve `lang="bn"` in the server HTML of `/bn` pages | T3 |

## 2. Current state (audited 28 Oct 2026)

| Check | Status |
| --- | --- |
| Pages live, 200, static, cached on Vercel | ✅ |
| `robots.txt` allows everything and points to the sitemap | ✅ |
| `sitemap.xml`: 40 URLs (20 pages × 2 locales) with hreflang alternates | ✅ |
| Canonical + hreflang `en-BD` / `bn-BD` / `x-default` on every page | ✅ |
| JSON-LD: `WebSite` (home); `WebApplication`, `BreadcrumbList`, `FAQPage` (calculators) | ✅ |
| Bangla titles and descriptions on `/bn` pages | ✅ |
| GA4 loaded | ✅ |
| `google-site-verification` / `msvalidate.01` meta tags | ❌ absent (unless verified another way) |
| Appears in search results (`site:bd-hisab.vercel.app`) | ❌ no results |
| `<html lang>` on `/bn` pages in the server HTML | ❌ `"en"` (only fixed after JavaScript runs) |
| Domain | ⚠️ `*.vercel.app` subdomain: weak brand, and moving later costs ranking |
| Contact / author / methodology info (trust signals for money and health topics) | ⚠️ About page only; no contact |
| Per-calculator social images | ⚠️ one shared `og.png` |
| `.env.example` and docs referenced `hisabbd-five.vercel.app` | ⚠️ outdated; updated to `bd-hisab.vercel.app` |

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
| T3 | Give each locale its own root layout (`src/app/(en)/layout.tsx` and `src/app/bn/layout.tsx` each render `<html lang>`). Remove `<html>` from `src/app/layout.tsx` and delete `SetHtmlLang`. Handle 404s with `global-not-found` or one `not-found` per root. | Bangla pages currently ship `lang="en"`. Fixes screen readers before JS runs and removes a mixed language signal. Switching locales becomes a full page load, which the toggle already is in effect. | `src/app/**/layout.tsx` |
| T4 | Bangla 404 for `/bn/*` paths | Unknown `/bn` URLs currently fall back to the English 404 | `src/app/bn/not-found.tsx` |
| T5 | Add an optional `updatedOn` to `CalculatorMeta`, use it in the sitemap `lastModified`, and show "Last reviewed: <date>" on rule-dependent calculators | Freshness signal; trust on finance pages | `types.ts`, `sitemap.ts`, `CalculatorPage` |
| T6 | Per-calculator social images. Use static 1200×630 PNGs in `public/og/<slug>.png` wired through `calculatorMetadata`. **Don't** render Bangla text with `next/og`: its renderer (Satori) doesn't shape Bengali conjuncts correctly. | Facebook and WhatsApp are the main sharing channels; a specific preview gets more clicks than a generic one | `metadata.ts`, `public/og/` |
| T7 | Trust pages: `/contact` (email), and a methodology section on About ("how we check formulas; sources; how to report an error"). Add `Organization` schema with logo and contact. | Google weighs who is behind money and health advice | `src/app/(en)/…`, `src/app/bn/…`, `structured-data.ts` |
| T8 | Embeddable widgets: `/embed/<slug>` (both locales) renders only the widget plus an attribution link. Relax framing **only** there (`Content-Security-Policy: frame-ancestors *` and no `X-Frame-Options`). Mark it `noindex`. | Bloggers and coaching sites can embed a calculator, which earns links (§6). Privacy is unchanged because inputs stay in the iframe. | `next.config.ts` headers per path, new route |
| T9 | Web app manifest + icons (installable; no offline caching needed) | Repeat visits from the phone home screen | `src/app/manifest.ts` |
| T10 | IndexNow ping on deploy (Bing/Yandex) | Faster recrawl after updates | Optional build step |
| T11 | Keep `FAQPage` markup, but don't count on FAQ rich results | Google limits FAQ rich results to authoritative government and health sites, so the markup rarely shows | Info only |

## 6. New calculators (backlog)

Scoring: **Demand** (H/M/L, to be confirmed in Trends), **Timing** (when it must be live), **Effort** (S/M/L), **Rule risk** (whether it depends on rates or laws that change).

| ID | Calculator (EN / BN) | Demand | Live by | Effort | Rule risk | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| N1 | Government Job Age Eligibility / সরকারি চাকরির বয়স ক্যালকুলেটর | H | **1–3 Nov 2026** | S | Medium | Reuses `age/logic.ts` |
| N2 | SSC/HSC GPA / এসএসসি-এইচএসসি জিপিএ ক্যালকুলেটর | H | **Nov 2026** | M | Low–Med | 5.00 scale with the 4th-subject rule |
| N3 | Land Area Converter / জমির পরিমাপ ক্যালকুলেটর | H | Nov 2026 | M | Low | Evergreen, Bangla-heavy |
| N4 | Amount in Words / টাকা কথায় | H | Dec 2026 | M | None | Bangla number words 0–99 come from a lookup table |
| N5 | Savings: Sanchayapatra / FDR / DPS | H | Dec 2026 | M | **High** | User-entered rate; dated, sourced presets |
| N6 | Zakat / যাকাত ক্যালকুলেটর | H (seasonal) | **15 Jan 2027** | M | Medium | Nisab basis selectable |
| N7 | Gold Value & Units / সোনার দাম ও ভরি | M | 15 Jan 2027 | S | Medium | Pairs with N6 |
| N8 | Income Tax (salaried) / আয়কর ক্যালকুলেটর | H (Nov peak) | 10 Nov 2026 or July 2027 | L | **Very high** | Only from the Finance Act text |
| N9 | Bangla Date Converter / বাংলা তারিখ | M | 1 Apr 2027 | M | Low | Revised Bangla calendar (Bangladesh, 2019 revision) |
| N10 | MFS Cash-Out Charge / বিকাশ-নগদ চার্জ | M | Dec 2026 | S | High | Presets with as-of dates |
| N11 | VAT / ভ্যাট ক্যালকুলেটর | M | Jan 2027 | S | Low | Rate is an input, 15% default with source |
| N12 | Electricity Bill / বিদ্যুৎ বিল | M | Later | M | High | Tariff slabs as data with BERC source |

### Specs for the first four

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
- Age (bn): add the phrase people type, e.g. "জন্ম তারিখ দিয়ে বয়স বের করুন", to the title or description.
- Pick one Bangla term per concept and use it in `nameBn`, `seoBn.title` and H1. For example, Date Difference uses "তারিখের পার্থক্য" in its name but "তারিখের ব্যবধান" in its title. Choose using Trends/GSC data.
- Add the assessment year or "2026" only to rule-dependent pages (tax, savings rates), never to evergreen math.
- Revisit after 4–6 weeks of GSC data: rewrite titles on pages with high impressions but CTR under 2%.

**C2. Guides hub** (`/guides/<slug>` and `/bn/guides/<slug>`, Server Components, linked from each related calculator). These are informational articles that answer the question and then send the reader to the calculator. Write Bangla-first; each 600–1,200 words with worked examples and sources. Starting list:

1. সরকারি চাকরির বয়স কীভাবে হিসাব হয় (সার্কুলারের তারিখ অনুযায়ী) → N1
2. এসএসসি/এইচএসসি জিপিএ কীভাবে হিসাব হয়, চতুর্থ বিষয়সহ → N2
3. জমি মাপার নিয়ম: শতাংশ, কাঠা, বিঘা → N3
4. জন্ম তারিখ দিয়ে বয়স বের করার নিয়ম → Age
5. সিজিপিএ হিসাবের নিয়ম (ক্রেডিট-ওয়েটেড কেন) → CGPA
6. ইএমআই কীভাবে হিসাব হয় (রিডিউসিং ব্যালেন্স বনাম ফ্ল্যাট রেট) → EMI
7. শতাংশ বের করার নিয়ম (৫টি সাধারণ প্রশ্ন) → Percentage
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
| D3 | Embeds (T8) | Offer an embed snippet to education bloggers, coaching centres and university clubs. Each embed carries an attribution link. |
| D4 | Community answers | Answer GPA, EMI and land questions on Reddit r/bangladesh and Bangla Q&A sites, linking only when the calculator is the answer. |
| D5 | Developer channels | Open-source the calculation logic (or the whole repo) with a README linking to the site. Post a "how we handle Bangla digits and plain dates" write-up on dev.to or a Bangla tech blog. |
| D6 | Local press / tech blogs | Pitch "free, private, bilingual calculator site" around a seasonal hook (tax week, zakat). |

## 9. Measurement

- **Weekly (first 8 weeks):** GSC indexed pages (target: all 40 within 4 weeks), impressions, top queries by page, CTR, Core Web Vitals.
- **Monthly:** GA4 `calculation_completed` ÷ `calculator_opened` per calculator (does the tool work for people?), plus `related_calculator_clicked` and returning users.
- **Per launch:** impressions 14 and 28 days after launch versus the seasonal peak date. If a page isn't indexed within 14 days, request indexing and add internal links to it.
- **Targets to sanity-check later**, as a direction rather than a promise: full index coverage by end of Nov 2026; first 1,000 monthly organic clicks by Feb 2027 (zakat season); Bangla pages producing at least half of clicks.
- Privacy is unchanged: every metric above uses the existing slug-only events.

## 10. Calendar

| Date | Ship / do |
| --- | --- |
| 28 Oct – 1 Nov 2026 | T1, T2 decision, N1, T3 |
| Nov 2026 | N2 + guide 2, N3 + guide 3, C1 titles, T5, T7; N8 only if sourced by 10 Nov; D1 for HSC/BCS/tax groups |
| Dec 2026 | N4, N5, N10, T6, T8; first GSC title-rewrite pass |
| 1–15 Jan 2027 | N6, N7, guide 8, N11; check gold, savings and MFS data |
| Feb – Mar 2027 | Zakat-season distribution; C2 guides 4–7; T9 |
| 1 Apr 2027 | N9 (before 14 Apr) |
| May – Jul 2027 | N2 refresh for SSC; after the budget (early Jun) refresh all rate data; N8 for AY 2027-28 in July |

**Data review reminders** (put them in a calendar): savings certificate rates (Jan and Jul), MFS charges (quarterly), gold price (the page asks the user for it), tax slabs (July), government job age rule (when the law changes).

## 11. What not to do

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

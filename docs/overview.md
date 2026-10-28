# Product overview

## Purpose

HisabBD is a free set of simple calculators for everyday life in Bangladesh. Each calculator does one job, gives a clear answer, and explains how it got there (formula, worked example, FAQ). The site needs no signup, has no ads, runs every calculation in the browser, and works well on low-end phones.

**Audience:** people in Bangladesh, mostly on mobile. That includes students (GPA/CGPA on the UGC 4.00 scale), salaried workers, shoppers, small business owners, and borrowers comparing loan instalments. They read English, Bangla or both.

**Positioning statements used in the UI:**

- "Free, no signup": no account, no app to install.
- "Instant results."
- "Easy on any phone."
- "Made for Bangladesh": Taka, lakh/crore grouping, Bangla digits accepted, Sunday–Thursday work week, UGC grading.

**Disclaimer, shown in the footer and on About/Terms:** results are for general information. Confirm important financial, health or academic decisions with the relevant institution or a qualified professional.

## Pages and URLs

Every page exists in English at the path shown and in Bangla with the `/bn` prefix (for example `/about` and `/bn/about`; `/` and `/bn`). All pages are statically generated.

| Path (English) | Page | Source |
| --- | --- | --- |
| `/` | Home: hero with search and quick picks, category tiles, featured and other calculators, benefits | `src/app/(en)/page.tsx` → `src/components/home/home-page.tsx` |
| `/calculators` | All calculators, grouped by category | `src/app/(en)/calculators/page.tsx` → `src/components/pages/calculators-index.tsx` |
| `/calculators/<slug>` | One calculator page (10 of them, listed below) | `src/app/(en)/calculators/<slug>/page.tsx` → `CalculatorPage` |
| `/categories/<id>` | Category page: calculators in one category plus links to the other categories | `src/app/(en)/categories/[category]/page.tsx` → `src/components/pages/category-page.tsx` |
| `/about` | What HisabBD does, how the calculations work, limits | `src/app/(en)/about/page.tsx` |
| `/privacy` | Privacy policy. Its text adapts to which analytics are enabled. | `src/app/(en)/privacy/page.tsx` |
| `/terms` | Terms of use | `src/app/(en)/terms/page.tsx` |
| any unknown path | 404 with search and popular calculators (English only, `noindex`) | `src/app/not-found.tsx` |
| `/sitemap.xml` | Both locales, with hreflang alternates | `src/app/sitemap.ts` |
| `/robots.txt` | Allows everything and points to the sitemap | `src/app/robots.ts` |

Bangla calculator pages are not separate files. A single dynamic route, `src/app/bn/calculators/[slug]/page.tsx`, renders every calculator from `src/calculators/page-registry.tsx`.

### Calculators

| Slug | Name (EN / BN) | Category | Icon | What it does |
| --- | --- | --- | --- | --- |
| `age-calculator` | Age Calculator / বয়স ক্যালকুলেটর | date-time | calendar | Exact age in years, months and days; totals; birth weekday; next birthday |
| `bmi-calculator` | BMI Calculator / বিএমআই ক্যালকুলেটর | health | scale | BMI from cm or ft+in and kg or lb; WHO adult category; healthy weight range |
| `gpa-calculator` | GPA Calculator / জিপিএ ক্যালকুলেটর | education | graduation | Credit-weighted semester GPA from letter grades (UGC 4.00 scale) |
| `cgpa-calculator` | CGPA Calculator / সিজিপিএ ক্যালকুলেটর | education | book | Credit-weighted CGPA from term GPAs and credits (4.00 or 5.00 scale) |
| `percentage-calculator` | Percentage Calculator / শতকরা ক্যালকুলেটর | everyday | percent | Five modes: % of, what %, % change, increase/decrease by %, reverse |
| `discount-calculator` | Discount Calculator / ছাড় ক্যালকুলেটর | finance | tag | Final price, savings, optional stacked extra discount |
| `profit-loss-calculator` | Profit and Loss Calculator / লাভ-ক্ষতি ক্যালকুলেটর | finance | trending | Profit/loss amount, % on cost (markup), margin on selling price |
| `emi-calculator` | EMI / Loan Calculator / ইএমআই / লোন ক্যালকুলেটর | finance | landmark | Reducing-balance EMI, total interest, yearly amortisation summary |
| `salary-calculator` | Salary Calculator / বেতন ক্যালকুলেটর | finance | wallet | Gross to net with user-entered deductions (percent or fixed) |
| `date-difference-calculator` | Date Difference Calculator / তারিখের পার্থক্য ক্যালকুলেটর | date-time | calendar-range | Years/months/days between dates, optional inclusive end, Sun–Thu working days |

Full specs: [calculators.md](calculators.md).

### Categories

| id | English | Bangla | Description |
| --- | --- | --- | --- |
| `health` | Health | স্বাস্থ্য | Check your BMI and other everyday health numbers. |
| `education` | Education | শিক্ষা | Work out your GPA and CGPA from your grades and credits. |
| `finance` | Finance | অর্থ | Loan EMI, salary, discounts, and profit or loss in Taka. |
| `everyday` | Everyday | দৈনন্দিন | Percentages and quick sums for daily life. |
| `date-time` | Date & Time | তারিখ ও সময় | Exact ages and the days between any two dates. |

Defined in `src/calculators/categories.ts`. Ids are fixed in `CATEGORY_IDS` (`src/calculators/types.ts`).

## Anatomy of a calculator page

Rendered by `src/components/calculator/calculator-page.tsx`, top to bottom:

1. **Header band** (green graph-paper background): breadcrumbs (Home › Calculators › Name), icon tile, H1 in the page language with the name in the other language below it, the one-sentence summary, a "More <category> calculators" link, and Save/Share buttons (`CalculatorPageActions`).
2. **Widget**: the interactive form (inputs, Calculate, Reset), then the result area. Before the first result, and while inputs have errors, a placeholder shows instead. Results include Copy result and Share (Web Share API, where supported).
3. **Try next**: links to related calculators (`NextCalculators`).
4. **Content**: the explanation, formula and worked example (`content.tsx` / `content.bn.tsx`).
5. **FAQ**: a native `<details>` accordion from `faqs` / `faqsBn` in meta.
6. **Related calculators**: cards for the explicit `related` slugs first, then others from the same category, up to 3.
7. **JSON-LD**: `WebApplication`, `BreadcrumbList`, and `FAQPage` when FAQs exist.

## User-facing features

- **Search** (home, 404, calculators index): an accessible combobox that matches calculators and categories on word prefixes across English and Bangla names, summary, keywords and slug. Runs client-side over a small serialized index. Details in [architecture.md](architecture.md#search).
- **Quick picks**: a chip row under the home search. It shows editor-picked calculators (`featuredSlugs` in `src/calculators/featured.ts`) until the visitor has favourites or recents, then shows those.
- **Favourites ("Save") and Recently used**: stored in `localStorage`, slugs only. Max 12 favourites and 6 recents.
- **Copy / Share result**: plain-text summary of the result. Sharing a page sends only the URL.
- **Language toggle**: a plain link to the same page in the other locale, with no cookie and no redirect.
- **Bangla digit input**: every numeric field accepts `০–৯` and commas.
- **Optional analytics**: GA4 and/or Umami, off unless env vars are set. Only anonymous events. See [privacy-and-analytics.md](privacy-and-analytics.md).

## Non-goals and things deliberately left out

- Accounts, server-side storage, user data of any kind.
- Statutory rules that change over time (income tax slabs, provident fund rates) and lender-specific loan terms.
- SSC/HSC GPA (the 4th/optional subject rules differ; a weighted average would mislead).
- Paid APIs or third-party font services. Fonts are self-hosted by `next/font`.

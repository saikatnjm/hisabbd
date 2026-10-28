# Architecture

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16, App Router | `reactStrictMode`, `poweredByHeader: false`, security headers in `next.config.ts` |
| UI | React 19 | Server Components by default; small `"use client"` islands |
| Language | TypeScript 5, `strict` + `noUncheckedIndexedAccess` | Path alias `@/*` → `src/*` |
| Styling | Tailwind CSS 4 via `@tailwindcss/postcss` | Tokens in `src/app/globals.css` (`@theme`) |
| Fonts | `next/font/google` Anek Bangla (Latin + Bengali, `wdth` axis) for headings; system stack for body | Self-hosted at build time |
| Tests | Vitest 4, `environment: "node"`, `src/**/*.test.ts` | No DOM/component tests; logic and data only |
| Lint | ESLint 9 flat config: `eslint-config-next` core-web-vitals + typescript | |
| Hosting | Vercel (build from source) | Docker image is for local dev only |

## Directory map

```
.
├── AGENTS.md                     agent instructions (entry point)
├── docs/                         this documentation
├── README.md                     short human README
├── Dockerfile, docker-compose.yml   dev container (node:24-bookworm-slim)
├── next.config.ts                security headers
├── vitest.config.mts, eslint.config.mjs, postcss.config.mjs, tsconfig.json
├── .env.example                  all optional env vars
├── public/og.png                 1200×630 social image used by every page
├── hisabbd-bangla-i18n.patch     exported patch; NOT used by the build
└── src/
    ├── app/
    │   ├── (no layout.tsx)       each locale has its own root layout (see below)
    │   ├── globals.css           Tailwind import + design tokens + utilities + keyframes
    │   ├── icon.svg              favicon
    │   ├── global-not-found.tsx  404 for any unmatched URL (full document; English + a Bangla line)
    │   ├── robots.ts, sitemap.ts, manifest.ts
    │   ├── (en)/                 route group → no URL segment
    │   │   ├── layout.tsx        ROOT layout: <RootDocument locale="en"> + <LocaleShell locale="en">
    │   │   ├── page.tsx          /
    │   │   ├── about/ privacy/ terms/
    │   │   ├── calculators/page.tsx               /calculators
    │   │   ├── calculators/<slug>/page.tsx        one static file per calculator
    │   │   └── categories/[category]/page.tsx     static params from CATEGORY_IDS
    │   ├── embed/[locale]/       ROOT layout for /embed/<en|bn>/<slug>: widget only, noindex,
    │   │                         no analytics, frameable by other sites
    │   └── bn/                   /bn/…
    │       ├── layout.tsx        ROOT layout: <RootDocument locale="bn"> (<html lang="bn">) + <LocaleShell locale="bn">
    │       ├── page.tsx, about/, privacy/, terms/, calculators/page.tsx
    │       ├── calculators/[slug]/page.tsx        ONE dynamic route for all calculators (page-registry)
    │       └── categories/[category]/page.tsx
    ├── calculators/
    │   ├── types.ts              CalculatorMeta, Category, CATEGORY_IDS, CALCULATOR_ICONS, FaqItem
    │   ├── registry.ts           `calculators` array + validateRegistry + lookups
    │   ├── page-registry.tsx     slug → { meta, Calculator, Content, ContentBn }
    │   ├── categories.ts         the 5 categories (EN + BN)
    │   ├── paths.ts              calculatorPath, categoryHref, CALCULATORS_PATH
    │   ├── metadata.ts           pageMetadata(), calculatorMetadata(), OG_IMAGE
    │   ├── search.ts             search index builders + ranking
    │   ├── featured.ts           editor-picked slugs for home/search suggestions
    │   ├── upcoming.ts           names shown only when the registry is empty
    │   ├── education/            grading scales, row-list hook, add/remove row buttons (GPA, CGPA)
    │   └── <name>/               one folder per calculator (see below)
    ├── components/
    │   ├── ui/                   primitives: Button, Card, Badge, Container, Section, ContentSection,
    │   │                         form (Label/Input/AffixInput/Select/SegmentedControl/FieldMessage/FormField),
    │   │                         ResultPanel, icons
    │   ├── calculator/           CalculatorPage shell, form, result area, actions, search, cards, lists
    │   ├── layout/               LocaleShell, header, footer, mobile menu, language toggle, breadcrumbs,
    │   │                         ProsePage, nav-links, logo
    │   ├── pages/                CalculatorsIndexPage, CategoryPageView (shared by both locales)
    │   ├── home/home-page.tsx    HomePage (shared by both locales, has its own EN/BN strings)
    │   ├── seo/json-ld.tsx
    │   └── analytics/            AnalyticsScript (GA4/Umami loaders), AnalyticsClickListener
    ├── config/
    │   ├── site.ts               siteConfig + absoluteUrl()
    │   └── analytics.ts          env-driven GA/Umami flags
    ├── i18n/
    │   ├── locales.ts            LOCALES, localePath, pathnameLocale, switchLocalePath, HREFLANG…
    │   ├── locale-context.tsx    LocaleProvider + useLocale()
    │   └── ui.ts                 chrome strings (nav, search, actions, footer…) in EN + BN
    └── lib/
        ├── number.ts             parse/validate user numbers, roundTo
        ├── format.ts             formatNumber/Taka/Percent, dates, lists
        ├── plain-date.ts         timezone-free date maths
        ├── analytics.ts          typed track() + relatedLinkAttributes()
        ├── saved-calculators.ts  localStorage store for recent/favourites (slugs only)
        ├── use-saved-calculators.ts, use-today.ts   useSyncExternalStore hooks
        ├── cn.ts                 class joiner
        └── seo/structured-data.ts   schema.org builders
```

### Calculator folder layout

```
src/calculators/<name>/
  meta.ts                 CalculatorMeta export (server-safe, no React)
  logic.ts                pure validation + calculation; numbered rules comment at top
  logic.test.ts           Vitest tests for logic
  <name>-calculator.tsx   "use client" widget; EN+BN STRINGS; uses useLocale()
  content.tsx             English explanatory content (Server Component)
  content.bn.tsx          Bangla explanatory content (Server Component)
  (extras)                e.g. salary/deduction-presets.ts
```

## Data flow: registry → everything

```
<name>/meta.ts ──► registry.ts `calculators` ──┬─► home (featured/other lists, category counts)
                                               ├─► /calculators index (grouped by category)
                                               ├─► /categories/<id> (getCalculatorsByCategory)
                                               ├─► search index (buildSearchIndex)
                                               ├─► related / "Try next" (getRelatedCalculators)
                                               ├─► sitemap.ts (one entry per locale, lastModified = addedOn)
                                               ├─► footer links
                                               ├─► /bn/calculators/[slug] generateStaticParams
                                               └─► JSON-LD + <head> metadata (calculatorMetadata)

<name>/{meta, widget, content, content.bn} ──► page-registry.tsx `calculatorPages` ──► /bn/calculators/[slug]
<name>/{meta, widget, content}             ──► src/app/(en)/calculators/<slug>/page.tsx (hand-written, 12 lines)
```

`registry.ts` imports only `meta.ts` files, so it stays free of client code and can be imported by routes, the sitemap and metadata without adding JavaScript to the bundle. `page-registry.tsx` imports the components and is used only by the Bangla dynamic route.

Tests enforce consistency (`npm run test`):

- `registry.test.ts`: `validateRegistry(calculators)` returns `[]`; every calculator has `src/app/(en)/calculators/<slug>/page.tsx`; nothing is related to itself; each category is defined exactly once.
- `page-registry.test.ts`: `calculatorPages` has exactly one entry per registry calculator.
- `featured.test.ts`: featured slugs exist.

`validateRegistry` checks the slug format (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), unique slugs, known category, non-empty name/SEO, non-empty Bangla name/summary/SEO, at least one keyword, `addedOn` as a real `YYYY-MM-DD` date, and that every `related` slug exists and is not self.

## Rendering model

- **Everything is static.** Dynamic segments set `dynamicParams = false` and use `generateStaticParams`. There are no API routes, server actions, `fetch` calls or cookies.
- **Server Components** handle pages, layouts, `CalculatorPage`, content, FAQ, related lists, breadcrumbs, JSON-LD and footer.
- **Client Components** handle calculator widgets, `CalculatorForm`, `CalculatorResultArea`, `CalculatorProvider`, search, quick picks, page actions (save/share), result actions (copy/share), mobile menu, language toggle, and analytics listener.
- **Locale reaches client components** through `LocaleProvider` (set in `LocaleShell`), read with `useLocale()`. Server components receive `locale` as a prop.
- **Browser-only state** (today's date, saved calculators) uses `useSyncExternalStore` with a server snapshot (`""` / empty list), so there is no hydration mismatch and no effects are needed.
- **`CalculatorProvider`** wraps each widget. On mount it records the slug in "recent" and fires `calculator_opened`. It also provides the slug to shared result components for analytics.

## Routing and layouts

```
(no shared root layout)
├── (en)/layout.tsx  ROOT → RootDocument("en") <html lang="en"> + LocaleShell("en")
├── bn/layout.tsx    ROOT → RootDocument("bn") <html lang="bn"> + LocaleShell("bn")
└── global-not-found.tsx  → full document for unmatched URLs (experimental.globalNotFound)

RootDocument (components/layout/root-document.tsx): font, globals.css, <body>, <AnalyticsScript/>
LocaleShell: skip link, SiteHeader, <main id="main">, SiteFooter
```

- English URLs have no prefix because `(en)` is a route group.
- Navigating between locales crosses root layouts, so it is a full page load.
- `localePath(locale, path)` builds links. Always use it (or the nav helpers in `components/layout/nav-links.ts`) instead of hard-coding `/bn`.
- `switchLocalePath(pathname)` powers the language toggle.
- Site-wide metadata (metadataBase, title template, verification tags, viewport) comes from `rootMetadata(locale)` / `rootViewport` in each root layout.

## Search

`src/calculators/search.ts`, UI in `components/calculator/calculator-search.tsx`.

- The index (`buildSearchIndex(list, locale)`) is serialized from the registry on the server and passed as props. In each item, `name` holds the page-language name and `nameBn` holds the *other* language's name, so matching works in both languages.
- `normalizeQuery`: NFKC, lowercase, collapse whitespace.
- Words are split on anything that isn't a letter, mark or number (Unicode-aware, Bangla-safe).
- **Every query word must be a prefix of some word** in the name, other-language name, summary, category name, slug or keywords. So "age" matches "Age Calculator" but not "percentage".
- Score 3 if the name starts with the full query, 2 if every query word prefixes a name word, otherwise 1. Ties break alphabetically by name. Default limits: 6 calculators, 3 categories.
- Only the number of results is sent to analytics (`calculator_search`), never the query text.

## Related calculators

`getRelatedCalculators(calc, limit = 3)` returns the explicit `related` slugs in order, then other calculators in the same category, excluding itself. It is used by `RelatedCalculators` (cards) and `NextCalculators` ("Try next" links). Those links carry `data-analytics` attributes that `AnalyticsClickListener` reads, so they stay plain server-rendered `<a>` tags.

## Configuration

`src/config/site.ts` → `siteConfig`:

| Key | Value |
| --- | --- |
| `name` | `HisabBD` |
| `tagline` / `taglineBn` | "Free Online Calculators for Bangladesh" / Bangla equivalent |
| `description` / `descriptionBn` | Default meta descriptions |
| `url` | `NEXT_PUBLIC_SITE_URL` (a scheme is added if missing; trailing slash stripped) → else `https://$VERCEL_PROJECT_PRODUCTION_URL` → else `http://localhost:3000` |
| `locale` / `language` | `en-BD` / `en` |
| `currency` | `BDT` |
| `timeZone` | `Asia/Dhaka` |

`absoluteUrl(path)` joins `siteConfig.url` and a site-relative path.

## Security headers

Applied to every path (`next.config.ts`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`. Every path except `/embed/*` also gets `X-Frame-Options: SAMEORIGIN`; `/embed/*` gets `Content-Security-Policy: frame-ancestors *` so other sites can frame it.

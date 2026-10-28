# HisabBD

Free Online Calculators for Bangladesh.

Next.js (App Router) · TypeScript · Tailwind CSS · Vitest. Static/client-side only — no backend, database or paid APIs. Deploys to Vercel.

## Run locally (Docker only — nothing installed on the host)

```bash
docker compose up --build                       # installs deps, starts dev server on http://localhost:3001
docker compose run --rm app npm run lint
docker compose run --rm app npm run typecheck
docker compose run --rm app npm run test
docker compose run --rm app npm run build
docker compose run --rm app npm run check       # all of the above in order
```

Change the host port with `HISABBD_PORT=4000 docker compose up`. `node_modules` and `.next` live in Docker volumes. Stop the dev server before `npm run build` (they share `.next`). Reset with `docker compose down -v`.

## Structure

```
src/
  app/                           routes: home, /calculators, /calculators/<slug>, /categories/<id>,
                                 /about, /privacy, /terms, 404, sitemap.ts, robots.ts
  calculators/
    registry.ts                  single source of truth (cards, search, categories, related, sitemap, nav)
    types.ts, categories.ts, paths.ts, search.ts, featured.ts, metadata.ts
    <name>/                      one folder per calculator (age, bmi, gpa, cgpa, percentage, discount,
      meta.ts                      profit-loss, emi, salary, date-difference):
      logic.ts + logic.test.ts     metadata · pure calculation + validation · tests
      <name>-calculator.tsx        client widget (inputs, result, copy/share)
      content.tsx                  explanation, formula, example (server component)
    education/grading-scales.ts  configurable grading scales (Bangladesh UGC 4.00)
  components/
    ui/                          Container, Button, Card, Badge, FormField/Input/AffixInput/Select/
                                 SegmentedControl, Section, ResultPanel, ContentSection, icons
    calculator/                  CalculatorPage shell, CalculatorForm, CalculatorResultArea, ResultStats,
                                 ResultPlaceholder, ResultActions, FaqList, RelatedCalculators, search
    layout/                      header, mobile menu, footer, breadcrumbs, prose pages, nav config
    seo/json-ld.tsx              structured data
  lib/                           plain-date (timezone-safe dates), number (parsing, Bangla digits,
                                 rounding), format (৳, %, lakh grouping), seo/structured-data
public/og.png                    social sharing image
```

## Documentation

Full docs live in [`docs/`](docs/README.md). AI coding agents should start at [`AGENTS.md`](AGENTS.md).

## Adding a calculator

1. Create `src/calculators/<name>/` following `age/` (or `discount/` for money inputs): `meta.ts` (English + Bangla fields and FAQs), pure `logic.ts` + `logic.test.ts`, a client widget with `en`/`bn` strings, `content.tsx` and `content.bn.tsx`.
2. Add the meta to `calculators` in `registry.ts` and an entry to `calculatorPages` in `page-registry.tsx`.
3. Add `src/app/(en)/calculators/<slug>/page.tsx` (copy any existing route). The `/bn` page is generated automatically.
4. `npm run test` checks slugs, keywords, categories, related links, Bangla fields and that the routes exist. Homepage, search, category pages, footer, sitemap and structured data pick it up automatically.

Full checklist: [`docs/adding-a-calculator.md`](docs/adding-a-calculator.md).

## Environment (all optional — set in Vercel → Settings → Environment Variables)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL. Defaults to the Vercel production domain; set only for a custom domain. |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console HTML-tag token (the `content="…"` value only). |
| `BING_SITE_VERIFICATION` | Bing Webmaster Tools `msvalidate.01` token. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Turns on Google Analytics 4 (`G-XXXXXXXXXX`). Off when unset. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Turns on Umami analytics (cookieless). Off when unset. |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Umami script URL (defaults to Umami Cloud). |

Redeploy after changing variables.

## Privacy rules (keep these when adding features)

- Calculator inputs never leave the browser: no URLs with values, no analytics properties with values, nothing sent to a server.
- Inputs may be kept in this browser only through the calculation history (`src/lib/calculation-history.ts`): user-visible, can be turned off and cleared.
- Analytics events are typed in `src/lib/analytics.ts` and carry only calculator slugs, counts and flags.
- `localStorage` keys: `hisabbd:recent` and `hisabbd:favorites` (slugs), `hisabbd:prefs` (unit/mode settings), `hisabbd:history` (recent calculations).

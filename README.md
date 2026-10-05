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

## Adding a calculator

1. Create `src/calculators/<name>/` following `age/` (or `discount/` for money inputs): `meta.ts`, pure `logic.ts` + `logic.test.ts`, a client widget built from the shared form/result components, and `content.tsx` (FAQs live in `meta.ts`).
2. Add the meta to `calculators` in `registry.ts`.
3. Add `src/app/calculators/<slug>/page.tsx` (copy any existing route: `calculatorMetadata` + `CalculatorPage`).
4. `npm run test` checks slugs, keywords, categories, related links and that the route exists. Homepage, search, category pages, footer, sitemap and structured data pick it up automatically.

## Environment

`NEXT_PUBLIC_SITE_URL` (optional): public base URL for canonical links, sitemap and structured data. On Vercel it falls back to the project's production domain automatically, so set it only when you use a custom domain. Locally it falls back to `http://localhost:3000`.

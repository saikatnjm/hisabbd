# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, etc.) working in this repository. Read this file first, then open only the `docs/` pages your task needs.

## What this project is

**HisabBD** (হিসাবBD, "hisab" = calculation) is a free, bilingual (English + Bangla) website of everyday calculators for Bangladesh: age, BMI, GPA, CGPA, percentage, discount, profit/loss, loan EMI, salary and date difference.

- Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS 4, Vitest 4.
- Fully static and client-side. **No backend, no database, no API routes, no paid services.**
- Deployed on Vercel from source. Docker is used only for local development.
- English lives at `/…`, Bangla at `/bn/…`. Every page exists in both languages.

## Commands

The host has no Node install; run everything through Docker Compose.

```bash
docker compose up --build                     # dev server at http://localhost:3001
docker compose run --rm app npm run lint      # ESLint (next core-web-vitals + typescript)
docker compose run --rm app npm run typecheck # next typegen && tsc --noEmit
docker compose run --rm app npm run test      # vitest run (src/**/*.test.ts)
docker compose run --rm app npm run build     # next build (stop the dev server first: they share .next)
docker compose run --rm app npm run check     # lint + typecheck + test + build, in order
docker compose run --rm e2e                   # Playwright smoke tests in Chromium (builds, then next start on :3100)
```

If Node ≥ 20.9 is available locally, the same `npm run …` scripts work directly.

**Definition of done for any code change:** `npm run check` passes.

## Hard rules (do not break these)

1. **Privacy.** Calculator input values and results never leave the browser. No values in URLs, query strings, analytics events, `localStorage`, cookies or network requests. Analytics events are a closed union type in `src/lib/analytics.ts` carrying only slugs, counts and flags. `localStorage` holds only calculator slugs (`hisabbd:recent`, `hisabbd:favorites`). See `docs/privacy-and-analytics.md`.
2. **Bilingual parity.** Every user-visible string ships in English and Bangla. New calculators need `nameBn`, `summaryBn`, `seoBn`, `faqsBn`, a `content.bn.tsx`, and `bn` entries in the widget's `STRINGS`. The registry validator fails the tests if Bangla meta fields are empty. See `docs/i18n.md`.
3. **Pure logic, separate UI.** Every calculation lives in `src/calculators/<name>/logic.ts` as pure functions with no React, no DOM, no clock and no UI strings, and has a `logic.test.ts`. Widgets only parse state, call logic and render.
4. **No guessed regulations.** Tax slabs, provident-fund rates, university grading quirks, lender fees and the like are not hard-coded. The user enters them, or the page states the assumption. Document every assumption in the comment block at the top of `logic.ts` and on the content page.
5. **Dates are plain dates.** Use `src/lib/plain-date.ts` (`{year, month, day}` integers). Never do date arithmetic with `Date` timestamps or `days / 365`. Read "today" only via `useToday()` in client components and pass it into logic as a string.
6. **Numbers.** Parse user input with `checkNumber` / `parseNumberInput` from `src/lib/number.ts`, which accept Bangla digits and `1,00,000` grouping. Round only for display (`roundTo`, `formatTaka`, `formatNumber`, `formatPercent`). Money is shown as `৳` with South Asian grouping.
7. **The registry is the source of truth.** Home, search, category pages, related links, footer, sitemap, JSON-LD and `/bn` routes all derive from `src/calculators/registry.ts` and `page-registry.tsx`. Don't hand-maintain lists elsewhere.
8. **Static only.** No server actions, API routes, runtime data fetching or new runtime dependencies without a strong reason. Current production dependencies: `next`, `react`, `react-dom`. Nothing else.
9. **Accessibility.** Use the shared `FormField` / `AffixInput` / `SegmentedControl` / `CalculatorForm` / `CalculatorResultArea` components; they wire up labels, `aria-invalid`, `aria-describedby`, live-region announcements and focus. Use `inputMode="decimal"` with `type="text"` for numeric inputs, not `type="number"`.

## Where things are

```
AGENTS.md                      ← you are here
docs/                          ← full documentation (start at docs/README.md)
src/app/(en)/…                 English routes (route group, no URL prefix)
src/app/bn/…                   Bangla routes (/bn prefix)
src/components/layout/root-document.tsx  <html>, font, global metadata, analytics (used by both root layouts)
src/app/sitemap.ts, robots.ts  generated from the registry
src/calculators/registry.ts    list of all calculators + validateRegistry()
src/calculators/page-registry.tsx  slug → {meta, Calculator, Content, ContentBn} (drives /bn pages)
src/calculators/<name>/        meta.ts, logic.ts, logic.test.ts, <name>-calculator.tsx, content.tsx, content.bn.tsx
src/guides/                    guide articles (/guides/<slug>): registry.ts, page-registry.tsx, <slug>/{meta,content,content.bn}
src/components/                ui/, calculator/, layout/, pages/, home/, seo/, analytics/
src/config/site.ts             site name, URL resolution, locale, currency, timezone
src/i18n/                      locales.ts (paths), ui.ts (chrome strings), locale-context.tsx (useLocale)
src/lib/                       number, format, plain-date, analytics, saved-calculators, seo/structured-data
```

## Task playbooks

| Task | Read |
| --- | --- |
| Add a new calculator | `docs/adding-a-calculator.md` (step-by-step checklist with templates) |
| Add or edit a guide article | `docs/architecture.md` → "Guides" |
| Change a calculator's maths or limits | `docs/calculators.md`, then that calculator's `logic.ts` header and `logic.test.ts` |
| Translate or change wording | `docs/i18n.md` |
| Titles, descriptions, sitemap, structured data | `docs/seo.md` |
| Analytics events, saved calculators | `docs/privacy-and-analytics.md` |
| Build UI or change styling | `docs/ui-and-components.md` |
| Number, money, date helpers | `docs/lib-reference.md` |
| Env vars, Docker, deploy, tests | `docs/development.md` |
| Unfamiliar Bangladesh terms (lakh, paisa, UGC, TDS…) | `docs/glossary.md` |
| SEO, growth, which calculator to build next | `docs/growth-plan.md` (items are numbered: N1, T3, C2…) |

## Code conventions

- Imports use the `@/` alias for `src/`.
- Files are kebab-case. Components are PascalCase named exports (no default exports, except Next.js `page.tsx` / `layout.tsx`).
- Mark client components with `"use client"` and keep them small. Content, pages and the calculator page shell are Server Components.
- Validation functions return discriminated unions: `{ ok: true; result } | { ok: false; errors: { field, code }[] }`. Error **codes** live in logic; human **messages** live in the widget (usually via `numberErrorMessage` in `src/components/calculator/number-messages.ts`).
- Comments explain *why* and state assumptions. Match the existing density: a doc comment on each export, a numbered rules block at the top of each `logic.ts`.
- Write in plain, friendly British-leaning English ("favourite", "instalment") and natural Bangla. In Bangla text the codebase keeps Western digits for numbers (`৳2,500`, `20%`).
- Tailwind utility classes only. Design tokens live in `src/app/globals.css`. Join classes with `cn()` from `src/lib/cn.ts`.

## Known quirks

- `hisabbd-bangla-i18n.patch` at the repo root is an exported git patch of the Bangla i18n commit. It is not used by the build. Ignore it unless asked.
- There is no `src/app/layout.tsx`: `src/app/(en)/layout.tsx` and `src/app/bn/layout.tsx` are separate root layouts (each renders `<html lang>` via `RootDocument`). Unmatched URLs render `src/app/global-not-found.tsx` (`experimental.globalNotFound`).
- `src/calculators/upcoming.ts` is only shown when the registry is empty. It is effectively dormant.

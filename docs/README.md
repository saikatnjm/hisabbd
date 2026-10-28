# HisabBD documentation

This folder documents the whole HisabBD codebase: what the product is, how it is built, the exact rules each calculator follows, and how to extend it. It is written so that a person or an LLM can work from it without first reading the source.

Agents should start at [`../AGENTS.md`](../AGENTS.md) for the hard rules and commands, then come here.

## Documents

| File | What it covers | Read when |
| --- | --- | --- |
| [overview.md](overview.md) | Product, audience, every page and URL, user-facing features | You need to know what the site does |
| [architecture.md](architecture.md) | Tech stack, directory map, data flow, rendering model, routing | You are changing structure or adding pages |
| [calculators.md](calculators.md) | Spec for all 14 calculators: inputs, formulas, limits, outputs, edge cases | You are touching calculator logic or content |
| [adding-a-calculator.md](adding-a-calculator.md) | Step-by-step checklist with file templates | You are adding a calculator |
| [i18n.md](i18n.md) | English/Bangla system: paths, strings, content, digits | You are writing or translating UI text |
| [seo.md](seo.md) | Metadata, canonical, hreflang, sitemap, robots, JSON-LD, verification | You are changing titles, URLs or structured data |
| [privacy-and-analytics.md](privacy-and-analytics.md) | Privacy rules, analytics events, local storage | You are adding tracking or persistence |
| [ui-and-components.md](ui-and-components.md) | Design tokens, component APIs, widget pattern, accessibility | You are building or styling UI |
| [lib-reference.md](lib-reference.md) | API reference for `src/lib` (number, format, plain-date, etc.) | You need a helper's exact behaviour |
| [development.md](development.md) | Setup, Docker, scripts, tests, env vars, deployment, troubleshooting | You are running, testing or deploying |
| [glossary.md](glossary.md) | Bangladesh-specific and project terms | You see an unfamiliar word |
| [growth-plan.md](growth-plan.md) | Search and growth plan Nov 2026 – Jul 2027: indexing, new calculators backlog (N1…), technical SEO (T1…), content (C1…), distribution (D1…) | You are picking up growth or SEO work |

## Facts at a glance

- **Name:** HisabBD. **Tagline:** "Free Online Calculators for Bangladesh" / "বাংলাদেশের জন্য ফ্রি অনলাইন ক্যালকুলেটর".
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 (strict, `noUncheckedIndexedAccess`) · Tailwind CSS 4 · Vitest 4 · ESLint 9.
- **Runtime dependencies:** `next`, `react`, `react-dom` only.
- **Hosting:** Vercel. Every page is statically generated at build time.
- **Locales:** `en` (default, at `/`) and `bn` (at `/bn`). hreflang `en-BD` / `bn-BD`.
- **Calculators (14):** age, BMI, GPA, CGPA, percentage, discount, profit/loss, EMI/loan, salary, date difference, government job age, SSC/HSC GPA, land area, amount in words.
- **Embeds:** every calculator can be framed by other sites at `/embed/<en|bn>/<slug>`.
- **Categories (5):** `health`, `education`, `finance`, `everyday`, `date-time`.
- **Currency / timezone:** BDT (৳) / Asia/Dhaka. Numbers are grouped South Asian style: `1,00,000`.
- **Brand colour:** `#006a4e` (Bangladesh flag green).
- **Backend / database / accounts:** none.

## Conventions used in these docs

- Paths are relative to the repository root unless stated.
- "Logic" means a calculator's `logic.ts` (pure functions). "Widget" means its client component `<name>-calculator.tsx`.
- Formulas use `×`, `÷` and `^` for multiply, divide and power.
- When the docs and the code disagree, the code wins. Please fix the doc in the same change.

# Adding a calculator

A complete checklist. Copy an existing calculator as a starting point:

- **`discount/`** for money inputs with a toggle (simple, 2–3 fields).
- **`age/`** for date inputs.
- **`bmi/`** or **`percentage/`** for unit or mode switches (`SegmentedControl`).
- **`gpa/`** or **`cgpa/`** for add/remove rows (`useRowList`, `AddRowButton`, `RemoveRowButton`).

Below, `<name>` is the folder (e.g. `vat`), `<slug>` is the URL id (e.g. `vat-calculator`) and `<Name>` is the PascalCase prefix (e.g. `Vat`).

## Checklist

- [ ] 1. Create `src/calculators/<name>/logic.ts` with pure functions and a numbered rules comment
- [ ] 2. Create `src/calculators/<name>/logic.test.ts`
- [ ] 3. Create `src/calculators/<name>/meta.ts` with all English and Bangla fields
- [ ] 4. Create `src/calculators/<name>/<name>-calculator.tsx` (client widget with `en` + `bn` STRINGS; settings via `usePreference`, history via `useCalculationHistory` + `<RecentCalculations>`; see docs/ui-and-components.md → "The widget pattern")
- [ ] 5. Create `src/calculators/<name>/content.tsx` and `content.bn.tsx`
- [ ] 6. Add the meta to `calculators` in `src/calculators/registry.ts`
- [ ] 7. Add an entry to `calculatorPages` in `src/calculators/page-registry.tsx`
- [ ] 8. Create `src/app/(en)/calculators/<slug>/page.tsx`
- [ ] 9. If it needs a new icon, add it to `CALCULATOR_ICONS` (`types.ts`), `components/ui/icons.tsx` and the map in `components/calculator/calculator-icon.tsx`
- [ ] 10. Optionally, add it to `featuredSlugs` (`featured.ts`) and to other calculators' `related`
- [ ] 11. If it introduces a new category, see "New category" below
- [ ] 12. Add its inputs to `CALCULATOR_INPUTS` in `e2e/calculator-inputs.ts` (labels and submit text from the widget's `STRINGS`, both locales)
- [ ] 13. Run `npm run check` and `docker compose run --rm e2e`

Nothing else needs editing. Home, `/calculators`, category pages, search, related links, footer, sitemap, JSON-LD and the `/bn` route all pick it up from the registry.

## 1. `logic.ts`

Rules:

- No React, DOM, `Date.now()`, `window` or UI strings. Import only from `@/lib/*` and sibling logic.
- Start with a `/* … */` block listing numbered rules and assumptions: formula, limits, rounding, what is deliberately **not** modelled.
- Export limits as constants (`MAX_…`) so the widget can show them in messages.
- Export small helpers (the formula itself) plus one `calculate<Name>(raw…)` that validates and computes.
- Return a discriminated union and collect **all** field errors before returning.

```ts
import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * VAT calculator rules and assumptions (documented):
 *
 * 1. …formula…
 * 2. …rounding…
 * 3. Limits: …
 */

export const MAX_AMOUNT = 1_000_000_000_000;

export type VatField = "amount" | "rate";
export interface VatError { field: VatField; code: NumberErrorCode }
export interface VatResult { /* …documented fields… */ }
export type VatCalculation = { ok: true; result: VatResult } | { ok: false; errors: VatError[] };

export function calculateVat(rawAmount: string, rawRate: string): VatCalculation {
  const errors: VatError[] = [];
  const amount = checkNumber(rawAmount, { min: 0.01, max: MAX_AMOUNT });
  if (!amount.ok) errors.push({ field: "amount", code: amount.code });
  const rate = checkNumber(rawRate, { min: 0, max: 100 });
  if (!rate.ok) errors.push({ field: "rate", code: rate.code });
  if (!amount.ok || !rate.ok) return { ok: false, errors };
  // …compute…
  return { ok: true, result: { /* … */ } };
}
```

If the calculation depends on a rate or rule that changes by law or by institution (tax, VAT rates, grading), make it an **input** or **data** and state the assumption. Never hard-code a guessed value.

## 2. `logic.test.ts`

Vitest, `environment: "node"`. Cover:

- the worked example used in `content.tsx` and the FAQs (keep numbers identical),
- boundaries (min, max, just outside each),
- `missing` / `invalid` for each field, and multiple errors reported together,
- Bangla digits and comma grouping (`"১০০০"`, `"1,00,000"`),
- rounding edge cases (e.g. `x.xx5`).

Use `toBeCloseTo(value, 10)` for unrounded floats and `toBe` for paisa-rounded money.

## 3. `meta.ts`

```ts
import type { CalculatorMeta } from "@/calculators/types";

export const vatCalculator: CalculatorMeta = {
  slug: "vat-calculator",             // ^[a-z0-9]+(-[a-z0-9]+)*$, unique, ends in -calculator by convention
  name: "VAT Calculator",
  nameBn: "ভ্যাট ক্যালকুলেটর",
  category: "finance",                // one of CATEGORY_IDS
  icon: "percent",                    // one of CALCULATOR_ICONS
  summary: "One sentence: intro, card text and search.",
  summaryBn: "…",
  keywords: ["vat", "ভ্যাট", "…"],    // synonyms, abbreviations, Bangla and Banglish words; never shown
  seo: { title: "VAT Calculator: …", description: "…~150 chars…" },  // site name is appended automatically
  seoBn: { title: "…", description: "…" },
  addedOn: "2026-11-01",              // real publish date, YYYY-MM-DD; drives "Recently added" and sitemap lastModified
  related: ["percentage-calculator"], // must exist; never itself
  faqs: [{ question: "…", answer: "…" }],
  faqsBn: [{ question: "…", answer: "…" }],
};
```

FAQs are plain strings (they become `FAQPage` JSON-LD) and appear only on the page in the same language. Keep FAQ numbers consistent with the logic tests.

## 4. Widget: `<name>-calculator.tsx`

Follow `discount/discount-calculator.tsx`. The skeleton:

```tsx
"use client";

import { useRef, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { numberErrorMessage } from "@/components/calculator/number-messages";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { AffixInput, FormField } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { calculateVat, type VatField } from "./logic";

const FIELD_IDS: Record<VatField, string> = { amount: "vat-amount", rate: "vat-rate" };

const STRINGS = {
  en: { submit: "Calculate VAT", /* labels, placeholders, errors, result text, share text */ },
  bn: { submit: "ভ্যাট হিসাব করুন", /* same keys */ },
} as const;

export function VatCalculator() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const refs = { amount: useRef<HTMLInputElement>(null), rate: useRef<HTMLInputElement>(null) };

  const calc = submitted ? calculateVat(amount, /* … */) : null;   // live validation after first submit
  const result = calc?.ok ? calc.result : null;

  function onSubmit() {
    setSubmitted(true);
    const check = calculateVat(amount, /* … */);
    if (check.ok) setRevealCount((n) => n + 1);
    else refs[check.errors[0]!.field].current?.focus();             // focus first invalid field
  }
  function onReset() { /* clear state, setSubmitted(false), setRevealCount(0), focus first field */ }

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <FormField id={FIELD_IDS.amount} label={/* … */} error={/* message from code */}>
          {(control) => (
            <AffixInput {...control} ref={refs.amount} type="text" inputMode="decimal"
              autoComplete="off" prefix="৳" value={amount} onChange={(e) => setAmount(e.target.value)} />
          )}
        </FormField>
      </CalculatorForm>
      <CalculatorResultArea
        revealKey={revealCount}
        announcement={result ? /* one short sentence */ "" : ""}
        result={result && /* <ResultPanel>…<ResultStats/>…</ResultPanel><ResultActions/> */ null}
        placeholder={<ResultPlaceholder title={/* … */ ""}>{/* … */}</ResultPlaceholder>}
      />
    </div>
  );
}
```

Requirements:

- Named export `<Name>Calculator`, no props. The locale comes from `useLocale()`.
- Every string exists in both `en` and `bn`. Type the dictionary `as const` and derive `type Strings = (typeof STRINGS)[Locale]`.
- Numeric fields use `type="text" inputMode="decimal"`, never `type="number"`.
- Format output with `formatTaka` / `formatNumber` / `formatPercent` / `formatPlainDate`.
- `ResultActions` gets a plain-text share string. Remount it with `key={text}` so its status message resets when the result changes.
- Do not call `track()` yourself. `CalculatorProvider` and `CalculatorResultArea` already send `calculator_opened` and `calculation_completed`.
- Never write inputs or results to storage, URLs or analytics.

## 5. Content: `content.tsx` and `content.bn.tsx`

Server Components with no `"use client"` and no JS. Export `<Name>CalculatorContent` and `<Name>CalculatorContentBn`. Use `ContentSection` blocks, for example:

- `how-it-works`: the formula in `<strong>` and a worked example (same numbers as the tests),
- topic-specific sections (assumptions, common mistakes),
- `how-to-use`: numbered steps matching the real labels.

## 6–8. Wire it up

`src/calculators/registry.ts`:

```ts
import { vatCalculator } from "./vat/meta";
export const calculators = [ /* … */, vatCalculator ];
```

`src/calculators/page-registry.tsx`: add the three imports and

```ts
{ meta: vatCalculator, Calculator: VatCalculator, Content: VatCalculatorContent, ContentBn: VatCalculatorContentBn },
```

`src/app/(en)/calculators/vat-calculator/page.tsx`:

```tsx
import { VatCalculator } from "@/calculators/vat/vat-calculator";
import { VatCalculatorContent } from "@/calculators/vat/content";
import { vatCalculator } from "@/calculators/vat/meta";
import { calculatorMetadata } from "@/calculators/metadata";
import { CalculatorPage } from "@/components/calculator/calculator-page";

export const metadata = calculatorMetadata(vatCalculator);

export default function VatCalculatorPage() {
  return (
    <CalculatorPage calculator={vatCalculator} content={<VatCalculatorContent />}>
      <VatCalculator />
    </CalculatorPage>
  );
}
```

The Bangla page `/bn/calculators/vat-calculator` is generated automatically.

## New category

1. Add the id to `CATEGORY_IDS` in `src/calculators/types.ts`.
2. Add the `{ id, name, nameBn, description, descriptionBn }` entry to `src/calculators/categories.ts`.
3. Add `--color-<id>-soft` / `--color-<id>-ink` tokens in `src/app/globals.css` and a matching entry in `components/calculator/category-theme.ts`.
4. Add an icon for it in `components/calculator/category-icon.tsx`.

Category pages, nav, sitemap and search update automatically.

## Final checks

- `npm run check` passes (the registry and page-registry tests catch missing routes and fields).
- `docker compose run --rm e2e` passes (it fails for a calculator without an `e2e/calculator-inputs.ts` entry).
- Open `/calculators/<slug>` and `/bn/calculators/<slug>`: labels, errors, result, copy/share text and FAQ are in the right language.
- Try Bangla digits and `1,00,000` in every numeric field.
- Keyboard only: Tab through, submit with errors (focus jumps to the first error), Reset.

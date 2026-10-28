# UI, design system and components

## Design principles

- **Mobile first.** Most visitors use phones. Touch targets are ≥ 44px (`min-h-11`); inputs are 48px tall (`h-12`) with 16px+ text so iOS doesn't zoom on focus.
- **Calm, friendly, local.** Bangladesh flag green as the brand colour, a softened flag red as the accent, exercise-book graph paper (`bg-graph`) behind headers, and a decorative calculator keypad in the hero.
- **Accessible by default.** Semantic HTML, native controls (radio pills, `<details>`, `<select>`), visible focus rings, live regions for results, `prefers-reduced-motion` respected.
- **No UI library and no icon library.** Tailwind utilities plus a few local primitives and inline SVG icons.

## Design tokens (`src/app/globals.css`)

Tailwind v4 `@theme` variables become utilities (`bg-brand-600`, `text-health-ink`, `shadow-lift`, …).

| Token | Value | Use |
| --- | --- | --- |
| `--color-brand-50…900` | `#eef9f3` … `#003325`; **600 = `#006a4e`** (flag green) | Primary actions, links, focus ring, header bands |
| `--color-coral-500` | `#ef4f58` | Accent (softened flag red) |
| `--color-sun-300` | `#ffd25e` | Text selection |
| `--color-<category>-soft` / `-ink` | health `#ffe6e3`/`#b42630`, education `#e0edff`/`#1d5bbf`, finance `#fff0c4`/`#855600`, everyday `#d6f1e3`/`#005740`, date-time `#ebe5ff`/`#5a3cc2` | Category tiles, badges, icons (mapped in `components/calculator/category-theme.ts`) |
| `--shadow-lift` | soft drop shadow | Cards and the calculator form |
| `--shadow-key` | inset bottom shadow | Keypad keys |
| `--font-sans` | system-ui stack with Noto Sans Bengali | Body |
| `--font-display` | Anek Bangla (`--font-anek`) | Headings via the `font-display` utility (`wdth` 110) |

Custom utilities and animations: `font-display`, `bg-graph` (28px grid), `.key-drop` (hero keys), `.result-in` (result reveal). Animations only run under `prefers-reduced-motion: no-preference`. Focus style: 3px brand-600 outline, 2px offset. Breakpoints are the Tailwind defaults (sm 640, md 768, lg 1024, xl 1280). Content columns are capped at `max-w-3xl` on calculator pages.

Styling rules: use Tailwind classes only (no CSS modules, no inline `style` except where unavoidable). Combine conditional classes with `cn()`, which joins truthy strings and does **not** resolve conflicts, so pass additive classes only.

## Primitives (`src/components/ui/`)

| Component | Purpose / API |
| --- | --- |
| `Button`, `buttonClasses({ variant, size, className })` | Variants `primary` \| `secondary` \| `ghost`; sizes `md` (min-h-11) \| `lg` (min-h-12). Use `buttonClasses` to style a `<Link>`. `type` defaults to `"button"`. |
| `Card`, `cardClasses` | Rounded bordered white box |
| `Badge` | Small label; pass colour classes |
| `Container` | Page-width wrapper with side padding |
| `Section` | `<section>` with an h2 title and optional description, `aria-labelledby` wired |
| `ContentSection` | Article section (h2 + prose) for calculator content and prose pages; styles `p`, `ul`, `ol`, `h3` inside |
| `Label`, `Input` | Base form controls (`Input` handles the `aria-invalid` red state) |
| `AffixInput` | `Input` with a non-interactive `prefix` (e.g. `৳`) or `suffix` (e.g. `%`, `kg`) |
| `Select` | Native select with a chevron |
| `SegmentedControl<T>` | `{ name, legend, options: {value,label}[], value, onChange, hideLegend? }`: radio buttons styled as pills inside a `<fieldset>` |
| `FieldMessage` | Hint or error text (errors get an alert icon) |
| `FormField` | `{ id, label, hint?, error?, children: (control) => ReactNode }`. Renders label + control + error + hint and passes `{ id, aria-invalid, aria-describedby }` to the render-prop control. The error appears directly under the control, before the hint. |
| `ResultPanel` | `{ title, titleId?, value, children? }`: the big result card. **Not** a live region. |
| `icons.tsx` | Inline SVG icons (`SearchIcon`, `CalendarIcon`, `ScaleIcon`, …), decorative by default (`aria-hidden`) |

## Calculator building blocks (`src/components/calculator/`)

| Component | Client? | Role |
| --- | --- | --- |
| `CalculatorPage` | server | The whole page shell: header band, widget slot, Try next, content slot, FAQ, related, JSON-LD. Props: `{ calculator, children (widget), content, locale }`. |
| `CalculatorProvider` / `useCalculatorSlug()` | client | Wraps the widget; records recents, fires `calculator_opened`, provides the slug to result components |
| `CalculatorForm` | client | `<form noValidate>` card with the submit button (`submitLabel`) and Reset. Props: `{ onSubmit, onReset, submitLabel, children }`. |
| `CalculatorResultArea` | client | `{ revealKey, announcement, result, placeholder }`. Holds the `aria-live="polite"` sr-only announcement, reveal animation and scroll-into-view, and fires `calculation_completed`. |
| `ResultPlaceholder` | server-safe | `{ title, preview?, children }`: shown before the first result and while inputs need fixing |
| `ResultStats` | server-safe | `items: { label, value }[]`: two-column `<dl>` of secondary figures |
| `ResultActions` | client | `{ text, shareTitle }`: Copy (Clipboard API) and Share (Web Share API, only where supported), with status messages. Remount with `key={text}`. |
| `numberErrorMessage` | – | Code → localized sentence (see [i18n.md](i18n.md)) |
| `CalculatorPageActions` | client | Save (favourite) and Share-page buttons in the header band |
| `NextCalculators` | server | "Try next" links under the widget |
| `RelatedCalculators` | server | Related cards at the bottom |
| `FaqList` | server | `<details>` accordion |
| `CalculatorCard`, `CalculatorList` | server | Card (whole card is one link with a visible "Open calculator" cue) and responsive grid |
| `CategoryList`, `CategoryIcon`, `CalculatorIconTile` | server | Category tiles with counts; coloured icon tiles |
| `CalculatorSearch` | client | Accessible combobox (arrow keys, Enter, Escape) over the serialized index; shows suggestions when empty |
| `QuickPicks` | client | Home chip row: featured, or the user's favourites and recents |

Education helpers (`src/calculators/education/`): `useRowList({ createRow, initialCount, maxRows, focusTargetId: (rowId) => domId })` gives rows stable incrementing ids and moves focus after add/remove/reset. `AddRowButton` / `RemoveRowButton` explain when the row limit is reached.

## Layout (`src/components/layout/`)

`LocaleShell` (skip link → `SiteHeader` → `<main id="main">` → `SiteFooter`), `SiteHeader` (logo, primary nav, language toggle, `MobileMenu`), `SiteFooter` (calculator links, categories, site links, disclaimer, build-year copyright), `Breadcrumbs`, `ProsePage` (About/Privacy/Terms: breadcrumb, H1, intro, optional `updated` date), `nav-links.ts` (single source for nav), `Logo` (÷ on a green tile; the top dot nods to the flag's red circle).

## The widget pattern

Every calculator widget follows the same state machine:

```
idle ──Calculate──► submitted
  submitted && !ok  → field errors shown live, focus first invalid field, placeholder ("Almost there")
  submitted && ok   → revealCount++ → result rendered (animated), announcement read, scrolled into view
Reset → idle, all fields cleared, focus first field
```

- State is raw strings (exactly what the user typed). Logic runs on every render once `submitted` is true, so fixing a field clears its error immediately.
- Field ids come from a `FIELD_IDS` record; refs from a `Record<Field, RefObject>` for focus management.
- The result view is a separate component that reads `STRINGS[useLocale()]`.
- Date fields use `<Input type="date">`. Default "today" values come from `useToday()`, which returns `""` during SSR.

## Accessibility checklist

- Every input has a visible `<label>` through `FormField`, and errors are linked with `aria-describedby` + `aria-invalid`.
- The form uses `noValidate`; the calculator's own messages replace browser bubbles.
- Results: one short sentence in the `aria-live` region, not the whole panel.
- Grouped choices use `SegmentedControl` (fieldset + legend + radios).
- Inline text in another language gets a `lang` attribute.
- A skip link goes to `#main`. Breadcrumbs use `<nav aria-label>`.
- Motion respects `prefers-reduced-motion` (CSS animations and smooth scrolling).
- Colour is never the only signal: categories have icons and text, and errors have an icon and text.

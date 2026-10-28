# `src/lib` reference

Pure helpers shared by every calculator. All of them are covered by tests in `src/lib/*.test.ts`.

## `number.ts`: parsing user numbers

| Export | Signature | Behaviour |
| --- | --- | --- |
| `normalizeDigits` | `(value: string) => string` | Bangla digits `০–৯` → ASCII (`"১২৫" → "125"`) |
| `parseNumberInput` | `(value: string) => number \| null` | Normalizes digits, trims, strips commas and whitespace, then matches `^[+-]?(\d+\.?\d*\|\.\d+)$`. Returns `null` for empty or malformed input. Never returns `NaN` or `Infinity`. `"1,00,000" → 100000`, `"12." → 12`, `".5" → 0.5`, `"1e3" → null`, `"10%" → null`. |
| `checkNumber` | `(raw: string, rule?: NumberRule) => NumberCheck` | `{ ok: true, value } \| { ok: false, code }`. Checks run in order: `missing` (blank after normalizing), `invalid`, `not-integer`, `too-small`, `too-large`. |
| `NumberRule` | `{ min?, minExclusive?, max?, integer? }` | `minExclusive: true` means the value must be `> min` |
| `NumberErrorCode` | `"missing" \| "invalid" \| "too-small" \| "too-large" \| "not-integer"` | |
| `roundTo` | `(value: number, decimals: number) => number` | Rounds half away from zero using the decimal string, so `1.005 → 1.01`, `2.675 → 2.68`, `-2.5 → -3` at 0 dp. Never returns `-0`. Passes non-finite values through. |

## `format.ts`: display formatting

All number output uses `Intl.NumberFormat("en-IN")` grouping (`1,00,000`, `1,00,00,000`) with Western digits. Non-finite values render as `"–"`.

| Export | Example |
| --- | --- |
| `formatNumber(value, { decimals = 2, minDecimals = 0 })` | `100000 → "1,00,000"`, `3.14159 → "3.14"`, `2.5 (minDecimals 2) → "2.50"` |
| `formatTaka(value, opts = { decimals: 0 })` | `25000 → "৳25,000"`, `-500 → "−৳500"` (true minus sign) |
| `formatPercent(value, opts)` | `12.5 → "12.5%"` (the input is already a percentage) |
| `pluralize(count, singular, plural?)` | `(3, "year") → "3 years"` |
| `countBn(count, unit)` | `(3, "দিন") → "3 দিন"` |
| `joinList(items, locale)` | `"a, b and c"` / `"a, b ও c"` |
| `weekdayName(weekday, locale)` | `0 → "Sunday"` / `"রবিবার"` |
| `formatPlainDate(date, { weekday?, locale? })` | `"5 October 2026"`, `"Monday, 5 October 2026"`, `"5 অক্টোবর 2026"`. Built without `Date`/`Intl`, so server and client always agree. |

Rounding for display happens here; logic keeps full precision.

## `plain-date.ts`: timezone-free dates

A `PlainDate` is `{ year, month (1–12), day (1–31) }`. Valid years are 1–9999 (proleptic Gregorian). Day counts use Howard Hinnant's integer "days from civil" algorithms, so results can never be shifted by timezone or DST.

| Export | Behaviour |
| --- | --- |
| `isLeapYear(y)`, `daysInMonth(y, m)`, `isValidPlainDate(d)` | Calendar basics |
| `parsePlainDate("YYYY-MM-DD")` | `PlainDate \| null`; rejects impossible dates such as `2023-02-29` |
| `toIsoDate(d)` | `"YYYY-MM-DD"` (zero-padded) |
| `comparePlainDates(a, b)` | negative / 0 / positive |
| `toDayNumber(d)` / `fromDayNumber(n)` | Days since 1970-01-01 and the inverse |
| `daysBetween(a, b)` | `toDayNumber(b) − toDayNumber(a)` |
| `dayOfWeek(d)` | 0 = Sunday … 6 = Saturday |
| `addDays(d, n)` | Whole-day offset |
| `addMonths(d, n)` | Calendar months with end-of-month clamping (31 Jan + 1 → 28/29 Feb) |
| `calendarDifference(from, to)` | `{ years, months, days, totalMonths, totalDays }`: complete months (with clamping), then leftover days. Throws `RangeError` if `to < from`. |

## `use-today.ts`

`useToday(): string`: the visitor's local date as `"YYYY-MM-DD"`, read with `useSyncExternalStore`. It returns `""` on the server and the real date after hydration, so there is no mismatch. This is the **only** place the app reads the current date for calculations.

## `analytics.ts`

`track(event: AnalyticsEvent)` and `relatedLinkAttributes(from, to, placement)`. See [privacy-and-analytics.md](privacy-and-analytics.md).

## `saved-calculators.ts` and `use-saved-calculators.ts`

Pure helpers: `sanitizeSlugs(value, max)`, `withRecent(list, slug, max)`, `toggled(list, slug, max)`. Store: `readSaved`, `subscribeSaved`, `serverSaved`, `rememberRecent`, `toggleFavorite`. Hook: `useSavedCalculators("recent" | "favorites")`. Constants: `MAX_RECENT = 6`, `MAX_FAVORITES = 12`. See [privacy-and-analytics.md](privacy-and-analytics.md#saved-calculators-favourites-and-recents).

## `seo/structured-data.ts`

`websiteSchema(locale)`, `calculatorSchema(calc, locale)`, `breadcrumbSchema(items)`, `faqSchema(faqs)`, `schemaGraph(schemas)`, `serializeJsonLd(data)`. See [seo.md](seo.md#structured-data-json-ld).

## `cn.ts`

`cn(...classes)` joins truthy class strings. It does not merge conflicting Tailwind classes.

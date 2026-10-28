# Privacy and analytics

Privacy is a product promise, stated on `/privacy` and `/about`. Treat these rules as hard constraints.

## Rules

1. **Calculator inputs and results never leave the browser.** They must not appear in:
   - URLs or query strings (no shareable "result links"),
   - analytics event properties,
   - cookies, `sessionStorage` or IndexedDB,
   - any network request.

   The one place typed values may be kept is the **calculation history** in `localStorage` (below). It is on the visitor's device only, shown to them, and they can turn it off or clear it.
2. **Search text is never sent.** Only the number of results.
3. **Storage is limited to four keys:** slugs (`hisabbd:recent`, `hisabbd:favorites`), settings (`hisabbd:prefs`) and the calculation history (`hisabbd:history`). Anything else needs a privacy-page update first.
4. **No accounts, no advertising cookies, no third-party fonts.**
5. **Analytics is optional and off by default.** With no env vars set, no analytics script loads and `track()` is a no-op.
6. Sharing a calculator page shares its URL only. "Share result" sends plain text to the OS share sheet or clipboard, which the user controls.

If a feature can't be built within these rules, don't build it. Raise it instead.

## Analytics

### Configuration

`src/config/analytics.ts` reads:

| Env var | Effect |
| --- | --- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Enables Google Analytics 4. It must match `^G-[A-Z0-9]+$`; otherwise it is ignored. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Enables Umami (cookieless). |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Umami script URL (default `https://cloud.umami.is/script.js`). |

It exports `gaEnabled`, `umamiEnabled` and `analyticsEnabled`. The Privacy page uses these flags to describe exactly what is active.

### Loading

`src/components/analytics/analytics-script.tsx` (rendered in the root layout) loads with `next/script` `afterInteractive`:

- **GA4**: `gtag.js` plus inline config with `allow_google_signals: false` and `allow_ad_personalization_signals: false`. GA sets analytics cookies; the privacy page says so when it is enabled.
- **Umami**: `data-domains` limited to the production hostname and `data-do-not-track="true"`.
- `AnalyticsClickListener`: one delegated click handler for server-rendered links that carry `data-analytics` attributes.

### Events

`src/lib/analytics.ts` defines a **closed union**. Adding a property that carries user input should be impossible without changing this type, and such a change must not be made.

| Event | Properties | Fired by |
| --- | --- | --- |
| `calculator_opened` | `calculator` (slug) | `CalculatorProvider` on mount |
| `calculation_completed` | `calculator` | `CalculatorResultArea` when `revealKey` increments |
| `calculator_search` | `results` (count) | `CalculatorSearch` |
| `search_result_clicked` | `target` (slug or category id), `kind` | `CalculatorSearch` |
| `related_calculator_clicked` | `from`, `to`, `placement: "next" \| "related"` | `AnalyticsClickListener` via `relatedLinkAttributes()` |
| `result_copied` | `calculator` | `ResultActions` |
| `result_shared` | `calculator` | `ResultActions` |
| `page_shared` | `calculator`, `method: "share" \| "copy"` | `CalculatorPageActions` |
| `favorite_toggled` | `calculator`, `favorite` (boolean) | `CalculatorPageActions` |

`track(event)` sends to `window.umami?.track` and `window.gtag?.("event", …)`, each wrapped in try/catch so analytics can never break the page.

**Adding an event:** add a variant to `AnalyticsEvent` with only slugs, ids, counts, booleans or small enums. Update the event list on the Privacy pages (`src/app/(en)/privacy/page.tsx` and `src/app/bn/privacy/page.tsx`) if users would describe it differently.

## Preferences (remembered settings)

`src/lib/preferences.ts`, hook `src/lib/use-preference.ts`, key `hisabbd:prefs`.

- Stores which unit, mode, scale or preset a visitor last chose in each calculator, e.g. BMI cm/ft+in and kg/lb, SSC or HSC, CGPA 4 or 5, EMI rate and tenure units, salary period, percentage mode, VAT mode and rate preset, land units and katha size, Bangla date mode.
- **Settings only, never personal values.** A date of birth, grade, price or salary is not a preference.
- Each preference is declared with its allowed values (`choicePreference`, `numberPreference`) as a module-level constant in the widget. Stored values outside the allowed set are ignored.
- The server render uses the fallback; the stored choice applies right after hydration. Reset in a calculator keeps preferences.

## Calculation history ("Your recent calculations")

`src/lib/calculation-history.ts`, hooks `src/lib/use-calculation-history.ts`; UI in `components/calculator/recent-calculations.tsx` (under each calculator) and `components/home/home-recent-calculations.tsx` (homepage).

| | |
| --- | --- |
| Key | `hisabbd:history` |
| Entry | `{ id, slug, at, locale, inputs (raw form values as strings), summary (the result's share text) }` |
| Limits | 5 per calculator, 30 in total, newest first; repeating the same inputs moves the entry to the top |
| Default | **On**. The setting `site/history` in `hisabbd:prefs` turns saving off. |
| Controls | Under each calculator: Use again, remove one entry, clear this calculator's history, a "Save my calculations on this device" checkbox. On `/privacy`: the same checkbox and "Clear everything saved on this device" (`clearAllLocalData`, which removes all four keys). |

- Widgets call `record(inputs, summary)` once per successful Calculate. `<RecentCalculations onRestore={…}>` gives the saved inputs back. The widget validates them like any other input, fills the form and shows the result.
- Read-back is sanitized: malformed or oversized entries are dropped.
- Shared devices: anyone using the same browser sees the history. That is why the controls are always next to it and the privacy page says so plainly.
- Never send history anywhere, never put it in a URL, never track its contents. "Use again" increments `revealKey`, so it counts as a `calculation_completed` (slug only).

## Saved calculators (favourites and recents)

`src/lib/saved-calculators.ts`, hook `src/lib/use-saved-calculators.ts`.

| List | Key | Max | Order |
| --- | --- | --- | --- |
| Recently used | `hisabbd:recent` | 6 | Most recent first, no duplicates |
| Favourites ("Save") | `hisabbd:favorites` | 12 | Insertion order; the oldest is dropped when full |

- Values are a JSON array of slugs. On read, `sanitizeSlugs` keeps only unique strings ≤ 60 chars that match the slug pattern, so tampered or outdated data is ignored.
- If storage is unavailable (private mode, blocked, full), the lists are empty and writes are silently skipped.
- It is an external store for `useSyncExternalStore`: there is an in-memory cache keyed on the raw string, a listener set, and a `storage` event subscription for cross-tab sync. The server snapshot is an empty list.
- `rememberRecent(slug)` is called by `CalculatorProvider`. `toggleFavorite(slug)` is called by the Save button.
- Used by `QuickPicks` on the home page ("Your calculators").

## Embeds

`/embed/<locale>/<slug>` (`src/app/embed/[locale]/`) renders one calculator widget for other websites to put in an `<iframe>`. The snippet is offered under "Add this calculator to your website" on each calculator page (`components/calculator/embed-code.tsx`).

- **No analytics scripts load in embeds** (`RootDocument analytics={false}`), so no cookies are set on other people's sites. `track()` is a no-op there.
- Inputs stay in the iframe, exactly as on the full page.
- Copy/Share in an embed links to the full calculator page (`shareablePath`), never to the embed URL.
- Embeds are `noindex` with a canonical to the full page, and they are excluded from the sitemap.
- Only `/embed/*` may be framed: it sends `Content-Security-Policy: frame-ancestors *` instead of `X-Frame-Options: SAMEORIGIN` (`next.config.ts`).

## Hosting logs

Vercel may log standard request data (IP, user agent, path). The Privacy page says so. The app itself adds no logging.

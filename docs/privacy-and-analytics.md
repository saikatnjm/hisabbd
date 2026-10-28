# Privacy and analytics

Privacy is a product promise, stated on `/privacy` and `/about`. Treat these rules as hard constraints.

## Rules

1. **Calculator inputs and results never leave the browser.** They must not appear in:
   - URLs or query strings (no shareable "result links"),
   - analytics event properties,
   - `localStorage`, `sessionStorage`, cookies or IndexedDB,
   - any network request.
2. **Search text is never sent.** Only the number of results.
3. **Storage holds calculator slugs only.**
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

## Hosting logs

Vercel may log standard request data (IP, user agent, path). The Privacy page says so. The app itself adds no logging.

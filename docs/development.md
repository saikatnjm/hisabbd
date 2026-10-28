# Development, testing and deployment

## Requirements

- **Docker + Docker Compose** (recommended; nothing else is needed on the host), or
- **Node.js ≥ 20.9** (`engines` in `package.json`). The Docker image uses Node 24.

## Running locally (Docker)

```bash
docker compose up --build           # npm install + next dev on http://localhost:3001
HISABBD_PORT=4000 docker compose up # different host port
docker compose down -v              # stop and wipe the node_modules/.next volumes
```

How the container is set up (`docker-compose.yml`, `Dockerfile`):

- Image `node:24-bookworm-slim`, runs as the non-root `node` user, `NEXT_TELEMETRY_DISABLED=1`.
- The repo is bind-mounted at `/app`. `node_modules` and `.next` live in named volumes (`node_modules`, `next_cache`), so they never touch the host.
- `WATCHPACK_POLLING=true` for reliable file watching through the mount.
- The container command is `npm install && npm run dev -- --hostname 0.0.0.0`; port 3000 inside maps to `${HISABBD_PORT:-3001}`.
- `.dockerignore` excludes everything except the Dockerfile (the source arrives through the mount, not the build context).

## Scripts

| Script | Command | Notes |
| --- | --- | --- |
| `dev` | `next dev` | |
| `build` | `next build` | Stop the dev server first: both use `.next` |
| `start` | `next start` | Serve a production build |
| `lint` | `eslint .` | Flat config: next core-web-vitals + typescript |
| `typecheck` | `next typegen && tsc --noEmit` | `typegen` generates route types first |
| `test` | `vitest run` | |
| `check` | lint → typecheck → test → build | **Run before every commit** |
| `e2e` | `playwright test` | Browser smoke tests; run via `docker compose run --rm e2e` (see below) |

With Docker: `docker compose run --rm app npm run <script>`.

## Tests

- Vitest, `environment: "node"`, files `src/**/*.test.ts`, `@` alias configured in `vitest.config.mts`.
- **What is tested:** all calculator logic, `lib` helpers (number, format, plain-date, saved-calculators, structured-data), search ranking, grading scales, featured list, registry integrity, and page-registry completeness.
- **What is not tested:** React components, which have no DOM environment. Keep logic out of components so it stays testable.
- Registry tests read the filesystem (`src/app/(en)/calculators/<slug>/page.tsx`) relative to `process.cwd()`, so run them from the repo root.

Run a single file: `npx vitest run src/calculators/emi/logic.test.ts`.

## Browser smoke tests

Playwright (`@playwright/test`, Chromium only) checks the real production build in a browser. Run it with:

```bash
docker compose run --rm e2e        # npm run e2e in the Playwright image
```

- The `e2e` service uses `mcr.microsoft.com/playwright:v<version>-noble` (browsers and their system libraries preinstalled; the `app` image is non-root and cannot install them). It mounts the repo and the same `node_modules` volume as `app`, runs as uid 1000 with `HOME=/tmp`, and builds into a private tmpfs `.next`, so it is safe to run while `docker compose up` is serving the dev site. It has the `e2e` profile, so `docker compose up` does not start it.
- `playwright.config.ts` runs `npm run build && npx next start -p 3100` as the web server, then the specs in `e2e/` in parallel. The whole run (build included) takes about a minute.
- When upgrading `@playwright/test`, keep it pinned to an exact version and change the image tag in `docker-compose.yml` to match.
- Artefacts (`test-results/`, `playwright-report/`) are git-ignored. Vitest only picks up `src/**/*.test.ts`, so the `e2e/*.spec.ts` files never run under `npm run test`.

**What is covered:**

- `e2e/calculators.spec.ts`: for every calculator in the registry, in English and Bangla: status 200, `<html lang>`, the H1, an empty Calculate shows a field error (`aria-invalid` or an `…-error` message), and one valid set of inputs fills the `aria-live` result announcement.
- `e2e/site.spec.ts`: home search finds "age" / "বয়স"; `/embed/{en,bn}/age-calculator` have no site header or footer, `robots` `noindex, follow` and a `frame-ancestors` CSP, while normal pages send `X-Frame-Options: SAMEORIGIN`; unknown URLs in both locales are 404; `/sitemap.xml` lists every calculator in both locales.

**Adding a calculator:** add an entry for its slug to `CALCULATOR_INPUTS` in `e2e/calculator-inputs.ts` (the test fails for a registry slug without one). Give the submit button text and the minimum required fields, with each label copied from the widget's `STRINGS` in both locales; fields left out keep their defaults. Use `kind: "select"` with the option value for a `<select>`, and `YYYY-MM-DD` for date inputs. Row-based widgets have a visually hidden prefix in the label ("Course 1 Grade").

## Environment variables

All optional. Copy `.env.example` to `.env.local` for local use (`.env*` is git-ignored except the example). On Vercel, set them under Project → Settings → Environment Variables and **redeploy**, because `NEXT_PUBLIC_*` values are inlined at build time.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL. Only needed for a custom domain; a missing scheme becomes `https://` |
| `GOOGLE_SITE_VERIFICATION` | Search Console token |
| `BING_SITE_VERIFICATION` | Bing `msvalidate.01` token |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Enables GA4 (`G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Enables Umami |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Umami script URL (default Umami Cloud) |

`VERCEL_PROJECT_PRODUCTION_URL` is provided by Vercel automatically and used as the URL fallback.

## Deployment

- Vercel builds from source with `next build`. The Docker image is **not** used for deployment.
- The output is entirely static (all routes pre-rendered), with security headers from `next.config.ts`.
- The live site is `https://bd-hisab.vercel.app` (the Vercel production domain, used as the canonical fallback) unless `NEXT_PUBLIC_SITE_URL` is set.
- After deploy, submit `<site>/sitemap.xml` in Search Console and Bing Webmaster Tools.

## Git and commits

- The default branch is `main`.
- Write short imperative commit messages describing the change ("Add VAT calculator", "Fix EMI rounding for 0% rate").
- Don't commit `.env*` files, `.next/` or `node_modules/`.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Build fails with `.next` lock or odd cache errors | Stop `docker compose up` before `npm run build`, or `docker compose down -v` |
| Changes not picked up in dev | Polling is on; if it still fails, restart the container |
| `registry.test.ts` says a route is missing | Create `src/app/(en)/calculators/<slug>/page.tsx` (note the `(en)` group) |
| `page-registry.test.ts` fails | Add the calculator to `calculatorPages` in `src/calculators/page-registry.tsx` |
| Type error on `STRINGS[locale]` | A key exists in `en` but not in `bn` (or the reverse) |
| Hydration mismatch with dates | Read today only via `useToday()`; format dates with `formatPlainDate`, not `toLocaleDateString` |
| Canonical URLs show `localhost` in production | Set `NEXT_PUBLIC_SITE_URL` or deploy on Vercel (which provides the production URL) and redeploy |
| GA not loading | The ID must match `G-[A-Z0-9]+`; redeploy after setting it |

## Repository oddities

- `hisabbd-bangla-i18n.patch` (about 460 KB) is a `git format-patch` export of the "Add full Bangla (bn) version" commit, committed at the root. Nothing reads it. Leave it alone unless asked to remove it.
- `src/calculators/upcoming.ts` only affects the UI when the registry is empty.
- Some comments still mention the pre-i18n route path `src/app/calculators/<slug>`. The current path is `src/app/(en)/calculators/<slug>`.

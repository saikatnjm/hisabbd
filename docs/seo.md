# SEO

All SEO output is derived from the registry and `siteConfig`, so it always matches what the page shows.

> **Standing rule:** every page must be an SEO landing page for a real Bangladesh search that expresses HisabBD's core identity. The checklist is in [`../AGENTS.md`](../AGENTS.md) → "SEO and landing-page criteria" (hard rule 10). This file covers the mechanics.
>
> `src/calculators/seo-criteria.test.ts` checks it automatically for every calculator and guide:
> - titles of 20–60 characters, without the site name;
> - descriptions of 100–165 characters (English) or 90–175 (Bangla);
> - a Bangla title on Bangla pages, and no duplicate titles;
> - at least 5 keywords, including 2 in Bangla;
> - at least 5 FAQs, the same number in each language;
> - at least 2 inbound links, from other calculators' related lists or from guides.

## Page metadata

`src/calculators/metadata.ts`:

- `pageMetadata({ title, description, path, locale, image })` is used by every non-home page. `path` is the **English** path; both locale URLs are derived from it. It returns:
  - `title`: the root/bn layout template appends `| HisabBD`.
  - `alternates.canonical`: `localePath(locale, path)`.
  - `alternates.languages`: `{ "en-BD": en path, "bn-BD": bn path, "x-default": en path }`.
  - `openGraph`: type website, siteName, `locale` / `alternateLocale` (`en_BD` / `bn_BD`), url, full title, description, and `image` (the page's own social preview) or else the shared `OG_IMAGE`.
  - `twitter`: `summary_large_image`.
- `calculatorMetadata(calc, locale)` is `pageMetadata` with `calc.seo` or `calc.seoBn`, `calculatorPath(calc.slug)` and `calculatorOgImage(calc, locale)`.
- `OG_IMAGE` is `/og.png`, 1200×630: the fallback for pages without their own image (about, privacy, categories, the indexes).

Home pages (`src/app/(en)/page.tsx`, `src/app/bn/page.tsx`) set their metadata by hand with the same shape, using `homeOgImage(locale)`. Guide routes pass `guideOgImage(guide, locale)` to `pageMetadata`.

## Social preview images

Facebook and WhatsApp are the main sharing channels in Bangladesh, so every calculator, guide and the home page has its own 1200×630 preview card in each language:

| Page | File (`public/…`) | Helper in `metadata.ts` |
| --- | --- | --- |
| Calculator | `og/<slug>.<locale>.png` | `calculatorOgImage(calc, locale)` |
| Guide | `og/guides/<slug>.<locale>.png` | `guideOgImage(guide, locale)` |
| Home | `og/home.<locale>.png` | `homeOgImage(locale)` |

Each card shows the HisabBD wordmark, a "Free · No signup" / "ফ্রি · সাইনআপ ছাড়া" badge, the calculator's icon on its category colours (a guide uses its calculator's icon), the category or "Guide" label, the title (`nameBn` / `titleBn` on Bangla cards), the one-line summary and the domain. PNGs are about 50–100 KB.

**How they are made.** `scripts/og/og-images.spec.ts` is a Playwright "spec" run by its own config (`playwright.og.config.ts`), not part of the smoke suite. For every page in the calculator and guide registries it builds an HTML card, loads Anek Bangla from Google Fonts, waits until the font (including its Bengali subset) has loaded, shrinks long titles to fit, and screenshots it to the path the helper above returns. Icon paths, category colours and brand colours are read from `components/ui/icons.tsx`, `components/calculator/calculator-icon.tsx` and `app/globals.css`, so a new icon needs no change in the script. The footer domain is `NEXT_PUBLIC_SITE_URL`'s hostname when set, otherwise `bd-hisab.vercel.app`.

**Regenerate** after adding a calculator or guide, or changing a name, title or summary, then commit `public/og/`:

```bash
docker compose run --rm e2e npm run og
```

It needs network access (Google Fonts) and fails rather than screenshot a fallback font. `src/calculators/og-images.test.ts` (part of `npm run test`) fails if any registered page is missing its image. Images of removed pages are not deleted automatically.

**Why not `next/og`?** Its renderer (Satori) doesn't shape Bengali conjuncts (যুক্তাক্ষর such as ক্ষ or ন্ত) correctly, and the Bangla cards matter most. A real browser shapes them correctly, and static files cost nothing at runtime (hard rule 8).

Root defaults (`rootMetadata(locale)` in `src/components/layout/root-document.tsx`, used by both root layouts): `metadataBase = siteConfig.url`, title template `%s | HisabBD`, default title `HisabBD — <tagline in that language>`, `formatDetection` off (so numbers don't become phone links on iOS), verification tags, and `themeColor #006a4e`. The server HTML has `<html lang="en">` on English pages and `<html lang="bn">` on `/bn` pages.

### Writing titles and descriptions

- `seo.title`: "<Name>: <main benefit>", for example `Discount Calculator: Final Price and Savings in ৳`. Don't add the site name.
- `seo.description`: about 150 characters, saying what you enter and what you get, with Bangladesh/Taka context where relevant.
- Category pages: `"<Category> Calculators"` / `"<nameBn> বিভাগের ক্যালকুলেটর"`.

## Sitemap and robots

`src/app/sitemap.ts` emits one entry **per locale** for `/`, `/calculators`, `/guides`, `/about`, `/privacy`, `/terms`, every `/categories/<id>`, every `/calculators/<slug>` and every `/guides/<slug>` (`lastModified = updatedOn ?? publishedOn`). Each entry carries `alternates.languages` (en-BD, bn-BD, x-default). Calculator entries use `lastModified = updatedOn ?? addedOn`. Set `updatedOn` in meta whenever a calculator's rules or figures are re-checked; it also shows as "Rules last reviewed: <date>" on the page.

`src/app/manifest.ts` serves `/manifest.webmanifest` (name, theme colour, icon) so the site can be added to a phone's home screen.

`src/app/robots.ts`: `allow: /` for all user agents, plus `sitemap: <siteUrl>/sitemap.xml`.

The 404 page is `noindex`.

## Structured data (JSON-LD)

Builders in `src/lib/seo/structured-data.ts`, rendered by `components/seo/json-ld.tsx` as one `@graph`. `serializeJsonLd` escapes `<` so the content can't close the script tag.

| Schema | Where | Built from |
| --- | --- | --- |
| `Organization` | Home | `siteConfig` (name, url, logo `/icon.svg`); `@id` `<site>/#organization` |
| `WebSite` | Home | `siteConfig`, locale; `publisher` → the Organization `@id` |
| `WebApplication` | Each calculator page | meta (localized name/description), `applicationCategory: UtilitiesApplication`, free `Offer` in BDT, `inLanguage` |
| `BreadcrumbList` | Calculator pages, category pages, `/calculators` index | Localized trail, e.g. Home › Calculators › Name |
| `FAQPage` | Calculator pages with FAQs | `faqs` or `faqsBn`, matching what is visible on the page |
| `Article` | Guide pages (`/guides/<slug>`) | guide meta: localized headline/description, `datePublished`, `dateModified`, author and publisher → Organization `@id` (the Organization is included in the same graph) |

Rule: only mark up what is visible. FAQ schema uses the same list the page renders in that language.

## Search engine verification

Set via env vars (token value only, not the whole meta tag):

- `GOOGLE_SITE_VERIFICATION` → `<meta name="google-site-verification">`
- `BING_SITE_VERIFICATION` → `<meta name="msvalidate.01">`

Both are omitted when unset.

## Canonical base URL

`siteConfig.url` resolves `NEXT_PUBLIC_SITE_URL` (a scheme is added if missing; trailing slashes removed), then Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:3000`. Set `NEXT_PUBLIC_SITE_URL` only for a custom domain, and redeploy after changing it.

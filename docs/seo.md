# SEO

All SEO output is derived from the registry and `siteConfig`, so it always matches what the page shows.

## Page metadata

`src/calculators/metadata.ts`:

- `pageMetadata({ title, description, path, locale })` is used by every non-home page. `path` is the **English** path; both locale URLs are derived from it. It returns:
  - `title`: the root/bn layout template appends `| HisabBD`.
  - `alternates.canonical`: `localePath(locale, path)`.
  - `alternates.languages`: `{ "en-BD": en path, "bn-BD": bn path, "x-default": en path }`.
  - `openGraph`: type website, siteName, `locale` / `alternateLocale` (`en_BD` / `bn_BD`), url, full title, description, `OG_IMAGE`.
  - `twitter`: `summary_large_image`.
- `calculatorMetadata(calc, locale)` is `pageMetadata` with `calc.seo` or `calc.seoBn` and `calculatorPath(calc.slug)`.
- `OG_IMAGE` is `/og.png`, 1200×630, shared by every page.

Home pages (`src/app/(en)/page.tsx`, `src/app/bn/page.tsx`) set their metadata by hand with the same shape.

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

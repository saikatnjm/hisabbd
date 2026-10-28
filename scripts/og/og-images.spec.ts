import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { categories } from "@/calculators/categories";
import { calculatorOgImage, guideOgImage, homeOgImage, OG_IMAGE_SIZE } from "@/calculators/metadata";
import { calculators } from "@/calculators/registry";
import type { CalculatorIconName, CategoryId } from "@/calculators/types";
import { siteConfig } from "@/config/site";
import { guides } from "@/guides/registry";
import { LOCALES, type Locale } from "@/i18n/locales";

/**
 * Generates the per-page social preview images in public/og/ (see
 * playwright.og.config.ts). Run: `docker compose run --rm e2e npm run og`.
 *
 * Output paths come from calculatorOgImage / guideOgImage / homeOgImage in
 * src/calculators/metadata.ts, so the files always match the URLs in the page
 * metadata. Icons, category colours and brand colours are read from the
 * site's own source (icons.tsx, calculator-icon.tsx, globals.css) rather than
 * copied, so a new calculator with a new icon needs no change here.
 */

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

/** Hostname shown in the footer: NEXT_PUBLIC_SITE_URL when set, else the production domain. */
const DOMAIN = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!explicit) return "bd-hisab.vercel.app";
  return new URL(/^https?:\/\//i.test(explicit) ? explicit : `https://${explicit}`).hostname;
})();

const FONT_HREF = "https://fonts.googleapis.com/css2?family=Anek+Bangla:wdth,wght@75..125,100..800&display=block";

// ---------------------------------------------------------------------------
// Read colours and icon paths from the site source.

const css = readFileSync(path.join(ROOT, "src/app/globals.css"), "utf8");

function cssColor(name: string): string {
  const match = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`).exec(css);
  if (!match?.[1]) throw new Error(`Colour token --color-${name} not found in src/app/globals.css`);
  return match[1];
}

const BRAND = {
  50: cssColor("brand-50"),
  100: cssColor("brand-100"),
  200: cssColor("brand-200"),
  600: cssColor("brand-600"),
  700: cssColor("brand-700"),
  coral: cssColor("coral-500"),
};

function categoryColors(id: CategoryId) {
  return { soft: cssColor(`${id}-soft`), ink: cssColor(`${id}-ink`) };
}

/** Component name → inner SVG markup, from src/components/ui/icons.tsx. */
const iconMarkup = (() => {
  const source = readFileSync(path.join(ROOT, "src/components/ui/icons.tsx"), "utf8");
  const map = new Map<string, string>();
  const pattern = /export const (\w+) = \(p: IconProps\) => \(\s*<Icon \{\.\.\.p\}>([\s\S]*?)<\/Icon>/g;
  for (const [, name, body] of source.matchAll(pattern)) {
    if (!name || body === undefined) continue;
    if (body.includes("{")) throw new Error(`${name} in icons.tsx uses a JSX expression; the OG generator only copies plain SVG`);
    // JSX camelCase attributes (strokeWidth) → SVG kebab-case (stroke-width).
    map.set(name, body.trim().replace(/\s([a-z]+[A-Z][\w]*)=/g, (_, attr: string) => ` ${attr.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}=`));
  }
  return map;
})();

/** Calculator icon key → component name, from the map in calculator-icon.tsx. */
const iconComponents = (() => {
  const source = readFileSync(path.join(ROOT, "src/components/calculator/calculator-icon.tsx"), "utf8");
  const block = /const icons\b[^\n]*= \{\n([\s\S]*?)\n\};/.exec(source)?.[1];
  if (!block) throw new Error("Icon map not found in src/components/calculator/calculator-icon.tsx");
  const map = new Map<string, string>();
  for (const [, key, component] of block.matchAll(/"?([\w-]+)"?\s*:\s*(\w+)/g)) {
    if (key && component) map.set(key, component);
  }
  return map;
})();

function iconSvg(icon: CalculatorIconName, size: number): string {
  const component = iconComponents.get(icon);
  const body = component ? iconMarkup.get(component) : undefined;
  if (!body) throw new Error(`No SVG found for calculator icon "${icon}" (check calculator-icon.tsx and icons.tsx)`);
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const LOGO_MARK = (size: number) =>
  `<svg viewBox="0 0 32 32" width="${size}" height="${size}"><rect width="32" height="32" rx="8" fill="${BRAND[600]}"/><rect x="7" y="14.25" width="18" height="3.5" rx="1.75" fill="#fff"/><circle cx="16" cy="8.5" r="3" fill="${BRAND.coral}"/><circle cx="16" cy="23.5" r="3" fill="#fff"/></svg>`;

const CHECK = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>`;

// ---------------------------------------------------------------------------
// Template

interface Card {
  locale: Locale;
  /** Small label above the title (category or "Guide"); omitted on home. */
  kicker?: string;
  title: string;
  summary: string;
  /** Icon tile: a calculator icon on its category colours, or the logo mark. */
  tile: { icon: CalculatorIconName; category: CategoryId } | "logo";
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderHtml(card: Card): string {
  const bn = card.locale === "bn";
  const tileHtml =
    card.tile === "logo"
      ? `<div class="tile logo">${LOGO_MARK(176)}</div>`
      : (() => {
          const { soft, ink } = categoryColors(card.tile.category);
          return `<div class="tile" style="background:${soft};color:${ink}">${iconSvg(card.tile.icon, 112)}</div>`;
        })();
  const kickerColor = card.tile === "logo" ? BRAND[700] : categoryColors(card.tile.category).ink;

  return `<!doctype html>
<html lang="${card.locale}">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_HREF}">
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${OG_IMAGE_SIZE.width}px; height: ${OG_IMAGE_SIZE.height}px; overflow: hidden; }
  body {
    font-family: "Anek Bangla", sans-serif;
    color: #0f172a;
    background-color: #f6fbf8;
    background-image:
      linear-gradient(to right, rgb(0 106 78 / 0.07) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(0 106 78 / 0.07) 1px, transparent 1px);
    background-size: 28px 28px;
    display: flex;
    flex-direction: column;
  }
  header { display: flex; align-items: center; justify-content: space-between; padding: 44px 64px 0; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 42px; font-weight: 700; font-variation-settings: "wdth" 110; letter-spacing: -0.01em; }
  .brand b { color: ${BRAND[600]}; font-weight: 700; }
  .badge {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 22px 10px 16px; border-radius: 999px;
    background: #fff; border: 2px solid ${BRAND[200]}; color: ${BRAND[700]};
    font-size: 26px; font-weight: 600; line-height: 1.2;
  }
  main { flex: 1; display: flex; align-items: center; gap: 48px; padding: 0 64px; min-height: 0; }
  .tile {
    flex: none; width: 200px; height: 200px; border-radius: 48px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: inset 0 -8px 0 0 rgb(15 23 42 / 0.06);
  }
  .tile.logo { box-shadow: none; }
  .text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 14px; }
  .kicker { font-size: 28px; font-weight: 600; color: ${kickerColor}; line-height: 1.2; }
  h1 {
    font-size: 76px; font-weight: 700; line-height: ${bn ? 1.28 : 1.08};
    font-variation-settings: "wdth" ${bn ? 100 : 108}; letter-spacing: ${bn ? "0" : "-0.015em"};
    overflow-wrap: anywhere;
  }
  .summary {
    font-size: 31px; font-weight: 400; line-height: ${bn ? 1.5 : 1.35}; color: #334155;
    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;
  }
  footer {
    flex: none; height: 76px; padding: 0 64px; display: flex; align-items: center; justify-content: space-between;
    background: ${BRAND[600]}; color: #fff; font-size: 28px; font-weight: 600;
  }
  footer .langs { color: ${BRAND[100]}; font-weight: 500; }
</style>
</head>
<body>
  <header>
    <div class="brand">${LOGO_MARK(56)}<span>Hisab<b>BD</b></span></div>
    <div class="badge">${CHECK}<span>${bn ? "ফ্রি · সাইনআপ ছাড়া" : "Free · No signup"}</span></div>
  </header>
  <main>
    ${tileHtml}
    <div class="text">
      ${card.kicker ? `<p class="kicker">${escapeHtml(card.kicker)}</p>` : ""}
      <h1>${escapeHtml(card.title)}</h1>
      <p class="summary">${escapeHtml(card.summary)}</p>
    </div>
  </main>
  <footer><span>${escapeHtml(DOMAIN)}</span><span class="langs">${bn ? "বাংলা · English" : "English · বাংলা"}</span></footer>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// One test per image

interface Job {
  name: string;
  /** Site URL of the image, e.g. "/og/age-calculator.bn.png". */
  url: string;
  card: Card;
}

const category = (id: CategoryId) => {
  const found = categories.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown category "${id}"`);
  return found;
};

const jobs: Job[] = [];
for (const locale of LOCALES) {
  const bn = locale === "bn";
  jobs.push({
    name: `home (${locale})`,
    url: homeOgImage(locale).url,
    card: {
      locale,
      title: bn ? siteConfig.taglineBn : siteConfig.tagline,
      summary: bn
        ? "বয়স, জিপিএ, ইএমআই, বেতন, জমি, ভ্যাট আর আরও অনেক হিসাব। বাংলা ও ইংরেজিতে, আপনার ফোনেই।"
        : "Age, GPA, EMI, salary, land, VAT and more. In Bangla and English, right on your phone.",
      tile: "logo",
    },
  });
  for (const calc of calculators) {
    jobs.push({
      name: `${calc.slug} (${locale})`,
      url: calculatorOgImage(calc, locale).url,
      card: {
        locale,
        kicker: bn ? category(calc.category).nameBn : category(calc.category).name,
        title: bn ? calc.nameBn : calc.name,
        summary: bn ? calc.summaryBn : calc.summary,
        tile: { icon: calc.icon, category: calc.category },
      },
    });
  }
  for (const guide of guides) {
    const calc = calculators.find((c) => c.slug === guide.calculator);
    jobs.push({
      name: `guide ${guide.slug} (${locale})`,
      url: guideOgImage(guide, locale).url,
      card: {
        locale,
        kicker: bn ? "গাইড" : "Guide",
        title: bn ? guide.titleBn : guide.title,
        summary: bn ? guide.summaryBn : guide.summary,
        tile: calc ? { icon: calc.icon, category: calc.category } : "logo",
      },
    });
  }
}

for (const job of jobs) {
  test(job.name, async ({ page }) => {
    await page.setContent(renderHtml(job.card), { waitUntil: "load" });

    // Load the faces the text needs (Latin and, on bn, Bengali subsets), then
    // fail rather than silently screenshot a fallback font.
    const fontState = await page.evaluate(async () => {
      const text = document.body.innerText;
      await Promise.all(["400", "500", "600", "700"].map((w) => document.fonts.load(`${w} 40px "Anek Bangla"`, text)));
      await document.fonts.ready;
      const loaded = [...document.fonts].filter((f) => f.family.replace(/"/g, "") === "Anek Bangla" && f.status === "loaded");
      // unicodeRange is e.g. "U+951-952, U+980-9fe, …"; look for "অ" (U+0985).
      const covers = (range: string, code: number) =>
        range.split(",").some((part) => {
          const [from, to = from] = part.trim().replace(/^U\+/i, "").split("-");
          return parseInt(from ?? "", 16) <= code && code <= parseInt(to ?? "", 16);
        });
      return { any: loaded.length > 0, bengali: loaded.some((f) => covers(f.unicodeRange, 0x0985)) };
    });
    expect(fontState.any, "Anek Bangla did not load from Google Fonts (is the network reachable?)").toBe(true);
    if (job.card.locale === "bn") expect(fontState.bengali, "Anek Bangla's Bengali subset did not load").toBe(true);

    // Shrink the title until it fits in at most 3 lines (2 for short pages) and
    // the text column fits the space between header and footer.
    await page.evaluate(() => {
      const h1 = document.querySelector("h1")!;
      const main = document.querySelector("main")!;
      const text = document.querySelector<HTMLElement>(".text")!;
      const lines = () => Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
      let size = 76;
      while (size > 44 && (lines() > 3 || text.scrollHeight > main.clientHeight - 24 || h1.scrollWidth > h1.clientWidth)) {
        size -= 2;
        h1.style.fontSize = `${size}px`;
      }
      // Long titles leave less room: keep the summary to two lines.
      if (lines() >= 3) document.querySelector<HTMLElement>(".summary")!.style.webkitLineClamp = "2";
    });

    const overflow = await page.evaluate(() => {
      const main = document.querySelector("main")!;
      const text = document.querySelector<HTMLElement>(".text")!;
      return text.scrollHeight > main.clientHeight;
    });
    expect(overflow, "Text does not fit the card").toBe(false);

    const file = path.join(PUBLIC_DIR, job.url);
    mkdirSync(path.dirname(file), { recursive: true });
    await page.screenshot({ path: file, type: "png" });
  });
}

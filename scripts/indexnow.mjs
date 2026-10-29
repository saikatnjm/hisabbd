/*
 * Tells IndexNow search engines (Bing, Yandex, Seznam, Naver…) which pages
 * changed, so they recrawl within hours instead of weeks. Bing's index also
 * feeds ChatGPT search, Copilot and DuckDuckGo.
 *
 * Run after a production deploy (.github/workflows/indexnow.yml does this):
 *
 *   node scripts/indexnow.mjs [--site https://…] [--days 7] [--all] [--dry-run]
 *
 * 1. The key is the name of the one `public/<32 hex>.txt` file, whose content
 *    is the key itself. The live copy must match, or engines reject the ping.
 * 2. Pages come from the live sitemap: those whose lastModified is within
 *    `--days` (default 7), plus the hubs that list them. `--all` sends every
 *    URL (for the first submission).
 * 3. Only page URLs are sent. No user data exists to send (AGENTS.md rule 1).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const DEFAULT_SITE = "https://bd-hisab.vercel.app";
/** Pages without a lastModified that change whenever a calculator or guide is added. */
const HUB_PATHS = ["/", "/bn", "/calculators", "/bn/calculators", "/guides", "/bn/guides"];

const { values: args } = parseArgs({
  options: {
    site: { type: "string" },
    days: { type: "string", default: "7" },
    all: { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
  },
});

const site = (args.site || process.env.SITE_URL || DEFAULT_SITE).replace(/\/+$/, "");
const days = Number(args.days);
if (!Number.isInteger(days) || days < 0) fail(`--days must be a whole number, got "${args.days}"`);

function fail(message) {
  console.error(`indexnow: ${message}`);
  process.exit(1);
}

/** The key, from the single public/<key>.txt file. */
function readKey() {
  const publicDir = fileURLToPath(new URL("../public", import.meta.url));
  const files = readdirSync(publicDir).filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));
  if (files.length !== 1) fail(`expected one public/<32 hex>.txt key file, found ${files.length}`);
  const key = files[0].slice(0, -".txt".length);
  if (readFileSync(join(publicDir, files[0]), "utf8").trim() !== key) fail(`${files[0]} must contain its own key`);
  return key;
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "hisabbd-indexnow" } });
  return response.ok ? response.text() : null;
}

/** `{ loc, lastmod }` for every <url> in the sitemap. */
function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => ({
    loc: /<loc>(.*?)<\/loc>/.exec(entry)?.[1]?.trim(),
    lastmod: /<lastmod>(.*?)<\/lastmod>/.exec(entry)?.[1]?.trim(),
  }));
}

const key = readKey();
const keyLocation = `${site}/${key}.txt`;
if ((await fetchText(keyLocation))?.trim() !== key) {
  const message = `${keyLocation} does not serve the key; deploy it first`;
  if (!args["dry-run"]) fail(message);
  console.warn(`indexnow: ${message} (ignored for --dry-run)`);
}

const sitemap = await fetchText(`${site}/sitemap.xml`);
if (sitemap === null) fail(`could not fetch ${site}/sitemap.xml`);
const entries = parseSitemap(sitemap);
const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const hubs = new Set(HUB_PATHS.map((path) => (path === "/" ? site : `${site}${path}`)));
const changed = entries.filter((e) => e.lastmod && e.lastmod.slice(0, 10) >= since).map((e) => e.loc);
const urlList = args.all
  ? entries.map((e) => e.loc).filter(Boolean)
  : changed.length > 0
    ? [...new Set([...changed, ...entries.map((e) => e.loc).filter((loc) => hubs.has(loc))])]
    : [];

if (urlList.length === 0) {
  console.log(`indexnow: nothing changed since ${since}; not pinging`);
  process.exit(0);
}

console.log(`indexnow: ${urlList.length} URL(s) for ${site}${args.all ? " (all)" : ` (changed since ${since})`}`);
for (const url of urlList) console.log(`  ${url}`);
if (args["dry-run"]) process.exit(0);

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation, urlList }),
});
// 200 = accepted, 202 = accepted while the key is still being checked.
if (response.status !== 200 && response.status !== 202) {
  fail(`POST ${ENDPOINT} returned ${response.status}: ${await response.text()}`);
}
console.log(`indexnow: submitted (${response.status})`);

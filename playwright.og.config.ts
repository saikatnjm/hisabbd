import { defineConfig } from "@playwright/test";

/**
 * Social preview (Open Graph) image generator, not a test suite: renders one
 * 1200×630 PNG per calculator, guide and home page in each locale into
 * public/og/. Run with `docker compose run --rm e2e npm run og` (Chromium is
 * preinstalled in the Playwright image) and commit the PNGs.
 * See docs/seo.md → "Social preview images".
 *
 * Real Chromium (not next/og) because Satori can't shape Bengali conjuncts.
 * No web server: each image is an HTML template passed to page.setContent.
 */
export default defineConfig({
  testDir: "scripts/og",
  fullyParallel: true,
  reporter: "list",
  timeout: 60_000,
  use: {
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});

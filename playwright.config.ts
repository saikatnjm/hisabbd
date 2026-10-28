import { defineConfig, devices } from "@playwright/test";

/**
 * Browser smoke tests (e2e/*.spec.ts). Run with `docker compose run --rm e2e`,
 * which uses the Playwright image (Chromium preinstalled). See docs/development.md.
 *
 * The web server is a real production build served by `next start`, so the
 * tests see the same static pages, headers and 404s as the deployed site.
 */
const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // A cold `next build` takes a minute or two inside Docker.
    timeout: 300_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});

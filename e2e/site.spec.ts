import { expect, test } from "@playwright/test";
import { calculatorPath, embedPath } from "@/calculators/paths";
import { calculators, getCalculator } from "@/calculators/registry";
import { GUIDES_PATH, guidePath, guides } from "@/guides/registry";
import { localePath, LOCALES } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

const age = getCalculator("age-calculator");

test.describe("home search", () => {
  const queries = { en: "age", bn: "বয়স" } as const;

  for (const locale of LOCALES) {
    test(`finds the age calculator (${locale})`, async ({ page }) => {
      const response = await page.goto(localePath(locale, "/"));
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);

      const search = page.getByRole("combobox", { name: ui[locale].search.label });
      const suggestion = page
        .getByRole("listbox", { name: ui[locale].search.suggestionsLabel })
        .getByRole("option")
        .filter({ hasText: locale === "bn" ? age?.nameBn : age?.name });
      // Typing before hydration doesn't reach React, so retry until the list shows.
      await expect(async () => {
        await search.fill("");
        await search.fill(queries[locale]);
        await expect(suggestion.first()).toBeVisible({ timeout: 1_000 });
      }).toPass({ timeout: 15_000 });
    });
  }
});

test.describe("embeds", () => {
  for (const locale of LOCALES) {
    test(`age calculator embed (${locale})`, async ({ page }) => {
      const response = await page.goto(embedPath(locale, "age-calculator"));
      expect(response?.status()).toBe(200);
      expect(response?.headers()["content-security-policy"]).toContain("frame-ancestors");
      expect(response?.headers()["x-frame-options"]).toBeUndefined();

      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
      // Widget only: no site header or footer.
      await expect(page.locator("header")).toHaveCount(0);
      await expect(page.locator("footer")).toHaveCount(0);
      await expect(page.locator("form")).toHaveCount(1);
    });
  }

  test("normal pages forbid framing by other sites", async ({ request }) => {
    for (const path of ["/", "/bn", calculatorPath("age-calculator")]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["x-frame-options"], path).toBe("SAMEORIGIN");
    }
  });
});

test.describe("guides", () => {
  for (const locale of LOCALES) {
    test(`hub and every guide render and link to their calculator (${locale})`, async ({ page }) => {
      const hub = await page.goto(localePath(locale, GUIDES_PATH));
      expect(hub?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1, name: ui[locale].guides.hubTitle })).toBeVisible();

      for (const guide of guides) {
        const path = localePath(locale, guidePath(guide.slug));
        const response = await page.goto(path);
        expect(response?.status(), path).toBe(200);
        await expect(page.getByRole("heading", { level: 1, name: locale === "bn" ? guide.titleBn : guide.title })).toBeVisible();
        await expect(page.getByRole("region", { name: ui[locale].guides.shortAnswer, exact: true })).toContainText(
          locale === "bn" ? guide.answerBn : guide.answer,
        );
        const calculatorHref = localePath(locale, calculatorPath(guide.calculator));
        expect(await page.locator(`main a[href="${calculatorHref}"]`).count(), path).toBeGreaterThanOrEqual(2);
        // JSON-LD isn't rendered text, so check the HTML itself.
        expect(await page.content(), path).toContain('"@type":"Article"');
      }
    });
  }
});

test.describe("not found", () => {
  for (const path of ["/definitely-not-a-page", "/bn/definitely-not-a-page"]) {
    test(`${path} is a 404`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
    });
  }
});

test("sitemap lists every calculator and guide in both locales", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1] ?? "").pathname);

  for (const calc of calculators) {
    for (const locale of LOCALES) {
      expect(paths, `${locale} ${calc.slug}`).toContain(localePath(locale, calculatorPath(calc.slug)));
    }
  }
  for (const guide of guides) {
    for (const locale of LOCALES) {
      expect(paths, `${locale} ${guide.slug}`).toContain(localePath(locale, guidePath(guide.slug)));
    }
  }
  expect(paths.some((p) => p.startsWith("/embed/")), "embeds stay out of the sitemap").toBe(false);
});

test("llms.txt is served as plain text and lists the guides", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  const text = await response.text();
  expect(text.startsWith("# HisabBD")).toBe(true);
  for (const guide of guides) expect(text, guide.slug).toContain(guidePath(guide.slug));
});

import { expect, test } from "@playwright/test";
import { calculatorPath } from "@/calculators/paths";
import { localePath, LOCALES } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

const SUBMIT = { en: "Calculate discount", bn: "ডিসকাউন্ট হিসাব করুন" } as const;
const PRICE = { en: "Original price", bn: "আসল দাম" } as const;
const DISCOUNT = { en: "Discount", bn: "ডিসকাউন্ট" } as const;

for (const locale of LOCALES) {
  test(`result can be saved as an image and printed (${locale})`, async ({ page }) => {
    const t = ui[locale].actions;
    await page.goto(localePath(locale, calculatorPath("discount-calculator")));
    const announcement = page.locator('p[aria-live="polite"]');
    await expect(async () => {
      await page.getByLabel(PRICE[locale], { exact: true }).fill("2500");
      await page.getByLabel(DISCOUNT[locale], { exact: true }).fill("20");
      await page.getByRole("button", { name: SUBMIT[locale], exact: true }).click();
      await expect(announcement).not.toHaveText("", { timeout: 1_000 });
    }).toPass({ timeout: 15_000 });

    // Desktop Chromium can't share files, so the card is downloaded instead.
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: t.shareImage }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("hisabbd-discount-calculator.png");
    const path = await download.path();
    const { readFileSync } = await import("node:fs");
    const bytes = readFileSync(path);
    expect(bytes.subarray(1, 4).toString()).toBe("PNG");
    expect(bytes.length).toBeGreaterThan(20_000);
    await expect(page.getByRole("status").filter({ hasText: t.imageSaved })).toBeVisible();

    await expect(page.getByRole("button", { name: t.print })).toBeVisible();
  });
}

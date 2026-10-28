import { expect, test, type Page } from "@playwright/test";
import { calculatorPath } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { localePath, LOCALES } from "@/i18n/locales";
import { CALCULATOR_INPUTS } from "./calculator-inputs";

/**
 * Submits the form until the widget reacts. A click that lands before React
 * hydrates does a native (empty) form submit and reloads the page, so retry.
 * `prepare` runs before each attempt (e.g. clearing pre-filled fields).
 */
async function submitUntil(page: Page, submit: string, check: () => Promise<void>, prepare?: () => Promise<void>) {
  await expect(async () => {
    await prepare?.();
    await page.getByRole("button", { name: submit, exact: true }).click();
    await check();
  }).toPass({ timeout: 15_000, intervals: [250, 500, 1_000] });
}

for (const calc of calculators) {
  for (const locale of LOCALES) {
    test(`${calc.slug} (${locale})`, async ({ page }) => {
      const inputs = CALCULATOR_INPUTS[calc.slug];
      expect(inputs, `Add "${calc.slug}" to e2e/calculator-inputs.ts`).toBeDefined();
      if (!inputs) return;

      const response = await page.goto(localePath(locale, calculatorPath(calc.slug)));
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale === "bn" ? calc.nameBn : calc.name);

      // The result area's live region: empty until a successful Calculate.
      const announcement = page.locator('p[aria-live="polite"]');
      await expect(announcement).toHaveText("");

      // Empty form: at least one field error (aria-invalid, or a list-level error message).
      // Fields some widgets pre-fill (e.g. today's date) are cleared first.
      const fieldErrors = page.locator('form [aria-invalid="true"], form [id$="-error"]');
      await expect(fieldErrors).toHaveCount(0);
      const clearFields = async () => {
        for (const field of inputs.fields) {
          if (field.kind !== "select") await page.getByLabel(field.label[locale], { exact: true }).fill("");
        }
      };
      await submitUntil(
        page,
        inputs.submit[locale],
        () => expect(fieldErrors.first()).toBeVisible({ timeout: 1_000 }),
        clearFields,
      );

      for (const field of inputs.fields) {
        const control = page.getByLabel(field.label[locale], { exact: true });
        if (field.kind === "select") await control.selectOption(field.value);
        else await control.fill(field.value);
      }
      await page.getByRole("button", { name: inputs.submit[locale], exact: true }).click();

      await expect(announcement).not.toHaveText("");
      await expect(page.locator('form [aria-invalid="true"]')).toHaveCount(0);
    });
  }
}

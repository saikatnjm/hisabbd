import { expect, test, type Page } from "@playwright/test";
import { calculatorPath } from "@/calculators/paths";
import { ui } from "@/i18n/ui";

const t = ui.en.history;
const age = calculatorPath("age-calculator");

/** Calculates an age, retrying the click in case it lands before hydration. */
async function calculateAge(page: Page, dateOfBirth: string) {
  const announcement = page.locator('p[aria-live="polite"]');
  await page.getByLabel("Date of birth", { exact: true }).fill(dateOfBirth);
  await expect(async () => {
    await page.getByRole("button", { name: "Calculate age", exact: true }).click();
    await expect(announcement).not.toHaveText("", { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
}

test("a chosen unit is remembered after a reload", async ({ page }) => {
  await page.goto(calculatorPath("bmi-calculator"));
  const ftin = page.getByRole("radio", { name: "ft + in" });
  await expect(async () => {
    await page.getByText("ft + in", { exact: true }).click();
    await expect(ftin).toBeChecked({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await page.reload();
  await expect(ftin).toBeChecked();
  await expect(page.getByLabel("Feet", { exact: true })).toBeVisible();
});

test("recent calculations: saved, used again, shown on the homepage, cleared", async ({ page }) => {
  await page.goto(age);
  await calculateAge(page, "1995-06-15");

  await page.reload();
  const recent = page.getByRole("region", { name: t.title });
  await expect(recent).toBeVisible();
  await expect(recent.getByRole("listitem")).toHaveCount(1);

  // Use again refills the form and shows the result straight away.
  await recent.getByRole("button", { name: t.useAgain }).click();
  await expect(page.getByLabel("Date of birth", { exact: true })).toHaveValue("1995-06-15");
  await expect(page.locator('p[aria-live="polite"]')).not.toHaveText("");

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: t.homeTitle })).toBeVisible();

  await page.goto("/privacy");
  await page.getByRole("button", { name: t.clearAll }).click();
  await expect(page.getByRole("status").filter({ hasText: t.clearedAll })).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: t.homeTitle })).toHaveCount(0);
});

test("turning saving off stops new calculations being remembered", async ({ page }) => {
  await page.goto("/privacy");
  const toggle = page.getByRole("checkbox", { name: t.saveToggle });
  await expect(async () => {
    await toggle.uncheck();
    await expect(toggle).not.toBeChecked({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await page.goto(age);
  await calculateAge(page, "2000-01-01");
  await page.reload();
  // Wait for hydration (the form works), then check nothing was saved.
  await calculateAge(page, "2000-01-01");
  await expect(page.getByRole("region", { name: t.title })).toHaveCount(0);
});

test("row-based history: a GPA calculation is restored row by row", async ({ page }) => {
  await page.goto(calculatorPath("gpa-calculator"));
  const announcement = page.locator('p[aria-live="polite"]');
  await expect(async () => {
    await page.getByLabel("Course 1 Grade", { exact: true }).selectOption("A");
    await page.getByLabel("Course 1 Credits", { exact: true }).fill("3");
    await page.getByLabel("Course 2 Grade", { exact: true }).selectOption("B+");
    await page.getByLabel("Course 2 Credits", { exact: true }).fill("1.5");
    await page.getByRole("button", { name: "Calculate GPA", exact: true }).click();
    await expect(announcement).not.toHaveText("", { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
  const result = await announcement.textContent();

  await page.reload();
  await page.getByRole("region", { name: t.title }).getByRole("button", { name: t.useAgain }).click();
  await expect(page.getByLabel("Course 2 Grade", { exact: true })).toHaveValue("B+");
  await expect(page.getByLabel("Course 2 Credits", { exact: true })).toHaveValue("1.5");
  await expect(announcement).toHaveText(result ?? "");
});

import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { guides } from "@/guides/registry";
import { LOCALES } from "@/i18n/locales";
import { calculatorOgImage, guideOgImage, homeOgImage, type OgImage } from "./metadata";
import { calculators } from "./registry";

/**
 * Every page that sets its own social preview image must have the file in
 * public/og/. The images are generated, not hand-made: see docs/seo.md →
 * "Social preview images".
 */
const REGENERATE = "Missing social preview images: run `docker compose run --rm e2e npm run og` and commit public/og/";

function missing(images: OgImage[]): string[] {
  return images.map((image) => image.url).filter((url) => !existsSync(path.join(process.cwd(), "public", url)));
}

describe("social preview images", () => {
  it("exist for the home page in every locale", () => {
    expect(missing(LOCALES.map((locale) => homeOgImage(locale))), REGENERATE).toEqual([]);
  });

  it("exist for every calculator in every locale", () => {
    const images = calculators.flatMap((calc) => LOCALES.map((locale) => calculatorOgImage(calc, locale)));
    expect(missing(images), REGENERATE).toEqual([]);
  });

  it("exist for every guide in every locale", () => {
    const images = guides.flatMap((guide) => LOCALES.map((locale) => guideOgImage(guide, locale)));
    expect(missing(images), REGENERATE).toEqual([]);
  });
});

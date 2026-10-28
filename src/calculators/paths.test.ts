import { describe, expect, it } from "vitest";
import { embedPath, shareablePath } from "./paths";

describe("embed paths", () => {
  it("builds an embed path per locale", () => {
    expect(embedPath("en", "age-calculator")).toBe("/embed/en/age-calculator");
    expect(embedPath("bn", "age-calculator")).toBe("/embed/bn/age-calculator");
  });

  it("maps an embed path to the full calculator page", () => {
    expect(shareablePath("/embed/en/age-calculator")).toBe("/calculators/age-calculator");
    expect(shareablePath("/embed/bn/emi-calculator")).toBe("/bn/calculators/emi-calculator");
    expect(shareablePath("/embed/bn/emi-calculator/")).toBe("/bn/calculators/emi-calculator");
  });

  it("leaves every other path unchanged", () => {
    for (const path of ["/", "/bn", "/calculators/age-calculator", "/bn/calculators/age-calculator", "/embed", "/embed/fr/x"]) {
      expect(shareablePath(path)).toBe(path);
    }
  });
});

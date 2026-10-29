import { describe, expect, it } from "vitest";
import { calculatorPath } from "@/calculators/paths";
import { calculators } from "@/calculators/registry";
import { absoluteUrl } from "@/config/site";
import { guidePath } from "@/guides/paths";
import { guides } from "@/guides/registry";
import { localePath, LOCALES } from "@/i18n/locales";
import { buildLlmsTxt } from "./llms-txt";

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt(calculators, guides);

  it("starts with the site name as the only H1, then a summary quote", () => {
    const lines = text.split("\n");
    expect(lines[0]).toBe("# HisabBD");
    expect(lines[2]).toMatch(/^> /);
    expect(lines.filter((line) => line.startsWith("# "))).toHaveLength(1);
  });

  it("links every calculator and guide in both languages", () => {
    const paths = [...calculators.map((c) => calculatorPath(c.slug)), ...guides.map((g) => guidePath(g.slug))];
    const missing = paths.flatMap((path) =>
      LOCALES.map((locale) => absoluteUrl(localePath(locale, path))).filter((url) => !text.includes(`(${url})`)),
    );
    expect(missing).toEqual([]);
  });

  it("carries each guide's short answer", () => {
    expect(guides.filter((g) => !text.includes(g.answer)).map((g) => g.slug)).toEqual([]);
  });
});

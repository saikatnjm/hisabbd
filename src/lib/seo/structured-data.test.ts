import { describe, expect, it } from "vitest";
import { ageCalculator } from "@/calculators/age/meta";
import {
  breadcrumbSchema,
  calculatorSchema,
  faqSchema,
  schemaGraph,
  serializeJsonLd,
} from "./structured-data";

describe("structured data", () => {
  it("describes a calculator as a free web application with an absolute URL", () => {
    const schema = calculatorSchema(ageCalculator);
    expect(schema["@type"]).toBe("WebApplication");
    expect(schema.name).toBe("Age Calculator");
    expect(String(schema.url).endsWith("/calculators/age-calculator")).toBe(true);
    expect(String(schema.url).startsWith("http")).toBe(true);
  });

  it("numbers breadcrumb items from 1", () => {
    const schema = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Calculators", path: "/calculators" },
    ]);
    const items = schema.itemListElement as { position: number; name: string }[];
    expect(items.map((i) => i.position)).toEqual([1, 2]);
    expect(items[1]?.name).toBe("Calculators");
  });

  it("mirrors the visible FAQs", () => {
    const schema = faqSchema(ageCalculator.faqs ?? []);
    expect((schema.mainEntity as unknown[]).length).toBe(ageCalculator.faqs?.length);
  });

  it("escapes < so the JSON can't break out of its script tag", () => {
    const json = serializeJsonLd(schemaGraph([{ name: "</script><script>alert(1)</script>" }]));
    expect(json.includes("</script>")).toBe(false);
    expect(JSON.parse(json)["@graph"][0].name).toBe("</script><script>alert(1)</script>");
  });
});

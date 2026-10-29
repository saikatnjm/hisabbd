import { calculatorPath } from "@/calculators/paths";
import type { CalculatorMeta } from "@/calculators/types";
import { absoluteUrl, siteConfig } from "@/config/site";
import { guidePath } from "@/guides/paths";
import type { GuideMeta } from "@/guides/types";
import { localePath } from "@/i18n/locales";

/*
 * /llms.txt (https://llmstxt.org): a plain Markdown index of the site for AI
 * assistants and answer engines. Built from the registries, like the sitemap,
 * so it always matches the pages. Each guide carries its short answer, which
 * is the same text shown at the top of the guide.
 */

function en(path: string): string {
  return absoluteUrl(localePath("en", path));
}

function bn(path: string): string {
  return absoluteUrl(localePath("bn", path));
}

/** The llms.txt body for the given calculators and guides. */
export function buildLlmsTxt(calculators: readonly CalculatorMeta[], guides: readonly GuideMeta[]): string {
  const calculatorLines = calculators.map((c) => {
    const path = calculatorPath(c.slug);
    const reviewed = c.updatedOn ? ` Rules last reviewed ${c.updatedOn}.` : "";
    return `- [${c.name}](${en(path)}): ${c.summary}${reviewed} Bangla: [${c.nameBn}](${bn(path)})`;
  });
  const guideLines = guides.map((g) => {
    const path = guidePath(g.slug);
    return `- [${g.title}](${en(path)}): ${g.answer} Bangla: [${g.titleBn}](${bn(path)})`;
  });

  return [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.tagline}: bilingual (Bangla and English) calculators and guides for everyday sums in Bangladesh, including money in Taka with lakh and crore, education boards, land units, the Bangla calendar, savings and zakat.`,
    "",
    "- Free, no signup. Every page works in English and in Bangla (Bangla pages are under /bn).",
    "- Calculations run in the visitor's browser; inputs and results are never sent to a server.",
    "- Rule-dependent figures (rates, charges, limits) cite their official source and the date they were checked. The source's own notice is final.",
    "",
    "## Calculators",
    "",
    ...calculatorLines,
    "",
    "## Guides",
    "",
    ...guideLines,
    "",
    "## Optional",
    "",
    `- [All calculators](${en("/calculators")}) · [সব ক্যালকুলেটর](${bn("/calculators")})`,
    `- [All guides](${en("/guides")}) · [সব গাইড](${bn("/guides")})`,
    `- [About](${en("/about")}) · [Privacy](${en("/privacy")})`,
    "",
  ].join("\n");
}

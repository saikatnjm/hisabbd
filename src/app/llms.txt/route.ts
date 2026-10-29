import { calculators } from "@/calculators/registry";
import { guides } from "@/guides/registry";
import { buildLlmsTxt } from "@/lib/seo/llms-txt";

// Prerendered at build time into a static file, like robots.txt and sitemap.xml.
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildLlmsTxt(calculators, guides), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

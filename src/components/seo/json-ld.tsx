import { schemaGraph, serializeJsonLd } from "@/lib/seo/structured-data";

/** Renders schema.org JSON-LD. Content is our own registry data, escaped by serializeJsonLd. */
export function JsonLd({ schemas }: { schemas: readonly Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Inline JSON is the standard way to ship JSON-LD; "<" is escaped.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaGraph(schemas)) }}
    />
  );
}

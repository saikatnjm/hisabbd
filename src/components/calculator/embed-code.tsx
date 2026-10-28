import { embedPath } from "@/calculators/paths";
import { absoluteUrl } from "@/config/site";
import type { Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

/**
 * "Add this calculator to your website": an <iframe> snippet for the
 * calculator's embed page. Native <details>, no JavaScript; the code is in a
 * read-only textarea so it can be selected and copied on any device.
 */
export function EmbedCode({ slug, name, locale }: { slug: string; name: string; locale: Locale }) {
  const t = ui[locale].embed;
  const id = `embed-code-${slug}`;
  const code = `<iframe src="${absoluteUrl(embedPath(locale, slug))}" title="${name} | HisabBD" width="100%" height="900" style="border:0;max-width:720px" loading="lazy"></iframe>`;

  return (
    <details className="mt-10 rounded-xl border border-slate-200 bg-white p-4 text-sm print:hidden">
      <summary className="cursor-pointer font-semibold text-slate-800">{t.summary}</summary>
      <p className="mt-3 text-slate-700">{t.intro}</p>
      <label htmlFor={id} className="mt-3 block font-medium text-slate-800">
        {t.codeLabel}
      </label>
      <textarea
        id={id}
        readOnly
        rows={4}
        value={code}
        className="mt-1.5 block w-full rounded-lg border-2 border-slate-300 bg-slate-50 p-2 font-mono text-xs text-slate-800"
      />
    </details>
  );
}

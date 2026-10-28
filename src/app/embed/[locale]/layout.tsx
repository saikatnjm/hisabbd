import { notFound } from "next/navigation";
import { RootDocument, rootViewport } from "@/components/layout/root-document";
import { LocaleProvider } from "@/i18n/locale-context";
import { LOCALES, type Locale } from "@/i18n/locales";

export const viewport = rootViewport;
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Root layout for embeds (/embed/<locale>/<slug>): just the widget, framed on
 * other websites. No site chrome and no analytics scripts.
 */
export default async function EmbedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <RootDocument locale={locale} analytics={false}>
      <LocaleProvider locale={locale}>{children}</LocaleProvider>
    </RootDocument>
  );
}

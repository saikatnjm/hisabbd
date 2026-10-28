import { LocaleShell } from "@/components/layout/locale-shell";
import { RootDocument, rootMetadata, rootViewport } from "@/components/layout/root-document";

export const metadata = rootMetadata("en");
export const viewport = rootViewport;

/** Root layout for English pages (no URL prefix). */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument locale="en">
      <LocaleShell locale="en">{children}</LocaleShell>
    </RootDocument>
  );
}

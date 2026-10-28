import { LocaleShell } from "@/components/layout/locale-shell";
import { RootDocument, rootMetadata, rootViewport } from "@/components/layout/root-document";

export const metadata = rootMetadata("bn");
export const viewport = rootViewport;

/** Root layout for Bangla pages under /bn: renders <html lang="bn">. */
export default function BanglaLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument locale="bn">
      <LocaleShell locale="bn">{children}</LocaleShell>
    </RootDocument>
  );
}

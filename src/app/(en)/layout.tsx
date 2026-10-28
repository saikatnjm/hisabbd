import { LocaleShell } from "@/components/layout/locale-shell";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <LocaleShell locale="en">{children}</LocaleShell>;
}

import type { Metadata } from "next";
import { LocaleShell } from "@/components/layout/locale-shell";
import { siteConfig } from "@/config/site";
import { SetHtmlLang } from "./set-html-lang";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.taglineBn}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.descriptionBn,
};

export default function BanglaLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleShell locale="bn">
      <SetHtmlLang lang="bn" />
      {children}
    </LocaleShell>
  );
}

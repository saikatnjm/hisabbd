"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "./locales";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** The page's locale, for Client Components (set once per layout). */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

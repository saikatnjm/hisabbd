import { choicePreference, PREFERENCES_KEY } from "@/lib/preferences";

/*
 * Light/dark theme. The visitor's choice is a site setting in "hisabbd:prefs"
 * (scope "site", key "theme"); "auto" follows the phone or computer setting.
 * The page reads it before first paint (THEME_SCRIPT) and sets
 * <html data-theme="light|dark">, which globals.css uses to swap colour tokens.
 */

export const THEMES = ["auto", "light", "dark"] as const;
export type ThemeChoice = (typeof THEMES)[number];

export const themePreference = choicePreference<ThemeChoice>("site", "theme", THEMES, "auto");

/** The theme a choice resolves to right now. */
export function resolveTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice !== "auto") return choice;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(choice: ThemeChoice) {
  document.documentElement.dataset.theme = resolveTheme(choice);
}

/**
 * Inline <head> script: sets data-theme before the first paint (no flash of
 * the wrong theme) and follows the system setting while the choice is "auto".
 * Kept tiny and dependency-free; it must not throw when storage is blocked.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");function c(){try{var t=(JSON.parse(localStorage.getItem(${JSON.stringify(PREFERENCES_KEY)})||"{}").site||{}).theme;return t==="light"||t==="dark"?t:"auto"}catch(e){return"auto"}}function a(){var t=c();d.dataset.theme=t==="auto"?(m.matches?"dark":"light"):t}a();try{m.addEventListener("change",a)}catch(e){}})();`;

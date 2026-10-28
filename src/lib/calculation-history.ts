import type { Locale } from "@/i18n/locales";
import { createLocalStore } from "@/lib/local-store";
import { choicePreference, PREFERENCES_KEY, prefsStore, preferenceValue, setPreference } from "@/lib/preferences";

/*
 * "Your recent calculations", remembered in this browser only
 * (localStorage "hisabbd:history"). Each entry keeps what was typed into a
 * calculator and a one-line summary of the result, so the visitor can see it
 * again and fill the form with it ("Use again").
 *
 * Privacy: entries never leave the device: they are not sent anywhere, not
 * put in URLs and not passed to analytics. Saving can be turned off
 * (`historyEnabled`), and everything can be cleared. When it is off, nothing
 * new is saved.
 */

export const HISTORY_KEY = "hisabbd:history";
/** All keys this site keeps in localStorage (for "clear my data"). */
export const LOCAL_DATA_KEYS = ["hisabbd:recent", "hisabbd:favorites", PREFERENCES_KEY, HISTORY_KEY] as const;

export const MAX_HISTORY = 30;
export const MAX_PER_CALCULATOR = 5;
const MAX_SUMMARY = 400;
const MAX_INPUT_KEYS = 20;
const MAX_INPUT_VALUE = 4000;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEY_PATTERN = /^[a-z0-9-]{1,40}$/i;

export interface HistoryEntry {
  id: string;
  slug: string;
  /** When it was calculated (ms since epoch). */
  at: number;
  /** Language of `summary`. */
  locale: Locale;
  /** Raw form values (strings; lists are JSON), restored by the widget. */
  inputs: Readonly<Record<string, string>>;
  /** One line describing the result, e.g. the share text. */
  summary: string;
}

const EMPTY: readonly HistoryEntry[] = Object.freeze([]);

function sanitizeInputs(raw: unknown): Record<string, string> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const entries = Object.entries(raw);
  if (entries.length > MAX_INPUT_KEYS) return null;
  const result: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (!KEY_PATTERN.test(key) || typeof value !== "string" || value.length > MAX_INPUT_VALUE) return null;
    result[key] = value;
  }
  return result;
}

/** Keeps only well-formed entries, newest first, within the limits. */
export function sanitizeHistory(raw: unknown): readonly HistoryEntry[] {
  if (!Array.isArray(raw)) return EMPTY;
  const result: HistoryEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { id, slug, at, locale, inputs, summary } = item as Record<string, unknown>;
    const cleanInputs = sanitizeInputs(inputs);
    if (
      typeof id !== "string" || id.length > 40 ||
      typeof slug !== "string" || !SLUG_PATTERN.test(slug) || slug.length > 60 ||
      typeof at !== "number" || !Number.isFinite(at) ||
      (locale !== "en" && locale !== "bn") ||
      typeof summary !== "string" || summary.length > MAX_SUMMARY ||
      !cleanInputs
    ) {
      continue;
    }
    result.push({ id, slug, at, locale, inputs: cleanInputs, summary });
  }
  return capHistory(result.sort((a, b) => b.at - a.at));
}

function sameInputs(a: Readonly<Record<string, string>>, b: Readonly<Record<string, string>>): boolean {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((k) => a[k] === b[k]);
}

/** At most MAX_PER_CALCULATOR per calculator and MAX_HISTORY overall (list is newest first). */
function capHistory(list: readonly HistoryEntry[]): HistoryEntry[] {
  const perCalculator = new Map<string, number>();
  const result: HistoryEntry[] = [];
  for (const entry of list) {
    const count = perCalculator.get(entry.slug) ?? 0;
    if (count >= MAX_PER_CALCULATOR) continue;
    perCalculator.set(entry.slug, count + 1);
    result.push(entry);
    if (result.length >= MAX_HISTORY) break;
  }
  return result;
}

/** Adds an entry at the front. The same calculation repeated moves to the front instead of duplicating. */
export function withEntry(list: readonly HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  const rest = list.filter((e) => !(e.slug === entry.slug && sameInputs(e.inputs, entry.inputs)));
  return capHistory([entry, ...rest]);
}

export const historyStore = createLocalStore<readonly HistoryEntry[]>(HISTORY_KEY, sanitizeHistory, EMPTY);

/** Whether new calculations are saved on this device (on unless the visitor turns it off). */
export const historyEnabledPref = choicePreference("site", "history", ["on", "off"] as const, "on");

export function isHistoryEnabled(): boolean {
  return preferenceValue(prefsStore.read(), historyEnabledPref) === "on";
}

function newId(at: number): string {
  return `${at.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Saves a successful calculation, unless saving is turned off. */
export function recordCalculation(slug: string, locale: Locale, inputs: Record<string, string>, summary: string) {
  if (!isHistoryEnabled()) return;
  const at = Date.now();
  const entry: HistoryEntry = { id: newId(at), slug, at, locale, inputs, summary: summary.slice(0, MAX_SUMMARY) };
  const clean = sanitizeInputs(inputs);
  if (!clean) return;
  historyStore.write(withEntry(historyStore.read(), { ...entry, inputs: clean }));
}

export function removeCalculation(id: string) {
  historyStore.write(historyStore.read().filter((e) => e.id !== id));
}

/** Clears one calculator's history, or all of it. */
export function clearHistory(slug?: string) {
  if (slug) historyStore.write(historyStore.read().filter((e) => e.slug !== slug));
  else historyStore.remove();
}

export function setHistoryEnabled(enabled: boolean) {
  setPreference(historyEnabledPref, enabled ? "on" : "off");
}

/** Removes everything this site keeps in this browser: history, preferences, recent and saved calculators. */
export function clearAllLocalData() {
  for (const key of LOCAL_DATA_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Storage blocked: nothing was saved.
    }
  }
  // Tell open components in this tab; other tabs get the storage event.
  historyStore.remove();
  prefsStore.remove();
  window.dispatchEvent(new StorageEvent("storage", { key: null }));
}

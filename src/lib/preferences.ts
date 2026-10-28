import { createLocalStore } from "@/lib/local-store";

/*
 * Per-calculator preferences, remembered in this browser only
 * (localStorage "hisabbd:prefs"): which unit, mode or scale a visitor last
 * chose, e.g. ft/in for BMI or the HSC exam for SSC/HSC GPA. Only settings
 * are stored here, never what someone typed about themselves (that is the
 * calculation history's job, see calculation-history.ts).
 *
 * Each preference declares its allowed values, so anything else read back
 * from storage is ignored and the fallback is used.
 */

export const PREFERENCES_KEY = "hisabbd:prefs";

/** scope (usually a calculator slug) → key → value. */
type PrefsData = Readonly<Record<string, Readonly<Record<string, string>>>>;

const EMPTY: PrefsData = Object.freeze({});
const NAME_PATTERN = /^[a-z0-9-]{1,60}$/i;
const MAX_VALUE_LENGTH = 40;
const MAX_SCOPES = 60;

/** Keeps only scope → key → short string values; drops everything else. */
export function sanitizePrefs(raw: unknown): PrefsData {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return EMPTY;
  const result: Record<string, Record<string, string>> = {};
  for (const [scope, entries] of Object.entries(raw).slice(0, MAX_SCOPES)) {
    if (!NAME_PATTERN.test(scope) || !entries || typeof entries !== "object" || Array.isArray(entries)) continue;
    const clean: Record<string, string> = {};
    for (const [key, value] of Object.entries(entries)) {
      if (NAME_PATTERN.test(key) && typeof value === "string" && value.length <= MAX_VALUE_LENGTH) clean[key] = value;
    }
    if (Object.keys(clean).length > 0) result[scope] = clean;
  }
  return result;
}

export const prefsStore = createLocalStore<PrefsData>(PREFERENCES_KEY, sanitizePrefs, EMPTY);

export interface Preference<T extends string> {
  scope: string;
  key: string;
  fallback: T;
  isValid: (value: string) => value is T;
}

/** A preference that is one of a fixed set of values (unit, mode, scale…). */
export function choicePreference<T extends string>(
  scope: string,
  key: string,
  choices: readonly T[],
  fallback: T,
): Preference<T> {
  return { scope, key, fallback, isValid: (value): value is T => (choices as readonly string[]).includes(value) };
}

/** A preference holding a number typed as text (e.g. a katha size), within a range. */
export function numberPreference(
  scope: string,
  key: string,
  range: { min: number; max: number },
  fallback: string,
): Preference<string> {
  return {
    scope,
    key,
    fallback,
    isValid: (value): value is string => {
      if (!/^\d+(\.\d+)?$/.test(value)) return false;
      const n = Number(value);
      return n >= range.min && n <= range.max;
    },
  };
}

/** The stored value if it is valid, otherwise the fallback. */
export function preferenceValue<T extends string>(data: PrefsData, pref: Preference<T>): T {
  const value = data[pref.scope]?.[pref.key];
  return value !== undefined && pref.isValid(value) ? value : pref.fallback;
}

/** `data` with the preference set (invalid values are ignored). */
export function withPreference<T extends string>(data: PrefsData, pref: Preference<T>, value: T): PrefsData {
  if (!pref.isValid(value)) return data;
  return { ...data, [pref.scope]: { ...data[pref.scope], [pref.key]: value } };
}

export function setPreference<T extends string>(pref: Preference<T>, value: T) {
  const data = prefsStore.read();
  if (data[pref.scope]?.[pref.key] === value) return;
  prefsStore.write(withPreference(data, pref, value));
}

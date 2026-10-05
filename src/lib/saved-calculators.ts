/**
 * "Recently used" and "Favourites", stored in this browser only (localStorage).
 *
 * Only calculator slugs (e.g. "age-calculator") are stored, never anything a
 * visitor typed into a calculator. Values read back are validated, so a
 * tampered or outdated entry is simply ignored. If storage is unavailable
 * (private mode, blocked), the lists are empty and nothing breaks.
 */

export type SavedList = "recent" | "favorites";

const STORAGE_KEYS: Record<SavedList, string> = {
  recent: "hisabbd:recent",
  favorites: "hisabbd:favorites",
};

export const MAX_RECENT = 6;
export const MAX_FAVORITES = 12;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMPTY: readonly string[] = Object.freeze([]);

/** Keeps unique, well-formed slugs only, in order, up to `max`. */
export function sanitizeSlugs(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  const result: string[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.length <= 60 && SLUG_PATTERN.test(item) && !result.includes(item)) {
      result.push(item);
      if (result.length >= max) break;
    }
  }
  return result;
}

/** Most recent first, without duplicates. */
export function withRecent(list: readonly string[], slug: string, max = MAX_RECENT): string[] {
  return [slug, ...list.filter((s) => s !== slug)].slice(0, max);
}

export function toggled(list: readonly string[], slug: string, max = MAX_FAVORITES): string[] {
  return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug].slice(-max);
}

/* ---------- browser store (used with useSyncExternalStore) ---------- */

const listeners = new Set<() => void>();
const cache: Partial<Record<SavedList, { raw: string | null; value: readonly string[] }>> = {};

function maxFor(list: SavedList) {
  return list === "recent" ? MAX_RECENT : MAX_FAVORITES;
}

export function readSaved(list: SavedList): readonly string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEYS[list]);
  } catch {
    return EMPTY;
  }
  const cached = cache[list];
  if (cached && cached.raw === raw) return cached.value;
  let value: readonly string[] = EMPTY;
  try {
    value = raw ? sanitizeSlugs(JSON.parse(raw), maxFor(list)) : EMPTY;
  } catch {
    value = EMPTY;
  }
  cache[list] = { raw, value };
  return value;
}

function writeSaved(list: SavedList, value: readonly string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEYS[list], JSON.stringify(value));
  } catch {
    return; // Storage full or blocked: keep working without saving.
  }
  listeners.forEach((notify) => notify());
}

export function subscribeSaved(notify: () => void) {
  listeners.add(notify);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || Object.values(STORAGE_KEYS).includes(event.key)) notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

export const serverSaved = () => EMPTY;

export function rememberRecent(slug: string) {
  writeSaved("recent", withRecent(readSaved("recent"), slug));
}

/** Returns true when the calculator is now a favourite. */
export function toggleFavorite(slug: string): boolean {
  const next = toggled(readSaved("favorites"), slug);
  writeSaved("favorites", next);
  return next.includes(slug);
}

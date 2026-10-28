/**
 * A small localStorage-backed store for useSyncExternalStore.
 *
 * Values are read back through `sanitize`, so a tampered, outdated or
 * oversized entry is replaced by safe data instead of breaking the page. If
 * storage is unavailable (private mode, blocked, full), reads return `empty`
 * and writes are skipped: the site works the same, it just doesn't remember.
 * Other tabs are kept in sync through the `storage` event.
 */
export interface LocalStore<T> {
  read(): T;
  write(value: T): void;
  remove(): void;
  subscribe(notify: () => void): () => void;
  /** Snapshot used during server rendering and before hydration. */
  server(): T;
}

export function createLocalStore<T>(key: string, sanitize: (raw: unknown) => T, empty: T): LocalStore<T> {
  const listeners = new Set<() => void>();
  let cache: { raw: string | null; value: T } | null = null;

  function read(): T {
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return empty;
    }
    if (cache && cache.raw === raw) return cache.value;
    let value = empty;
    try {
      value = raw ? sanitize(JSON.parse(raw)) : empty;
    } catch {
      value = empty;
    }
    cache = { raw, value };
    return value;
  }

  function notifyAll() {
    listeners.forEach((notify) => notify());
  }

  return {
    read,
    write(value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        return; // Storage full or blocked: keep working without saving.
      }
      notifyAll();
    },
    remove() {
      try {
        window.localStorage.removeItem(key);
      } catch {
        return;
      }
      notifyAll();
    },
    subscribe(notify) {
      listeners.add(notify);
      const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === key) notify();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(notify);
        window.removeEventListener("storage", onStorage);
      };
    },
    server: () => empty,
  };
}

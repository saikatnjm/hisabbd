import { roundTo } from "@/lib/number";
import { dayOfWeek, type PlainDate } from "@/lib/plain-date";

/*
 * Presentation formatting. Numbers use the South Asian grouping familiar in
 * Bangladesh (1,00,000 and 1,00,00,000). Rounding happens here, at display
 * time; calculations keep full precision. Non-finite values never reach the
 * screen: they are shown as "–".
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const NOT_A_NUMBER = "–";
const formatters = new Map<string, Intl.NumberFormat>();

function formatter(minDigits: number, maxDigits: number): Intl.NumberFormat {
  const key = `${minDigits}-${maxDigits}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    });
    formatters.set(key, f);
  }
  return f;
}

export interface NumberFormatOptions {
  /** Maximum decimals shown (default 2). Trailing zeros are dropped unless `minDecimals` is set. */
  decimals?: number;
  minDecimals?: number;
}

/** 100000 → "1,00,000"; 3.14159 → "3.14". */
export function formatNumber(value: number, options: NumberFormatOptions = {}): string {
  if (!Number.isFinite(value)) return NOT_A_NUMBER;
  const { decimals = 2, minDecimals = 0 } = options;
  return formatter(minDecimals, Math.max(decimals, minDecimals)).format(roundTo(value, decimals));
}

/** 25000 → "৳25,000"; -500 → "−৳500". Whole Taka by default. */
export function formatTaka(value: number, options: NumberFormatOptions = { decimals: 0 }): string {
  if (!Number.isFinite(value)) return NOT_A_NUMBER;
  const text = formatNumber(Math.abs(value), options);
  return roundTo(value, options.decimals ?? 0) < 0 ? `−৳${text}` : `৳${text}`;
}

/** 12.5 → "12.5%". The value is already a percentage (not a fraction). */
export function formatPercent(value: number, options: NumberFormatOptions = {}): string {
  if (!Number.isFinite(value)) return NOT_A_NUMBER;
  return `${formatNumber(value, options)}%`;
}

/** 1 → "1 year", 3 → "3 years". */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}

/** ["a", "b", "c"] → "a, b and c". */
export function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

export function weekdayName(weekday: number): string {
  return WEEKDAYS[weekday] ?? "";
}

/**
 * Day-month-year as commonly written in Bangladesh: "5 October 2026".
 * Built from plain numbers (no Date/Intl) so server and browser always agree.
 */
export function formatPlainDate(date: PlainDate, options: { weekday?: boolean } = {}): string {
  const text = `${date.day} ${MONTHS[date.month - 1]} ${date.year}`;
  return options.weekday ? `${weekdayName(dayOfWeek(date))}, ${text}` : text;
}

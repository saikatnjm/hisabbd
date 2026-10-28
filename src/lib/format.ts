import type { Locale } from "@/i18n/locales";
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

const MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
] as const;

const WEEKDAYS_BN = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"] as const;

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

/** ["a", "b", "c"] → "a, b and c" (bn: "a, b ও c"). */
export function joinList(items: readonly string[], locale: Locale = "en"): string {
  if (items.length <= 1) return items.join("");
  const joiner = locale === "bn" ? " ও " : " and ";
  return `${items.slice(0, -1).join(", ")}${joiner}${items.at(-1)}`;
}

/** Bangla has no plural suffix: 3 → "৩টি নয়, 3 দিন". Digits stay Western for consistency. */
export function countBn(count: number, unit: string): string {
  return `${formatNumber(count)} ${unit}`;
}

export function weekdayName(weekday: number, locale: Locale = "en"): string {
  return (locale === "bn" ? WEEKDAYS_BN : WEEKDAYS)[weekday] ?? "";
}

/**
 * Day-month-year as commonly written in Bangladesh: "5 October 2026".
 * Built from plain numbers (no Date/Intl) so server and browser always agree.
 */
export function formatPlainDate(
  date: PlainDate,
  options: { weekday?: boolean; locale?: Locale } = {},
): string {
  const locale = options.locale ?? "en";
  const months = locale === "bn" ? MONTHS_BN : MONTHS;
  const text = `${date.day} ${months[date.month - 1]} ${date.year}`;
  return options.weekday ? `${weekdayName(dayOfWeek(date), locale)}, ${text}` : text;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * How long ago a moment was, for history lists: "just now", "5 min ago",
 * "3 hours ago", "2 days ago", then the date ("5 October 2026").
 * `now` is passed in so this stays pure.
 */
export function formatTimeAgo(at: number, now: number, locale: Locale = "en"): string {
  const diff = Math.max(0, now - at);
  const bn = locale === "bn";
  if (diff < MINUTE) return bn ? "এইমাত্র" : "just now";
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return bn ? `${m} মিনিট আগে` : `${m} min ago`;
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return bn ? `${h} ঘণ্টা আগে` : `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  if (diff < 7 * DAY) {
    const d = Math.floor(diff / DAY);
    return bn ? `${d} দিন আগে` : `${d} day${d === 1 ? "" : "s"} ago`;
  }
  const date = new Date(at);
  return formatPlainDate({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }, { locale });
}

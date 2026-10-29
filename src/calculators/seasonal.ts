import type { PlainDate } from "@/lib/plain-date";
import { comparePlainDates, parsePlainDate } from "@/lib/plain-date";

/*
 * "Useful right now" on the homepage: calculators that matter at a given time
 * of the Bangladesh year (exam results, Ramadan, Pohela Boishakh, the
 * budget). Pages are static, so the homepage works out today's seasons in the
 * visitor's browser.
 *
 * Yearly seasons use "MM-DD" (a window may wrap the year end). Seasons tied
 * to the Islamic calendar move about 11 days earlier each year, so they use
 * full dates: add next year's window when the dates are announced.
 */

export interface Season {
  id: string;
  label: string;
  labelBn: string;
  /** "MM-DD" for every year, or "YYYY-MM-DD" for one year only. */
  from: string;
  to: string;
  /** Calculators to show, most useful first (must exist in the registry). */
  slugs: readonly string[];
}

export const SEASONS: readonly Season[] = [
  {
    id: "hsc-results",
    label: "HSC results and admissions",
    labelBn: "এইচএসসি ফলাফল ও ভর্তি",
    from: "10-15",
    to: "01-31",
    slugs: ["ssc-hsc-gpa-calculator", "government-job-age-calculator"],
  },
  {
    id: "ssc-results",
    label: "SSC results",
    labelBn: "এসএসসি ফলাফল",
    from: "05-01",
    to: "07-31",
    slugs: ["ssc-hsc-gpa-calculator"],
  },
  {
    id: "ramadan-1448",
    label: "Ramadan and zakat",
    labelBn: "রমজান ও যাকাত",
    // Ramadan 1448 is expected around 8 Feb – 9 Mar 2027 (moon sighting decides).
    from: "2027-01-10",
    to: "2027-03-12",
    slugs: ["zakat-calculator", "gold-calculator"],
  },
  {
    id: "pohela-boishakh",
    label: "Pohela Boishakh",
    labelBn: "পহেলা বৈশাখ",
    from: "03-25",
    to: "04-20",
    slugs: ["bangla-date-converter"],
  },
  {
    id: "budget",
    label: "Budget: new rates from July",
    labelBn: "বাজেট: জুলাই থেকে নতুন হার",
    from: "06-01",
    to: "07-31",
    slugs: ["vat-calculator", "sanchayapatra-calculator", "salary-calculator"],
  },
];

const MONTH_DAY = /^(\d{2})-(\d{2})$/;

function monthDay(date: PlainDate): number {
  return date.month * 100 + date.day;
}

/** Whether `today` falls inside the season's window (inclusive). */
export function isInSeason(season: Season, today: PlainDate): boolean {
  const from = MONTH_DAY.exec(season.from);
  const to = MONTH_DAY.exec(season.to);
  if (from && to) {
    const start = Number(from[1]) * 100 + Number(from[2]);
    const end = Number(to[1]) * 100 + Number(to[2]);
    const md = monthDay(today);
    return start <= end ? md >= start && md <= end : md >= start || md <= end;
  }
  const start = parsePlainDate(season.from);
  const end = parsePlainDate(season.to);
  if (!start || !end) return false;
  return comparePlainDates(today, start) >= 0 && comparePlainDates(today, end) <= 0;
}

/** Seasons active today, in list order. */
export function activeSeasons(today: PlainDate, seasons: readonly Season[] = SEASONS): Season[] {
  return seasons.filter((season) => isInSeason(season, today));
}

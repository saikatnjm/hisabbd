import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Earned (annual) leave calculator rules and assumptions (documented):
 *
 * Source: Bangladesh Labour Act 2006 on bdlaws (consolidated text incl. the
 * 2026 amendment), read on 2 November 2026. Sections and URLs in sources.ts.
 *
 * 1. Who and when. s.117(1): "কোন প্রতিষ্ঠানে অবিচ্ছিন্নভাবে এক বৎসর চাকুরী পূর্ণ
 *    করিয়াছেন এমন প্রত্যেক প্রাপ্ত বয়স্ক শ্রমিককে পরবর্তী বারো মাস সময়ে তাহার
 *    পূর্ববর্তী বারো মাসের কাজের জন্য মজুরীসহ ... ছুটি মঞ্জুর করিতে হইবে". So an adult
 *    worker who has completed one year of continuous service earns leave for
 *    the previous 12 months of work, to be taken in the next 12 months. Under
 *    one year of service, nothing is due yet (the calculator then returns 0).
 * 2. Accrual (adult workers), s.117(1):
 *      (ক) shop, commercial or industrial establishment, factory or road
 *          transport establishment: "প্রতি আঠার দিন কাজের জন্য একদিন" (1 per 18);
 *      (খ) tea plantation: "প্রতি বাইশ দিন কাজের জন্য একদিন" (1 per 22);
 *      (গ) newspaper worker: "প্রতি এগার দিন কাজের জন্য একদিন" (1 per 11).
 *    Days worked / interval, rounded DOWN to whole days. The Act says "one day
 *    for every 18 days of work" and does not mention part-days, so only
 *    completed groups are counted (assumption). The remainder is shown.
 * 3. What counts as worked. s.117(8): service counts as continuous, and the
 *    time as worked, even if interrupted by a closed day, paid leave, leave
 *    for sickness or accident (paid or unpaid), up to 120 days of maternity
 *    leave, lay-off, or a lawful strike / unlawful lock-out. The user decides
 *    which days to enter; the calculator does not guess.
 * 4. Carry-forward. s.117(4): unused due leave "পরবর্তী বারো মাস মেয়াদে তাহার
 *    প্রাপ্য ছুটির সহিত যুক্ত হইবে" (is added to the next 12 months' leave).
 * 5. Maximum. s.117(5): for an adult, entitlement stops when the earned leave
 *    due reaches "চল্লিশ দিন" (40) in a factory or road transport
 *    establishment, and "ষাট দিন" (60) in a tea plantation, shop, commercial or
 *    industrial establishment. The Act names no limit for newspaper workers in
 *    s.117(5), so none is applied to them (stated on the page).
 *    Model: available = min(carried + earned, cap). The cap is applied when the
 *    leave falls due (the s.117(1) grant), then leave taken is subtracted.
 * 6. Refused leave. s.117(7): leave applied for but refused by the employer is
 *    added to the worker's account as due "in excess of" the s.117(5) limit.
 *    Optional input; added after the cap.
 * 7. Leave taken during the period is deducted from the available days.
 *    Remaining = available + refused - taken. Taking more than is available
 *    is an error.
 * 8. Encashment. s.11: when employment ends (retrenchment, discharge, removal,
 *    dismissal, retirement, resignation or any other reason) and annual leave
 *    is due, the employer pays "the wages the worker would have received during
 *    the leave under this Act" for the due days.
 * 9. Daily wage. s.119(1): wages for leave are the daily average of the
 *    full-time wage plus dearness allowance and ad hoc or interim wage, if any,
 *    paid for the days worked in the month immediately before the leave,
 *    EXCLUDING overtime allowance and bonus. So daily wage = that month's
 *    wage (basic + dearness + ad hoc) / the number of days worked in that
 *    month. Both are inputs. We use the last month worked before leaving as
 *    "the month immediately before the leave" (assumption). A cash allowance
 *    paid instead of food grain is part of the wage (s.119(1) proviso); the
 *    user includes it. Encashment = remaining days x daily wage.
 *    Optional: leave both wage fields blank to skip it.
 * 10. Limits. Days are whole numbers (no half days). MAX_DAYS_WORKED is 366
 *    (a leap year); the carry-forward may not exceed the cap that applies.
 * 11. Rounding: only for display. Daily wage and encashment are rounded to
 *    the paisa.
 * 12. Not modelled: adolescent (কিশোর) workers (s.117(2), (6): different rates and
 *    caps), the casual, sick, festival and weekly leave kinds (explained on
 *    the page), service rules that are better than the Act, government
 *    employees (different rules), advance payment before leave (s.119(2)).
 */

export const MAX_DAYS_WORKED = 366;
export const MAX_DAYS = 366;
export const MAX_WAGE = 10_000_000;
export const MAX_WAGE_DAYS = 31;

export type LeaveRuleId = "shop-factory" | "factory" | "tea" | "newspaper";

export interface LeaveRule {
  id: LeaveRuleId;
  /** One day of leave for every `interval` days worked (s.117(1)). */
  interval: number;
  /** Maximum earned leave due for an adult (s.117(5)); null where the Act names none. */
  cap: number | null;
}

/** The adult accrual rules. "shop-factory" covers shop, commercial and industrial establishments (60-day cap). */
const SHOP_RULE: LeaveRule = { id: "shop-factory", interval: 18, cap: 60 };
export const LEAVE_RULES: readonly LeaveRule[] = [
  SHOP_RULE,
  { id: "factory", interval: 18, cap: 40 },
  { id: "tea", interval: 22, cap: 60 },
  { id: "newspaper", interval: 11, cap: null },
];

export const DEFAULT_LEAVE_RULE: LeaveRuleId = "shop-factory";

export function leaveRule(id: LeaveRuleId): LeaveRule {
  return LEAVE_RULES.find((rule) => rule.id === id) ?? SHOP_RULE;
}

export interface LeaveInput {
  rule: LeaveRuleId;
  /** Completed one year of continuous service (s.117(1)). */
  eligible: boolean;
  daysWorked: string;
  carried: string;
  /** Optional: blank = 0. */
  refused: string;
  taken: string;
  /** Optional with wageDays: wage paid for the days worked in the month before leave. */
  wage: string;
  wageDays: string;
}

export type LeaveField = "daysWorked" | "carried" | "refused" | "taken" | "wage" | "wageDays";
export type LeaveErrorCode = NumberErrorCode | "exceeds-available";
export interface LeaveError {
  field: LeaveField;
  code: LeaveErrorCode;
}
export interface LeaveResult {
  rule: LeaveRule;
  eligible: boolean;
  daysWorked: number;
  /** Whole days earned in this period (0 if not yet eligible). */
  earned: number;
  /** Days worked that do not yet make a whole day (daysWorked mod interval). */
  remainderDays: number;
  carried: number;
  /** min(carried + earned, cap); no cap for newspaper workers. */
  available: number;
  /** Days lost to the cap (carried + earned - available). */
  overCap: number;
  refused: number;
  taken: number;
  /** available + refused - taken */
  remaining: number;
  /** Encashment, only when a wage was entered. */
  encashment: { dailyWage: number; value: number } | null;
}
export type LeaveCalculation = { ok: true; result: LeaveResult } | { ok: false; errors: LeaveError[] };

/** Whole days earned for the days worked at one day per `interval` (s.117(1)). */
export function earnedDays(daysWorked: number, interval: number): number {
  return Math.floor(daysWorked / interval);
}

/** Daily wage under s.119(1): wage paid for the days worked / those days (unrounded). */
export function dailyWageFor(wage: number, daysWorked: number): number {
  return wage / daysWorked;
}

/** Validates the inputs and works out earned, available and remaining leave, and the encashment if a wage was entered. */
export function calculateLeave(input: LeaveInput): LeaveCalculation {
  const rule = leaveRule(input.rule);
  const errors: LeaveError[] = [];

  const worked = checkNumber(input.daysWorked, { min: 0, max: MAX_DAYS_WORKED, integer: true });
  if (!worked.ok) errors.push({ field: "daysWorked", code: worked.code });

  const carried = checkNumber(input.carried, { min: 0, max: rule.cap ?? MAX_DAYS, integer: true });
  if (!carried.ok) errors.push({ field: "carried", code: carried.code });

  let refused = 0;
  if (input.refused.trim() !== "") {
    const r = checkNumber(input.refused, { min: 0, max: MAX_DAYS, integer: true });
    if (r.ok) refused = r.value;
    else errors.push({ field: "refused", code: r.code });
  }

  const taken = checkNumber(input.taken, { min: 0, max: MAX_DAYS, integer: true });
  if (!taken.ok) errors.push({ field: "taken", code: taken.code });

  const wantsEncashment = input.wage.trim() !== "" || input.wageDays.trim() !== "";
  let wage = 0;
  let wageDays = 0;
  if (wantsEncashment) {
    const w = checkNumber(input.wage, { min: 0, minExclusive: true, max: MAX_WAGE });
    if (w.ok) wage = w.value;
    else errors.push({ field: "wage", code: w.code });
    const d = checkNumber(input.wageDays, { min: 0, minExclusive: true, max: MAX_WAGE_DAYS, integer: true });
    if (d.ok) wageDays = d.value;
    else errors.push({ field: "wageDays", code: d.code });
  }

  if (!worked.ok || !carried.ok || !taken.ok || errors.length > 0) return { ok: false, errors };

  const earned = input.eligible ? earnedDays(worked.value, rule.interval) : 0;
  const total = carried.value + earned;
  const available = rule.cap === null ? total : Math.min(total, rule.cap);
  if (taken.value > available + refused) {
    return { ok: false, errors: [{ field: "taken", code: "exceeds-available" }] };
  }
  const remaining = available + refused - taken.value;

  let encashment: LeaveResult["encashment"] = null;
  if (wantsEncashment) {
    const dailyWage = dailyWageFor(wage, wageDays);
    encashment = { dailyWage: roundTo(dailyWage, 2), value: roundTo(dailyWage * remaining, 2) };
  }

  return {
    ok: true,
    result: {
      rule,
      eligible: input.eligible,
      daysWorked: worked.value,
      earned,
      remainderDays: worked.value % rule.interval,
      carried: carried.value,
      available,
      overCap: total - available,
      refused,
      taken: taken.value,
      remaining,
      encashment,
    },
  };
}

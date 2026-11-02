import { describe, expect, it } from "vitest";
import {
  calculateLeave,
  dailyWageFor,
  earnedDays,
  LEAVE_RULES,
  leaveRule,
  MAX_DAYS_WORKED,
  type LeaveInput,
} from "./logic";

const base: LeaveInput = {
  rule: "shop-factory",
  eligible: true,
  daysWorked: "300",
  carried: "50",
  refused: "",
  taken: "14",
  wage: "31200",
  wageDays: "26",
};

function ok(overrides: Partial<LeaveInput> = {}) {
  const calc = calculateLeave({ ...base, ...overrides });
  if (!calc.ok) throw new Error(JSON.stringify(calc.errors));
  return calc.result;
}

describe("rules table (s.117)", () => {
  it("has the adult rates and caps read from the Act", () => {
    expect(LEAVE_RULES.map((r) => [r.id, r.interval, r.cap])).toEqual([
      ["shop-factory", 18, 60],
      ["factory", 18, 40],
      ["tea", 22, 60],
      ["newspaper", 11, null],
    ]);
    expect(leaveRule("tea").interval).toBe(22);
  });
});

describe("worked example (same numbers as the page and FAQs)", () => {
  it("300 days worked, 50 carried, cap 60, 14 taken, ৳31,200 for 26 days", () => {
    const r = ok();
    expect(r.earned).toBe(16); // floor(300 / 18)
    expect(r.remainderDays).toBe(12);
    expect(r.available).toBe(60); // 50 + 16 = 66, capped at 60
    expect(r.overCap).toBe(6);
    expect(r.remaining).toBe(46);
    expect(r.encashment).toEqual({ dailyWage: 1200, value: 55200 });
  });
  it("same year in a factory is capped at 40", () => {
    const r = ok({ rule: "factory", carried: "30" });
    expect(r.available).toBe(40);
    expect(r.overCap).toBe(6);
    expect(r.remaining).toBe(26);
  });
  it("tea plantation: 1 day per 22", () => {
    expect(ok({ rule: "tea", daysWorked: "300", carried: "0", taken: "0" }).earned).toBe(13);
  });
  it("newspaper worker: 1 day per 11, no cap in s.117(5)", () => {
    const r = ok({ rule: "newspaper", daysWorked: "300", carried: "70", taken: "0" });
    expect(r.earned).toBe(27);
    expect(r.available).toBe(97);
    expect(r.overCap).toBe(0);
  });
});

describe("helpers", () => {
  it("earnedDays rounds down", () => {
    expect(earnedDays(17, 18)).toBe(0);
    expect(earnedDays(18, 18)).toBe(1);
    expect(earnedDays(35, 18)).toBe(1);
    expect(earnedDays(366, 18)).toBe(20);
  });
  it("dailyWageFor is wage / days worked", () => {
    expect(dailyWageFor(31200, 26)).toBe(1200);
  });
});

describe("eligibility, refused leave, encashment", () => {
  it("earns nothing before one year of service", () => {
    const r = ok({ eligible: false, carried: "0", taken: "0" });
    expect(r.earned).toBe(0);
    expect(r.remaining).toBe(0);
  });
  it("refused leave is added above the cap (s.117(7))", () => {
    const r = ok({ refused: "5", taken: "0" });
    expect(r.available).toBe(60);
    expect(r.remaining).toBe(65);
  });
  it("encashment is skipped when both wage fields are blank", () => {
    expect(ok({ wage: "", wageDays: "" }).encashment).toBeNull();
  });
  it("encashment needs both wage fields", () => {
    const c = calculateLeave({ ...base, wage: "31200", wageDays: "" });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors).toEqual([{ field: "wageDays", code: "missing" }]);
  });
  it("rounds the daily wage and value to the paisa", () => {
    const r = ok({ wage: "10000", wageDays: "26", taken: "0", carried: "0", daysWorked: "36" });
    expect(r.remaining).toBe(2);
    expect(r.encashment?.dailyWage).toBe(384.62);
    expect(r.encashment?.value).toBe(769.23);
  });
});

describe("validation", () => {
  it("reports every missing required field", () => {
    const c = calculateLeave({ ...base, daysWorked: "", carried: "", taken: "" });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors.map((e) => e.field)).toEqual(["daysWorked", "carried", "taken"]);
    expect(c.errors.every((e) => e.code === "missing")).toBe(true);
  });
  it("rejects negatives, decimals and invalid text", () => {
    const c = calculateLeave({ ...base, daysWorked: "-1", carried: "2.5", taken: "abc", refused: "x" });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors.map((e) => `${e.field}:${e.code}`)).toEqual([
      "daysWorked:too-small",
      "carried:not-integer",
      "refused:invalid",
      "taken:invalid",
    ]);
  });
  it("enforces maximums", () => {
    expect(calculateLeave({ ...base, daysWorked: String(MAX_DAYS_WORKED) }).ok).toBe(true);
    const c = calculateLeave({ ...base, daysWorked: String(MAX_DAYS_WORKED + 1) });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors[0]?.code).toBe("too-large");
  });
  it("carry-forward may not exceed the cap", () => {
    expect(calculateLeave({ ...base, rule: "factory", carried: "40" }).ok).toBe(true);
    const c = calculateLeave({ ...base, rule: "factory", carried: "41" });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors).toEqual([{ field: "carried", code: "too-large" }]);
  });
  it("taking more than is available is an error", () => {
    const c = calculateLeave({ ...base, taken: "61" });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors).toEqual([{ field: "taken", code: "exceeds-available" }]);
    expect(calculateLeave({ ...base, taken: "60" }).ok).toBe(true);
  });
  it("rejects zero wage and 32 days in the month", () => {
    const c = calculateLeave({ ...base, wage: "0", wageDays: "32" });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors.map((e) => `${e.field}:${e.code}`)).toEqual(["wage:too-small", "wageDays:too-large"]);
  });
  it("accepts Bangla digits and lakh grouping", () => {
    const r = ok({ daysWorked: "৩০০", carried: "৫০", taken: "১৪", wage: "৩১,২০০", wageDays: "২৬" });
    expect(r.remaining).toBe(46);
    expect(r.encashment?.value).toBe(55200);
    expect(ok({ wage: "1,00,000", wageDays: "25", taken: "0", carried: "0", daysWorked: "18" }).encashment?.value).toBe(4000);
  });
});

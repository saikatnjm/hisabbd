import { describe, expect, it } from "vitest";
import {
  calculateSettlement,
  MAX_DIVISOR,
  MAX_WAGE,
  MAX_YEARS,
  resignationDaysPerYear,
  type SettlementInput,
} from "./logic";

const base: SettlementInput = {
  exit: "resignation",
  basic: "20000",
  allowance: "",
  years: "4",
  months: "8",
  days: "",
  divisor: "30",
  gratuity: false,
  notice: true,
};

function ok(overrides: Partial<SettlementInput> = {}) {
  const calc = calculateSettlement({ ...base, ...overrides });
  if (!calc.ok) throw new Error(JSON.stringify(calc.errors));
  return calc.result;
}

describe("worked examples (same numbers as the pages and FAQs)", () => {
  it("resignation: basic 20,000, 4 years 8 months, notice served, divisor 30", () => {
    const r = ok();
    expect(r.completedYears).toBe(4);
    expect(r.compensationDaysPerYear).toBe(15);
    expect(r.dailyWage).toBeCloseTo(666.6666666667, 8);
    expect(r.compensation).toBe(40000);
    expect(r.gratuity).toBeNull();
    expect(r.benefit).toBe(40000);
    expect(r.benefitSection).toBe("27(4)");
    expect(r.noticeKind).toBe("none");
    expect(r.total).toBe(40000);
  });
  it("retrenchment: basic 14,000 + dearness 1,000, 8 years 7 months, gratuity on, no notice", () => {
    const r = ok({
      exit: "retrenchment",
      basic: "14000",
      allowance: "1000",
      years: "8",
      months: "7",
      gratuity: true,
      notice: false,
    });
    expect(r.wage).toBe(15000);
    expect(r.dailyWage).toBe(500);
    expect(r.compensation).toBe(120000);
    expect(r.gratuity).toEqual({ yearsCounted: 9, daysPerYear: 30, amount: 135000 });
    expect(r.basis).toBe("gratuity");
    expect(r.benefit).toBe(135000);
    expect(r.benefitSection).toBe("2(10)");
    expect(r.noticeKind).toBe("paid-to-worker");
    expect(r.noticeDays).toBeNull();
    expect(r.noticeAmount).toBe(15000);
    expect(r.total).toBe(150000);
  });
  it("termination: basic 15,000, 5 years, no notice, divisor 30", () => {
    const r = ok({ exit: "termination", basic: "15000", years: "5", months: "", notice: false });
    expect(r.compensation).toBe(75000);
    expect(r.noticeDays).toBe(120);
    expect(r.noticeAmount).toBe(60000);
    expect(r.total).toBe(135000);
  });
});

describe("resignation tiers (section 27(4))", () => {
  it("7 days up to 3 years, 15 days over 3 and under 10, 30 days from 10", () => {
    expect(resignationDaysPerYear(0, 11, 30)).toBe(7);
    expect(resignationDaysPerYear(3, 0, 0)).toBe(7);
    expect(resignationDaysPerYear(3, 0, 1)).toBe(15);
    expect(resignationDaysPerYear(3, 1, 0)).toBe(15);
    expect(resignationDaysPerYear(9, 11, 30)).toBe(15);
    expect(resignationDaysPerYear(10, 0, 0)).toBe(30);
    expect(resignationDaysPerYear(25, 0, 0)).toBe(30);
  });
  it("applies the tier rate to every completed year", () => {
    expect(ok({ years: "3", months: "", basic: "30000" }).compensation).toBe(21000);
    expect(ok({ years: "3", months: "1", basic: "30000" }).compensation).toBe(45000);
  });
  it("gratuity only from 10 years; 45 days when service is over 10 years", () => {
    expect(ok({ years: "9", gratuity: true }).gratuity).toBeNull();
    const ten = ok({ years: "10", months: "", basic: "30000", gratuity: true });
    expect(ten.compensation).toBe(300000);
    expect(ten.gratuity?.daysPerYear).toBe(30);
    expect(ten.basis).toBe("compensation");
    const over = ok({ years: "10", months: "3", basic: "30000", gratuity: true });
    expect(over.gratuity).toEqual({ yearsCounted: 10, daysPerYear: 45, amount: 450000 });
    expect(over.basis).toBe("gratuity");
    const seven = ok({ years: "10", months: "7", basic: "30000", gratuity: true });
    expect(seven.gratuity).toEqual({ yearsCounted: 11, daysPerYear: 45, amount: 495000 });
  });
  it("leaving without notice owes 60 days' wages, netted in the total", () => {
    const r = ok({ years: "10", months: "", basic: "30000", notice: false });
    expect(r.noticeKind).toBe("owed-by-worker");
    expect(r.noticeAmount).toBe(60000);
    expect(r.total).toBe(240000);
  });
  it("can come out negative for under one year", () => {
    const r = ok({ years: "0", months: "5", notice: false });
    expect(r.eligible).toBe(false);
    expect(r.benefit).toBe(0);
    expect(r.basis).toBe("none");
    expect(r.total).toBe(-40000);
  });
});

describe("six-month rule for gratuity (section 2(10))", () => {
  const g = (months: string, days = "") =>
    ok({ exit: "termination", years: "4", months, days, gratuity: true }).gratuity;
  it("6 months exactly does not count; 6 months and a day does", () => {
    expect(g("6")).toEqual({ yearsCounted: 4, daysPerYear: 30, amount: 80000 });
    expect(g("6", "1")?.yearsCounted).toBe(5);
    expect(g("7")?.yearsCounted).toBe(5);
    expect(g("5", "30")?.yearsCounted).toBe(4);
  });
  it("uses completed years only without gratuity", () => {
    expect(ok({ exit: "termination", years: "4", months: "11" }).compensation).toBe(80000);
  });
});

describe("discharge and retrenchment minimums", () => {
  it("discharge: 30 days a year from one completed year, no notice line", () => {
    const r = ok({ exit: "discharge", years: "2", months: "", notice: false });
    expect(r.compensation).toBe(40000);
    expect(r.noticeKind).toBe("none");
    expect(r.benefitSection).toBe("22(2)");
  });
  it("under one year gets nothing under sections 20 and 22", () => {
    const d = ok({ exit: "discharge", years: "0", months: "11" });
    expect(d.eligible).toBe(false);
    expect(d.total).toBe(0);
    const r = ok({ exit: "retrenchment", years: "0", months: "11", notice: false });
    expect(r.noticeKind).toBe("none");
    expect(r.total).toBe(0);
  });
  it("termination notice applies even under one year", () => {
    const r = ok({ exit: "termination", years: "0", months: "4", notice: false });
    expect(r.compensation).toBe(0);
    expect(r.noticeAmount).toBe(80000);
  });
  it("gratuity never lowers the benefit", () => {
    const r = ok({ exit: "discharge", years: "5", months: "", gratuity: true });
    expect(r.basis).toBe("compensation");
    expect(r.benefit).toBe(100000);
  });
});

describe("validation", () => {
  it("reports every missing required field", () => {
    const c = calculateSettlement({ ...base, exit: "", basic: "", years: "", divisor: "" });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors.map((e) => `${e.field}:${e.code}`)).toEqual([
      "exit:missing",
      "basic:missing",
      "years:missing",
      "divisor:missing",
    ]);
  });
  it("rejects unknown exit types, zero wage and fractional years", () => {
    const c = calculateSettlement({ ...base, exit: "dismissal", basic: "0", years: "2.5", months: "12", days: "31" });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors.map((e) => `${e.field}:${e.code}`)).toEqual([
      "exit:invalid",
      "basic:too-small",
      "years:not-integer",
      "months:too-large",
      "days:too-large",
    ]);
  });
  it("flags an invalid allowance", () => {
    const c = calculateSettlement({ ...base, allowance: "abc" });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors).toEqual([{ field: "allowance", code: "invalid" }]);
  });
  it("enforces maximums", () => {
    expect(ok({ basic: String(MAX_WAGE), years: String(MAX_YEARS), divisor: String(MAX_DIVISOR) })).toBeTruthy();
    const c = calculateSettlement({
      ...base,
      basic: String(MAX_WAGE + 1),
      years: String(MAX_YEARS + 1),
      divisor: String(MAX_DIVISOR + 1),
    });
    if (c.ok) throw new Error("expected errors");
    expect(c.errors.every((e) => e.code === "too-large")).toBe(true);
  });
  it("accepts Bangla digits and lakh grouping", () => {
    expect(ok({ basic: "২০,০০০", years: "৪", months: "৮", divisor: "৩০" }).total).toBe(40000);
    expect(ok({ basic: "2,00,000", years: "1", months: "", divisor: "30" }).compensation).toBe(46666.67);
  });
});

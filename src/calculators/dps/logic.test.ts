import { describe, expect, it } from "vitest";
import { roundTo } from "@/lib/number";
import {
  calculateDps,
  dpsMaturityMonthly,
  dpsMonthlyBalances,
  dpsSchedule,
  MAX_INSTALMENT,
  MAX_TENURE_YEARS,
  type DpsCalculation,
  type DpsInputs,
} from "./logic";

const base: DpsInputs = {
  instalment: "5000",
  rate: "9",
  tenureYears: "5",
  compounding: "monthly",
  taxRate: "10",
  exciseMode: "bands",
  exciseAmount: "",
};

function ok(overrides: Partial<DpsInputs> = {}) {
  const calc = calculateDps({ ...base, ...overrides });
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: DpsCalculation) => (calc.ok ? [] : calc.errors);

describe("core functions", () => {
  it("closed form matches the textbook annuity-due formula", () => {
    const i = 0.0075;
    const direct = ((5000 * ((1 + i) ** 60 - 1)) / i) * (1 + i);
    expect(dpsMaturityMonthly(5000, i, 60)).toBeCloseTo(direct, 6);
  });

  it("zero rate is instalment × months", () => {
    expect(dpsMaturityMonthly(5000, 0, 60)).toBe(300_000);
    expect(dpsMonthlyBalances(5000, 0, 60, "quarterly").at(-1)).toBe(300_000);
  });

  it("month-by-month monthly compounding equals the closed form", () => {
    const balances = dpsMonthlyBalances(5000, 0.09, 60, "monthly");
    expect(balances).toHaveLength(60);
    expect(balances.at(-1)).toBeCloseTo(dpsMaturityMonthly(5000, 0.0075, 60), 6);
    expect(balances[11]).toBeCloseTo(dpsMaturityMonthly(5000, 0.0075, 12), 6);
  });

  it("one year of ৳1,000 at 12%: monthly, quarterly and yearly crediting", () => {
    // Yearly: no compounding inside the year, interest = 1000 × 1% × (1 + 2 + … + 12) = 780.
    expect(dpsMonthlyBalances(1000, 0.12, 12, "yearly").at(-1)).toBeCloseTo(12_780, 8);
    expect(dpsMonthlyBalances(1000, 0.12, 12, "quarterly").at(-1)).toBeCloseTo(12_801.89862, 5);
    expect(dpsMonthlyBalances(1000, 0.12, 12, "monthly").at(-1)).toBeCloseTo(12_809.328043, 5);
  });

  it("more frequent crediting earns more", () => {
    const m = dpsMonthlyBalances(5000, 0.09, 60, "monthly").at(-1) ?? 0;
    const q = dpsMonthlyBalances(5000, 0.09, 60, "quarterly").at(-1) ?? 0;
    const y = dpsMonthlyBalances(5000, 0.09, 60, "yearly").at(-1) ?? 0;
    expect(m).toBeGreaterThan(q);
    expect(q).toBeGreaterThan(y);
    expect(q).toBeCloseTo(379_277.892463, 5);
    expect(y).toBeCloseTo(376_587.915134, 5);
  });

  it("schedule interest and deposits add up to the last balance", () => {
    const rows = dpsSchedule(5000, 0.09, 5, "quarterly", null);
    const total = rows.reduce((s, r) => s + r.deposits + r.interest, 0);
    expect(total).toBeCloseTo(rows.at(-1)?.balance ?? 0, 6);
    expect(rows.map((r) => r.totalDeposits)).toEqual([60_000, 120_000, 180_000, 240_000, 300_000]);
  });
});

describe("worked examples (content and FAQs)", () => {
  it("৳5,000 a month at 9% for 5 years, monthly: ৳3,79,949 before tax", () => {
    const r = ok();
    expect(r.months).toBe(60);
    expect(r.totalDeposits).toBe(300_000);
    expect(r.maturityValue).toBeCloseTo(379_949.089762, 5);
    expect(roundTo(r.maturityValue, 0)).toBe(379_949);
    expect(roundTo(r.grossInterest, 0)).toBe(79_949);
    expect(roundTo(r.tax, 0)).toBe(7_995);
    // Every year-end balance stays at or below ৳4 lakh, so no excise.
    expect(r.schedule.map((row) => roundTo(row.balance, 0))).toEqual([63_007, 131_924, 207_307, 289_761, 379_949]);
    expect(r.excise).toBe(0);
    expect(roundTo(r.netAmount, 0)).toBe(371_954);
    expect(r.netAmount).toBeCloseTo(371_954.180786, 5);
  });

  it("৳10,000 a month at 10% for 5 years: excise from year 3", () => {
    const r = ok({ instalment: "10,000", rate: "10" });
    expect(roundTo(r.maturityValue, 0)).toBe(780_824);
    expect(roundTo(r.grossInterest, 0)).toBe(180_824);
    expect(roundTo(r.tax, 0)).toBe(18_082);
    expect(r.schedule.map((row) => row.excise)).toEqual([0, 0, 150, 500, 500]);
    expect(r.excise).toBe(1_150);
    expect(roundTo(r.netAmount, 0)).toBe(761_591);
  });
});

describe("excise modes", () => {
  it("none and custom", () => {
    expect(ok({ instalment: "10000", rate: "10", exciseMode: "none" }).excise).toBe(0);
    const custom = ok({ instalment: "10000", rate: "10", exciseMode: "custom", exciseAmount: "2000" });
    expect(custom.excise).toBe(2_000);
    expect(custom.schedule.every((row) => row.excise === 0)).toBe(true);
  });

  it("custom excise is required only in custom mode", () => {
    expect(errors(calculateDps({ ...base, exciseMode: "custom", exciseAmount: "" }))).toEqual([
      { field: "excise", code: "missing" },
    ]);
    expect(calculateDps({ ...base, exciseMode: "none", exciseAmount: "x" }).ok).toBe(true);
  });
});

describe("validation", () => {
  it("reports missing fields together", () => {
    expect(errors(calculateDps({ ...base, instalment: "", rate: "", tenureYears: "", taxRate: "" }))).toEqual([
      { field: "instalment", code: "missing" },
      { field: "rate", code: "missing" },
      { field: "tenure", code: "missing" },
      { field: "tax", code: "missing" },
    ]);
  });

  it("instalment above 0 and at most the maximum", () => {
    expect(errors(calculateDps({ ...base, instalment: "0" }))).toEqual([{ field: "instalment", code: "too-small" }]);
    expect(calculateDps({ ...base, instalment: String(MAX_INSTALMENT) }).ok).toBe(true);
    expect(errors(calculateDps({ ...base, instalment: String(MAX_INSTALMENT + 1) }))).toEqual([
      { field: "instalment", code: "too-large" },
    ]);
    expect(errors(calculateDps({ ...base, instalment: "five" }))).toEqual([{ field: "instalment", code: "invalid" }]);
  });

  it("tenure is a whole number of 1–30 years", () => {
    expect(ok({ tenureYears: "1" }).schedule).toHaveLength(1);
    expect(ok({ tenureYears: String(MAX_TENURE_YEARS) }).schedule).toHaveLength(30);
    expect(errors(calculateDps({ ...base, tenureYears: "0" }))).toEqual([{ field: "tenure", code: "too-small" }]);
    expect(errors(calculateDps({ ...base, tenureYears: "31" }))).toEqual([{ field: "tenure", code: "too-large" }]);
    expect(errors(calculateDps({ ...base, tenureYears: "2.5" }))).toEqual([{ field: "tenure", code: "not-integer" }]);
  });

  it("rate and tax are 0–100", () => {
    expect(calculateDps({ ...base, rate: "0", taxRate: "100" }).ok).toBe(true);
    expect(errors(calculateDps({ ...base, rate: "101", taxRate: "101" }))).toEqual([
      { field: "rate", code: "too-large" },
      { field: "tax", code: "too-large" },
    ]);
  });

  it("accepts Bangla digits and grouping", () => {
    const r = ok({ instalment: "৫,০০০", rate: "৯", tenureYears: "৫" });
    expect(roundTo(r.maturityValue, 0)).toBe(379_949);
  });

  it("0% interest: maturity equals deposits", () => {
    const r = ok({ rate: "0" });
    expect(r.maturityValue).toBe(300_000);
    expect(r.grossInterest).toBe(0);
    expect(r.netAmount).toBe(300_000);
  });

  it("stays finite at the limits", () => {
    const r = ok({ instalment: String(MAX_INSTALMENT), rate: "100", tenureYears: "30", compounding: "monthly" });
    expect(Number.isFinite(r.maturityValue)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { roundTo } from "@/lib/number";
import {
  EXCISE_BANDS,
  EXCISE_FREE_LIMIT,
  exciseBandRanges,
  exciseForBalance,
  SOURCE_TAX_PRESETS,
} from "./deposit-tax";
import {
  calculateFdr,
  effectiveAnnualRate,
  fdrSchedule,
  fdrValue,
  MAX_PRINCIPAL,
  MAX_TERM_MONTHS,
  type FdrCalculation,
  type FdrInputs,
} from "./logic";

const base: FdrInputs = {
  principal: "100000",
  rate: "9",
  termMonths: "12",
  compounding: "simple",
  taxRate: "10",
  exciseMode: "bands",
  exciseAmount: "",
};

function ok(overrides: Partial<FdrInputs> = {}) {
  const calc = calculateFdr({ ...base, ...overrides });
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: FdrCalculation) => (calc.ok ? [] : calc.errors);

describe("deposit tax and excise data", () => {
  it("tax presets are 10% and 15% (10% + 50%)", () => {
    expect(SOURCE_TAX_PRESETS.standard.value).toBe(10);
    expect(SOURCE_TAX_PRESETS.noReturnProof.value).toBe(15);
    expect(SOURCE_TAX_PRESETS.noReturnProof.value).toBe(SOURCE_TAX_PRESETS.standard.value * 1.5);
  });

  it("excise bands are ordered and the last one is open-ended", () => {
    const limits = EXCISE_BANDS.map((b) => b.upTo);
    expect(limits.at(-1)).toBeNull();
    const finite = limits.filter((x): x is number => x !== null);
    expect([...finite].sort((a, b) => a - b)).toEqual(finite);
    expect(EXCISE_BANDS[0]).toEqual({ upTo: EXCISE_FREE_LIMIT, duty: 0 });
  });

  it("looks up duty with inclusive upper limits", () => {
    expect(exciseForBalance(0)).toBe(0);
    expect(exciseForBalance(400_000)).toBe(0);
    expect(exciseForBalance(400_000.01)).toBe(150);
    expect(exciseForBalance(500_000)).toBe(150);
    expect(exciseForBalance(500_001)).toBe(500);
    expect(exciseForBalance(1_000_000)).toBe(500);
    expect(exciseForBalance(1_000_001)).toBe(3_000);
    expect(exciseForBalance(5_000_000)).toBe(3_000);
    expect(exciseForBalance(5_000_001)).toBe(5_000);
    expect(exciseForBalance(10_000_001)).toBe(10_000);
    expect(exciseForBalance(20_000_001)).toBe(20_000);
    expect(exciseForBalance(50_000_000)).toBe(20_000);
    expect(exciseForBalance(50_000_001)).toBe(50_000);
    expect(exciseForBalance(MAX_PRINCIPAL)).toBe(50_000);
  });

  it("accepts another band table", () => {
    expect(exciseForBalance(350_000, [{ upTo: 300_000, duty: 0 }, { upTo: null, duty: 150 }])).toBe(150);
  });
});

describe("core functions", () => {
  it("simple interest is P × (1 + r × months ÷ 12)", () => {
    expect(fdrValue(100_000, 0.09, 12, "simple")).toBeCloseTo(109_000, 8);
    expect(fdrValue(100_000, 0.09, 3, "simple")).toBeCloseTo(102_250, 8);
  });

  it("compounding matches (1 + r·p/12)^periods", () => {
    expect(fdrValue(100_000, 0.12, 12, "monthly")).toBeCloseTo(100_000 * 1.01 ** 12, 8);
    expect(fdrValue(100_000, 0.12, 12, "quarterly")).toBeCloseTo(100_000 * 1.03 ** 4, 8);
    expect(fdrValue(100_000, 0.12, 24, "yearly")).toBeCloseTo(100_000 * 1.12 ** 2, 8);
  });

  it("a part period at the end earns simple interest", () => {
    // 18 months at 8% yearly compounding: 1 full year, then 6 months simple.
    expect(fdrValue(200_000, 0.08, 18, "yearly")).toBeCloseTo(224_640, 8);
    // Shorter than one period: plain simple interest.
    expect(fdrValue(100_000, 0.12, 6, "yearly")).toBeCloseTo(fdrValue(100_000, 0.12, 6, "simple"), 8);
  });

  it("effective annual rate", () => {
    expect(effectiveAnnualRate(0.12, "simple")).toBe(0.12);
    expect(effectiveAnnualRate(0.12, "yearly")).toBeCloseTo(0.12, 12);
    expect(effectiveAnnualRate(0.12, "monthly")).toBeCloseTo(1.01 ** 12 - 1, 12);
    expect(effectiveAnnualRate(0.1, "quarterly")).toBeCloseTo(1.025 ** 4 - 1, 12);
  });

  it("schedule rows add up to the maturity value", () => {
    const rows = fdrSchedule(500_000, 0.1, 30, "quarterly", null);
    expect(rows.map((r) => r.months)).toEqual([12, 12, 6]);
    const interest = rows.reduce((s, r) => s + r.interest, 0);
    expect(500_000 + interest).toBeCloseTo(fdrValue(500_000, 0.1, 30, "quarterly"), 6);
    expect(rows.every((r) => r.excise === 0)).toBe(true);
  });
});

describe("worked examples (content and FAQs)", () => {
  it("৳1,00,000 at 9% for 12 months, simple, 10% tax: net ৳1,08,100", () => {
    const r = ok();
    expect(r.maturityValue).toBeCloseTo(109_000, 8);
    expect(r.grossInterest).toBeCloseTo(9_000, 8);
    expect(r.tax).toBeCloseTo(900, 8);
    expect(r.excise).toBe(0);
    expect(r.netAmount).toBeCloseTo(108_100, 8);
    expect(r.netInterest).toBeCloseTo(8_100, 8);
    expect(r.effectiveAnnualRatePercent).toBeCloseTo(9, 10);
  });

  it("৳5,00,000 at 10% for 3 years, quarterly, 10% tax, excise from bands", () => {
    const r = ok({ principal: "5,00,000", rate: "10", termMonths: "36", compounding: "quarterly" });
    expect(r.maturityValue).toBeCloseTo(672_444.412123, 5);
    expect(roundTo(r.maturityValue, 0)).toBe(672_444);
    expect(roundTo(r.grossInterest, 0)).toBe(172_444);
    expect(roundTo(r.tax, 0)).toBe(17_244);
    expect(r.schedule.map((row) => roundTo(row.balance, 0))).toEqual([551_906, 609_201, 672_444]);
    expect(r.schedule.map((row) => row.excise)).toEqual([500, 500, 500]);
    expect(r.excise).toBe(1_500);
    expect(r.netAmount).toBeCloseTo(653_699.970911, 5);
    expect(roundTo(r.netAmount, 0)).toBe(653_700);
    expect(r.effectiveAnnualRatePercent).toBeCloseTo(10.381289, 5);
  });

  it("15% tax for a depositor without proof of return", () => {
    const r = ok({ taxRate: "15" });
    expect(r.tax).toBeCloseTo(1_350, 8);
    expect(r.netAmount).toBeCloseTo(107_650, 8);
  });
});

describe("excise modes", () => {
  it("none leaves excise out", () => {
    const r = ok({ principal: "500000", exciseMode: "none" });
    expect(r.excise).toBe(0);
    expect(r.schedule[0]?.excise).toBe(0);
  });

  it("custom uses the typed total and ignores the bands", () => {
    const r = ok({ principal: "500000", exciseMode: "custom", exciseAmount: "1,000" });
    expect(r.excise).toBe(1_000);
    expect(r.schedule[0]?.excise).toBe(0);
  });

  it("custom excise is validated only in custom mode", () => {
    expect(errors(calculateFdr({ ...base, exciseMode: "custom", exciseAmount: "" }))).toEqual([
      { field: "excise", code: "missing" },
    ]);
    expect(errors(calculateFdr({ ...base, exciseMode: "custom", exciseAmount: "-1" }))).toEqual([
      { field: "excise", code: "too-small" },
    ]);
    expect(calculateFdr({ ...base, exciseMode: "bands", exciseAmount: "abc" }).ok).toBe(true);
  });

  it("a short FDR still gets one excise charge on its balance", () => {
    const r = ok({ principal: "450000", termMonths: "3" });
    expect(r.schedule).toHaveLength(1);
    expect(r.excise).toBe(150);
  });

  it("net amount can fall below the principal when excise exceeds interest", () => {
    const r = ok({ principal: "450000", rate: "0", termMonths: "12" });
    expect(r.netAmount).toBe(449_850);
    expect(r.netInterest).toBe(-150);
  });
});

describe("validation", () => {
  it("reports missing fields together", () => {
    expect(errors(calculateFdr({ ...base, principal: "", rate: "", termMonths: "", taxRate: "" }))).toEqual([
      { field: "principal", code: "missing" },
      { field: "rate", code: "missing" },
      { field: "term", code: "missing" },
      { field: "tax", code: "missing" },
    ]);
  });

  it("rejects invalid text", () => {
    expect(errors(calculateFdr({ ...base, principal: "abc" }))).toEqual([{ field: "principal", code: "invalid" }]);
  });

  it("principal must be above 0 and at most the maximum", () => {
    expect(errors(calculateFdr({ ...base, principal: "0" }))).toEqual([{ field: "principal", code: "too-small" }]);
    expect(calculateFdr({ ...base, principal: String(MAX_PRINCIPAL) }).ok).toBe(true);
    expect(errors(calculateFdr({ ...base, principal: String(MAX_PRINCIPAL + 1) }))).toEqual([
      { field: "principal", code: "too-large" },
    ]);
  });

  it("rate and tax are 0–100", () => {
    expect(calculateFdr({ ...base, rate: "0", taxRate: "0" }).ok).toBe(true);
    expect(calculateFdr({ ...base, rate: "100", taxRate: "100" }).ok).toBe(true);
    expect(errors(calculateFdr({ ...base, rate: "100.01", taxRate: "-0.1" }))).toEqual([
      { field: "rate", code: "too-large" },
      { field: "tax", code: "too-small" },
    ]);
  });

  it("term is a whole number of 1–360 months", () => {
    expect(calculateFdr({ ...base, termMonths: "1" }).ok).toBe(true);
    expect(calculateFdr({ ...base, termMonths: String(MAX_TERM_MONTHS) }).ok).toBe(true);
    expect(errors(calculateFdr({ ...base, termMonths: "0" }))).toEqual([{ field: "term", code: "too-small" }]);
    expect(errors(calculateFdr({ ...base, termMonths: "361" }))).toEqual([{ field: "term", code: "too-large" }]);
    expect(errors(calculateFdr({ ...base, termMonths: "6.5" }))).toEqual([{ field: "term", code: "not-integer" }]);
  });

  it("accepts Bangla digits and lakh grouping", () => {
    const r = ok({ principal: "১,০০,০০০", rate: "৯", termMonths: "১২" });
    expect(r.netAmount).toBeCloseTo(108_100, 8);
  });

  it("0% interest returns the principal minus excise", () => {
    const r = ok({ rate: "0" });
    expect(r.grossInterest).toBe(0);
    expect(r.tax).toBe(0);
    expect(r.netAmount).toBe(100_000);
  });

  it("stays finite at the limits", () => {
    const r = ok({ principal: String(MAX_PRINCIPAL), rate: "100", termMonths: "360", compounding: "monthly" });
    expect(Number.isFinite(r.maturityValue)).toBe(true);
    expect(r.schedule).toHaveLength(30);
  });
});

describe("exciseBandRanges", () => {
  it("turns bands into from–to ranges", () => {
    const ranges = exciseBandRanges();
    expect(ranges[0]).toEqual({ from: 0, to: 400_000, duty: 0 });
    expect(ranges[1]).toEqual({ from: 400_001, to: 500_000, duty: 150 });
    expect(ranges.at(-1)).toEqual({ from: 50_000_001, to: null, duty: 50_000 });
  });
});

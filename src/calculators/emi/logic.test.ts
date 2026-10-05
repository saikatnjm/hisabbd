import { describe, expect, it } from "vitest";
import {
  calculateEmi,
  calculateLoan,
  MAX_LOAN,
  monthlyRate,
  tenureToMonths,
  yearlySchedule,
  type EmiCalculation,
  type EmiInputs,
} from "./logic";

const base: EmiInputs = { amount: "500000", rate: "9", rateUnit: "year", tenure: "5", tenureUnit: "years" };

function ok(overrides: Partial<EmiInputs> = {}) {
  const calc = calculateLoan({ ...base, ...overrides });
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: EmiCalculation) => (calc.ok ? [] : calc.errors);

describe("core functions", () => {
  it("monthlyRate converts yearly and monthly percentages", () => {
    expect(monthlyRate(12, "year")).toBeCloseTo(0.01, 12);
    expect(monthlyRate(9, "year")).toBeCloseTo(0.0075, 12);
    expect(monthlyRate(1, "month")).toBeCloseTo(0.01, 12);
    expect(monthlyRate(0, "year")).toBe(0);
  });

  it("tenureToMonths converts years and keeps months", () => {
    expect(tenureToMonths(5, "years")).toBe(60);
    expect(tenureToMonths(18, "months")).toBe(18);
  });

  it("calculateEmi matches the textbook formula", () => {
    const r = 0.0075;
    const n = 60;
    const direct = (500000 * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    expect(calculateEmi(500000, r, n)).toBeCloseTo(direct, 8);
  });

  it("calculateEmi with zero rate is principal / months", () => {
    expect(calculateEmi(120000, 0, 12)).toBe(10000);
  });

  it("calculateEmi stays finite at extreme rate and tenure", () => {
    const emi = calculateEmi(MAX_LOAN, 1, 600);
    expect(Number.isFinite(emi)).toBeTruthy();
    expect(emi).toBeGreaterThan(MAX_LOAN * 0.99);
  });
});

describe("known values", () => {
  it("৳5,00,000 at 9% per year for 5 years", () => {
    const r = ok();
    expect(r.months).toBe(60);
    expect(r.monthlyRatePercent).toBeCloseTo(0.75, 10);
    expect(r.emi).toBeCloseTo(10379.177613, 5);
    expect(r.totalPayment).toBeCloseTo(622750.656791, 4);
    expect(r.totalInterest).toBeCloseTo(122750.656791, 4);
    expect(r.principalSharePercent + r.interestSharePercent).toBeCloseTo(100, 10);
    expect(r.interestSharePercent).toBeCloseTo(19.711044, 4);
  });

  it("৳1,00,000 at 12% per year for 1 year is about ৳8,884.88", () => {
    const r = ok({ amount: "100000", rate: "12", tenure: "1" });
    expect(r.emi).toBeCloseTo(8884.878868, 5);
    expect(r.totalInterest).toBeCloseTo(6618.546414, 4);
  });

  it("৳10,00,000 at 10% per year for 20 years is about ৳9,650.22", () => {
    const r = ok({ amount: "1000000", rate: "10", tenure: "20" });
    expect(r.months).toBe(240);
    expect(r.emi).toBeCloseTo(9650.216451, 5);
    expect(r.totalPayment).toBeCloseTo(2316051.948178, 3);
  });

  it("accepts commas and Bangla digits", () => {
    const r = ok({ amount: "৫,০০,০০০" });
    expect(r.emi).toBeCloseTo(10379.177613, 5);
  });
});

describe("rate and tenure units", () => {
  it("1% per month equals 12% per year", () => {
    const perMonth = ok({ amount: "100000", rate: "1", rateUnit: "month", tenure: "12", tenureUnit: "months" });
    const perYear = ok({ amount: "100000", rate: "12", rateUnit: "year", tenure: "1", tenureUnit: "years" });
    expect(perMonth.emi).toBeCloseTo(perYear.emi, 8);
    expect(perMonth.monthlyRatePercent).toBeCloseTo(1, 10);
    expect(perMonth.rateUnit).toBe("month");
  });

  it("tenure in months matches the same tenure in years", () => {
    expect(ok({ tenure: "60", tenureUnit: "months" }).emi).toBeCloseTo(ok().emi, 8);
  });
});

describe("edge cases", () => {
  it("zero interest splits the loan equally with no interest", () => {
    const r = ok({ amount: "120000", rate: "0", tenure: "1" });
    expect(r.emi).toBe(10000);
    expect(r.totalInterest).toBe(0);
    expect(r.totalPayment).toBe(120000);
    expect(r.principalSharePercent).toBeCloseTo(100, 10);
    expect(r.interestSharePercent).toBeCloseTo(0, 10);
  });

  it("a 1-month loan costs one month of interest", () => {
    const r = ok({ amount: "100000", rate: "12", tenure: "1", tenureUnit: "months" });
    expect(r.emi).toBeCloseTo(101000, 6);
    expect(r.totalInterest).toBeCloseTo(1000, 6);
    expect(r.schedule).toHaveLength(1);
    expect(r.schedule[0]?.instalments).toBe(1);
    expect(r.schedule[0]?.remainingBalance).toBe(0);
  });

  it("50-year tenure at the maximum works", () => {
    const r = ok({ tenure: "50" });
    expect(r.months).toBe(600);
    expect(r.schedule).toHaveLength(50);
    expect(r.emi).toBeGreaterThan(500000 * 0.0075);
  });

  it("600 months is allowed", () => {
    expect(ok({ tenure: "600", tenureUnit: "months" }).months).toBe(600);
  });

  it("100% per year and 100% per month stay finite", () => {
    expect(Number.isFinite(ok({ rate: "100" }).emi)).toBeTruthy();
    const r = ok({ rate: "100", rateUnit: "month", tenure: "600", tenureUnit: "months" });
    expect(Number.isFinite(r.emi)).toBeTruthy();
    expect(r.emi).toBeCloseTo(500000, 2);
  });

  it("a tiny rate gives a tiny positive interest", () => {
    const r = ok({ amount: "100000", rate: "0.01", tenure: "1" });
    expect(r.totalInterest).toBeGreaterThan(0);
    expect(r.totalInterest).toBeLessThan(10);
  });

  it("decimal rates and amounts work", () => {
    const r = ok({ amount: "250000.50", rate: "8.5" });
    expect(r.emi).toBeGreaterThan(0);
    expect(r.totalInterest).toBeGreaterThan(0);
  });

  it("the maximum loan amount is accepted", () => {
    expect(ok({ amount: String(MAX_LOAN) }).emi).toBeGreaterThan(0);
  });
});

describe("yearly schedule", () => {
  it("has the right number of years and partial last year", () => {
    expect(ok().schedule).toHaveLength(5);
    const r = ok({ tenure: "30", tenureUnit: "months" });
    expect(r.schedule).toHaveLength(3);
    expect(r.schedule.map((row) => row.instalments)).toEqual([12, 12, 6]);
    expect(r.schedule.map((row) => row.year)).toEqual([1, 2, 3]);
  });

  it("principal sums to the loan, interest to total interest, final balance is 0", () => {
    for (const overrides of [{}, { tenure: "30", tenureUnit: "months" as const }, { rate: "0" }, { tenure: "50" }]) {
      const r = ok(overrides);
      const principal = r.schedule.reduce((sum, row) => sum + row.principalPaid, 0);
      const interest = r.schedule.reduce((sum, row) => sum + row.interestPaid, 0);
      expect(principal).toBeCloseTo(r.amount, 4);
      expect(interest).toBeCloseTo(r.totalInterest, 4);
      expect(r.schedule.at(-1)?.remainingBalance).toBe(0);
    }
  });

  it("year 1 of ৳5,00,000 at 9% for 5 years", () => {
    const first = ok().schedule[0];
    expect(first?.principalPaid).toBeCloseTo(82915.011467, 4);
    expect(first?.interestPaid).toBeCloseTo(41635.119891, 4);
    expect(first?.remainingBalance).toBeCloseTo(417084.988533, 4);
  });

  it("balances never increase and are never negative", () => {
    const r = ok({ tenure: "25" });
    let previous = r.amount;
    for (const row of r.schedule) {
      expect(row.remainingBalance).toBeLessThanOrEqual(previous);
      expect(row.remainingBalance).toBeGreaterThanOrEqual(0);
      previous = row.remainingBalance;
    }
  });

  it("yearlySchedule works directly with a zero rate", () => {
    const rows = yearlySchedule(24000, 0, 24, 1000);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.principalPaid).toBeCloseTo(12000, 8);
    expect(rows[0]?.interestPaid).toBe(0);
    expect(rows[0]?.remainingBalance).toBeCloseTo(12000, 8);
    expect(rows[1]?.remainingBalance).toBe(0);
  });
});

describe("invalid input", () => {
  const codes = (overrides: Partial<EmiInputs>) => errors(calculateLoan({ ...base, ...overrides }));

  it("rejects missing values", () => {
    expect(codes({ amount: "", rate: " ", tenure: "" })).toEqual([
      { field: "amount", code: "missing" },
      { field: "rate", code: "missing" },
      { field: "tenure", code: "missing" },
    ]);
  });

  it("rejects zero and negative amounts", () => {
    expect(codes({ amount: "0" })).toEqual([{ field: "amount", code: "too-small" }]);
    expect(codes({ amount: "-5000" })).toEqual([{ field: "amount", code: "too-small" }]);
  });

  it("rejects amounts above the limit", () => {
    expect(codes({ amount: String(MAX_LOAN + 1) })).toEqual([{ field: "amount", code: "too-large" }]);
  });

  it("rejects rates outside 0-100", () => {
    expect(codes({ rate: "101" })).toEqual([{ field: "rate", code: "too-large" }]);
    expect(codes({ rate: "-1" })).toEqual([{ field: "rate", code: "too-small" }]);
  });

  it("rejects text", () => {
    expect(codes({ amount: "abc", rate: "9%" })).toEqual([
      { field: "amount", code: "invalid" },
      { field: "rate", code: "invalid" },
    ]);
  });

  it("rejects tenure of 0, negative, decimal", () => {
    expect(codes({ tenure: "0" })).toEqual([{ field: "tenure", code: "too-small" }]);
    expect(codes({ tenure: "0", tenureUnit: "months" })).toEqual([{ field: "tenure", code: "too-small" }]);
    expect(codes({ tenure: "-2" })).toEqual([{ field: "tenure", code: "too-small" }]);
    expect(codes({ tenure: "2.5" })).toEqual([{ field: "tenure", code: "not-integer" }]);
    expect(codes({ tenure: "7.5", tenureUnit: "months" })).toEqual([{ field: "tenure", code: "not-integer" }]);
  });

  it("rejects tenure above 600 months / 50 years", () => {
    expect(codes({ tenure: "601", tenureUnit: "months" })).toEqual([{ field: "tenure", code: "too-large" }]);
    expect(codes({ tenure: "51" })).toEqual([{ field: "tenure", code: "too-large" }]);
  });
});

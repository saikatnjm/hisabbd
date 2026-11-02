import { describe, expect, it } from "vitest";
import {
  calculateFlatRate,
  instalmentCount,
  MAX_FLAT_RATE,
  MAX_TERM_MONTHS,
  presentValue,
  solvePeriodicRate,
} from "./logic";

function ok(...args: Parameters<typeof calculateFlatRate>) {
  const c = calculateFlatRate(...args);
  if (!c.ok) throw new Error(JSON.stringify(c.errors));
  return c.result;
}

describe("worked examples (figures also used on the page and in the FAQs)", () => {
  it("৳1,00,000 at 12% flat, 12 monthly instalments → 21.46% real", () => {
    const r = ok("1,00,000", "12", "12", "monthly", "");
    expect(r.totalInterest).toBeCloseTo(12000, 8);
    expect(r.instalment).toBeCloseTo(9333.3333333333, 8);
    expect(r.totalPayable).toBeCloseTo(112000, 8);
    expect(r.periodicRatePercent).toBeCloseTo(1.7880987, 5);
    expect(r.realRatePercent).toBeCloseTo(21.4571843, 5);
    expect(r.effectiveAnnualRatePercent).toBeCloseTo(23.6983842, 5);
  });

  it("same loan with a ৳2,000 upfront fee → 25.40% real", () => {
    const r = ok("100000", "12", "12", "monthly", "2000");
    expect(r.received).toBe(98000);
    expect(r.totalCost).toBeCloseTo(14000, 8);
    expect(r.realRatePercent).toBeCloseTo(25.3993352, 5);
    expect(r.effectiveAnnualRatePercent).toBeCloseTo(28.5750589, 5);
  });

  it("৳50,000 at 15% flat for 12 months, 52 weekly instalments → 28.14% real", () => {
    const r = ok("50000", "15", "12", "weekly", "");
    expect(r.instalmentCount).toBe(52);
    expect(r.totalInterest).toBeCloseTo(7500, 8);
    expect(r.instalment).toBeCloseTo(1105.7692308, 6);
    expect(r.periodicRatePercent).toBeCloseTo(0.5412377, 5);
    expect(r.realRatePercent).toBeCloseTo(28.1443596, 5);
    expect(r.effectiveAnnualRatePercent).toBeCloseTo(32.4036042, 5);
  });

  it("৳2,00,000 at 10% flat for 24 months → 18.16% real", () => {
    const r = ok("200000", "10", "24", "monthly", "");
    expect(r.instalment).toBeCloseTo(10000, 8);
    expect(r.realRatePercent).toBeCloseTo(18.1570127, 5);
    expect(r.effectiveAnnualRatePercent).toBeCloseTo(19.7469011, 5);
  });
});

describe("solver", () => {
  it("round-trips: the instalments discounted at the answer equal the money received", () => {
    for (const [received, inst, n] of [
      [98000, 9333.33, 12],
      [1, 0.1, 30],
      [50000, 1105.77, 52],
      [100, 60, 2],
    ] as const) {
      const i = solvePeriodicRate(received, inst, n);
      expect(presentValue(inst, i, n)).toBeCloseTo(received, 6);
    }
  });
  it("is 0 when nothing extra is repaid", () => {
    expect(solvePeriodicRate(1000, 100, 10)).toBe(0);
  });
});

describe("edge cases", () => {
  it("0% flat, no fee → 0% real", () => {
    const r = ok("100000", "0", "12", "monthly", "");
    expect(r.totalInterest).toBe(0);
    expect(r.realRatePercent).toBe(0);
    expect(r.effectiveAnnualRatePercent).toBe(0);
  });
  it("0% flat with a fee → positive real rate", () => {
    const r = ok("100000", "0", "12", "monthly", "1000");
    expect(r.realRatePercent).toBeGreaterThan(0);
  });
  it("real rate is above the flat rate for any positive flat rate", () => {
    expect(ok("100000", "1", "36", "monthly", "").realRatePercent).toBeGreaterThan(1);
  });
  it("accepts a fee just below the amount and rejects fee ≥ amount", () => {
    expect(ok("1000", "10", "6", "monthly", "999").realRatePercent).toBeGreaterThan(100);
    const bad = calculateFlatRate("1000", "10", "6", "monthly", "1000");
    expect(bad).toEqual({ ok: false, errors: [{ field: "fee", code: "fee-too-large" }] });
  });
  it("counts weekly instalments as 52 a year, at least 1", () => {
    expect(instalmentCount(6, "weekly")).toBe(26);
    expect(instalmentCount(1, "weekly")).toBe(4);
    expect(instalmentCount(24, "monthly")).toBe(24);
  });
  it("accepts the maximums and rejects just beyond them", () => {
    expect(calculateFlatRate("1000", String(MAX_FLAT_RATE), String(MAX_TERM_MONTHS), "weekly", "").ok).toBe(true);
    expect(calculateFlatRate("1000", "100.01", String(MAX_TERM_MONTHS + 1), "monthly", "").ok).toBe(false);
  });
});

describe("validation", () => {
  it("reports every problem together", () => {
    const c = calculateFlatRate("", "x", "1.5", "monthly", "-1");
    expect(c).toEqual({
      ok: false,
      errors: [
        { field: "amount", code: "missing" },
        { field: "rate", code: "invalid" },
        { field: "months", code: "not-integer" },
        { field: "fee", code: "too-small" },
      ],
    });
  });
  it("rejects a zero amount and a zero term", () => {
    const c = calculateFlatRate("0", "10", "0", "monthly", "");
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.errors.map((e) => e.code)).toEqual(["too-small", "too-small"]);
  });
  it("accepts Bangla digits and lakh grouping", () => {
    const r = ok("১,০০,০০০", "১২", "১২", "monthly", "");
    expect(r.realRatePercent).toBeCloseTo(21.4571843, 5);
  });
});

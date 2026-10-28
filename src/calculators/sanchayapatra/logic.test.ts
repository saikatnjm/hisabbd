import { describe, expect, it } from "vitest";
import { roundTo } from "@/lib/number";
import {
  calculateSanchayapatra,
  DEFAULT_TAX_RATE,
  MAX_AMOUNT,
  maturityRate,
  payoutCount,
  RATE_TIER_LIMIT,
  rateTierFor,
  SANCHAYAPATRA_SCHEMES,
  SANCHAYAPATRA_SOURCES,
  SCHEME_IDS,
  SOURCE_TAX_RULES,
  yearlyProfit,
  type SanchayapatraCalculation,
  type SanchayapatraInputs,
  type SchemeId,
} from "./logic";

function ok(scheme: SchemeId, amount: string, rate: string, tax: string) {
  const calc = calculateSanchayapatra({ scheme, amount, rate, tax });
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: SanchayapatraCalculation) => (calc.ok ? [] : calc.errors);
const paisa = (value: number) => roundTo(value, 2);

describe("scheme data", () => {
  it("matches the IRD order of 30 June 2025 (maturity rates)", () => {
    expect(maturityRate("bangladesh", "upTo")).toBe(11.83);
    expect(maturityRate("bangladesh", "above")).toBe(11.8);
    expect(maturityRate("threeMonth", "upTo")).toBe(11.82);
    expect(maturityRate("threeMonth", "above")).toBe(11.77);
    expect(maturityRate("paribar", "upTo")).toBe(11.93);
    expect(maturityRate("paribar", "above")).toBe(11.8);
    expect(maturityRate("pensioner", "upTo")).toBe(11.98);
    expect(maturityRate("pensioner", "above")).toBe(11.8);
  });

  it("has one year-end rate per year of the term, rising each year, in both tiers", () => {
    for (const id of SCHEME_IDS) {
      const scheme = SANCHAYAPATRA_SCHEMES[id];
      for (const rates of [scheme.rateTiers.upTo, scheme.rateTiers.above]) {
        expect(rates).toHaveLength(scheme.tenureMonths / 12);
        for (let i = 1; i < rates.length; i++) expect(rates[i]!).toBeGreaterThan(rates[i - 1]!);
      }
    }
  });

  it("every scheme has an https source, an effective date and a checked date", () => {
    for (const id of SCHEME_IDS) {
      const scheme = SANCHAYAPATRA_SCHEMES[id];
      expect(scheme.id).toBe(id);
      expect(scheme.name.length).toBeGreaterThan(0);
      expect(scheme.nameBn.length).toBeGreaterThan(0);
      expect(scheme.source.url).toMatch(/^https:\/\//);
      expect(scheme.effectiveFrom).toBe("2025-07-01");
      expect(scheme.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("pays monthly, quarterly or at maturity as the NSD sheets say", () => {
    expect(SANCHAYAPATRA_SCHEMES.paribar.payout).toBe("monthly");
    expect(SANCHAYAPATRA_SCHEMES.pensioner.payout).toBe("monthly");
    expect(SANCHAYAPATRA_SCHEMES.threeMonth.payout).toBe("quarterly");
    expect(SANCHAYAPATRA_SCHEMES.bangladesh.payout).toBe("maturity");
    expect(payoutCount(SANCHAYAPATRA_SCHEMES.paribar)).toBe(60);
    expect(payoutCount(SANCHAYAPATRA_SCHEMES.threeMonth)).toBe(12);
    expect(payoutCount(SANCHAYAPATRA_SCHEMES.bangladesh)).toBe(1);
  });

  it("pre-fills only the confirmed 10% tax; other tax rules are flagged unconfirmed", () => {
    expect(DEFAULT_TAX_RATE).toBe(10);
    expect(SOURCE_TAX_RULES.standard.confirmedForFy2026_27).toBe(true);
    expect(SOURCE_TAX_RULES.smallHolder.value).toBe(5);
    expect(SOURCE_TAX_RULES.smallHolder.confirmedForFy2026_27).toBe(false);
    expect(SOURCE_TAX_RULES.pensionerSmall.value).toBe(0);
    expect(SOURCE_TAX_RULES.pensionerSmall.confirmedForFy2026_27).toBe(false);
  });

  it("lists each page source once", () => {
    const urls = SANCHAYAPATRA_SOURCES.map((s) => s.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(url).toMatch(/^https:\/\//);
  });
});

describe("rate tier", () => {
  it("an amount above ৳7,50,000 is always in the upper tier", () => {
    expect(rateTierFor(750_001, "upTo")).toBe("above");
    expect(rateTierFor(RATE_TIER_LIMIT, "upTo")).toBe("upTo");
    expect(rateTierFor(100_000, "above")).toBe("above");
    expect(rateTierFor(null, "upTo")).toBe("upTo");
  });
});

describe("worked examples (same numbers as the page)", () => {
  it("monthly: Paribar ৳1,00,000 at 11.93%, 10% tax", () => {
    const r = ok("paribar", "100000", "11.93", "10");
    expect(r.payments).toBe(60);
    expect(paisa(r.grossPerPayment)).toBe(994.17);
    expect(paisa(r.taxPerPayment)).toBe(99.42);
    expect(paisa(r.netPerPayment)).toBe(894.75);
    expect(r.totalGross).toBeCloseTo(59_650, 8);
    expect(r.totalTax).toBeCloseTo(5_965, 8);
    expect(r.totalNet).toBeCloseTo(53_685, 8);
    expect(r.totalReceived).toBeCloseTo(153_685, 8);
    expect(r.receivedAtMaturity).toBe(100_000);
  });

  it("quarterly: 3-month ৳1,00,000 at 11.82%, 10% tax", () => {
    const r = ok("threeMonth", "100000", "11.82", "10");
    expect(r.payments).toBe(12);
    expect(r.grossPerPayment).toBeCloseTo(2_955, 8);
    expect(r.taxPerPayment).toBeCloseTo(295.5, 8);
    expect(r.netPerPayment).toBeCloseTo(2_659.5, 8);
    expect(r.totalGross).toBeCloseTo(35_460, 8);
    expect(r.totalTax).toBeCloseTo(3_546, 8);
    expect(r.totalNet).toBeCloseTo(31_914, 8);
    expect(r.totalReceived).toBeCloseTo(131_914, 8);
  });

  it("at maturity: Bangladesh ৳1,00,000 at 11.83%, 10% tax", () => {
    const r = ok("bangladesh", "100000", "11.83", "10");
    expect(r.payments).toBe(1);
    expect(r.totalGross).toBeCloseTo(59_150, 8);
    expect(r.grossPerPayment).toBeCloseTo(59_150, 8);
    expect(r.totalTax).toBeCloseTo(5_915, 8);
    expect(r.totalNet).toBeCloseTo(53_235, 8);
    expect(r.receivedAtMaturity).toBeCloseTo(153_235, 8);
    expect(r.totalReceived).toBeCloseTo(153_235, 8);
  });

  it("zero tax: Pensioner ৳5,00,000 at 11.98%, 0% tax", () => {
    const r = ok("pensioner", "500000", "11.98", "0");
    expect(paisa(r.grossPerPayment)).toBe(4_991.67);
    expect(r.taxPerPayment).toBe(0);
    expect(r.totalGross).toBeCloseTo(299_500, 8);
    expect(r.totalNet).toBeCloseTo(299_500, 8);
  });

  it("upper tier: Paribar ৳10,00,000 at 11.80%, 10% tax", () => {
    const r = ok("paribar", "1000000", String(maturityRate("paribar", "above")), "10");
    expect(paisa(r.grossPerPayment)).toBe(9_833.33);
    expect(paisa(r.taxPerPayment)).toBe(983.33);
    expect(paisa(r.netPerPayment)).toBe(8_850);
    expect(r.totalNet).toBeCloseTo(531_000, 6);
  });
});

describe("formula", () => {
  it("simple yearly profit, no compounding", () => {
    expect(yearlyProfit(100_000, 11.93)).toBeCloseTo(11_930, 10);
    const r = ok("bangladesh", "100000", "10", "0");
    expect(r.totalGross).toBeCloseTo(50_000, 10); // 5 × 10,000, not 1.1^5 − 1
  });

  it("payment × count equals the total, and gross = tax + net", () => {
    for (const id of SCHEME_IDS) {
      const r = ok(id, "123456.78", "11.5", "7.5");
      expect(r.grossPerPayment * r.payments).toBeCloseTo(r.totalGross, 8);
      expect(r.totalTax + r.totalNet).toBeCloseTo(r.totalGross, 8);
      expect(r.taxPerPayment + r.netPerPayment).toBeCloseTo(r.grossPerPayment, 10);
    }
  });

  it("a 0% rate gives no profit", () => {
    const r = ok("paribar", "100000", "0", "10");
    expect(r.totalGross).toBe(0);
    expect(r.totalReceived).toBe(100_000);
  });

  it("100% tax leaves no net profit", () => {
    const r = ok("threeMonth", "100000", "11.82", "100");
    expect(r.totalNet).toBeCloseTo(0, 10);
  });
});

describe("input parsing", () => {
  it("accepts Bangla digits and lakh grouping", () => {
    const a = ok("paribar", "১,০০,০০০", "১১.৯৩", "১০");
    const b = ok("paribar", "1,00,000", "11.93", "10");
    expect(a.totalNet).toBeCloseTo(53_685, 8);
    expect(b.totalNet).toBeCloseTo(53_685, 8);
  });
});

describe("validation", () => {
  const base: SanchayapatraInputs = { scheme: "paribar", amount: "100000", rate: "11.93", tax: "10" };

  it("amount limits ৳1,000 to 10^9", () => {
    expect(calculateSanchayapatra({ ...base, amount: "1000" }).ok).toBe(true);
    expect(calculateSanchayapatra({ ...base, amount: String(MAX_AMOUNT) }).ok).toBe(true);
    expect(errors(calculateSanchayapatra({ ...base, amount: "999.99" }))).toEqual([
      { field: "amount", code: "too-small" },
    ]);
    expect(errors(calculateSanchayapatra({ ...base, amount: "1000000001" }))).toEqual([
      { field: "amount", code: "too-large" },
    ]);
  });

  it("rate and tax limits 0 to 100", () => {
    expect(calculateSanchayapatra({ ...base, rate: "100", tax: "100" }).ok).toBe(true);
    expect(errors(calculateSanchayapatra({ ...base, rate: "-1" }))).toEqual([{ field: "rate", code: "too-small" }]);
    expect(errors(calculateSanchayapatra({ ...base, rate: "100.01" }))).toEqual([
      { field: "rate", code: "too-large" },
    ]);
    expect(errors(calculateSanchayapatra({ ...base, tax: "-0.5" }))).toEqual([{ field: "tax", code: "too-small" }]);
    expect(errors(calculateSanchayapatra({ ...base, tax: "101" }))).toEqual([{ field: "tax", code: "too-large" }]);
  });

  it("missing and invalid fields", () => {
    expect(errors(calculateSanchayapatra({ ...base, amount: "" }))).toEqual([{ field: "amount", code: "missing" }]);
    expect(errors(calculateSanchayapatra({ ...base, rate: "abc" }))).toEqual([{ field: "rate", code: "invalid" }]);
    expect(errors(calculateSanchayapatra({ ...base, tax: "  " }))).toEqual([{ field: "tax", code: "missing" }]);
  });

  it("reports every invalid field together, in form order", () => {
    expect(errors(calculateSanchayapatra({ scheme: "bangladesh", amount: "", rate: "x", tax: "200" }))).toEqual([
      { field: "amount", code: "missing" },
      { field: "rate", code: "invalid" },
      { field: "tax", code: "too-large" },
    ]);
  });
});

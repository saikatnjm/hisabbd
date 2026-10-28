import { describe, expect, it } from "vitest";
import {
  calculateVat,
  MAX_AMOUNT,
  VAT_RATE_PRESETS,
  VAT_RATE_SOURCES,
  vatInGross,
  vatOnNet,
  type VatCalculation,
  type VatMode,
} from "./logic";

function ok(mode: VatMode, amount: string, rate: string) {
  const calc = calculateVat(mode, amount, rate);
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: VatCalculation) => (calc.ok ? [] : calc.errors);

describe("rate presets", () => {
  it("standard rate is 15% with a source and a checked date", () => {
    expect(VAT_RATE_PRESETS.standard.value).toBe(15);
    expect(VAT_RATE_PRESETS.standard.source.url).toMatch(/^https:\/\/nbr\.gov\.bd\//);
  });

  it("every preset has a rate in range, an https source and a YYYY-MM-DD date", () => {
    for (const preset of Object.values(VAT_RATE_PRESETS)) {
      expect(preset.value).toBeGreaterThanOrEqual(0);
      expect(preset.value).toBeLessThanOrEqual(100);
      expect(preset.source.title.length).toBeGreaterThan(0);
      expect(preset.source.url).toMatch(/^https:\/\//);
      expect(preset.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("lists each source once", () => {
    const urls = VAT_RATE_SOURCES.map((s) => s.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const preset of Object.values(VAT_RATE_PRESETS)) expect(urls).toContain(preset.source.url);
  });
});

describe("core formulas", () => {
  it("vatOnNet is net × r ÷ 100", () => {
    expect(vatOnNet(1000, 15)).toBeCloseTo(150, 10);
    expect(vatOnNet(1000, 7.5)).toBeCloseTo(75, 10);
    expect(vatOnNet(1000, 0)).toBe(0);
  });

  it("vatInGross is gross × r ÷ (100 + r)", () => {
    expect(vatInGross(1150, 15)).toBeCloseTo(150, 10);
    expect(vatInGross(1000, 15)).toBeCloseTo(130.4347826087, 10);
    expect(vatInGross(200, 100)).toBeCloseTo(100, 10);
    expect(vatInGross(1000, 0)).toBe(0);
  });

  it("the common mistake: 15% of the gross is not the VAT inside it", () => {
    expect(vatOnNet(1150, 15)).toBeCloseTo(172.5, 10);
    expect(vatInGross(1150, 15)).toBeCloseTo(150, 10);
  });
});

describe("add VAT", () => {
  it("৳1,000 + 15% = ৳1,150", () => {
    const r = ok("add", "1000", "15");
    expect(r).toEqual({ mode: "add", rate: 15, net: 1000, vat: 150, gross: 1150 });
  });

  it("keeps paisa: ৳2,499.50 + 15% = ৳2,874.43", () => {
    const r = ok("add", "2499.50", "15");
    // 2,499.50 × 0.15 = 374.925 → 374.93
    expect(r.vat).toBe(374.93);
    expect(r.gross).toBe(2874.43);
  });

  it("reduced rate 7.5%", () => {
    const r = ok("add", "1000", "7.5");
    expect(r.vat).toBe(75);
    expect(r.gross).toBe(1075);
  });

  it("0% adds nothing", () => {
    const r = ok("add", "1500", "0");
    expect(r.vat).toBe(0);
    expect(r.gross).toBe(1500);
  });

  it("rounds half away from zero to paisa", () => {
    // 0.10 × 5 ÷ 100 = 0.005 → 0.01
    const r = ok("add", "0.1", "5");
    expect(r.vat).toBe(0.01);
    expect(r.gross).toBe(0.11);
  });

  it("rounds the entered amount to paisa first", () => {
    const r = ok("add", "100.004", "15");
    expect(r.net).toBe(100);
    expect(r.vat).toBe(15);
    expect(r.gross).toBe(115);
  });
});

describe("remove VAT", () => {
  it("৳1,150 including 15% → ৳1,000 net + ৳150 VAT", () => {
    const r = ok("remove", "1150", "15");
    expect(r).toEqual({ mode: "remove", rate: 15, net: 1000, vat: 150, gross: 1150 });
  });

  it("keeps paisa: ৳1,000 including 15% → ৳869.57 net + ৳130.43 VAT", () => {
    const r = ok("remove", "1000", "15");
    expect(r.vat).toBe(130.43);
    expect(r.net).toBe(869.57);
    expect(r.gross).toBe(1000);
  });

  it("reduced rate 7.5%", () => {
    const r = ok("remove", "1075", "7.5");
    expect(r.vat).toBe(75);
    expect(r.net).toBe(1000);
  });

  it("100% VAT is half the gross", () => {
    const r = ok("remove", "200", "100");
    expect(r.vat).toBe(100);
    expect(r.net).toBe(100);
  });

  it("0% removes nothing", () => {
    const r = ok("remove", "999.99", "0");
    expect(r.vat).toBe(0);
    expect(r.net).toBe(999.99);
  });

  it("one paisa including 15% has no VAT left after rounding", () => {
    // 0.01 × 15 ÷ 115 = 0.0013… → 0.00
    const r = ok("remove", "0.01", "15");
    expect(r.vat).toBe(0);
    expect(r.net).toBe(0.01);
  });
});

describe("both directions", () => {
  it("add then remove gets back to the start", () => {
    const added = ok("add", "1000", "15");
    const removed = ok("remove", String(added.gross), "15");
    expect(removed.net).toBe(1000);
    expect(removed.vat).toBe(150);
  });

  it("net + VAT = gross exactly, to the paisa", () => {
    const cases: [string, string][] = [
      ["1234.56", "15"],
      ["999.99", "15"],
      ["0.07", "15"],
      ["123456789.99", "7.5"],
      ["333.33", "12.75"],
      ["10.05", "15"],
    ];
    for (const mode of ["add", "remove"] as const) {
      for (const [amount, rate] of cases) {
        const r = ok(mode, amount, rate);
        expect(roundCents(r.net + r.vat)).toBe(roundCents(r.gross));
        for (const value of [r.net, r.vat, r.gross]) expect(roundCents(value)).toBe(value);
      }
    }
  });

  it("accepts Indian grouping commas and Bangla digits", () => {
    expect(ok("add", "1,00,000", "15").gross).toBe(115000);
    expect(ok("remove", "১১৫০", "১৫").net).toBe(1000);
  });
});

describe("validation", () => {
  it("requires an amount and a rate", () => {
    expect(errors(calculateVat("add", "", "15"))).toEqual([{ field: "amount", code: "missing" }]);
    expect(errors(calculateVat("add", "1000", ""))).toEqual([{ field: "rate", code: "missing" }]);
    expect(errors(calculateVat("remove", "", ""))).toEqual([
      { field: "amount", code: "missing" },
      { field: "rate", code: "missing" },
    ]);
  });

  it("rejects text", () => {
    expect(errors(calculateVat("add", "abc", "15"))).toEqual([{ field: "amount", code: "invalid" }]);
    expect(errors(calculateVat("add", "1000", "15%"))).toEqual([{ field: "rate", code: "invalid" }]);
  });

  it("amount must be at least one paisa", () => {
    expect(errors(calculateVat("add", "0", "15"))).toEqual([{ field: "amount", code: "too-small" }]);
    expect(errors(calculateVat("add", "-100", "15"))).toEqual([{ field: "amount", code: "too-small" }]);
    expect(errors(calculateVat("remove", "0.009", "15"))).toEqual([{ field: "amount", code: "too-small" }]);
    expect(ok("add", "0.01", "15").gross).toBe(0.01);
  });

  it("amount has an upper limit", () => {
    expect(ok("add", String(MAX_AMOUNT), "15").gross).toBe(1_150_000_000_000);
    expect(ok("remove", String(MAX_AMOUNT), "100").net).toBe(500_000_000_000);
    expect(errors(calculateVat("add", "1000000000000.01", "15"))).toEqual([{ field: "amount", code: "too-large" }]);
  });

  it("rate must be from 0 to 100", () => {
    expect(errors(calculateVat("add", "1000", "-1"))).toEqual([{ field: "rate", code: "too-small" }]);
    expect(errors(calculateVat("add", "1000", "100.01"))).toEqual([{ field: "rate", code: "too-large" }]);
    expect(ok("add", "1000", "100").gross).toBe(2000);
    expect(ok("add", "1000", "0").gross).toBe(1000);
  });

  it("reports all invalid fields together", () => {
    expect(errors(calculateVat("add", "0", "200")).map((e) => e.field)).toEqual(["amount", "rate"]);
  });
});

function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}

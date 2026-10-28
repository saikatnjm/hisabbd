import { describe, expect, it } from "vitest";
import {
  calculateMfsCharge,
  chargeOn,
  MAX_AMOUNT,
  MAX_RATE,
  maxCashForBalance,
  MFS_CHARGE_PRESETS,
  MFS_CHARGE_SOURCES,
  MFS_PRESET_KEYS,
  MFS_PROVIDERS,
  MFS_RATES_CHECKED_ON,
  presetsForProvider,
  roundedCharge,
  type MfsChargeCalculation,
  type MfsChargeResult,
} from "./logic";

function ok(calc: MfsChargeCalculation): MfsChargeResult {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

function errors(calc: MfsChargeCalculation) {
  if (calc.ok) throw new Error("expected errors");
  return calc.errors;
}

describe("presets", () => {
  it("has the confirmed rates per ৳1,000 checked on 28 October 2026", () => {
    expect(MFS_CHARGE_PRESETS["bkash-priyo"].ratePerThousand).toBe(13.95);
    expect(MFS_CHARGE_PRESETS["bkash-agent"].ratePerThousand).toBe(18.5);
    expect(MFS_CHARGE_PRESETS["nagad-ussd"].ratePerThousand).toBe(15);
    expect(MFS_CHARGE_PRESETS["nagad-islamic-app"].ratePerThousand).toBe(15);
    expect(MFS_CHARGE_PRESETS["rocket-agent"].ratePerThousand).toBe(16.7);
    expect(MFS_CHARGE_PRESETS["rocket-atm"].ratePerThousand).toBe(9);
    expect(MFS_CHARGE_PRESETS["rocket-branch"].ratePerThousand).toBe(9);
    expect(MFS_CHARGE_PRESETS["upay-agent"].ratePerThousand).toBe(14);
    expect(MFS_CHARGE_PRESETS["upay-atm"].ratePerThousand).toBe(8);
  });

  it("leaves unconfirmed channels for the user to fill in", () => {
    expect(MFS_CHARGE_PRESETS["bkash-atm"].ratePerThousand).toBeNull();
    expect(MFS_CHARGE_PRESETS["nagad-app"].ratePerThousand).toBeNull();
  });

  it("gives every preset an https source, a date and notes", () => {
    for (const key of MFS_PRESET_KEYS) {
      const preset = MFS_CHARGE_PRESETS[key];
      expect(preset.source.url).toMatch(/^https:\/\//);
      expect(preset.source.title.length).toBeGreaterThan(0);
      expect(preset.notes.length).toBeGreaterThan(0);
      expect(preset.checkedOn).toBe(MFS_RATES_CHECKED_ON);
    }
    expect(MFS_RATES_CHECKED_ON).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Set(MFS_CHARGE_SOURCES.map((s) => s.url)).size).toBe(MFS_CHARGE_SOURCES.length);
  });

  it("groups presets by provider, every provider having at least one", () => {
    for (const provider of MFS_PROVIDERS) expect(presetsForProvider(provider).length).toBeGreaterThan(0);
    expect(presetsForProvider("bkash")).toEqual(["bkash-priyo", "bkash-agent", "bkash-atm"]);
    expect(MFS_PROVIDERS.flatMap(presetsForProvider)).toHaveLength(MFS_PRESET_KEYS.length);
  });
});

describe("chargeOn / roundedCharge", () => {
  it("is cash × rate ÷ 1,000", () => {
    expect(chargeOn(1000, 13.95)).toBeCloseTo(13.95, 10);
    expect(chargeOn(4931.21, 13.95)).toBeCloseTo(68.7903795, 10);
  });

  it("rounds half a paisa up", () => {
    // ৳10 at ৳18.50 per ৳1,000 = ৳0.185
    expect(roundedCharge(10, 18.5)).toBe(0.19);
    expect(roundedCharge(1234.56, 14)).toBe(17.28);
  });
});

describe("cash-out mode (worked examples)", () => {
  it("bKash Priyo Agent: ৳1,000 → ৳13.95 charge, ৳1,013.95 deducted", () => {
    const r = ok(calculateMfsCharge("cash-out", "1000", "13.95"));
    expect(r).toMatchObject({ cash: 1000, charge: 13.95, total: 1013.95, balance: null, leftover: null, wholeTaka: null });
    expect(r.effectivePercent).toBeCloseTo(1.395, 10);
  });

  it("bKash other agent: ৳5,000 → ৳92.50 charge, ৳5,092.50 deducted", () => {
    const r = ok(calculateMfsCharge("cash-out", "5000", "18.50"));
    expect(r).toMatchObject({ cash: 5000, charge: 92.5, total: 5092.5 });
    expect(r.effectivePercent).toBeCloseTo(1.85, 10);
  });

  it("Rocket agent: ৳2,500 → ৳41.75 charge, ৳2,541.75 deducted", () => {
    const r = ok(calculateMfsCharge("cash-out", "2500", "16.7"));
    expect(r).toMatchObject({ cash: 2500, charge: 41.75, total: 2541.75 });
  });

  it("Nagad USSD: ৳3,000 → ৳45 charge, ৳3,045 deducted", () => {
    const r = ok(calculateMfsCharge("cash-out", "3000", "15"));
    expect(r).toMatchObject({ cash: 3000, charge: 45, total: 3045 });
  });

  it("rounds an amount with paisa", () => {
    const r = ok(calculateMfsCharge("cash-out", "1234.56", "14"));
    expect(r).toMatchObject({ cash: 1234.56, charge: 17.28, total: 1251.84 });
  });

  it("rounds the entered amount to paisa first", () => {
    const r = ok(calculateMfsCharge("cash-out", "1000.004", "13.95"));
    expect(r).toMatchObject({ cash: 1000, charge: 13.95 });
  });

  it("charges nothing at a zero rate", () => {
    const r = ok(calculateMfsCharge("cash-out", "500", "0"));
    expect(r).toMatchObject({ cash: 500, charge: 0, total: 500, effectivePercent: 0 });
  });
});

describe("balance mode (worked examples)", () => {
  it("৳10,000 at ৳18.50 → ৳9,818.36 cash + ৳181.64 charge, nothing left", () => {
    const r = ok(calculateMfsCharge("balance", "10000", "18.5"));
    expect(r).toMatchObject({ balance: 10000, cash: 9818.36, charge: 181.64, total: 10000, leftover: 0 });
    expect(r.wholeTaka).toEqual({ cash: 9818, charge: 181.63, total: 9999.63 });
  });

  it("৳5,000 at ৳13.95 → ৳4,931.21 cash + ৳68.79 charge", () => {
    const r = ok(calculateMfsCharge("balance", "5000", "13.95"));
    expect(r).toMatchObject({ cash: 4931.21, charge: 68.79, total: 5000, leftover: 0 });
    expect(r.wholeTaka).toEqual({ cash: 4931, charge: 68.79, total: 4999.79 });
  });

  it("৳1,000 at ৳18.50 → ৳981.84 cash + ৳18.16 charge", () => {
    const r = ok(calculateMfsCharge("balance", "1000", "18.5"));
    expect(r).toMatchObject({ cash: 981.84, charge: 18.16, total: 1000, leftover: 0 });
    expect(r.wholeTaka).toEqual({ cash: 981, charge: 18.15, total: 999.15 });
  });

  it("is the inverse of cash-out mode", () => {
    for (const [amount, rate] of [
      ["1013.95", "13.95"],
      ["5092.50", "18.5"],
      ["2541.75", "16.7"],
      ["3045", "15"],
    ] as const) {
      const back = ok(calculateMfsCharge("balance", amount, rate));
      const forward = ok(calculateMfsCharge("cash-out", String(back.cash), rate));
      expect(forward.total).toBe(back.total);
      expect(back.total).toBe(Number(amount));
    }
  });

  it("returns the whole balance at a zero rate", () => {
    const r = ok(calculateMfsCharge("balance", "2500.50", "0"));
    expect(r).toMatchObject({ cash: 2500.5, charge: 0, total: 2500.5, leftover: 0 });
    expect(r.wholeTaka).toEqual({ cash: 2500, charge: 0, total: 2500 });
  });
});

describe("maxCashForBalance", () => {
  it("never exceeds the balance and one more paisa would", () => {
    for (const balance of [0.01, 1, 49.99, 100, 999.99, 1000, 12345.67, 30000, 200000]) {
      for (const rate of [0, 8, 9, 13.95, 14, 15, 16.7, 18.5, MAX_RATE]) {
        const cash = maxCashForBalance(balance, rate);
        const fits = (c: number) => Math.round(c * 100) + Math.round(roundedCharge(c, rate) * 100) <= Math.round(balance * 100);
        expect(fits(cash)).toBe(true);
        expect(fits(Math.round(cash * 100 + 1) / 100)).toBe(false);
      }
    }
  });

  it("keeps one paisa as cash when the charge on it rounds to zero", () => {
    expect(maxCashForBalance(0.01, 18.5)).toBe(0.01);
  });
});

describe("validation", () => {
  it("reports a missing amount and rate together", () => {
    expect(errors(calculateMfsCharge("cash-out", "", ""))).toEqual([
      { field: "amount", code: "missing" },
      { field: "rate", code: "missing" },
    ]);
  });

  it("rejects text", () => {
    expect(errors(calculateMfsCharge("balance", "abc", "13.95"))).toEqual([{ field: "amount", code: "invalid" }]);
    expect(errors(calculateMfsCharge("cash-out", "1000", "x"))).toEqual([{ field: "rate", code: "invalid" }]);
  });

  it("checks the amount limits", () => {
    expect(ok(calculateMfsCharge("cash-out", "0.01", "18.5")).charge).toBe(0);
    expect(errors(calculateMfsCharge("cash-out", "0", "18.5"))).toEqual([{ field: "amount", code: "too-small" }]);
    expect(errors(calculateMfsCharge("cash-out", "0.009", "18.5"))).toEqual([{ field: "amount", code: "too-small" }]);
    expect(ok(calculateMfsCharge("cash-out", String(MAX_AMOUNT), "18.5")).charge).toBe(185000);
    expect(errors(calculateMfsCharge("cash-out", String(MAX_AMOUNT + 0.01), "18.5"))).toEqual([
      { field: "amount", code: "too-large" },
    ]);
    expect(errors(calculateMfsCharge("cash-out", "-100", "18.5"))).toEqual([{ field: "amount", code: "too-small" }]);
  });

  it("checks the rate limits", () => {
    expect(ok(calculateMfsCharge("cash-out", "1000", String(MAX_RATE))).charge).toBe(100);
    expect(errors(calculateMfsCharge("cash-out", "1000", "100.01"))).toEqual([{ field: "rate", code: "too-large" }]);
    expect(errors(calculateMfsCharge("cash-out", "1000", "-1"))).toEqual([{ field: "rate", code: "too-small" }]);
  });

  it("accepts Bangla digits and lakh grouping", () => {
    expect(ok(calculateMfsCharge("cash-out", "১০০০", "১৩.৯৫"))).toMatchObject({ charge: 13.95, total: 1013.95 });
    expect(ok(calculateMfsCharge("cash-out", "1,00,000", "18.5"))).toMatchObject({ charge: 1850, total: 101850 });
  });
});

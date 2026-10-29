import { describe, expect, it } from "vitest";
import {
  calculateZakat,
  MAX_AMOUNT,
  NISAB_GRAMS,
  nisabAmount,
  zakatOn,
  type ZakatInput,
} from "./logic";

/** The worked example on the page (example prices, not today's). */
const EXAMPLE: ZakatInput = {
  basis: "silver",
  weightUnit: "bhori",
  cash: "50,000",
  bank: "3,00,000",
  goldWeight: "2",
  goldPrice: "2,00,000",
  silverPrice: "4,000",
  debts: "50,000",
};

describe("constants and helpers", () => {
  it("uses 7.5 bhori (87.48 g) of gold and 52.5 bhori (612.36 g) of silver", () => {
    expect(NISAB_GRAMS.gold).toBeCloseTo(87.48, 10);
    expect(NISAB_GRAMS.silver).toBeCloseTo(612.36, 10);
    expect(nisabAmount("gold", 200_000)).toBe(1_500_000);
    expect(nisabAmount("silver", 4_000)).toBe(210_000);
  });

  it("takes 2.5% (one-fortieth)", () => {
    expect(zakatOn(700_000)).toBe(17_500);
    expect(zakatOn(40)).toBe(1);
  });
});

describe("calculateZakat", () => {
  it("works out the page example on the silver nisab: ৳17,500 due", () => {
    const r = calculateZakat(EXAMPLE);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.goldValue).toBe(400_000);
    expect(r.result.totalAssets).toBe(750_000);
    expect(r.result.net).toBe(700_000);
    expect(r.result.nisab).toBe(210_000);
    expect(r.result.nisabBhori).toBe(52.5);
    expect(r.result.due).toBe(true);
    expect(r.result.zakat).toBe(17_500);
  });

  it("works out the same example on the gold nisab: not due", () => {
    const r = calculateZakat({ ...EXAMPLE, basis: "gold" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.nisab).toBe(1_500_000);
    expect(r.result.due).toBe(false);
    expect(r.result.zakat).toBe(0);
  });

  it("counts every asset and subtracts debts", () => {
    const r = calculateZakat({
      basis: "silver",
      weightUnit: "bhori",
      cash: "1000",
      bank: "2000",
      goldWeight: "0.5",
      goldPrice: "200000",
      silverWeight: "10",
      silverPrice: "4000",
      business: "3000",
      receivables: "4000",
      other: "5000",
      debts: "6000",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.goldValue).toBe(100_000);
    expect(r.result.silverValue).toBe(40_000);
    expect(r.result.totalAssets).toBe(155_000);
    expect(r.result.net).toBe(149_000);
    expect(r.result.due).toBe(false);
  });

  it("is due at exactly the nisab, including weights in grams", () => {
    // 87.48 g of gold at ৳2,00,000 a bhori = 7.5 bhori = ৳15,00,000, the gold nisab.
    const r = calculateZakat({ basis: "gold", weightUnit: "gram", goldWeight: "87.48", goldPrice: "200000" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.goldBhori).toBeCloseTo(7.5, 12);
    expect(r.result.due).toBe(true);
    expect(r.result.zakat).toBeCloseTo(37_500, 6);
  });

  it("is not due one paisa below the nisab", () => {
    const r = calculateZakat({ basis: "silver", weightUnit: "bhori", cash: "209999.99", silverPrice: "4000" });
    expect(r.ok && r.result.due).toBe(false);
    const at = calculateZakat({ basis: "silver", weightUnit: "bhori", cash: "210000", silverPrice: "4000" });
    expect(at.ok && at.result.zakat).toBe(5_250);
  });

  it("allows debts larger than assets (negative net, not due)", () => {
    const r = calculateZakat({ basis: "silver", weightUnit: "bhori", cash: "1000", debts: "5000", silverPrice: "4000" });
    expect(r.ok && r.result.net).toBe(-4_000);
    expect(r.ok && r.result.due).toBe(false);
    expect(r.ok && r.result.zakat).toBe(0);
  });

  it("accepts Bangla digits and keeps full precision", () => {
    const r = calculateZakat({ basis: "silver", weightUnit: "bhori", cash: "৩,০০,০০১", silverPrice: "৪০০০" });
    expect(r.ok && r.result.zakat).toBeCloseTo(7_500.025, 10);
  });

  it("needs at least one asset", () => {
    expect(calculateZakat({ basis: "silver", weightUnit: "bhori", silverPrice: "4000" })).toEqual({
      ok: false,
      errors: [{ field: "cash", code: "no-assets" }],
    });
    expect(calculateZakat({ basis: "silver", weightUnit: "bhori", cash: "0", silverPrice: "4000", debts: "10" })).toEqual({
      ok: false,
      errors: [{ field: "cash", code: "no-assets" }],
    });
  });

  it("asks for the chosen nisab metal's price", () => {
    expect(calculateZakat({ basis: "silver", weightUnit: "bhori", cash: "500000" })).toEqual({
      ok: false,
      errors: [{ field: "silverPrice", code: "needed-for-nisab" }],
    });
    expect(calculateZakat({ basis: "gold", weightUnit: "bhori", cash: "500000", silverPrice: "4000" })).toEqual({
      ok: false,
      errors: [{ field: "goldPrice", code: "needed-for-nisab" }],
    });
  });

  it("asks for a metal's price when its weight is entered", () => {
    expect(calculateZakat({ basis: "silver", weightUnit: "bhori", goldWeight: "2", silverPrice: "4000" })).toEqual({
      ok: false,
      errors: [{ field: "goldPrice", code: "missing" }],
    });
    expect(calculateZakat({ basis: "gold", weightUnit: "bhori", silverWeight: "60", goldPrice: "200000" })).toEqual({
      ok: false,
      errors: [{ field: "silverPrice", code: "missing" }],
    });
  });

  it("reports every invalid field together, in form order", () => {
    const r = calculateZakat({
      basis: "silver",
      weightUnit: "bhori",
      cash: "abc",
      bank: "-1",
      silverPrice: "",
      debts: "x",
    });
    expect(r).toEqual({
      ok: false,
      errors: [
        { field: "cash", code: "invalid" },
        { field: "bank", code: "too-small" },
        { field: "silverPrice", code: "needed-for-nisab" },
        { field: "debts", code: "invalid" },
      ],
    });
  });

  it("enforces the limits", () => {
    expect(calculateZakat({ basis: "silver", weightUnit: "bhori", cash: String(MAX_AMOUNT), silverPrice: "4000" }).ok).toBe(
      true,
    );
    expect(calculateZakat({ basis: "silver", weightUnit: "bhori", cash: String(MAX_AMOUNT + 1), silverPrice: "4000" })).toEqual({
      ok: false,
      errors: [{ field: "cash", code: "too-large" }],
    });
    expect(calculateZakat({ basis: "silver", weightUnit: "bhori", cash: "1", silverPrice: "100000001" })).toEqual({
      ok: false,
      errors: [{ field: "silverPrice", code: "too-large" }],
    });
    expect(
      calculateZakat({ basis: "gold", weightUnit: "gram", goldWeight: "1000000001", goldPrice: "200000" }),
    ).toEqual({ ok: false, errors: [{ field: "goldWeight", code: "too-large" }] });
  });

  it("ignores a price entered without a weight, except for the nisab", () => {
    const r = calculateZakat({ basis: "silver", weightUnit: "bhori", cash: "300000", goldPrice: "200000", silverPrice: "4000" });
    expect(r.ok && r.result.goldValue).toBe(0);
    expect(r.ok && r.result.zakat).toBe(7_500);
  });
});

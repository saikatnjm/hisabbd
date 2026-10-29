import { describe, expect, it } from "vitest";
import { calculateGoldValue, checkGoldWeight, convertGoldWeight, goldVat, makingCharge, type GoldValueInput } from "./logic";
import {
  bhoriBreakdown,
  bhoriToGrams,
  fromBhori,
  GOLD_UNIT_ORDER,
  GRAMS_PER_UNIT,
  gramsToBhori,
  MAX_WEIGHT_GRAMS,
  toBhori,
  traditionalToBhori,
} from "./units";

describe("units", () => {
  it("defines 1 bhori = 11.664 g = 16 ana = 96 roti = 960 point", () => {
    expect(bhoriToGrams(1)).toBe(11.664);
    expect(fromBhori(1, "ana")).toBe(16);
    expect(fromBhori(1, "roti")).toBe(96);
    expect(fromBhori(1, "point")).toBe(960);
    expect(gramsToBhori(11.664)).toBe(1);
  });

  it("gives the gram size of each unit", () => {
    expect(GRAMS_PER_UNIT.ana).toBeCloseTo(0.729, 12);
    expect(GRAMS_PER_UNIT.roti).toBeCloseTo(0.1215, 12);
    expect(GRAMS_PER_UNIT.point).toBeCloseTo(0.01215, 12);
  });

  it("round-trips every unit through bhori", () => {
    for (const unit of GOLD_UNIT_ORDER) {
      expect(fromBhori(toBhori(37.5, unit), unit)).toBeCloseTo(37.5, 10);
    }
    expect(toBhori(8, "ana")).toBe(0.5);
    expect(toBhori(6, "roti")).toBeCloseTo(1 / 16, 12);
    expect(toBhori(10, "point")).toBeCloseTo(1 / 96, 12);
  });

  it("adds traditional parts, carrying over large parts", () => {
    expect(traditionalToBhori({ bhori: 2, ana: 5, roti: 3, point: 0 })).toBeCloseTo(2.34375, 12);
    expect(traditionalToBhori({ bhori: 0, ana: 20, roti: 0, point: 0 })).toBe(1.25);
  });

  it("breaks a weight into bhori, ana, roti and point", () => {
    expect(bhoriBreakdown(1.5)).toEqual({ bhori: 1, ana: 8, roti: 0, point: 0 });
    expect(bhoriBreakdown(2.34375)).toEqual({ bhori: 2, ana: 5, roti: 3, point: 0 });
    expect(bhoriBreakdown(gramsToBhori(1))).toEqual({ bhori: 0, ana: 1, roti: 2, point: 2.3 });
    expect(bhoriBreakdown(gramsToBhori(10))).toEqual({ bhori: 0, ana: 13, roti: 4, point: 3.05 });
    expect(bhoriBreakdown(0)).toEqual({ bhori: 0, ana: 0, roti: 0, point: 0 });
  });

  it("never shows 10 point after rounding", () => {
    // 959.999 point rounds to 960.00 → exactly 1 bhori.
    expect(bhoriBreakdown(959.999 / 960)).toEqual({ bhori: 1, ana: 0, roti: 0, point: 0 });
    expect(bhoriBreakdown(9.996 / 960).point).toBe(0);
    expect(bhoriBreakdown(9.996 / 960).roti).toBe(1);
  });
});

describe("checkGoldWeight / convertGoldWeight", () => {
  it("converts the worked example 2 bhori 5 ana 3 roti to 27.3375 g", () => {
    const r = convertGoldWeight({ unit: "traditional", bhori: "2", ana: "5", roti: "3", point: "" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.weight.bhori).toBeCloseTo(2.34375, 12);
    expect(r.weight.grams).toBeCloseTo(27.3375, 10);
    expect(r.weight.totalAna).toBeCloseTo(37.5, 10);
    expect(r.weight.totalRoti).toBeCloseTo(225, 10);
    expect(r.weight.totalPoint).toBeCloseTo(2250, 10);
  });

  it("converts 10 g to 0.857… bhori (13 ana 4 roti 3.05 point)", () => {
    const r = convertGoldWeight({ unit: "gram", grams: "10" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.weight.bhori).toBeCloseTo(0.857338820301783, 12);
    expect(r.weight.breakdown).toEqual({ bhori: 0, ana: 13, roti: 4, point: 3.05 });
  });

  it("treats blank parts as 0 and accepts Bangla digits and grouping", () => {
    const r = checkGoldWeight({ unit: "traditional", bhori: "১", ana: "৮" });
    expect(r.ok && r.weight.bhori).toBe(1.5);
    const g = checkGoldWeight({ unit: "gram", grams: "1,166.4" });
    expect(g.ok && g.weight.bhori).toBeCloseTo(100, 10);
  });

  it("reads only the fields of the chosen unit", () => {
    const r = checkGoldWeight({ unit: "gram", bhori: "abc", grams: "11.664" });
    expect(r.ok && r.weight.bhori).toBe(1);
  });

  it("rejects an empty or zero weight on the first field", () => {
    expect(checkGoldWeight({ unit: "traditional" })).toEqual({ ok: false, errors: [{ field: "bhori", code: "no-weight" }] });
    expect(checkGoldWeight({ unit: "traditional", bhori: "0", ana: "0" })).toEqual({
      ok: false,
      errors: [{ field: "bhori", code: "no-weight" }],
    });
    expect(checkGoldWeight({ unit: "gram", grams: "" })).toEqual({ ok: false, errors: [{ field: "grams", code: "no-weight" }] });
  });

  it("reports every invalid part together", () => {
    expect(checkGoldWeight({ unit: "traditional", bhori: "x", ana: "-1", roti: "2", point: "y" })).toEqual({
      ok: false,
      errors: [
        { field: "bhori", code: "invalid" },
        { field: "ana", code: "too-small" },
        { field: "point", code: "invalid" },
      ],
    });
    expect(checkGoldWeight({ unit: "gram", grams: "-5" })).toEqual({ ok: false, errors: [{ field: "grams", code: "too-small" }] });
  });

  it("enforces the maximum weight", () => {
    expect(checkGoldWeight({ unit: "gram", grams: String(MAX_WEIGHT_GRAMS) }).ok).toBe(true);
    expect(checkGoldWeight({ unit: "gram", grams: String(MAX_WEIGHT_GRAMS + 1) })).toEqual({
      ok: false,
      errors: [{ field: "grams", code: "too-large" }],
    });
  });
});

function input(overrides: Partial<GoldValueInput> = {}): GoldValueInput {
  return {
    weight: { unit: "traditional", bhori: "1", ana: "8", roti: "", point: "" },
    purity: "22k",
    price: "2,20,000",
    makingType: "percent",
    making: "",
    vatType: "included",
    vat: "",
    ...overrides,
  };
}

describe("calculateGoldValue", () => {
  it("prices 1 bhori 8 ana at ৳2,20,000 with VAT included and no making charge", () => {
    const r = calculateGoldValue(input());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.goldValue).toBe(330_000);
    expect(r.result.makingCharge).toBe(0);
    expect(r.result.vat).toBe(0);
    expect(r.result.total).toBe(330_000);
    expect(r.result.purity).toBe("22k");
  });

  it("adds an 8% making charge (worked example: ৳3,56,400)", () => {
    const r = calculateGoldValue(input({ making: "8" }));
    expect(r.ok && r.result.makingCharge).toBeCloseTo(26_400, 8);
    expect(r.ok && r.result.total).toBeCloseTo(356_400, 8);
  });

  it("adds a making charge per bhori", () => {
    const r = calculateGoldValue(input({ makingType: "per-bhori", making: "5000" }));
    expect(r.ok && r.result.makingCharge).toBe(7_500);
    expect(r.ok && r.result.total).toBe(337_500);
  });

  it("adds percentage VAT on gold value + making (worked example: ৳3,74,220)", () => {
    const r = calculateGoldValue(input({ making: "8", vatType: "percent", vat: "5" }));
    expect(r.ok && r.result.vat).toBeCloseTo(17_820, 8);
    expect(r.ok && r.result.total).toBeCloseTo(374_220, 8);
  });

  it("adds VAT per bhori", () => {
    const r = calculateGoldValue(input({ vatType: "per-bhori", vat: "2500" }));
    expect(r.ok && r.result.vat).toBe(3_750);
    expect(r.ok && r.result.total).toBe(333_750);
  });

  it("prices a weight in grams", () => {
    const r = calculateGoldValue(input({ weight: { unit: "gram", grams: "5" }, price: "233280" }));
    // 5 g = 5 / 11.664 bhori; × 2,33,280 = ৳1,00,000.
    expect(r.ok && r.result.goldValue).toBeCloseTo(100_000, 8);
  });

  it("keeps full precision (no rounding in logic)", () => {
    const r = calculateGoldValue(input({ weight: { unit: "gram", grams: "1" }, price: "100000" }));
    expect(r.ok && r.result.goldValue).toBeCloseTo(8573.388203017833, 8);
  });

  it("requires a price above 0 and within the limit", () => {
    expect(calculateGoldValue(input({ price: "" }))).toEqual({ ok: false, errors: [{ field: "price", code: "missing" }] });
    expect(calculateGoldValue(input({ price: "0" }))).toEqual({ ok: false, errors: [{ field: "price", code: "too-small" }] });
    expect(calculateGoldValue(input({ price: "100000001" }))).toEqual({
      ok: false,
      errors: [{ field: "price", code: "too-large" }],
    });
    expect(calculateGoldValue(input({ price: "100000000" })).ok).toBe(true);
  });

  it("limits percentages to 0–100", () => {
    expect(calculateGoldValue(input({ making: "100" })).ok).toBe(true);
    expect(calculateGoldValue(input({ making: "100.5" }))).toEqual({
      ok: false,
      errors: [{ field: "making", code: "too-large" }],
    });
    expect(calculateGoldValue(input({ making: "150", makingType: "per-bhori" })).ok).toBe(true);
    expect(calculateGoldValue(input({ vatType: "percent", vat: "-1" }))).toEqual({
      ok: false,
      errors: [{ field: "vat", code: "too-small" }],
    });
  });

  it("needs a VAT figure only when VAT is added", () => {
    expect(calculateGoldValue(input({ vatType: "included", vat: "abc" })).ok).toBe(true);
    expect(calculateGoldValue(input({ vatType: "percent", vat: "" }))).toEqual({
      ok: false,
      errors: [{ field: "vat", code: "missing" }],
    });
  });

  it("reports weight, price, making and VAT errors together", () => {
    const r = calculateGoldValue(
      input({ weight: { unit: "traditional" }, price: "x", making: "y", vatType: "per-bhori", vat: "" }),
    );
    expect(r).toEqual({
      ok: false,
      errors: [
        { field: "bhori", code: "no-weight" },
        { field: "price", code: "invalid" },
        { field: "making", code: "invalid" },
        { field: "vat", code: "missing" },
      ],
    });
  });
});

describe("charge helpers", () => {
  it("computes making charge and VAT both ways", () => {
    expect(makingCharge("percent", 10, 2, 400_000)).toBe(40_000);
    expect(makingCharge("per-bhori", 3_000, 2, 400_000)).toBe(6_000);
    expect(goldVat("included", 5, 2, 400_000)).toBe(0);
    expect(goldVat("percent", 5, 2, 400_000)).toBe(20_000);
    expect(goldVat("per-bhori", 2_500, 2, 400_000)).toBe(5_000);
  });
});

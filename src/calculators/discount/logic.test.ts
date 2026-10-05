import { describe, expect, it } from "vitest";
import {
  applyDiscounts,
  calculateDiscount,
  combinedDiscountPercent,
  MAX_PRICE,
  type DiscountCalculation,
} from "./logic";

function ok(price: string, discount: string, extra: string | null = null) {
  const calc = calculateDiscount(price, discount, extra);
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: DiscountCalculation) => (calc.ok ? [] : calc.errors);

describe("core functions", () => {
  it("applyDiscounts applies each percentage to the reduced price", () => {
    expect(applyDiscounts(1000, [20])).toBeCloseTo(800, 10);
    expect(applyDiscounts(1000, [20, 10])).toBeCloseTo(720, 10);
    expect(applyDiscounts(1000, [])).toBe(1000);
    expect(applyDiscounts(1000, [100])).toBe(0);
  });

  it("combinedDiscountPercent is below the simple sum", () => {
    expect(combinedDiscountPercent([20, 10])).toBeCloseTo(28, 10);
    expect(combinedDiscountPercent([50, 50])).toBeCloseTo(75, 10);
    expect(combinedDiscountPercent([10])).toBeCloseTo(10, 10);
    expect(combinedDiscountPercent([12.5, 7.5])).toBeCloseTo(19.0625, 10);
    expect(combinedDiscountPercent([100, 50])).toBeCloseTo(100, 10);
    expect(combinedDiscountPercent([0, 0])).toBeCloseTo(0, 10);
  });
});

describe("single discount", () => {
  it("20% off 1,000", () => {
    const r = ok("1000", "20");
    expect(r.finalPrice).toBe(800);
    expect(r.youSave).toBe(200);
    expect(r.effectivePercent).toBeCloseTo(20, 10);
    expect(r.extraDiscountPercent).toBeNull();
    expect(r.priceAfterFirstDiscount).toBe(800);
    expect(r.simpleSumPercent).toBe(20);
  });

  it("keeps paisa", () => {
    const r = ok("999", "15");
    expect(r.finalPrice).toBe(849.15);
    expect(r.youSave).toBe(149.85);
  });

  it("0% off changes nothing", () => {
    const r = ok("1500", "0");
    expect(r.finalPrice).toBe(1500);
    expect(r.youSave).toBe(0);
    expect(r.effectivePercent).toBe(0);
  });

  it("100% off is free", () => {
    const r = ok("2500", "100");
    expect(r.finalPrice).toBe(0);
    expect(r.youSave).toBe(2500);
    expect(r.effectivePercent).toBeCloseTo(100, 10);
  });

  it("decimal discount and price", () => {
    const r = ok("999.99", "33.3");
    // 999.99 × 0.667 = 666.99333 → 666.99
    expect(r.finalPrice).toBe(666.99);
    expect(r.youSave).toBe(333);
  });

  it("rounds half away from zero to paisa", () => {
    // 10.05 × 0.5 = 5.025 → 5.03
    const r = ok("10.05", "50");
    expect(r.finalPrice).toBe(5.03);
    expect(r.youSave).toBe(5.02);
  });

  it("final price and savings always add up to the price", () => {
    const r = ok("1234.56", "17.35");
    expect(r.finalPrice + r.youSave).toBeCloseTo(1234.56, 8);
  });

  it("accepts Indian grouping commas and Bangla digits", () => {
    expect(ok("1,00,000", "25").finalPrice).toBe(75000);
    expect(ok("১০০০", "১০").finalPrice).toBe(900);
  });
});

describe("extra (stacked) discount", () => {
  it("20% then an extra 10% is 28%, not 30%", () => {
    const r = ok("1000", "20", "10");
    expect(r.priceAfterFirstDiscount).toBe(800);
    expect(r.finalPrice).toBe(720);
    expect(r.youSave).toBe(280);
    expect(r.effectivePercent).toBeCloseTo(28, 10);
    expect(r.simpleSumPercent).toBe(30);
    expect(r.extraDiscountPercent).toBe(10);
  });

  it("order of the two discounts doesn't change the final price", () => {
    expect(ok("1000", "10", "20").finalPrice).toBe(720);
    expect(ok("1000", "10", "20").effectivePercent).toBeCloseTo(28, 10);
  });

  it("two 50% discounts make 75%", () => {
    const r = ok("400", "50", "50");
    expect(r.finalPrice).toBe(100);
    expect(r.effectivePercent).toBeCloseTo(75, 10);
  });

  it("decimals", () => {
    const r = ok("1250.50", "12.5", "7.5");
    // 1250.5 × 0.875 = 1094.1875 → 1094.19; × 0.925 = 1012.1234375 → 1012.12
    expect(r.priceAfterFirstDiscount).toBe(1094.19);
    expect(r.finalPrice).toBe(1012.12);
    expect(r.youSave).toBe(238.38);
    expect(r.effectivePercent).toBeCloseTo(19.0625, 10);
  });

  it("0% extra discount is the same as none", () => {
    const r = ok("1000", "20", "0");
    expect(r.finalPrice).toBe(800);
    expect(r.effectivePercent).toBeCloseTo(20, 10);
  });

  it("100% in either place makes it free", () => {
    expect(ok("500", "100", "50").finalPrice).toBe(0);
    expect(ok("500", "50", "100").finalPrice).toBe(0);
    expect(ok("500", "100", "100").effectivePercent).toBeCloseTo(100, 10);
  });

  it("ignores the extra discount when it is off (null)", () => {
    expect(ok("1000", "20", null).finalPrice).toBe(800);
  });
});

describe("validation", () => {
  it("requires a price and a discount", () => {
    expect(errors(calculateDiscount("", "10", null))).toEqual([{ field: "price", code: "missing" }]);
    expect(errors(calculateDiscount("1000", "", null))).toEqual([{ field: "discount", code: "missing" }]);
    expect(errors(calculateDiscount("", "", null))).toEqual([
      { field: "price", code: "missing" },
      { field: "discount", code: "missing" },
    ]);
  });

  it("rejects text", () => {
    expect(errors(calculateDiscount("abc", "10", null))).toEqual([{ field: "price", code: "invalid" }]);
    expect(errors(calculateDiscount("1000", "10%", null))).toEqual([{ field: "discount", code: "invalid" }]);
  });

  it("price must be at least one paisa", () => {
    expect(errors(calculateDiscount("0", "10", null))).toEqual([{ field: "price", code: "too-small" }]);
    expect(errors(calculateDiscount("-100", "10", null))).toEqual([{ field: "price", code: "too-small" }]);
    expect(errors(calculateDiscount("0.001", "10", null))).toEqual([{ field: "price", code: "too-small" }]);
    expect(ok("0.01", "10").finalPrice).toBe(0.01);
  });

  it("price has an upper limit", () => {
    expect(ok(String(MAX_PRICE), "10").finalPrice).toBe(900_000_000_000);
    expect(errors(calculateDiscount("1000000000001", "10", null))).toEqual([{ field: "price", code: "too-large" }]);
  });

  it("discount must be from 0 to 100", () => {
    expect(errors(calculateDiscount("1000", "-1", null))).toEqual([{ field: "discount", code: "too-small" }]);
    expect(errors(calculateDiscount("1000", "100.01", null))).toEqual([{ field: "discount", code: "too-large" }]);
    expect(errors(calculateDiscount("1000", "150", null))).toEqual([{ field: "discount", code: "too-large" }]);
    expect(ok("1000", "100").finalPrice).toBe(0);
    expect(ok("1000", "0").finalPrice).toBe(1000);
  });

  it("validates the extra discount only when it is on", () => {
    expect(errors(calculateDiscount("1000", "10", ""))).toEqual([{ field: "extraDiscount", code: "missing" }]);
    expect(errors(calculateDiscount("1000", "10", "101"))).toEqual([{ field: "extraDiscount", code: "too-large" }]);
    expect(errors(calculateDiscount("1000", "10", "-5"))).toEqual([{ field: "extraDiscount", code: "too-small" }]);
    expect(errors(calculateDiscount("1000", "10", "x"))).toEqual([{ field: "extraDiscount", code: "invalid" }]);
  });

  it("reports all invalid fields together", () => {
    expect(errors(calculateDiscount("0", "200", "-1")).map((e) => e.field)).toEqual([
      "price",
      "discount",
      "extraDiscount",
    ]);
  });
});

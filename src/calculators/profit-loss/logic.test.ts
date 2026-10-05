import { describe, expect, it } from "vitest";
import {
  calculateProfitLoss,
  getStatus,
  marginOnSelling,
  MAX_PRICE,
  percentOnCost,
  type ProfitLossCalculation,
} from "./logic";

function ok(cost: string, selling: string) {
  const calc = calculateProfitLoss(cost, selling);
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: ProfitLossCalculation) => (calc.ok ? [] : calc.errors);

describe("core functions", () => {
  it("getStatus", () => {
    expect(getStatus(80, 100)).toBe("profit");
    expect(getStatus(100, 80)).toBe("loss");
    expect(getStatus(100, 100)).toBe("break-even");
  });

  it("percentOnCost is signed and based on cost", () => {
    expect(percentOnCost(80, 100)).toBe(25);
    expect(percentOnCost(100, 80)).toBe(-20);
    expect(percentOnCost(100, 100)).toBe(0);
    expect(percentOnCost(500, 0)).toBe(-100);
    expect(() => percentOnCost(0, 10)).toThrow();
  });

  it("marginOnSelling is signed and based on selling price", () => {
    expect(marginOnSelling(80, 100)).toBe(20);
    expect(marginOnSelling(100, 80)).toBe(-25);
    expect(marginOnSelling(100, 100)).toBe(0);
    expect(() => marginOnSelling(100, 0)).toThrow();
  });
});

describe("profit", () => {
  it("cost 80, selling 100", () => {
    const r = ok("80", "100");
    expect(r.status).toBe("profit");
    expect(r.amount).toBe(20);
    expect(r.percentOnCost).toBe(25);
    expect(r.marginPercent).toBe(20);
  });

  it("margin is not the same as markup", () => {
    const r = ok("50", "200");
    expect(r.percentOnCost).toBe(300);
    expect(r.marginPercent).toBe(75);
  });

  it("doubling the price is 100% on cost but 50% margin", () => {
    const r = ok("250", "500");
    expect(r.percentOnCost).toBe(100);
    expect(r.marginPercent).toBe(50);
  });

  it("decimal prices", () => {
    const r = ok("12.50", "15");
    expect(r.amount).toBe(2.5);
    expect(r.percentOnCost).toBeCloseTo(20, 10);
    expect(r.marginPercent).toBeCloseTo(16.6666666667, 8);
  });

  it("floating-point style inputs", () => {
    const r = ok("0.1", "0.3");
    expect(r.status).toBe("profit");
    expect(r.amount).toBe(0.2);
    expect(r.percentOnCost).toBeCloseTo(200, 8);
    expect(r.marginPercent).toBeCloseTo(66.6666666667, 8);
  });

  it("smallest possible profit is one paisa", () => {
    const r = ok("100", "100.01");
    expect(r.status).toBe("profit");
    expect(r.amount).toBe(0.01);
    expect(r.percentOnCost).toBeCloseTo(0.01, 8);
  });

  it("accepts commas and Bangla digits", () => {
    const r = ok("1,00,000", "১,২৫,০০০");
    expect(r.amount).toBe(25000);
    expect(r.percentOnCost).toBe(25);
  });
});

describe("loss", () => {
  it("cost 100, selling 80", () => {
    const r = ok("100", "80");
    expect(r.status).toBe("loss");
    expect(r.amount).toBe(20);
    expect(r.percentOnCost).toBe(20);
    expect(r.marginPercent).toBe(25);
  });

  it("giving the item away is a 100% loss with no margin", () => {
    const r = ok("500", "0");
    expect(r.status).toBe("loss");
    expect(r.amount).toBe(500);
    expect(r.percentOnCost).toBe(100);
    expect(r.marginPercent).toBeNull();
  });

  it("decimal prices", () => {
    const r = ok("999.99", "749.99");
    expect(r.status).toBe("loss");
    expect(r.amount).toBe(250);
    expect(r.percentOnCost).toBeCloseTo(25.00025, 5);
  });
});

describe("break-even", () => {
  it("equal prices", () => {
    const r = ok("750", "750");
    expect(r.status).toBe("break-even");
    expect(r.amount).toBe(0);
    expect(r.percentOnCost).toBe(0);
    expect(r.marginPercent).toBe(0);
  });

  it("tiny float differences are break-even", () => {
    expect(ok("0.3", "0.30000000000000004").status).toBe("break-even");
    expect(ok("0.30000000000000004", "0.3").status).toBe("break-even");
    expect(ok("0.1", "0.1").status).toBe("break-even");
  });

  it("prices that round to the same paisa are break-even", () => {
    const r = ok("100.004", "100.001");
    expect(r.status).toBe("break-even");
    expect(r.costPrice).toBe(100);
    expect(r.sellingPrice).toBe(100);
  });

  it("prices that round to different paisa are not", () => {
    const r = ok("100.004", "100.006");
    expect(r.status).toBe("profit");
    expect(r.amount).toBe(0.01);
  });
});

describe("validation", () => {
  it("requires both prices", () => {
    expect(errors(calculateProfitLoss("", "100"))).toEqual([{ field: "cost", code: "missing" }]);
    expect(errors(calculateProfitLoss("100", ""))).toEqual([{ field: "selling", code: "missing" }]);
    expect(errors(calculateProfitLoss("", " "))).toEqual([
      { field: "cost", code: "missing" },
      { field: "selling", code: "missing" },
    ]);
  });

  it("rejects text", () => {
    expect(errors(calculateProfitLoss("৳100", "120"))).toEqual([{ field: "cost", code: "invalid" }]);
    expect(errors(calculateProfitLoss("100", "12o"))).toEqual([{ field: "selling", code: "invalid" }]);
  });

  it("cost must be at least one paisa", () => {
    expect(errors(calculateProfitLoss("0", "100"))).toEqual([{ field: "cost", code: "too-small" }]);
    expect(errors(calculateProfitLoss("-50", "100"))).toEqual([{ field: "cost", code: "too-small" }]);
    expect(errors(calculateProfitLoss("0.001", "100"))).toEqual([{ field: "cost", code: "too-small" }]);
    expect(ok("0.01", "0.01").status).toBe("break-even");
  });

  it("selling price can be 0 but not negative", () => {
    expect(ok("100", "0").status).toBe("loss");
    expect(errors(calculateProfitLoss("100", "-1"))).toEqual([{ field: "selling", code: "too-small" }]);
  });

  it("has an upper limit", () => {
    expect(ok(String(MAX_PRICE), String(MAX_PRICE)).status).toBe("break-even");
    expect(errors(calculateProfitLoss("1000000000001", "5"))).toEqual([{ field: "cost", code: "too-large" }]);
    expect(errors(calculateProfitLoss("5", "1000000000001"))).toEqual([{ field: "selling", code: "too-large" }]);
  });

  it("handles extreme-but-allowed values without NaN or Infinity", () => {
    const r = ok("0.01", String(MAX_PRICE));
    expect(Number.isFinite(r.percentOnCost)).toBe(true);
    expect(r.status).toBe("profit");
    expect(r.marginPercent).toBeCloseTo(100, 6);
  });
});

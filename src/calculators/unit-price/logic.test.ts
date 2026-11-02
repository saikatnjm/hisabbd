import { describe, expect, it } from "vitest";
import { calculateUnitPrice, type OptionRowInput, type UnitPriceCalculation } from "./logic";

let nextId = 1;
function option(price: string, quantity: string, unit: string, name = ""): OptionRowInput {
  return { id: nextId++, name, price, quantity, unit };
}
const blank = (): OptionRowInput => option("", "", "kg");

function ok(calc: UnitPriceCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: UnitPriceCalculation) => (calc.ok ? [] : calc.errors);

describe("calculateUnitPrice", () => {
  it("works out the page's example: 1 kg rice at ৳78 vs 5 kg at ৳370", () => {
    const r = ok(calculateUnitPrice([option("78", "1", "kg", "1 kg pack"), option("370", "5", "kg", "5 kg bag")]));
    expect(r.group).toBe("weight");
    expect(r.options.map((o) => o.perMain)).toEqual([78, 74]);
    expect(r.options[0]!.perSmall).toBeCloseTo(7.8, 10);
    expect(r.options[1]!.perSmall).toBeCloseTo(7.4, 10);
    expect(r.options.map((o) => o.rank)).toEqual([2, 1]);
    expect(r.options.map((o) => o.isCheapest)).toEqual([false, true]);
    expect(r.order).toEqual([1, 0]);
    expect(r.savingPerMain).toBeCloseTo(4, 10);
    expect(r.savingPercent).toBeCloseTo(5.1282051282, 8);
    expect(r.options[0]!.morePercent).toBeCloseTo(5.4054054054, 8);
    expect(r.options[1]!.morePercent).toBe(0);
  });

  it("compares grams with kilograms", () => {
    const r = ok(calculateUnitPrice([option("45", "500", "g"), option("80", "1", "kg")]));
    expect(r.options.map((o) => o.perMain)).toEqual([90, 80]);
    expect(r.options[1]!.isCheapest).toBe(true);
  });

  it("compares millilitres with litres", () => {
    const r = ok(calculateUnitPrice([option("95", "500", "ml"), option("180", "1", "l"), option("850", "5", "l")]));
    expect(r.group).toBe("volume");
    expect(r.options.map((o) => o.perMain)).toEqual([190, 180, 170]);
    expect(r.options[0]!.perSmall).toBeCloseTo(19, 10);
    expect(r.order).toEqual([2, 1, 0]);
  });

  it("treats a dozen as 12 and a hali as 4 pieces", () => {
    const r = ok(calculateUnitPrice([option("150", "1", "dozen"), option("48", "4", "piece"), option("52", "1", "hali")]));
    expect(r.group).toBe("count");
    expect(r.options.map((o) => o.perMain)).toEqual([12.5, 12, 13]);
    expect(r.options.every((o) => o.perSmall === null)).toBe(true);
    expect(r.options.map((o) => o.rank)).toEqual([2, 1, 3]);
  });

  it("ties share a rank, and every tied cheapest option is highlighted", () => {
    const r = ok(calculateUnitPrice([option("10", "1", "kg"), option("5", "500", "g"), option("12", "1", "kg")]));
    expect(r.options.map((o) => o.rank)).toEqual([1, 1, 3]);
    expect(r.options.map((o) => o.isCheapest)).toEqual([true, true, false]);
    expect(r.order).toEqual([0, 1, 2]);
  });

  it("reports no saving when every option costs the same", () => {
    const r = ok(calculateUnitPrice([option("10", "1", "kg"), option("5", "500", "g")]));
    expect(r.allSame).toBe(true);
    expect(r.savingPerMain).toBe(0);
    expect(r.savingPercent).toBe(0);
    expect(r.options.map((o) => o.rank)).toEqual([1, 1]);
  });

  it("keeps the form position of each option and ignores blank rows", () => {
    const r = ok(calculateUnitPrice([option("78", "1", "kg"), blank(), option("370", "5", "kg")]));
    expect(r.options.map((o) => o.position)).toEqual([1, 3]);
  });

  it("accepts Bangla digits and lakh grouping", () => {
    const r = ok(calculateUnitPrice([option("১,২০০", "১০", "kg"), option("1,00,000", "10,000", "g")]));
    expect(r.options.map((o) => o.perMain)).toEqual([120, 10_000]);
  });

  it("needs at least 2 options", () => {
    expect(errors(calculateUnitPrice([option("78", "1", "kg"), blank()]))).toEqual([{ rowId: null, field: "rows", code: "too-few" }]);
  });

  it("allows at most 10 options", () => {
    const rows = Array.from({ length: 11 }, () => option("10", "1", "kg"));
    expect(errors(calculateUnitPrice(rows))).toEqual([{ rowId: null, field: "rows", code: "too-many" }]);
  });

  it("reports number errors per field, together", () => {
    const a = option("", "1", "kg", "A");
    const b = option("abc", "0", "kg");
    const c = option("5", "-2", "kg");
    expect(errors(calculateUnitPrice([a, b, c]))).toEqual([
      { rowId: a.id, field: "price", code: "missing" },
      { rowId: b.id, field: "price", code: "invalid" },
      { rowId: b.id, field: "quantity", code: "too-small" },
      { rowId: c.id, field: "quantity", code: "too-small" },
    ]);
    const big = option("10000001", "1000001", "g");
    expect(errors(calculateUnitPrice([big, option("5", "1", "kg")]))).toEqual([
      { rowId: big.id, field: "price", code: "too-large" },
      { rowId: big.id, field: "quantity", code: "too-large" },
    ]);
  });

  it("treats a named row with blank price and quantity as an error, not a blank row", () => {
    const named = option("", "", "kg", "Rice");
    expect(errors(calculateUnitPrice([named, option("5", "1", "kg")])).map((e) => e.field)).toEqual(["price", "quantity"]);
  });

  it("rejects mixing unit groups", () => {
    expect(errors(calculateUnitPrice([option("78", "1", "kg"), option("95", "500", "ml")]))).toEqual([
      { rowId: null, field: "rows", code: "mixed-groups" },
    ]);
    expect(errors(calculateUnitPrice([option("78", "1", "kg"), option("48", "1", "dozen")])).map((e) => e.code)).toEqual(["mixed-groups"]);
  });

  it("rejects an unknown unit", () => {
    const bad = option("5", "1", "maund");
    expect(errors(calculateUnitPrice([bad, option("5", "1", "kg")]))).toEqual([{ rowId: bad.id, field: "unit", code: "bad-unit" }]);
  });
});

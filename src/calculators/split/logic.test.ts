import { describe, expect, it } from "vitest";
import { calculateSplit, settle, type PersonRowInput, type SplitCalculation } from "./logic";

let nextId = 1;
function person(paid: string, name = ""): PersonRowInput {
  return { id: nextId++, name, paid };
}
const blank = (): PersonRowInput => person("", "");

function ok(calc: SplitCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: SplitCalculation) => (calc.ok ? [] : calc.errors);

describe("calculateSplit", () => {
  it("works out the page's example: a ৳12,000 trip for 4", () => {
    const r = ok(calculateSplit([person("6000", "Rahim"), person("4000", "Karim"), person("2000", "Jamal"), person("0", "Salam")]));
    expect(r.total).toBe(12000);
    expect(r.perPerson).toBe(3000);
    expect(r.people.map((p) => p.balance)).toEqual([3000, 1000, -1000, -3000]);
    expect(r.transfers).toEqual([
      { from: 3, to: 0, amount: 3000 },
      { from: 2, to: 1, amount: 1000 },
    ]);
  });

  it("shares leftover paisa so everything adds up exactly", () => {
    const r = ok(calculateSplit([person("100"), person("0"), person("0")]));
    expect(r.people.map((p) => p.share)).toEqual([33.34, 33.33, 33.33]);
    expect(r.people.map((p) => p.balance)).toEqual([66.66, -33.33, -33.33]);
    expect(r.transfers.reduce((s, t) => s + t.amount, 0)).toBeCloseTo(66.66, 10);
  });

  it("needs at most people − 1 payments", () => {
    const r = ok(calculateSplit([person("500"), person("300"), person("0"), person("0"), person("200")]));
    expect(r.transfers.length).toBeLessThanOrEqual(4);
    const net = r.people.map((p) => Math.round(p.balance * 100));
    for (const t of r.transfers) {
      net[t.from]! += Math.round(t.amount * 100);
      net[t.to]! -= Math.round(t.amount * 100);
    }
    expect(net).toEqual([0, 0, 0, 0, 0]);
  });

  it("treats a named person with a blank amount as having paid ৳0, and ignores blank rows", () => {
    const r = ok(calculateSplit([person("900", "A"), person("", "B"), blank(), person("", "C")]));
    expect(r.people.map((p) => [p.name, p.paid, p.balance])).toEqual([
      ["A", 900, 600],
      ["B", 0, -300],
      ["C", 0, -300],
    ]);
  });

  it("accepts Bangla digits and grouping", () => {
    expect(ok(calculateSplit([person("১,২০০"), person("০")])).perPerson).toBe(600);
  });

  it("checks the rows", () => {
    expect(errors(calculateSplit([person("100"), blank()]))).toEqual([{ rowId: null, field: "rows", code: "too-few" }]);
    expect(errors(calculateSplit([person("0", "A"), person("0", "B")]))).toEqual([{ rowId: null, field: "rows", code: "nothing-paid" }]);
    const bad = person("-5");
    expect(errors(calculateSplit([person("100"), bad]))).toEqual([{ rowId: bad.id, field: "paid", code: "too-small" }]);
    expect(errors(calculateSplit(Array.from({ length: 31 }, () => person("1"))))).toEqual([{ rowId: null, field: "rows", code: "too-many" }]);
  });
});

describe("settle", () => {
  it("returns nothing when everyone is even", () => {
    expect(settle([0, 0, 0])).toEqual([]);
  });
});

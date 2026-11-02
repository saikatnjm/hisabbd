import { describe, expect, it } from "vitest";
import { calculateMess, type MemberRowInput, type MessCalculation } from "./logic";

let nextId = 1;
function member(meals: string, deposit = "", name = ""): MemberRowInput {
  return { id: nextId++, name, meals, deposit };
}
const blank = (): MemberRowInput => member("", "", "");

function ok(calc: MessCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: MessCalculation) => (calc.ok ? [] : calc.errors);

describe("calculateMess", () => {
  it("works out the page's example: 4 members, ৳7,200 bazar, ৳2,000 shared", () => {
    const r = ok(
      calculateMess(
        [member("60", "3000", "Rahim"), member("45", "2500", "Karim"), member("50", "2000", "Jamal"), member("25", "1500", "Salam")],
        "7,200",
        "2000",
      ),
    );
    expect(r.totalMeals).toBe(180);
    expect(r.mealRate).toBe(40);
    expect(r.sharedPerMember).toBe(500);
    expect(r.members.map((m) => [m.name, m.mealCost, m.totalCost, m.balance])).toEqual([
      ["Rahim", 2400, 2900, 100],
      ["Karim", 1800, 2300, 200],
      ["Jamal", 2000, 2500, -500],
      ["Salam", 1000, 1500, 0],
    ]);
    expect([r.totalDeposit, r.totalCost, r.cashBalance]).toEqual([9000, 9200, -200]);
    expect(r.members.reduce((s, m) => s + m.balance, 0)).toBe(r.cashBalance);
  });

  it("handles fractional meal rates and half meals", () => {
    const r = ok(calculateMess([member("30.5", "1000"), member("29.5", "1000")], "2,500", ""));
    expect(r.totalMeals).toBe(60);
    expect(r.mealRate).toBeCloseTo(41.6666666667, 9);
    expect(r.shared).toBe(0);
    expect(r.cashBalance).toBe(-500);
  });

  it("ignores blank rows and treats a blank deposit as ৳0", () => {
    const r = ok(calculateMess([blank(), member("10"), blank()], "400", ""));
    expect(r.members).toHaveLength(1);
    expect(r.members[0]?.balance).toBe(-400);
  });

  it("accepts Bangla digits", () => {
    expect(ok(calculateMess([member("১০", "৫০০")], "৪০০", "")).mealRate).toBe(40);
  });

  it("reports missing and invalid values together", () => {
    const named = member("", "", "Rahim");
    const bad = member("-1", "x");
    expect(errors(calculateMess([named, bad], "", "abc"))).toEqual([
      { rowId: null, field: "bazar", code: "missing" },
      { rowId: null, field: "shared", code: "invalid" },
      { rowId: named.id, field: "meals", code: "missing" },
      { rowId: bad.id, field: "meals", code: "too-small" },
      { rowId: bad.id, field: "deposit", code: "invalid" },
    ]);
  });

  it("needs a member and at least one meal", () => {
    expect(errors(calculateMess([blank()], "100", ""))).toEqual([{ rowId: null, field: "rows", code: "no-members" }]);
    expect(errors(calculateMess([member("0", "100")], "100", ""))).toEqual([{ rowId: null, field: "rows", code: "no-meals" }]);
  });

  it("limits members, meals and money", () => {
    const many = Array.from({ length: 31 }, () => member("1"));
    expect(errors(calculateMess(many, "100", ""))).toEqual([{ rowId: null, field: "rows", code: "too-many" }]);
    const big = member("1001", "10000001");
    expect(errors(calculateMess([big], "10000001", ""))).toEqual([
      { rowId: null, field: "bazar", code: "too-large" },
      { rowId: big.id, field: "meals", code: "too-large" },
      { rowId: big.id, field: "deposit", code: "too-large" },
    ]);
  });
});

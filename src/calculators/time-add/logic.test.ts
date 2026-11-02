import { describe, expect, it } from "vitest";
import { calculateTimeTotal, type DurationRowInput, type TimeAddCalculation } from "./logic";

let nextId = 1;
function row(hours: string, minutes: string, op = "add"): DurationRowInput {
  return { id: nextId++, op, hours, minutes };
}

function ok(calc: TimeAddCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: TimeAddCalculation) => (calc.ok ? [] : calc.errors);

describe("calculateTimeTotal", () => {
  it("works out the page's example: 2 h 45 min + 3 h 30 min + 1 h 50 min", () => {
    const r = ok(calculateTimeTotal([row("2", "45"), row("3", "30"), row("1", "50")]));
    expect(r).toMatchObject({ totalMinutes: 485, hours: 8, minutes: 5, decimalHours: 8.08, days: 0, negative: false, rowCount: 3 });
  });

  it("subtracts, and shows a negative total", () => {
    expect(ok(calculateTimeTotal([row("8", "0"), row("1", "15", "subtract")]))).toMatchObject({ hours: 6, minutes: 45, decimalHours: 6.75 });
    expect(ok(calculateTimeTotal([row("1", "0"), row("2", "30", "subtract")]))).toMatchObject({ totalMinutes: -90, hours: 1, minutes: 30, negative: true });
  });

  it("normalises 90 minutes and counts whole days", () => {
    expect(ok(calculateTimeTotal([row("", "90")]))).toMatchObject({ hours: 1, minutes: 30 });
    expect(ok(calculateTimeTotal([row("20", "0"), row("10", "30")]))).toMatchObject({ hours: 30, minutes: 30, days: 1, dayHours: 6 });
  });

  it("ignores blank rows and accepts Bangla digits", () => {
    expect(ok(calculateTimeTotal([row("", ""), row("২", "৩০")]))).toMatchObject({ totalMinutes: 150, rowCount: 1 });
  });

  it("reports every invalid field and empty or oversized lists", () => {
    const a = row("1.5", "");
    const b = row("2", "-5");
    expect(errors(calculateTimeTotal([a, b]))).toEqual([
      { rowId: a.id, field: "hours", code: "not-integer" },
      { rowId: b.id, field: "minutes", code: "too-small" },
    ]);
    expect(errors(calculateTimeTotal([row("", "")]))).toEqual([{ rowId: null, field: "rows", code: "no-rows" }]);
    expect(errors(calculateTimeTotal(Array.from({ length: 21 }, () => row("1", "0"))))).toEqual([{ rowId: null, field: "rows", code: "too-many" }]);
  });
});

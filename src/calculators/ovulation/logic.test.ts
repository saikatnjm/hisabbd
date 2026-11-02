import { describe, expect, it } from "vitest";
import { parsePlainDate } from "@/lib/plain-date";
import { calculateOvulation, cycleEstimate, type OvulationCalculation } from "./logic";

const d = (iso: string) => parsePlainDate(iso)!;

function ok(calc: OvulationCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: OvulationCalculation) => (calc.ok ? [] : calc.errors);

describe("cycleEstimate", () => {
  it("puts likely ovulation 16 to 10 days before the next period (NHS)", () => {
    expect(cycleEstimate(d("2026-10-20"), 28)).toEqual({
      periodStart: d("2026-10-20"),
      ovulationFrom: d("2026-11-01"),
      ovulationTo: d("2026-11-07"),
      nextPeriod: d("2026-11-17"),
    });
    const long = cycleEstimate(d("2026-10-20"), 32);
    expect([long.ovulationFrom, long.ovulationTo, long.nextPeriod]).toEqual([d("2026-11-05"), d("2026-11-11"), d("2026-11-21")]);
  });
});

describe("calculateOvulation", () => {
  it("works out the page's example: last period 20 Oct 2026, 28-day cycle, on 2 Nov 2026", () => {
    const r = ok(calculateOvulation("2026-10-20", "28", "2026-11-02"));
    expect(r.cycleDay).toBe(14);
    expect(r.irregular).toBe(false);
    expect(r.cycles.map((c) => [c.ovulationFrom, c.ovulationTo, c.nextPeriod])).toEqual([
      [d("2026-11-01"), d("2026-11-07"), d("2026-11-17")],
      [d("2026-11-29"), d("2026-12-05"), d("2026-12-15")],
      [d("2026-12-27"), d("2027-01-02"), d("2027-01-12")],
    ]);
  });

  it("counts the cycle day into later cycles", () => {
    expect(ok(calculateOvulation("2026-10-01", "28", "2026-11-02")).cycleDay).toBe(5);
  });

  it("flags cycles outside 21–35 days", () => {
    expect(ok(calculateOvulation("2026-10-20", "38", "2026-11-02")).irregular).toBe(true);
    expect(ok(calculateOvulation("2026-10-20", "21", "2026-11-02")).irregular).toBe(false);
  });

  it("accepts Bangla digits for the cycle", () => {
    expect(ok(calculateOvulation("2026-10-20", "২৮", "2026-11-02")).cycleLength).toBe(28);
  });

  it("checks dates and the cycle length", () => {
    expect(errors(calculateOvulation("", "", ""))).toEqual([
      { field: "lastPeriod", code: "date-missing" },
      { field: "cycle", code: "missing" },
      { field: "asOf", code: "date-missing" },
    ]);
    expect(errors(calculateOvulation("2026-11-03", "19", "2026-11-02"))).toEqual([
      { field: "cycle", code: "too-small" },
      { field: "lastPeriod", code: "after-as-of" },
    ]);
    expect(errors(calculateOvulation("2026-08-03", "28.5", "2026-11-02"))).toEqual([
      { field: "cycle", code: "not-integer" },
      { field: "lastPeriod", code: "too-long-ago" },
    ]);
    expect(calculateOvulation("2026-08-04", "45", "2026-11-02").ok).toBe(true);
  });
});

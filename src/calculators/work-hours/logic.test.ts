import { describe, expect, it } from "vitest";
import { calculateWorkHours, parseTime, toHours, type DayRowInput, type WorkHoursCalculation } from "./logic";

let nextId = 1;
function day(start: string, end: string, breakMinutes = ""): DayRowInput {
  return { id: nextId++, start, end, breakMinutes };
}
const blank = (): DayRowInput => day("", "", "");

function ok(calc: WorkHoursCalculation) {
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: WorkHoursCalculation) => (calc.ok ? [] : calc.errors);

describe("parseTime / toHours", () => {
  it("reads 24-hour times and converts minutes to decimal hours", () => {
    expect(parseTime("08:00")).toBe(480);
    expect(parseTime("23:59")).toBe(1439);
    expect(parseTime("24:00")).toBeNull();
    expect(parseTime("8:00")).toBeNull();
    expect(toHours(150)).toBe(2.5);
    expect(toHours(100)).toBe(1.67);
  });
});

describe("calculateWorkHours", () => {
  it("works out the page's example: a 6-day week of 8:00 to 19:00 with an hour's break", () => {
    const week = Array.from({ length: 6 }, () => day("08:00", "19:00", "60"));
    const r = ok(calculateWorkHours(week));
    expect(r.days.map((d) => d.workedMinutes)).toEqual([600, 600, 600, 600, 600, 600]);
    expect(r.totalMinutes).toBe(3600);
    expect(r.overtimeMinutes).toBe(720);
    expect(toHours(r.overtimeMinutes)).toBe(12);
    expect(r.regularMinutes).toBe(2880);
    expect(r.week).toEqual({ overNormalMinutes: 720, overMax: false });
  });

  it("handles a shift past midnight", () => {
    const r = ok(calculateWorkHours([day("20:00", "04:00", "30")]));
    expect(r.days[0]).toMatchObject({ workedMinutes: 450, overtimeMinutes: 0, overnight: true });
  });

  it("flags days over 10 hours and weeks over 60", () => {
    const long = ok(calculateWorkHours([day("07:00", "19:30")]));
    expect(long.days[0]).toMatchObject({ workedMinutes: 750, overtimeMinutes: 270, overMax: true });
    const heavy = ok(calculateWorkHours(Array.from({ length: 6 }, () => day("07:00", "18:30"))));
    expect(heavy.totalMinutes).toBe(4140);
    expect(heavy.week?.overMax).toBe(true);
  });

  it("drops the weekly figure for more than 7 days and ignores blank rows", () => {
    const month = [...Array.from({ length: 8 }, () => day("09:00", "17:00")), blank()];
    const r = ok(calculateWorkHours(month));
    expect(r.days).toHaveLength(8);
    expect(r.week).toBeNull();
    expect(r.overtimeMinutes).toBe(0);
  });

  it("checks times and breaks, reporting every problem", () => {
    const a = day("", "17:00");
    const b = day("9:00", "25:00", "abc");
    const c = day("09:00", "09:00");
    const e = day("09:00", "10:00", "60");
    expect(errors(calculateWorkHours([a, b, c, e]))).toEqual([
      { rowId: a.id, field: "start", code: "time-missing" },
      { rowId: b.id, field: "start", code: "time-invalid" },
      { rowId: b.id, field: "end", code: "time-invalid" },
      { rowId: b.id, field: "breakMinutes", code: "invalid" },
      { rowId: c.id, field: "end", code: "same-time" },
      { rowId: e.id, field: "breakMinutes", code: "break-too-long" },
    ]);
    expect(errors(calculateWorkHours([blank()]))).toEqual([{ rowId: null, field: "rows", code: "no-days" }]);
    expect(errors(calculateWorkHours(Array.from({ length: 32 }, () => day("09:00", "17:00"))))).toEqual([
      { rowId: null, field: "rows", code: "too-many" },
    ]);
  });

  it("accepts Bangla digits in the break", () => {
    expect(ok(calculateWorkHours([day("09:00", "18:00", "৬০")])).totalMinutes).toBe(480);
  });
});

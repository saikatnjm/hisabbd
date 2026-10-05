import { describe, expect, it } from "vitest";
import { BD_UGC_4_SCALE } from "@/calculators/education/grading-scales";
import {
  calculateGpa,
  computeGpa,
  isBlankCourseRow,
  MAX_COURSES,
  MAX_COURSE_CREDITS,
  type CourseRowInput,
  type GpaCalculation,
} from "./logic";

let nextId = 1;
function row(grade: string, credits: string, name = ""): CourseRowInput {
  return { id: nextId++, name, grade, credits };
}
const blank = (): CourseRowInput => row("", "");

function ok(rows: CourseRowInput[]) {
  const calc = calculateGpa(rows);
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: GpaCalculation) => (calc.ok ? [] : calc.errors);

describe("computeGpa", () => {
  it("weights grade points by credits", () => {
    // (4.00×3 + 3.00×1) / 4 = 15/4 = 3.75
    const r = computeGpa([
      { point: 4, credits: 3 },
      { point: 3, credits: 1 },
    ]);
    expect(r?.gpa).toBeCloseTo(3.75, 10);
    expect(r?.totalCredits).toBe(4);
    expect(r?.totalGradePoints).toBe(15);
  });

  it("returns null with no credits", () => {
    expect(computeGpa([])).toBeNull();
    expect(computeGpa([{ point: 4, credits: 0 }])).toBeNull();
  });

  it("removes floating point noise from sums", () => {
    // 0.1 + 0.2 must be exactly 0.3 credits
    const r = computeGpa([
      { point: 4, credits: 0.1 },
      { point: 4, credits: 0.2 },
    ]);
    expect(r?.totalCredits).toBe(0.3);
    expect(r?.gpa).toBeCloseTo(4, 10);
  });
});

describe("calculateGpa", () => {
  it("single course gives its own grade point", () => {
    const r = ok([row("A-", "3")]);
    expect(r.gpa).toBe(3.5);
    expect(r.totalCredits).toBe(3);
    expect(r.totalGradePoints).toBe(10.5);
    expect(r.courseCount).toBe(1);
  });

  it("worked example from the page: 36 points over 10.5 credits", () => {
    // A 3.75×3=11.25, B+ 3.25×3=9.75, A- 3.50×3=10.5, B 3.00×1.5=4.5 → 36.0 / 10.5
    const r = ok([row("A", "3"), row("B+", "3"), row("A-", "3"), row("B", "1.5")]);
    expect(r.totalGradePoints).toBe(36);
    expect(r.totalCredits).toBe(10.5);
    expect(r.gpa).toBeCloseTo(3.428571428, 8);
    expect(r.courseCount).toBe(4);
  });

  it("FAQ example: a 3-credit A and a 3-credit B+ give 3.50", () => {
    const r = ok([row("A", "3"), row("B+", "3")]);
    expect(r.totalGradePoints).toBe(21);
    expect(r.gpa).toBe(3.5);
  });

  it("all A+ gives 4.00 and all F gives 0", () => {
    expect(ok([row("A+", "3"), row("A+", "4")]).gpa).toBe(4);
    expect(ok([row("F", "3"), row("F", "2")]).gpa).toBe(0);
  });

  it("an F still counts its credits", () => {
    // (4×3 + 0×3)/6 = 2
    const r = ok([row("A+", "3"), row("F", "3")]);
    expect(r.gpa).toBe(2);
    expect(r.totalCredits).toBe(6);
    expect(r.courseCount).toBe(2);
  });

  it("supports decimal credits", () => {
    // 3.75×0.75 = 2.8125 ; 2.00×1.5 = 3 → 5.8125 / 2.25 = 2.58333…
    const r = ok([row("A", "0.75"), row("D", "1.5")]);
    expect(r.totalGradePoints).toBeCloseTo(5.8125, 10);
    expect(r.gpa).toBeCloseTo(2.583333333, 8);
  });

  it("accepts commas and Bangla digits in credits", () => {
    expect(ok([row("B", "৩")]).totalCredits).toBe(3);
    expect(ok([row("B", "1.5")]).totalCredits).toBe(1.5);
  });

  it("ignores completely blank rows but counts only complete ones", () => {
    const r = ok([blank(), row("A", "3", "Physics"), blank(), row("B", "3")]);
    expect(r.courseCount).toBe(2);
    expect(r.gpa).toBe(3.375);
  });

  it("treats whitespace-only rows as blank", () => {
    expect(isBlankCourseRow({ id: 1, name: "  ", grade: " ", credits: " " })).toBe(true);
    expect(isBlankCourseRow({ id: 1, name: "x", grade: "", credits: "" })).toBe(false);
  });

  it("names do not affect the result", () => {
    expect(ok([row("A", "3", "Math")]).gpa).toBe(ok([row("A", "3")]).gpa);
  });

  it("allows the credit boundaries", () => {
    expect(ok([row("A", String(MAX_COURSE_CREDITS))]).totalCredits).toBe(30);
    expect(ok([row("A", "0.01")]).totalCredits).toBe(0.01);
  });

  it("handles the maximum number of courses", () => {
    const rows = Array.from({ length: MAX_COURSES }, () => row("A+", "3"));
    const r = ok(rows);
    expect(r.courseCount).toBe(30);
    expect(r.totalCredits).toBe(90);
    expect(r.gpa).toBe(4);
  });
});

describe("calculateGpa validation", () => {
  it("needs at least one complete course", () => {
    expect(errors(calculateGpa([]))).toEqual([{ rowId: null, field: "rows", code: "no-courses" }]);
    expect(errors(calculateGpa([blank(), blank(), blank()]))).toEqual([
      { rowId: null, field: "rows", code: "no-courses" },
    ]);
  });

  it("flags the missing field of a partially filled row", () => {
    const onlyGrade = row("A", "");
    const onlyCredits = row("", "3");
    const onlyName = row("", "", "Chemistry");
    const errs = errors(calculateGpa([onlyGrade, onlyCredits, onlyName]));
    expect(errs).toEqual([
      { rowId: onlyGrade.id, field: "credits", code: "missing" },
      { rowId: onlyCredits.id, field: "grade", code: "missing" },
      { rowId: onlyName.id, field: "grade", code: "missing" },
      { rowId: onlyName.id, field: "credits", code: "missing" },
    ]);
  });

  it("keeps errors in row order and reports them even when other rows are fine", () => {
    const good = row("A", "3");
    const bad = row("B", "abc");
    const errs = errors(calculateGpa([good, bad]));
    expect(errs).toEqual([{ rowId: bad.id, field: "credits", code: "invalid" }]);
  });

  it("rejects unknown grades", () => {
    const bad = row("E", "3");
    expect(errors(calculateGpa([bad]))).toEqual([{ rowId: bad.id, field: "grade", code: "invalid" }]);
    const lower = row("a+", "3");
    expect(errors(calculateGpa([lower]))).toEqual([{ rowId: lower.id, field: "grade", code: "invalid" }]);
  });

  it("rejects zero, negative and oversized credits", () => {
    const zero = row("A", "0");
    const neg = row("A", "-3");
    const big = row("A", "30.5");
    const errs = errors(calculateGpa([zero, neg, big]));
    expect(errs).toEqual([
      { rowId: zero.id, field: "credits", code: "too-small" },
      { rowId: neg.id, field: "credits", code: "too-small" },
      { rowId: big.id, field: "credits", code: "too-large" },
    ]);
  });

  it("rejects more than the maximum number of courses", () => {
    const rows = Array.from({ length: MAX_COURSES + 1 }, () => row("A", "3"));
    expect(errors(calculateGpa(rows))).toEqual([{ rowId: null, field: "rows", code: "too-many" }]);
  });

  it("uses the scale it is given", () => {
    const tiny = { ...BD_UGC_4_SCALE, grades: [{ letter: "X", point: 1 }] };
    const calc = calculateGpa([row("X", "2")], tiny);
    expect(calc.ok && calc.result.gpa).toBe(1);
    expect(calculateGpa([row("A+", "2")], tiny).ok).toBe(false);
  });
});

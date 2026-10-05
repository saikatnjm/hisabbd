import { describe, expect, it } from "vitest";
import {
  calculateCgpa,
  computeCgpa,
  isBlankTermRow,
  MAX_TERMS,
  MAX_TERM_CREDITS,
  simpleAverageGpa,
  type CgpaCalculation,
  type ScaleMax,
  type TermRowInput,
} from "./logic";

let nextId = 1;
function row(gpa: string, credits: string, name = ""): TermRowInput {
  return { id: nextId++, name, gpa, credits };
}
const blank = (): TermRowInput => row("", "");

function ok(rows: TermRowInput[], scale: ScaleMax = 4) {
  const calc = calculateCgpa(rows, scale);
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: CgpaCalculation) => (calc.ok ? [] : calc.errors);

describe("computeCgpa", () => {
  it("weights term GPAs by credits", () => {
    // (3.00×15 + 4.00×15) / 30 = 3.5
    const r = computeCgpa([
      { gpa: 3, credits: 15 },
      { gpa: 4, credits: 15 },
    ]);
    expect(r?.cgpa).toBe(3.5);
    expect(r?.totalCredits).toBe(30);
  });

  it("returns null without credits", () => {
    expect(computeCgpa([])).toBeNull();
  });

  it("simple average differs from the weighted CGPA when credits differ", () => {
    // 3.80 on 9 credits, 3.00 on 18 credits
    const entries = [
      { gpa: 3.8, credits: 9 },
      { gpa: 3, credits: 18 },
    ];
    // weighted: (34.2 + 54) / 27 = 88.2 / 27 = 3.26666…
    expect(computeCgpa(entries)?.cgpa).toBeCloseTo(3.266666667, 8);
    expect(simpleAverageGpa([3.8, 3])).toBeCloseTo(3.4, 10);
  });

  it("simple average equals the weighted CGPA when credits are equal", () => {
    expect(computeCgpa([{ gpa: 3.2, credits: 12 }, { gpa: 3.6, credits: 12 }])?.cgpa).toBeCloseTo(
      simpleAverageGpa([3.2, 3.6]) ?? -1,
      10,
    );
  });

  it("simpleAverageGpa returns null for an empty list", () => {
    expect(simpleAverageGpa([])).toBeNull();
  });
});

describe("calculateCgpa", () => {
  it("single term returns that term's GPA", () => {
    const r = ok([row("3.42", "15")]);
    expect(r.cgpa).toBeCloseTo(3.42, 10);
    expect(r.totalCredits).toBe(15);
    expect(r.termCount).toBe(1);
  });

  it("combining a previous CGPA and credits with a new semester (page example)", () => {
    // (3.40×60 + 3.80×15) / 75 = (204 + 57) / 75 = 3.48
    const r = ok([row("3.40", "60", "Previous"), row("3.80", "15", "Semester 5")]);
    expect(r.cgpa).toBeCloseTo(3.48, 10);
    expect(r.totalCredits).toBe(75);
    expect(r.termCount).toBe(2);
  });

  it("is the same whether terms are entered one by one or as one combined row", () => {
    // Two terms 3.00×15 and 3.50×15 → CGPA 3.25 over 30; as one row it is the same
    const separate = ok([row("3.00", "15"), row("3.50", "15"), row("4.00", "12")]);
    const combined = ok([row("3.25", "30"), row("4.00", "12")]);
    expect(separate.cgpa).toBeCloseTo(combined.cgpa, 10);
    expect(separate.totalCredits).toBe(combined.totalCredits);
  });

  it("weighted example from the page: 3.27 not 3.40", () => {
    const r = ok([row("3.80", "9"), row("3.00", "18")]);
    expect(r.cgpa).toBeCloseTo(3.2667, 4);
  });

  it("page example: 3.50 on 12 credits and 4.00 on 18 credits is 3.80", () => {
    const r = ok([row("3.50", "12"), row("4.00", "18")]);
    expect(r.cgpa).toBeCloseTo(3.8, 10);
    expect(r.totalCredits).toBe(30);
  });

  it("works on a 5.00 scale", () => {
    // (4.50×12 + 5.00×6) / 18 = 84/18 = 4.666…
    const r = ok([row("4.50", "12"), row("5.00", "6")], 5);
    expect(r.cgpa).toBeCloseTo(4.666666667, 8);
  });

  it("accepts boundary GPAs 0 and the scale maximum", () => {
    expect(ok([row("0", "10")]).cgpa).toBe(0);
    expect(ok([row("4", "10")]).cgpa).toBe(4);
    expect(ok([row("5", "10")], 5).cgpa).toBe(5);
  });

  it("accepts decimal credits, commas and Bangla digits", () => {
    expect(ok([row("3.5", "7.5")]).totalCredits).toBe(7.5);
    expect(ok([row("৩.৫", "১২")]).cgpa).toBe(3.5);
  });

  it("ignores blank rows", () => {
    const r = ok([blank(), row("3", "10"), blank()]);
    expect(r.termCount).toBe(1);
    expect(isBlankTermRow({ id: 1, name: " ", gpa: "", credits: " " })).toBe(true);
    expect(isBlankTermRow({ id: 1, name: "Sem 1", gpa: "", credits: "" })).toBe(false);
  });

  it("handles the maximum number of terms and credits", () => {
    const rows = Array.from({ length: MAX_TERMS }, () => row("3.5", String(MAX_TERM_CREDITS)));
    const r = ok(rows);
    expect(r.termCount).toBe(20);
    expect(r.totalCredits).toBe(1200);
    expect(r.cgpa).toBeCloseTo(3.5, 10);
  });
});

describe("calculateCgpa validation", () => {
  it("needs at least one complete term", () => {
    expect(errors(calculateCgpa([]))).toEqual([{ rowId: null, field: "rows", code: "no-terms" }]);
    expect(errors(calculateCgpa([blank(), blank()]))).toEqual([{ rowId: null, field: "rows", code: "no-terms" }]);
  });

  it("flags the missing field of a partially filled row", () => {
    const a = row("3.5", "");
    const b = row("", "12");
    expect(errors(calculateCgpa([a, b]))).toEqual([
      { rowId: a.id, field: "credits", code: "missing" },
      { rowId: b.id, field: "gpa", code: "missing" },
    ]);
  });

  it("validates GPA against the chosen scale", () => {
    const r = row("4.5", "10");
    expect(errors(calculateCgpa([r], 4))).toEqual([{ rowId: r.id, field: "gpa", code: "too-large" }]);
    expect(calculateCgpa([r], 5).ok).toBe(true);
    const over = row("5.01", "10");
    expect(errors(calculateCgpa([over], 5))).toEqual([{ rowId: over.id, field: "gpa", code: "too-large" }]);
  });

  it("rejects negative and non-numeric GPAs", () => {
    const neg = row("-1", "10");
    const bad = row("abc", "10");
    expect(errors(calculateCgpa([neg, bad]))).toEqual([
      { rowId: neg.id, field: "gpa", code: "too-small" },
      { rowId: bad.id, field: "gpa", code: "invalid" },
    ]);
  });

  it("rejects zero, negative and oversized credits", () => {
    const zero = row("3", "0");
    const neg = row("3", "-5");
    const big = row("3", "60.5");
    expect(errors(calculateCgpa([zero, neg, big]))).toEqual([
      { rowId: zero.id, field: "credits", code: "too-small" },
      { rowId: neg.id, field: "credits", code: "too-small" },
      { rowId: big.id, field: "credits", code: "too-large" },
    ]);
  });

  it("reports both fields of a row at once", () => {
    const r = row("x", "y");
    expect(errors(calculateCgpa([r]))).toEqual([
      { rowId: r.id, field: "gpa", code: "invalid" },
      { rowId: r.id, field: "credits", code: "invalid" },
    ]);
  });

  it("rejects more than the maximum number of terms", () => {
    const rows = Array.from({ length: MAX_TERMS + 1 }, () => row("3", "10"));
    expect(errors(calculateCgpa(rows))).toEqual([{ rowId: null, field: "rows", code: "too-many" }]);
  });
});

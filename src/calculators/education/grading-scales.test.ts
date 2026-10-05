import { describe, expect, it } from "vitest";
import { DEFAULT_GRADING_SCALE, getGradingScale, gradePointFor, GRADING_SCALES } from "./grading-scales";

describe("grading scales", () => {
  it("has unique scale ids and the default scale is registered", () => {
    const ids = GRADING_SCALES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(getGradingScale("bd-ugc-4")).toBe(DEFAULT_GRADING_SCALE);
    expect(getGradingScale("nope")).toBeUndefined();
  });

  for (const scale of GRADING_SCALES) {
    describe(scale.id, () => {
      it("lists grade points from best to worst without repeats", () => {
        for (let i = 1; i < scale.grades.length; i++) {
          const prev = scale.grades[i - 1];
          const cur = scale.grades[i];
          expect(prev !== undefined && cur !== undefined).toBeTruthy();
          if (prev && cur) expect(prev.point).toBeGreaterThan(cur.point);
        }
      });

      it("has unique, non-empty letters", () => {
        const letters = scale.grades.map((g) => g.letter);
        expect(new Set(letters).size).toBe(letters.length);
        for (const letter of letters) expect(letter.length).toBeGreaterThan(0);
      });

      it("keeps every point within 0..maxPoint and tops out at maxPoint", () => {
        for (const g of scale.grades) {
          expect(g.point).toBeGreaterThanOrEqual(0);
          expect(g.point).toBeLessThanOrEqual(scale.maxPoint);
        }
        expect(scale.grades[0]?.point).toBe(scale.maxPoint);
        expect(scale.grades.at(-1)?.point).toBe(0);
      });

      it("has marks ranges that cover 0..100 with no gaps or overlaps", () => {
        let expectedMax = 100;
        for (const g of scale.grades) {
          expect(g.marksRange).toBeDefined();
          if (!g.marksRange) continue;
          expect(g.marksRange.max).toBe(expectedMax);
          expect(g.marksRange.min).toBeLessThanOrEqual(g.marksRange.max);
          expectedMax = g.marksRange.min - 1;
        }
        expect(expectedMax).toBe(-1);
      });
    });
  }

  it("matches the documented Bangladesh UGC values", () => {
    const table = DEFAULT_GRADING_SCALE.grades.map((g) => [g.letter, g.point]);
    expect(table).toEqual([
      ["A+", 4], ["A", 3.75], ["A-", 3.5], ["B+", 3.25], ["B", 3],
      ["B-", 2.75], ["C+", 2.5], ["C", 2.25], ["D", 2], ["F", 0],
    ]);
  });

  it("looks up grade points by exact letter", () => {
    expect(gradePointFor(DEFAULT_GRADING_SCALE, "A-")).toBe(3.5);
    expect(gradePointFor(DEFAULT_GRADING_SCALE, "F")).toBe(0);
    expect(gradePointFor(DEFAULT_GRADING_SCALE, "a")).toBeNull();
    expect(gradePointFor(DEFAULT_GRADING_SCALE, "")).toBeNull();
  });
});

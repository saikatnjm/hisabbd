import { describe, expect, it } from "vitest";
import {
  BD_BOARD_5_SCALE,
  calculateSscHscGpa,
  cappedGpa,
  fourthSubjectBonus,
  isBlankSubjectRow,
  MAX_GPA,
  MAX_SUBJECTS,
  type SscHscGpaCalculation,
  type SubjectRowInput,
} from "./logic";

let nextId = 1;
function row(grade: string, name = ""): SubjectRowInput {
  return { id: nextId++, name, grade };
}
const blank = (): SubjectRowInput => row("");
const rowsOf = (...grades: string[]) => grades.map((g) => row(g));

function ok(rows: SubjectRowInput[], fourth = "") {
  const calc = calculateSscHscGpa(rows, fourth);
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}
const errors = (calc: SscHscGpaCalculation) => (calc.ok ? [] : calc.errors);

describe("BD_BOARD_5_SCALE", () => {
  it("has the board letter grades, best first", () => {
    expect(BD_BOARD_5_SCALE.grades.map((g) => [g.letter, g.point])).toEqual([
      ["A+", 5],
      ["A", 4],
      ["A-", 3.5],
      ["B", 3],
      ["C", 2],
      ["D", 1],
      ["F", 0],
    ]);
    expect(BD_BOARD_5_SCALE.maxPoint).toBe(MAX_GPA);
  });

  it("marks ranges cover 0–100 without gaps", () => {
    const ranges = BD_BOARD_5_SCALE.grades.map((g) => g.marksRange!).reverse();
    expect(ranges[0]!.min).toBe(0);
    expect(ranges.at(-1)!.max).toBe(100);
    for (let i = 1; i < ranges.length; i++) expect(ranges[i]!.min).toBe(ranges[i - 1]!.max + 1);
  });
});

describe("fourthSubjectBonus", () => {
  it("gives each grade's bonus above 2.00", () => {
    const bonus = (letter: string) =>
      fourthSubjectBonus(BD_BOARD_5_SCALE.grades.find((g) => g.letter === letter)!.point);
    expect(bonus("A+")).toBe(3);
    expect(bonus("A")).toBe(2);
    expect(bonus("A-")).toBe(1.5);
    expect(bonus("B")).toBe(1);
    expect(bonus("C")).toBe(0);
    expect(bonus("D")).toBe(0);
    expect(bonus("F")).toBe(0);
  });
});

describe("cappedGpa", () => {
  it("caps at 5.00 and says so", () => {
    expect(cappedGpa(32, 6)).toEqual({ gpa: 5, capped: true });
    expect(cappedGpa(30, 6)).toEqual({ gpa: 5, capped: false });
    expect(cappedGpa(27, 6)).toEqual({ gpa: 4.5, capped: false });
  });
});

describe("calculateSscHscGpa", () => {
  it("worked example 1 (HSC): 26.5 main points + A in the 4th gives 4.75", () => {
    // Bangla A 4, English A- 3.5, ICT A+ 5, Physics A 4, Chemistry A+ 5, Higher Math A+ 5 = 26.5
    // Biology (4th) A: +2 → 28.5 ÷ 6 = 4.75; without the 4th: 26.5 ÷ 6 = 4.4166…
    const r = ok(rowsOf("A", "A-", "A+", "A", "A+", "A+"), "A");
    expect(r.status).toBe("pass");
    expect(r.totalMainPoints).toBe(26.5);
    expect(r.fourthBonus).toBe(2);
    expect(r.totalPoints).toBe(28.5);
    expect(r.mainSubjectCount).toBe(6);
    expect(r.gpa).toBe(4.75);
    expect(r.gpaWithoutFourth).toBeCloseTo(4.416666667, 8);
    expect(r.capped).toBe(false);
    expect(r.allMainAPlus).toBe(false);
    expect(r.fourthGrade).toBe("A");
  });

  it("worked example 2 (HSC, capped): 29 main points + A+ in the 4th is capped at 5.00", () => {
    // Bangla A+, English A, ICT A+, Physics A+, Chemistry A+, Higher Math A+ = 29 → 4.8333…
    // Biology (4th) A+: +3 → 32 ÷ 6 = 5.333… → capped at 5.00
    const r = ok(rowsOf("A+", "A", "A+", "A+", "A+", "A+"), "A+");
    expect(r.totalMainPoints).toBe(29);
    expect(r.totalPoints).toBe(32);
    expect(r.gpa).toBe(5);
    expect(r.capped).toBe(true);
    expect(r.gpaWithoutFourth).toBeCloseTo(4.833333333, 8);
    expect(r.allMainAPlus).toBe(false);
  });

  it("all A+ with an A+ 4th subject is exactly 5.00, never above", () => {
    const r = ok(rowsOf("A+", "A+", "A+", "A+", "A+", "A+"), "A+");
    expect(r.gpa).toBe(MAX_GPA);
    expect(r.gpaWithoutFourth).toBe(MAX_GPA);
    expect(r.capped).toBe(true);
    expect(r.allMainAPlus).toBe(true);
  });

  it("all A+ without a 4th subject is 5.00 and not capped", () => {
    const r = ok(rowsOf("A+", "A+", "A+", "A+", "A+", "A+", "A+", "A+", "A+"));
    expect(r.gpa).toBe(5);
    expect(r.capped).toBe(false);
    expect(r.allMainAPlus).toBe(true);
    expect(r.fourthGrade).toBeNull();
    expect(r.fourthBonus).toBe(0);
  });

  it("adds each 4th-subject bonus to the points but not to the divisor", () => {
    const main = () => rowsOf("B", "B", "B", "B", "B", "B"); // 18 points → 3.00
    const cases: [string, number][] = [
      ["A+", 3],
      ["A", 2],
      ["A-", 1.5],
      ["B", 1],
      ["C", 0],
      ["D", 0],
    ];
    for (const [letter, bonus] of cases) {
      const r = ok(main(), letter);
      expect(r.fourthBonus).toBe(bonus);
      expect(r.mainSubjectCount).toBe(6);
      expect(r.gpa).toBeCloseTo((18 + bonus) / 6, 10);
      expect(r.gpaWithoutFourth).toBe(3);
    }
  });

  it("an F in the 4th subject does not fail the student", () => {
    const r = ok(rowsOf("A", "A", "A", "A", "A", "A"), "F");
    expect(r.status).toBe("pass");
    expect(r.fourthBonus).toBe(0);
    expect(r.gpa).toBe(4);
    expect(r.fourthGrade).toBe("F");
  });

  it("an F in a main subject fails: GPA 0 and the failed rows are listed", () => {
    const failed1 = row("F", "Physics");
    const failed2 = row("F");
    const r = ok([row("A+"), failed1, row("A"), failed2, row("A+"), row("A+")], "A+");
    expect(r.status).toBe("fail");
    expect(r.gpa).toBe(0);
    expect(r.gpaWithoutFourth).toBe(0);
    expect(r.fourthBonus).toBe(0);
    expect(r.capped).toBe(false);
    expect(r.failedRowIds).toEqual([failed1.id, failed2.id]);
    expect(r.totalMainPoints).toBe(19);
    expect(r.totalPoints).toBe(19);
    expect(r.mainSubjectCount).toBe(6);
  });

  it("the divisor is the number of main subjects entered", () => {
    // SSC-style: 9 main subjects, 40.5 points → 4.50; A- in the 4th adds 1.5 → 42 ÷ 9 = 4.666…
    const r = ok(rowsOf("A+", "A+", "A", "A+", "A-", "A", "A+", "A", "A+"), "A-");
    expect(r.mainSubjectCount).toBe(9);
    expect(r.totalMainPoints).toBe(40.5);
    expect(r.gpaWithoutFourth).toBe(4.5);
    expect(r.gpa).toBeCloseTo(42 / 9, 10);
    // A single subject works too
    expect(ok(rowsOf("C")).gpa).toBe(2);
    expect(ok(rowsOf("D"), "A+").gpa).toBe(4);
  });

  it("ignores blank rows, including whitespace-only ones", () => {
    const r = ok([blank(), row("A+", "Bangla"), blank(), row("A"), { id: nextId++, name: "  ", grade: " " }], "");
    expect(r.mainSubjectCount).toBe(2);
    expect(r.gpa).toBe(4.5);
  });

  it("treats a blank or whitespace 4th subject as none", () => {
    expect(ok(rowsOf("A"), "  ").fourthGrade).toBeNull();
    expect(ok(rowsOf("A"), "").fourthBonus).toBe(0);
  });

  it("names do not affect the result", () => {
    expect(ok([row("A", "Math")], "B").gpa).toBe(ok([row("A")], "B").gpa);
  });

  it("handles the maximum number of subjects", () => {
    const r = ok(Array.from({ length: MAX_SUBJECTS }, () => row("A-")), "A");
    expect(r.mainSubjectCount).toBe(15);
    expect(r.gpa).toBeCloseTo((15 * 3.5 + 2) / 15, 10);
  });

  it("isBlankSubjectRow needs both name and grade empty", () => {
    expect(isBlankSubjectRow({ id: 1, name: " ", grade: "" })).toBe(true);
    expect(isBlankSubjectRow({ id: 1, name: "Bangla", grade: "" })).toBe(false);
    expect(isBlankSubjectRow({ id: 1, name: "", grade: "A" })).toBe(false);
  });
});

describe("calculateSscHscGpa validation", () => {
  it("needs at least one main subject", () => {
    const noSubjects = [{ rowId: null, field: "rows", code: "no-subjects" }];
    expect(errors(calculateSscHscGpa([], ""))).toEqual(noSubjects);
    expect(errors(calculateSscHscGpa([blank(), blank()], ""))).toEqual(noSubjects);
    // A 4th subject alone is not enough
    expect(errors(calculateSscHscGpa([blank()], "A+"))).toEqual(noSubjects);
  });

  it("a named row without a grade is an error", () => {
    const named = row("", "Chemistry");
    expect(errors(calculateSscHscGpa([row("A"), named], ""))).toEqual([
      { rowId: named.id, field: "grade", code: "missing" },
    ]);
  });

  it("rejects unknown grades in main rows and the 4th subject, reporting all together", () => {
    const bad = row("B+");
    const lower = row("a+");
    expect(errors(calculateSscHscGpa([bad, row("A"), lower], "E"))).toEqual([
      { rowId: bad.id, field: "grade", code: "invalid" },
      { rowId: lower.id, field: "grade", code: "invalid" },
      { rowId: null, field: "fourth", code: "invalid" },
    ]);
  });

  it("reports an invalid 4th subject instead of no-subjects when both apply", () => {
    expect(errors(calculateSscHscGpa([blank()], "X"))).toEqual([{ rowId: null, field: "fourth", code: "invalid" }]);
  });

  it("rejects more than the maximum number of rows", () => {
    const rows = Array.from({ length: MAX_SUBJECTS + 1 }, () => row("A"));
    expect(errors(calculateSscHscGpa(rows, ""))).toEqual([{ rowId: null, field: "rows", code: "too-many" }]);
  });

  it("uses the scale it is given", () => {
    const tiny = { ...BD_BOARD_5_SCALE, grades: [{ letter: "X", point: 4 }] };
    const calc = calculateSscHscGpa([row("X")], "X", tiny);
    expect(calc.ok && calc.result.gpa).toBe(5); // (4 + 2) ÷ 1 = 6 → capped
    expect(calculateSscHscGpa([row("A+")], "", tiny).ok).toBe(false);
  });
});

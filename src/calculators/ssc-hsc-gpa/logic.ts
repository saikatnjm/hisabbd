import { roundTo } from "@/lib/number";
import { gradePointFor, type GradingScale } from "@/calculators/education/grading-scales";

/*
 * SSC & HSC GPA calculator rules and assumptions (documented):
 *
 * These rules match widely published Bangladesh education-board practice for
 * SSC/HSC (and the equivalent Dakhil/Alim) results on the 5.00 scale. We found
 * no official circular online that states them, so the page tells students to
 * check their board's result notice. The grade table is data (BD_BOARD_5_SCALE).
 *
 * 1. Each main subject (compulsory + group) contributes its grade point once.
 *    A two-paper subject (e.g. Bangla 1st and 2nd paper) is ONE subject with
 *    its combined grade, so the user enters it as one row.
 * 2. The optional (4th) subject adds a bonus of max(0, grade point − 2.00):
 *    A+ +3, A +2, A- +1.5, B +1, C/D/F +0. It is NOT counted in the divisor,
 *    and an F in it does not fail the student.
 * 3. GPA = (Σ main grade points + bonus) ÷ number of main subjects entered,
 *    capped at 5.00. The divisor is whatever the student enters (typically 6
 *    for HSC, more for SSC); 6 or 9 is never hard-coded.
 * 4. If any main subject is F, the result is a fail: GPA 0.00, status "fail",
 *    and the failed rows are listed.
 * 5. The GPA without the 4th subject (Σ main ÷ n, capped) is also returned so
 *    the UI can show how much the 4th subject added.
 * 6. Nothing is rounded here except removing floating-point noise (10
 *    decimals). Boards publish 2 decimals; the UI rounds half up to 2 decimals
 *    for display. Because of the cap, 5.00 is the maximum.
 * 7. A row where name and grade are both blank is ignored. A named row needs a
 *    grade. At least one main subject is required; at most MAX_SUBJECTS rows.
 *    The 4th subject is optional: "" means no 4th subject.
 */

/** Bangladesh education boards' 5.00 letter-grade scale (SSC, HSC, Dakhil, Alim). */
export const BD_BOARD_5_SCALE: GradingScale = {
  id: "bd-board-5",
  name: "Bangladesh education boards (SSC/HSC, 5.00 scale)",
  nameBn: "বাংলাদেশের শিক্ষা বোর্ড (এসএসসি/এইচএসসি, ৫.০০ স্কেল)",
  description:
    "Letter grades used by Bangladesh’s education boards for SSC, HSC and equivalent exams. Check your board’s result notice for the official rules.",
  descriptionBn:
    "এসএসসি, এইচএসসি ও সমমানের পরীক্ষায় বাংলাদেশের শিক্ষা বোর্ডের লেটার গ্রেড। আনুষ্ঠানিক নিয়মের জন্য নিজের বোর্ডের ফলাফল বিজ্ঞপ্তি দেখুন।",
  maxPoint: 5,
  grades: [
    { letter: "A+", point: 5.0, marksRange: { min: 80, max: 100 } },
    { letter: "A", point: 4.0, marksRange: { min: 70, max: 79 } },
    { letter: "A-", point: 3.5, marksRange: { min: 60, max: 69 } },
    { letter: "B", point: 3.0, marksRange: { min: 50, max: 59 } },
    { letter: "C", point: 2.0, marksRange: { min: 40, max: 49 } },
    { letter: "D", point: 1.0, marksRange: { min: 33, max: 39 } },
    { letter: "F", point: 0.0, marksRange: { min: 0, max: 32 } },
  ],
};

/** Highest GPA a student can get; totals above this are capped. */
export const MAX_GPA = 5;
/** The 4th subject only earns the part of its grade point above this. */
export const FOURTH_SUBJECT_BASE = 2;
/** Most main-subject rows accepted in one calculation. */
export const MAX_SUBJECTS = 15;

export interface SubjectRowInput {
  /** Stable row id (not the array index). */
  id: number;
  name: string;
  grade: string;
}

export type SscHscGpaField = "grade" | "fourth" | "rows";
export type SscHscGpaErrorCode = "missing" | "invalid" | "no-subjects" | "too-many";

export interface SscHscGpaError {
  /** Row the error belongs to; null for the 4th subject and whole-list errors. */
  rowId: number | null;
  field: SscHscGpaField;
  code: SscHscGpaErrorCode;
}

export interface SscHscGpaResult {
  status: "pass" | "fail";
  /** Final GPA: (Σ main + bonus) ÷ n, capped at 5.00; 0 on a fail. */
  gpa: number;
  /** Σ main ÷ n, capped at 5.00; 0 on a fail. */
  gpaWithoutFourth: number;
  /** True when (Σ main + bonus) ÷ n went above 5.00 and was capped. */
  capped: boolean;
  /** Letter of the 4th subject, or null when there is none. */
  fourthGrade: string | null;
  /** Bonus points from the 4th subject, max(0, GP − 2); 0 without one or on a fail. */
  fourthBonus: number;
  /** Σ main-subject grade points. */
  totalMainPoints: number;
  /** totalMainPoints + fourthBonus (before dividing and capping). */
  totalPoints: number;
  /** The divisor: main subjects entered. */
  mainSubjectCount: number;
  /** Every main subject is A+ (the fact behind the informal "Golden A+"). */
  allMainAPlus: boolean;
  /** Rows of main subjects graded F, in input order (empty on a pass). */
  failedRowIds: number[];
}

export type SscHscGpaCalculation =
  | { ok: true; result: SscHscGpaResult }
  | { ok: false; errors: SscHscGpaError[] };

/** Bonus a 4th-subject grade point earns: max(0, point − 2.00). */
export function fourthSubjectBonus(point: number): number {
  return Math.max(0, roundTo(point - FOURTH_SUBJECT_BASE, 10));
}

/** Σ ÷ n capped at 5.00. Returns the GPA and whether the cap applied. */
export function cappedGpa(totalPoints: number, subjectCount: number): { gpa: number; capped: boolean } {
  const raw = totalPoints / subjectCount;
  return raw > MAX_GPA ? { gpa: MAX_GPA, capped: true } : { gpa: raw, capped: false };
}

export function isBlankSubjectRow(row: SubjectRowInput): boolean {
  return !row.name.trim() && !row.grade.trim();
}

/**
 * Validates the main-subject rows and the optional 4th-subject grade
 * ("" = none) and works out the board GPA. All errors are collected.
 */
export function calculateSscHscGpa(
  rows: readonly SubjectRowInput[],
  fourthGrade: string,
  scale: GradingScale = BD_BOARD_5_SCALE,
): SscHscGpaCalculation {
  if (rows.length > MAX_SUBJECTS) {
    return { ok: false, errors: [{ rowId: null, field: "rows", code: "too-many" }] };
  }

  const errors: SscHscGpaError[] = [];
  const subjects: { rowId: number; letter: string; point: number }[] = [];

  for (const row of rows) {
    if (isBlankSubjectRow(row)) continue;
    const letter = row.grade.trim();
    const point = letter ? gradePointFor(scale, letter) : null;
    if (point === null) {
      errors.push({ rowId: row.id, field: "grade", code: letter ? "invalid" : "missing" });
    } else {
      subjects.push({ rowId: row.id, letter, point });
    }
  }

  const fourthLetter = fourthGrade.trim();
  const fourthPoint = fourthLetter ? gradePointFor(scale, fourthLetter) : null;
  if (fourthLetter && fourthPoint === null) {
    errors.push({ rowId: null, field: "fourth", code: "invalid" });
  }

  if (errors.length === 0 && subjects.length === 0) {
    errors.push({ rowId: null, field: "rows", code: "no-subjects" });
  }
  if (errors.length > 0) return { ok: false, errors };

  const n = subjects.length;
  const totalMainPoints = roundTo(subjects.reduce((sum, s) => sum + s.point, 0), 10);
  const failedRowIds = subjects.filter((s) => s.point === 0).map((s) => s.rowId);
  const allMainAPlus = subjects.every((s) => s.point === scale.maxPoint);
  const base = { fourthGrade: fourthLetter || null, totalMainPoints, mainSubjectCount: n, allMainAPlus };

  // Rule 4: an F in any main subject fails the exam, whatever the 4th subject is.
  if (failedRowIds.length > 0) {
    return {
      ok: true,
      result: {
        ...base,
        status: "fail",
        gpa: 0,
        gpaWithoutFourth: 0,
        capped: false,
        fourthBonus: 0,
        totalPoints: totalMainPoints,
        failedRowIds,
      },
    };
  }

  const fourthBonus = fourthPoint === null ? 0 : fourthSubjectBonus(fourthPoint);
  const totalPoints = roundTo(totalMainPoints + fourthBonus, 10);
  const final = cappedGpa(totalPoints, n);

  return {
    ok: true,
    result: {
      ...base,
      status: "pass",
      gpa: final.gpa,
      gpaWithoutFourth: cappedGpa(totalMainPoints, n).gpa,
      capped: final.capped,
      fourthBonus,
      totalPoints,
      failedRowIds: [],
    },
  };
}

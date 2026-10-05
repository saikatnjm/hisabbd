import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";
import { DEFAULT_GRADING_SCALE, gradePointFor, type GradingScale } from "@/calculators/education/grading-scales";

/*
 * GPA calculator rules and assumptions (documented):
 *
 * 1. GPA = Σ(grade point × credits) ÷ Σ credits, over every course entered.
 *    A course with an F counts: it adds 0 points but its credits stay in the
 *    divisor, which lowers the GPA.
 * 2. Grade points come from a grading scale (see education/grading-scales.ts).
 *    The default is the Bangladesh UGC uniform 4.00 scale; universities may
 *    differ, so the scale is data, not code.
 * 3. Credits are decimals: more than 0 and at most 30 per course (1.5, 0.75 …).
 *    At most 30 courses per calculation.
 * 4. A row where name, grade and credits are all blank is ignored. A row with
 *    anything filled in must have both a grade and credits. At least one
 *    complete course is required.
 * 5. Nothing is rounded here except for removing floating-point noise
 *    (sums are rounded to 10 decimals so that e.g. 3.4249999999999 does not
 *    display as 3.42). Display rounding (2 decimals, half up) happens in the
 *    UI. Some institutions truncate instead of rounding; that is explained on
 *    the page, not applied.
 */

export const MAX_COURSES = 30;
/** Credits must be more than 0 and at most this. */
export const MAX_COURSE_CREDITS = 30;

export interface CourseRowInput {
  /** Stable row id (not the array index). */
  id: number;
  name: string;
  grade: string;
  credits: string;
}

export type GpaField = "grade" | "credits" | "rows";
export type GpaErrorCode = NumberErrorCode | "no-courses" | "too-many";

export interface GpaError {
  /** Row the error belongs to; null for errors about the whole list. */
  rowId: number | null;
  field: GpaField;
  code: GpaErrorCode;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
  courseCount: number;
}

export type GpaCalculation = { ok: true; result: GpaResult } | { ok: false; errors: GpaError[] };

export interface CourseEntry {
  point: number;
  credits: number;
}

/** Weighted GPA. Returns null when there are no credits (avoids dividing by zero). */
export function computeGpa(entries: readonly CourseEntry[]): Omit<GpaResult, "courseCount"> | null {
  const totalCredits = roundTo(entries.reduce((sum, e) => sum + e.credits, 0), 10);
  if (!(totalCredits > 0)) return null;
  const totalGradePoints = roundTo(entries.reduce((sum, e) => sum + e.point * e.credits, 0), 10);
  return { gpa: totalGradePoints / totalCredits, totalCredits, totalGradePoints };
}

export function isBlankCourseRow(row: CourseRowInput): boolean {
  return !row.name.trim() && !row.grade.trim() && !row.credits.trim();
}

export function calculateGpa(
  rows: readonly CourseRowInput[],
  scale: GradingScale = DEFAULT_GRADING_SCALE,
): GpaCalculation {
  if (rows.length > MAX_COURSES) {
    return { ok: false, errors: [{ rowId: null, field: "rows", code: "too-many" }] };
  }

  const errors: GpaError[] = [];
  const entries: CourseEntry[] = [];

  for (const row of rows) {
    if (isBlankCourseRow(row)) continue;

    const point = row.grade.trim() ? gradePointFor(scale, row.grade) : null;
    if (point === null) {
      errors.push({ rowId: row.id, field: "grade", code: row.grade.trim() ? "invalid" : "missing" });
    }
    const credits = checkNumber(row.credits, { min: 0, minExclusive: true, max: MAX_COURSE_CREDITS });
    if (!credits.ok) errors.push({ rowId: row.id, field: "credits", code: credits.code });

    if (point !== null && credits.ok) entries.push({ point, credits: credits.value });
  }

  if (errors.length > 0) return { ok: false, errors };

  const computed = computeGpa(entries);
  if (!computed) return { ok: false, errors: [{ rowId: null, field: "rows", code: "no-courses" }] };
  return { ok: true, result: { ...computed, courseCount: entries.length } };
}

import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * CGPA calculator rules and assumptions (documented):
 *
 * 1. CGPA = Σ(term GPA × term credits) ÷ Σ term credits. Terms are weighted by
 *    credits; a plain average of the GPAs is wrong when credits differ.
 * 2. This is exactly equivalent to treating an earlier CGPA and its completed
 *    credits as one term, then adding the new terms.
 * 3. The scale maximum is 4.00 or 5.00. Each term GPA must be between 0 and the
 *    maximum (inclusive). Term credits must be more than 0 and at most 60;
 *    at most 20 terms.
 * 4. A row where name, GPA and credits are all blank is ignored. A row with
 *    anything filled in needs both GPA and credits. At least one complete term
 *    is required.
 * 5. Only floating-point noise is removed (sums rounded to 10 decimals).
 *    Display rounding (2 decimals, half up) happens in the UI. Some institutions
 *    truncate instead; the page explains this.
 */

export const SCALE_MAXIMA = [4, 5] as const;
export type ScaleMax = (typeof SCALE_MAXIMA)[number];

export const MAX_TERMS = 20;
/** Credits must be more than 0 and at most this. */
export const MAX_TERM_CREDITS = 60;

export interface TermRowInput {
  /** Stable row id (not the array index). */
  id: number;
  name: string;
  gpa: string;
  credits: string;
}

export type CgpaField = "gpa" | "credits" | "rows";
export type CgpaErrorCode = NumberErrorCode | "no-terms" | "too-many";

export interface CgpaError {
  /** Row the error belongs to; null for errors about the whole list. */
  rowId: number | null;
  field: CgpaField;
  code: CgpaErrorCode;
}

export interface CgpaResult {
  cgpa: number;
  totalCredits: number;
  termCount: number;
}

export type CgpaCalculation = { ok: true; result: CgpaResult } | { ok: false; errors: CgpaError[] };

export interface TermEntry {
  gpa: number;
  credits: number;
}

/** Credit-weighted CGPA. Returns null when there are no credits. */
export function computeCgpa(entries: readonly TermEntry[]): { cgpa: number; totalCredits: number } | null {
  const totalCredits = roundTo(entries.reduce((sum, e) => sum + e.credits, 0), 10);
  if (!(totalCredits > 0)) return null;
  const weighted = roundTo(entries.reduce((sum, e) => sum + e.gpa * e.credits, 0), 10);
  return { cgpa: weighted / totalCredits, totalCredits };
}

/** Plain average of the GPAs, ignoring credits. Only for showing why it is wrong. */
export function simpleAverageGpa(gpas: readonly number[]): number | null {
  if (gpas.length === 0) return null;
  return gpas.reduce((sum, g) => sum + g, 0) / gpas.length;
}

export function isBlankTermRow(row: TermRowInput): boolean {
  return !row.name.trim() && !row.gpa.trim() && !row.credits.trim();
}

export function calculateCgpa(rows: readonly TermRowInput[], scaleMax: ScaleMax = 4): CgpaCalculation {
  if (rows.length > MAX_TERMS) {
    return { ok: false, errors: [{ rowId: null, field: "rows", code: "too-many" }] };
  }

  const errors: CgpaError[] = [];
  const entries: TermEntry[] = [];

  for (const row of rows) {
    if (isBlankTermRow(row)) continue;

    const gpa = checkNumber(row.gpa, { min: 0, max: scaleMax });
    if (!gpa.ok) errors.push({ rowId: row.id, field: "gpa", code: gpa.code });
    const credits = checkNumber(row.credits, { min: 0, minExclusive: true, max: MAX_TERM_CREDITS });
    if (!credits.ok) errors.push({ rowId: row.id, field: "credits", code: credits.code });

    if (gpa.ok && credits.ok) entries.push({ gpa: gpa.value, credits: credits.value });
  }

  if (errors.length > 0) return { ok: false, errors };

  const computed = computeCgpa(entries);
  if (!computed) return { ok: false, errors: [{ rowId: null, field: "rows", code: "no-terms" }] };
  return { ok: true, result: { ...computed, termCount: entries.length } };
}

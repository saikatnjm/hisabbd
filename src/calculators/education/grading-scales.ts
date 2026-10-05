/*
 * Grading scales used by the GPA calculator (and anything else that needs
 * letter grades). Each scale is plain data: add a new object to
 * GRADING_SCALES and the calculators can use it without any code change.
 *
 * "bd-ugc-4" is the uniform grading system published by Bangladesh's
 * University Grants Commission (UGC) and used by many universities in the
 * country. Institutions may differ (some use other cut-offs, extra grades or a
 * different maximum), so users should always check their own handbook.
 *
 * Deliberately NOT included: SSC/HSC scales. Their GPA rules (for example the
 * optional/fourth subject) work differently and a plain weighted average
 * would give misleading results.
 */

export interface GradeBand {
  letter: string;
  /** Grade point earned for this letter. */
  point: number;
  /** Marks (percent) that map to this grade, inclusive on both ends. */
  marksRange?: { min: number; max: number };
}

export interface GradingScale {
  id: string;
  name: string;
  description: string;
  /** Highest grade point on the scale. */
  maxPoint: number;
  /** Best grade first. */
  grades: readonly GradeBand[];
}

export const BD_UGC_4_SCALE: GradingScale = {
  id: "bd-ugc-4",
  name: "Bangladesh university (UGC uniform grading, 4.00 scale)",
  description:
    "The uniform grading system published by Bangladesh’s University Grants Commission and used by many universities. Check your own university’s handbook, as some differ.",
  maxPoint: 4,
  grades: [
    { letter: "A+", point: 4.0, marksRange: { min: 80, max: 100 } },
    { letter: "A", point: 3.75, marksRange: { min: 75, max: 79 } },
    { letter: "A-", point: 3.5, marksRange: { min: 70, max: 74 } },
    { letter: "B+", point: 3.25, marksRange: { min: 65, max: 69 } },
    { letter: "B", point: 3.0, marksRange: { min: 60, max: 64 } },
    { letter: "B-", point: 2.75, marksRange: { min: 55, max: 59 } },
    { letter: "C+", point: 2.5, marksRange: { min: 50, max: 54 } },
    { letter: "C", point: 2.25, marksRange: { min: 45, max: 49 } },
    { letter: "D", point: 2.0, marksRange: { min: 40, max: 44 } },
    { letter: "F", point: 0.0, marksRange: { min: 0, max: 39 } },
  ],
};

export const GRADING_SCALES: readonly GradingScale[] = [BD_UGC_4_SCALE];

export const DEFAULT_GRADING_SCALE: GradingScale = BD_UGC_4_SCALE;

/** Looks a scale up by id; undefined when unknown. */
export function getGradingScale(id: string): GradingScale | undefined {
  return GRADING_SCALES.find((scale) => scale.id === id);
}

/** Grade point for a letter on a scale (exact match), or null when the letter is not on it. */
export function gradePointFor(scale: GradingScale, letter: string): number | null {
  const band = scale.grades.find((grade) => grade.letter === letter);
  return band ? band.point : null;
}

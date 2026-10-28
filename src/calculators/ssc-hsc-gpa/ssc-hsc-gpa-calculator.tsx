"use client";

import { useEffect, useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { CalculatorResultArea } from "@/components/calculator/calculator-result-area";
import { RecentCalculations } from "@/components/calculator/recent-calculations";
import { ResultActions } from "@/components/calculator/result-actions";
import { ResultPlaceholder } from "@/components/calculator/result-placeholder";
import { ResultStats } from "@/components/calculator/result-stats";
import { FieldMessage, FormField, Input, Label, SegmentedControl, Select } from "@/components/ui/form";
import { ResultPanel } from "@/components/ui/result";
import { AddRowButton, RemoveRowButton } from "@/calculators/education/row-controls";
import { rowsFromJson, rowsToJson, useRowList } from "@/calculators/education/use-row-list";
import { useLocale } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { countBn, formatNumber, joinList, pluralize } from "@/lib/format";
import { roundTo } from "@/lib/number";
import { choicePreference } from "@/lib/preferences";
import { useCalculationHistory } from "@/lib/use-calculation-history";
import { usePreference } from "@/lib/use-preference";
import {
  BD_BOARD_5_SCALE,
  calculateSscHscGpa,
  fourthSubjectBonus,
  isBlankSubjectRow,
  MAX_SUBJECTS,
  type SscHscGpaError,
  type SscHscGpaField,
  type SscHscGpaResult,
  type SubjectRowInput,
} from "./logic";

type Exam = "ssc" | "hsc";

const SCALE = BD_BOARD_5_SCALE;
/** The exam is remembered in this browser; HSC on a first visit. */
const EXAM = choicePreference<Exam>("ssc-hsc-gpa-calculator", "exam", ["ssc", "hsc"], "hsc");
/** Starting rows only (typical main-subject counts); the divisor is whatever is entered. */
const DEFAULT_ROWS: Record<Exam, number> = { ssc: 9, hsc: 6 };
const EXAM_CONTROL_NAME = "ssc-hsc-exam";
const FOURTH_ID = "ssc-hsc-fourth";

const fieldId = (rowId: number, field: "name" | "grade") => `ssc-hsc-subject-${rowId}-${field}`;
const firstFieldId = (rowId: number) => fieldId(rowId, "name");
/** Row fields saved in the calculation history (as JSON, in this order). */
const SAVED_FIELDS = ["name", "grade"] as const;

const gpaText = (value: number) => formatNumber(value, { decimals: 2, minDecimals: 2 });
const pointText = (value: number) => formatNumber(value, { minDecimals: 2 });

const STRINGS = {
  en: {
    submit: "Calculate GPA",
    examLegend: "Exam",
    examName: { ssc: "SSC", hsc: "HSC" },
    intro: (exam: Exam) =>
      exam === "hsc"
        ? "Enter your main HSC subjects: the compulsory and group subjects (usually 6). Put the 4th subject in its own box below."
        : "Enter your main SSC subjects: the compulsory and group subjects. Put the 4th subject in its own box below.",
    twoPaperHint:
      "Two-paper subjects, such as Bangla 1st and 2nd paper, count once: choose the combined grade from your marksheet. Leave unused rows empty.",
    subjectsLabel: "Main subjects",
    subjectN: (n: number) => `Subject ${n}`,
    removeSubject: (n: number) => `Remove subject ${n}`,
    nameOptional: "Name (optional)",
    namePlaceholder: (n: number) => `e.g. Subject ${n}`,
    grade: "Grade",
    select: "Select",
    addSubject: "Add subject",
    limit: `You can add up to ${MAX_SUBJECTS} main subjects.`,
    fourthLabel: "4th subject (optional) grade",
    noFourth: "No 4th subject",
    bonusOption: (bonus: string) => `+${bonus} bonus`,
    fourthHint:
      "Adds a bonus of its grade point minus 2 (A+ adds 3). It is not counted as a subject when dividing, and an F in it does not make you fail.",
    errChooseGrade: (n: number) => `Choose a grade for subject ${n}.`,
    errListedGrade: (n: number) => `Choose one of the listed grades for subject ${n}.`,
    errFourth: "Choose one of the listed grades for the 4th subject.",
    errNoSubjects: "Choose a grade for at least one main subject.",
    announcementPass: (exam: string, gpa: string) => `Your ${exam} GPA is ${gpa}.`,
    announcementFail: (exam: string) => `Result: fail. An F in a main subject gives an ${exam} GPA of 0.00.`,
    placeholderTitleFirst: "Your GPA will appear here",
    placeholderTitleFix: "Almost there",
    placeholderFirst: "Choose a grade for each main subject and, if you have one, the 4th subject. Then select Calculate GPA.",
    placeholderFix: "Fix the highlighted fields above and your GPA will show here.",
    resultTitle: (exam: string) => `Your ${exam} GPA`,
    pass: "Pass",
    fail: "Fail",
    allAPlus: "All main subjects A+",
    failNote: (subjects: string) =>
      `F in ${subjects}. An F in any main subject means the result is a fail, so the GPA is 0.00.`,
    cappedNote: (raw: string) => `Your points work out to ${raw}, but GPA is capped at 5.00, the maximum.`,
    result: "Result",
    failedSubjects: "Failed subjects",
    fourthBonus: "4th subject bonus",
    fourthBonusValue: (bonus: string, grade: string) => `+${bonus} (${grade})`,
    none: "None",
    withoutFourth: "GPA without 4th subject",
    addedByFourth: "Added by 4th subject",
    totalPoints: "Total points",
    totalPointsValue: (total: string, main: string, bonus: string) => `${total} (${main} + ${bonus} bonus)`,
    mainPoints: "Main subject points",
    subjectsCounted: "Main subjects (divisor)",
    roundingNote:
      "Rounded to 2 decimals (half up). The rules follow widely published board practice; check your board’s result notice for the official result.",
    subjectCount: (n: number) => pluralize(n, "main subject"),
    sharePass: (exam: string, gpa: string, subjects: string, points: string, bonusNote: string) =>
      `${exam} GPA ${gpa} from ${subjects} (${points} points${bonusNote}) on the Bangladesh board 5.00 scale. Calculated with HisabBD’s SSC & HSC GPA Calculator.`,
    shareBonus: (bonus: string) => `, including a 4th subject bonus of +${bonus}`,
    shareFail: (exam: string, failed: string) =>
      `${exam} result: fail (F in ${failed}), GPA 0.00 on the Bangladesh board 5.00 scale. Calculated with HisabBD’s SSC & HSC GPA Calculator.`,
    shareTitle: "SSC/HSC GPA calculated with HisabBD",
  },
  bn: {
    submit: "জিপিএ হিসাব করুন",
    examLegend: "পরীক্ষা",
    examName: { ssc: "এসএসসি", hsc: "এইচএসসি" },
    intro: (exam: Exam) =>
      exam === "hsc"
        ? "এইচএসসির মূল বিষয়গুলো লিখুন: আবশ্যিক ও বিভাগভিত্তিক বিষয় (সাধারণত 6টি)। চতুর্থ বিষয় নিচের আলাদা ঘরে দিন।"
        : "এসএসসির মূল বিষয়গুলো লিখুন: আবশ্যিক ও বিভাগভিত্তিক বিষয়। চতুর্থ বিষয় নিচের আলাদা ঘরে দিন।",
    twoPaperHint:
      "বাংলা ১ম ও ২য় পত্রের মতো দুই পত্রের বিষয় একবারই গোনা হয়: মার্কশিটের সম্মিলিত গ্রেডটি বেছে নিন। অব্যবহৃত সারি ফাঁকা রাখুন।",
    subjectsLabel: "মূল বিষয়সমূহ",
    subjectN: (n: number) => `বিষয় ${n}`,
    removeSubject: (n: number) => `বিষয় ${n} সরান`,
    nameOptional: "নাম (ঐচ্ছিক)",
    namePlaceholder: (n: number) => `যেমন বিষয় ${n}`,
    grade: "গ্রেড",
    select: "বেছে নিন",
    addSubject: "বিষয় যোগ করুন",
    limit: `সর্বোচ্চ ${MAX_SUBJECTS}টি মূল বিষয় যোগ করা যায়।`,
    fourthLabel: "চতুর্থ বিষয়ের (ঐচ্ছিক) গ্রেড",
    noFourth: "চতুর্থ বিষয় নেই",
    bonusOption: (bonus: string) => `+${bonus} বোনাস`,
    fourthHint:
      "এর গ্রেড পয়েন্ট থেকে 2 বাদ দিয়ে যা থাকে, তা বোনাস হিসেবে যোগ হয় (A+ হলে 3)। ভাগ করার সময় এটি বিষয় হিসেবে গোনা হয় না, আর এতে F পেলে ফেল হয় না।",
    errChooseGrade: (n: number) => `বিষয় ${n}-এর জন্য একটি গ্রেড বেছে নিন।`,
    errListedGrade: (n: number) => `বিষয় ${n}-এর জন্য তালিকার কোনো গ্রেড বেছে নিন।`,
    errFourth: "চতুর্থ বিষয়ের জন্য তালিকার কোনো গ্রেড বেছে নিন।",
    errNoSubjects: "অন্তত একটি মূল বিষয়ের গ্রেড বেছে নিন।",
    announcementPass: (exam: string, gpa: string) => `আপনার ${exam} জিপিএ ${gpa}।`,
    announcementFail: (exam: string) => `ফলাফল: ফেল। মূল বিষয়ে F থাকায় ${exam} জিপিএ 0.00।`,
    placeholderTitleFirst: "আপনার জিপিএ এখানে দেখা যাবে",
    placeholderTitleFix: "প্রায় হয়ে গেছে",
    placeholderFirst: "প্রতিটি মূল বিষয়ের গ্রেড আর থাকলে চতুর্থ বিষয়ের গ্রেড বেছে নিন, তারপর “জিপিএ হিসাব করুন” চাপুন।",
    placeholderFix: "ওপরে চিহ্নিত ঘরগুলো ঠিক করলেই জিপিএ এখানে দেখা যাবে।",
    resultTitle: (exam: string) => `আপনার ${exam} জিপিএ`,
    pass: "পাস",
    fail: "ফেল",
    allAPlus: "সব মূল বিষয়ে A+",
    failNote: (subjects: string) =>
      `${subjects}-এ F। কোনো মূল বিষয়ে F থাকলে ফলাফল ফেল, তাই জিপিএ 0.00।`,
    cappedNote: (raw: string) => `আপনার পয়েন্টে হিসাব দাঁড়ায় ${raw}, কিন্তু জিপিএ সর্বোচ্চ 5.00 পর্যন্তই ধরা হয়।`,
    result: "ফলাফল",
    failedSubjects: "ফেল করা বিষয়",
    fourthBonus: "চতুর্থ বিষয়ের বোনাস",
    fourthBonusValue: (bonus: string, grade: string) => `+${bonus} (${grade})`,
    none: "নেই",
    withoutFourth: "চতুর্থ বিষয় ছাড়া জিপিএ",
    addedByFourth: "চতুর্থ বিষয়ে বেড়েছে",
    totalPoints: "মোট পয়েন্ট",
    totalPointsValue: (total: string, main: string, bonus: string) => `${total} (${main} + ${bonus} বোনাস)`,
    mainPoints: "মূল বিষয়ের পয়েন্ট",
    subjectsCounted: "মূল বিষয় (ভাজক)",
    roundingNote:
      "2 দশমিকে রাউন্ড করা (হাফ-আপ)। নিয়মগুলো বহুল প্রচলিত বোর্ডের চর্চা অনুযায়ী; আনুষ্ঠানিক ফলাফলের জন্য নিজের বোর্ডের ফলাফল বিজ্ঞপ্তি দেখুন।",
    subjectCount: (n: number) => countBn(n, "মূল বিষয়"),
    sharePass: (exam: string, gpa: string, subjects: string, points: string, bonusNote: string) =>
      `${exam} জিপিএ ${gpa}, ${subjects} থেকে (${points} পয়েন্ট${bonusNote}), বাংলাদেশের বোর্ডের ৫.০০ স্কেলে। HisabBD-র এসএসসি ও এইচএসসি জিপিএ ক্যালকুলেটরে হিসাব করা।`,
    shareBonus: (bonus: string) => `, চতুর্থ বিষয়ের +${bonus} বোনাসসহ`,
    shareFail: (exam: string, failed: string) =>
      `${exam} ফলাফল: ফেল (${failed}-এ F), জিপিএ 0.00, বাংলাদেশের বোর্ডের ৫.০০ স্কেলে। HisabBD-র এসএসসি ও এইচএসসি জিপিএ ক্যালকুলেটরে হিসাব করা।`,
    shareTitle: "HisabBD দিয়ে এসএসসি/এইচএসসি জিপিএ হিসাব",
  },
} as const;

type Strings = (typeof STRINGS)[Locale];

function errorMessage(t: Strings, error: SscHscGpaError, subjectNumber: number): string {
  switch (error.field) {
    case "grade":
      return error.code === "missing" ? t.errChooseGrade(subjectNumber) : t.errListedGrade(subjectNumber);
    case "fourth":
      return t.errFourth;
    case "rows":
      return error.code === "too-many" ? t.limit : t.errNoSubjects;
  }
}

/** Name the user typed, or "Subject n" by position. */
function subjectLabel(t: Strings, rows: readonly SubjectRowInput[], rowId: number): string {
  const index = rows.findIndex((row) => row.id === rowId);
  return rows[index]?.name.trim() || t.subjectN(index + 1);
}

/**
 * GPA the 4th subject added, from the two displayed (2-decimal) values so the
 * three figures on screen always add up.
 */
function addedByFourth(r: SscHscGpaResult): number {
  return roundTo(roundTo(r.gpa, 2) - roundTo(r.gpaWithoutFourth, 2), 2);
}

function shareText(t: Strings, exam: Exam, r: SscHscGpaResult, rows: readonly SubjectRowInput[], locale: Locale) {
  const examName = t.examName[exam];
  if (r.status === "fail") {
    return t.shareFail(examName, joinList(r.failedRowIds.map((id) => subjectLabel(t, rows, id)), locale));
  }
  return t.sharePass(
    examName,
    gpaText(r.gpa),
    t.subjectCount(r.mainSubjectCount),
    formatNumber(r.totalPoints),
    r.fourthBonus > 0 ? t.shareBonus(formatNumber(r.fourthBonus)) : "",
  );
}

/** How the form should start after a (re)mount: rows carried over, whether to show the result, where focus goes. */
interface FormSetup {
  /** Rows carried over by position (row id = index + 1). */
  seed: readonly { name: string; grade: string }[];
  /** Start with exactly the seed's rows (a restored calculation) instead of at least the exam's usual count. */
  exactRows: boolean;
  fourth: string;
  /** Show the result straight away (a restored calculation). */
  calculated: boolean;
  focus: "exam" | "first" | null;
}

const INITIAL_SETUP: FormSetup = { seed: [], exactRows: false, fourth: "", calculated: false, focus: null };

/**
 * The exam choice sets how many rows the form starts with, and useRowList
 * takes its row count once. So switching exam, Reset or restoring a saved
 * calculation remounts the form with a new setup; on a switch the grades
 * already chosen are carried over. The exam is part of the key, so a
 * remembered exam applied after hydration also starts the form afresh.
 */
export function SscHscGpaCalculator() {
  const [exam, setExam] = usePreference(EXAM);
  const [{ setup, generation }, setState] = useState({ setup: INITIAL_SETUP, generation: 0 });

  function restart(next: FormSetup, nextExam: Exam = exam) {
    setState((s) => ({ setup: next, generation: s.generation + 1 }));
    if (nextExam !== exam) setExam(nextExam);
  }

  /** Fills the form from a saved calculation and shows its result. */
  function restore(saved: Readonly<Record<string, string>>) {
    const savedExam = saved.exam ?? "";
    const seed = rowsFromJson(saved.rows, SAVED_FIELDS);
    restart(
      { seed, exactRows: true, fourth: saved.fourth ?? "", calculated: true, focus: null },
      EXAM.isValid(savedExam) ? savedExam : exam,
    );
  }

  return (
    <div>
      <SscHscGpaForm key={`${exam}-${generation}`} exam={exam} setup={setup} onRestart={restart} />
      <RecentCalculations onRestore={restore} />
    </div>
  );
}

function SscHscGpaForm({
  exam,
  setup,
  onRestart,
}: {
  exam: Exam;
  setup: FormSetup;
  onRestart: (next: FormSetup, nextExam?: Exam) => void;
}) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const { seed } = setup;
  const examOptions = [
    { value: "ssc", label: t.examName.ssc },
    { value: "hsc", label: t.examName.hsc },
  ] as const;
  const list = useRowList<SubjectRowInput>({
    // Ids 1…n take the carried-over rows; later ids (added rows) start blank.
    createRow: (id) => ({ id, name: seed[id - 1]?.name ?? "", grade: seed[id - 1]?.grade ?? "" }),
    initialCount: Math.min(
      MAX_SUBJECTS,
      setup.exactRows && seed.length > 0 ? seed.length : Math.max(DEFAULT_ROWS[exam], seed.length),
    ),
    maxRows: MAX_SUBJECTS,
    focusTargetId: firstFieldId,
  });
  const { rows } = list;
  const [fourth, setFourth] = useState(setup.fourth);
  const [submitted, setSubmitted] = useState(setup.calculated);
  const [revealCount, setRevealCount] = useState(setup.calculated ? 1 : 0);
  const { record } = useCalculationHistory();

  // After a remount, keep keyboard and screen-reader users where they were.
  useEffect(() => {
    if (setup.focus === "exam") {
      document.querySelector<HTMLInputElement>(`input[name="${EXAM_CONTROL_NAME}"]:checked`)?.focus();
    } else if (setup.focus === "first") {
      document.getElementById(firstFieldId(1))?.focus();
    }
  }, [setup.focus]);

  const calc = submitted ? calculateSscHscGpa(rows, fourth, SCALE) : null;
  const errorList = calc && !calc.ok ? calc.errors : [];
  const errorFor = (rowId: number, field: SscHscGpaField, subjectNumber: number) => {
    const error = errorList.find((e) => e.rowId === rowId && e.field === field);
    return error ? errorMessage(t, error, subjectNumber) : undefined;
  };
  const fourthError = errorList.find((e) => e.field === "fourth");
  const listError = errorList.find((e) => e.field === "rows");
  const result = calc?.ok ? calc.result : null;

  function onExamChange(next: Exam) {
    let end = rows.length;
    while (end > 0 && isBlankSubjectRow(rows[end - 1]!)) end -= 1;
    const carried = rows.slice(0, end).map(({ name, grade }) => ({ name, grade }));
    onRestart({ ...INITIAL_SETUP, seed: carried, fourth, focus: "exam" }, next);
  }

  function onSubmit() {
    setSubmitted(true);
    const check = calculateSscHscGpa(rows, fourth, SCALE);
    if (check.ok) {
      setRevealCount((n) => n + 1);
      record(
        { exam, rows: rowsToJson(rows, SAVED_FIELDS), fourth },
        shareText(t, exam, check.result, rows, locale),
      );
      return;
    }
    const first = check.errors[0];
    if (!first) return;
    if (first.field === "fourth") {
      document.getElementById(FOURTH_ID)?.focus();
      return;
    }
    const targetRow = first.rowId ?? rows[0]?.id;
    if (targetRow !== undefined) document.getElementById(fieldId(targetRow, "grade"))?.focus();
  }

  /** Empty rows for the current exam; the remembered exam stays. */
  function onReset() {
    onRestart({ ...INITIAL_SETUP, focus: "first" });
  }

  const announcement = !result
    ? ""
    : result.status === "pass"
      ? t.announcementPass(t.examName[exam], gpaText(result.gpa))
      : t.announcementFail(t.examName[exam]);

  return (
    <div>
      <CalculatorForm onSubmit={onSubmit} onReset={onReset} submitLabel={t.submit}>
        <SegmentedControl
          name={EXAM_CONTROL_NAME}
          legend={t.examLegend}
          options={examOptions}
          value={exam}
          onChange={onExamChange}
        />
        <p className="mt-3 text-sm text-slate-600">{t.intro(exam)}</p>
        <p className="mt-1 mb-4 text-sm text-slate-600">{t.twoPaperHint}</p>

        <ul className="space-y-3" aria-label={t.subjectsLabel}>
          {rows.map((row, index) => {
            const n = index + 1;
            const gradeError = errorFor(row.id, "grade", n);
            return (
              <li key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-slate-800">{t.subjectN(n)}</p>
                  <RemoveRowButton
                    label={t.removeSubject(n)}
                    disabled={!list.canRemove}
                    onClick={() => list.removeRow(row.id)}
                  />
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_8.5rem] gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "name")}>
                      <span className="sr-only">{t.subjectN(n)} </span>{t.nameOptional}
                    </Label>
                    <Input
                      id={fieldId(row.id, "name")}
                      type="text"
                      autoComplete="off"
                      maxLength={60}
                      placeholder={t.namePlaceholder(n)}
                      value={row.name}
                      onChange={(event) => list.updateRow(row.id, { name: event.target.value })}
                    />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor={fieldId(row.id, "grade")}>
                      <span className="sr-only">{t.subjectN(n)} </span>{t.grade}
                    </Label>
                    <Select
                      id={fieldId(row.id, "grade")}
                      value={row.grade}
                      aria-invalid={gradeError ? true : undefined}
                      aria-describedby={gradeError ? `${fieldId(row.id, "grade")}-error` : undefined}
                      onChange={(event) => list.updateRow(row.id, { grade: event.target.value })}
                    >
                      <option value="">{t.select}</option>
                      {SCALE.grades.map((g) => (
                        <option key={g.letter} value={g.letter}>
                          {g.letter} ({pointText(g.point)})
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                {gradeError && (
                  <FieldMessage id={`${fieldId(row.id, "grade")}-error`} error>
                    {gradeError}
                  </FieldMessage>
                )}
              </li>
            );
          })}
        </ul>

        {listError && (
          <div className="mt-3">
            <FieldMessage id="ssc-hsc-rows-error" error>
              {errorMessage(t, listError, 0)}
            </FieldMessage>
          </div>
        )}

        <AddRowButton
          label={t.addSubject}
          limitMessage={t.limit}
          disabled={!list.canAdd}
          onClick={list.addRow}
        />

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
          <FormField
            id={FOURTH_ID}
            label={t.fourthLabel}
            hint={t.fourthHint}
            error={fourthError ? errorMessage(t, fourthError, 0) : undefined}
          >
            {(control) => (
              <Select {...control} value={fourth} onChange={(event) => setFourth(event.target.value)}>
                <option value="">{t.noFourth}</option>
                {SCALE.grades.map((g) => (
                  <option key={g.letter} value={g.letter}>
                    {g.letter} ({pointText(g.point)}) · {t.bonusOption(formatNumber(fourthSubjectBonus(g.point)))}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </div>
      </CalculatorForm>

      <CalculatorResultArea
        revealKey={revealCount}
        announcement={announcement}
        result={result && <SscHscGpaResultView result={result} exam={exam} rows={rows} />}
        placeholder={
          <ResultPlaceholder
            title={calc ? t.placeholderTitleFix : t.placeholderTitleFirst}
            preview={<p className="font-display text-4xl font-bold tracking-tight">–.––</p>}
          >
            {calc ? t.placeholderFix : t.placeholderFirst}
          </ResultPlaceholder>
        }
      />
    </div>
  );
}

function SscHscGpaResultView({
  result: r,
  exam,
  rows,
}: {
  result: SscHscGpaResult;
  exam: Exam;
  rows: readonly SubjectRowInput[];
}) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const passed = r.status === "pass";
  const failedList = joinList(
    r.failedRowIds.map((id) => subjectLabel(t, rows, id)),
    locale,
  );

  const stats = passed
    ? [
        { label: t.result, value: t.pass },
        { label: t.subjectsCounted, value: formatNumber(r.mainSubjectCount) },
        {
          label: t.fourthBonus,
          value: r.fourthGrade ? t.fourthBonusValue(pointText(r.fourthBonus), r.fourthGrade) : t.none,
        },
        ...(r.fourthGrade
          ? [
              { label: t.withoutFourth, value: gpaText(r.gpaWithoutFourth) },
              { label: t.addedByFourth, value: `+${gpaText(addedByFourth(r))}` },
            ]
          : []),
        {
          label: t.totalPoints,
          value:
            r.fourthBonus > 0
              ? t.totalPointsValue(
                  formatNumber(r.totalPoints),
                  formatNumber(r.totalMainPoints),
                  formatNumber(r.fourthBonus),
                )
              : formatNumber(r.totalPoints),
          wide: r.fourthBonus > 0,
        },
      ]
    : [
        { label: t.result, value: t.fail },
        { label: t.subjectsCounted, value: formatNumber(r.mainSubjectCount) },
        { label: t.failedSubjects, value: failedList, wide: true },
        { label: t.mainPoints, value: formatNumber(r.totalMainPoints) },
      ];
  const share = shareText(t, exam, r, rows, locale);

  return (
    <div className="space-y-4">
      <ResultPanel
        title={t.resultTitle(t.examName[exam])}
        titleId="ssc-hsc-gpa-result-heading"
        value={
          <>
            <p className="font-display text-5xl font-bold tracking-tight sm:text-6xl">{gpaText(r.gpa)}</p>
            <p className="mt-2 font-semibold text-slate-800">
              {passed ? t.pass : t.fail}
              {passed && r.allMainAPlus && <> · {t.allAPlus}</>}
            </p>
          </>
        }
      >
        {!passed && <p className="mb-4 text-sm font-medium text-red-700">{t.failNote(failedList)}</p>}
        {passed && r.capped && (
          <p className="mb-4 text-sm text-slate-700">
            {t.cappedNote(gpaText(r.totalPoints / r.mainSubjectCount))}
          </p>
        )}
        <ResultStats items={stats} />
        <p className="mt-4 text-sm text-slate-600">{t.roundingNote}</p>
      </ResultPanel>

      <ResultActions key={share} text={share} shareTitle={t.shareTitle} />
    </div>
  );
}

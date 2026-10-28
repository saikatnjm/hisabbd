import type { Locale } from "@/i18n/locales";

/**
 * One valid set of inputs per calculator, used by calculators.spec.ts.
 *
 * Labels are copied from each widget's STRINGS (src/calculators/<name>/
 * <name>-calculator.tsx), en and bn. Fields not listed keep the widget's
 * defaults (e.g. "as of" dates default to today, the first mode/unit is
 * selected). Row-based widgets (GPA, CGPA, SSC/HSC) prefix the label with a
 * visually hidden "Course 1 " / "Semester 1 " / "Subject 1 ", which is part
 * of the accessible name, so it is part of the label here too.
 *
 * Adding a calculator: add an entry keyed by its slug. The spec fails for any
 * registry slug without one.
 */
export interface FieldInput {
  label: Record<Locale, string>;
  value: string;
  /** "select" for a native <select> (value = option value); default "fill". */
  kind?: "fill" | "select";
}

export interface CalculatorInputs {
  /** The submit button's text, STRINGS[locale].submit. */
  submit: Record<Locale, string>;
  fields: FieldInput[];
}

export const CALCULATOR_INPUTS: Record<string, CalculatorInputs> = {
  "age-calculator": {
    submit: { en: "Calculate age", bn: "বয়স হিসাব করুন" },
    fields: [{ label: { en: "Date of birth", bn: "জন্ম তারিখ" }, value: "1995-06-15" }],
  },
  "bmi-calculator": {
    submit: { en: "Calculate BMI", bn: "বিএমআই হিসাব করুন" },
    fields: [
      { label: { en: "Height", bn: "উচ্চতা" }, value: "170" },
      { label: { en: "Weight", bn: "ওজন" }, value: "65" },
    ],
  },
  "gpa-calculator": {
    submit: { en: "Calculate GPA", bn: "জিপিএ হিসাব করুন" },
    fields: [
      { label: { en: "Course 1 Grade", bn: "কোর্স 1 গ্রেড" }, value: "A", kind: "select" },
      { label: { en: "Course 1 Credits", bn: "কোর্স 1 ক্রেডিট" }, value: "3" },
    ],
  },
  "cgpa-calculator": {
    submit: { en: "Calculate CGPA", bn: "সিজিপিএ হিসাব করুন" },
    fields: [
      { label: { en: "Semester 1 GPA", bn: "সেমিস্টার 1 জিপিএ" }, value: "3.5" },
      { label: { en: "Semester 1 Credits", bn: "সেমিস্টার 1 ক্রেডিট" }, value: "15" },
    ],
  },
  "percentage-calculator": {
    submit: { en: "Calculate", bn: "হিসাব করুন" },
    fields: [
      { label: { en: "Percentage (P)", bn: "শতকরা (P)" }, value: "15" },
      { label: { en: "Number (Y)", bn: "সংখ্যা (Y)" }, value: "2000" },
    ],
  },
  "discount-calculator": {
    submit: { en: "Calculate discount", bn: "ডিসকাউন্ট হিসাব করুন" },
    fields: [
      { label: { en: "Original price", bn: "আসল দাম" }, value: "2500" },
      { label: { en: "Discount", bn: "ডিসকাউন্ট" }, value: "20" },
    ],
  },
  "profit-loss-calculator": {
    submit: { en: "Calculate profit or loss", bn: "লাভ-ক্ষতি হিসাব করুন" },
    fields: [
      { label: { en: "Cost price", bn: "ক্রয়মূল্য" }, value: "100" },
      { label: { en: "Selling price", bn: "বিক্রয়মূল্য" }, value: "120" },
    ],
  },
  "emi-calculator": {
    submit: { en: "Calculate EMI", bn: "ইএমআই হিসাব করুন" },
    fields: [
      { label: { en: "Loan amount", bn: "লোনের পরিমাণ" }, value: "500000" },
      { label: { en: "Interest rate", bn: "সুদের হার" }, value: "9" },
      { label: { en: "Loan tenure", bn: "লোনের মেয়াদ" }, value: "5" },
    ],
  },
  "salary-calculator": {
    submit: { en: "Calculate net salary", bn: "নিট বেতন হিসাব করুন" },
    fields: [{ label: { en: "Gross salary", bn: "গ্রস বেতন" }, value: "50000" }],
  },
  "date-difference-calculator": {
    submit: { en: "Calculate difference", bn: "ব্যবধান হিসাব করুন" },
    fields: [{ label: { en: "Start date", bn: "শুরুর তারিখ" }, value: "2024-01-01" }],
  },
  "government-job-age-calculator": {
    submit: { en: "Check age limit", bn: "বয়সসীমা যাচাই করুন" },
    fields: [{ label: { en: "Date of birth", bn: "জন্ম তারিখ" }, value: "2000-01-01" }],
  },
  "ssc-hsc-gpa-calculator": {
    submit: { en: "Calculate GPA", bn: "জিপিএ হিসাব করুন" },
    fields: [{ label: { en: "Subject 1 Grade", bn: "বিষয় 1 গ্রেড" }, value: "A+", kind: "select" }],
  },
  "land-calculator": {
    submit: { en: "Calculate area", bn: "জমির হিসাব করুন" },
    fields: [{ label: { en: "Area", bn: "জমির পরিমাণ" }, value: "10" }],
  },
  "amount-in-words": {
    submit: { en: "Write in words", bn: "কথায় লিখুন" },
    fields: [{ label: { en: "Amount", bn: "টাকার পরিমাণ" }, value: "125300.50" }],
  },
};

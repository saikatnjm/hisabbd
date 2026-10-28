/*
 * Quick-add names for the deduction rows. Names only: no rates and no rules.
 *
 * Statutory rules (income tax slabs, provident fund rates and the like) are
 * intentionally NOT built into the Salary Calculator, because they change over
 * time and vary by employer and by person. The user enters the figures from
 * their own payslip or employer. Configurable presets with values could be
 * added later, if they come from a verified source.
 */
export const DEDUCTION_PRESETS = [
  { name: "Provident fund", nameBn: "প্রভিডেন্ট ফান্ড" },
  { name: "Income tax (TDS)", nameBn: "আয়কর (TDS)" },
  { name: "Loan instalment", nameBn: "লোনের কিস্তি" },
  { name: "Other", nameBn: "অন্যান্য" },
] as const;

/** English names only, kept for anything that needs a plain list. */
export const DEDUCTION_PRESET_NAMES = DEDUCTION_PRESETS.map((p) => p.name);

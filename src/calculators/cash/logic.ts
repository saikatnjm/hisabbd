import { checkNumber, type NumberErrorCode } from "@/lib/number";

/*
 * Cash counter rules and assumptions (documented):
 *
 * 1. Denominations: notes of ৳1000, ৳500, ৳200, ৳100, ৳50, ৳20, ৳10, ৳5 and ৳2,
 *    and coins of ৳5, ৳2 and ৳1 (see sources.ts). Old and new-design notes
 *    of the same value are counted together; the value is what matters.
 * 2. Each count is a whole number from 0 to MAX_COUNT (100,000). A blank
 *    count means 0.
 * 3. At least one count must be above 0.
 * 4. subtotal = value × count, total = sum of subtotals. All amounts are whole
 *    taka, so no rounding is needed.
 * 5. Errors are reported per denomination id, all together.
 * 6. Not modelled: detecting fake or damaged notes, paisa, and any other coin
 *    or note. This only adds up what the user typed.
 */

export const MAX_COUNT = 100_000;

/** The field that gets the error or focus when nothing is entered. */
export const FIRST_FIELD = "note-1000";

export type DenominationKind = "note" | "coin";

export interface Denomination {
  id: string;
  kind: DenominationKind;
  value: number;
}

/** Highest value first; notes before coins. */
export const DENOMINATIONS: readonly Denomination[] = [
  { id: "note-1000", kind: "note", value: 1000 },
  { id: "note-500", kind: "note", value: 500 },
  { id: "note-200", kind: "note", value: 200 },
  { id: "note-100", kind: "note", value: 100 },
  { id: "note-50", kind: "note", value: 50 },
  { id: "note-20", kind: "note", value: 20 },
  { id: "note-10", kind: "note", value: 10 },
  { id: "note-5", kind: "note", value: 5 },
  { id: "note-2", kind: "note", value: 2 },
  { id: "coin-5", kind: "coin", value: 5 },
  { id: "coin-2", kind: "coin", value: 2 },
  { id: "coin-1", kind: "coin", value: 1 },
];

/** Typed counts keyed by denomination id. Missing ids count as blank. */
export type CashCounts = Readonly<Record<string, string>>;

export interface CashError {
  /** A denomination id. */
  field: string;
  /** "none" means every count is blank or 0. */
  code: NumberErrorCode | "none";
}

export interface CashRow {
  id: string;
  kind: DenominationKind;
  value: number;
  count: number;
  subtotal: number;
}

export interface CashResult {
  /** Only denominations with a count above 0. */
  rows: CashRow[];
  total: number;
  noteCount: number;
  coinCount: number;
}

export type CashCalculation = { ok: true; result: CashResult } | { ok: false; errors: CashError[] };

/** Validates the typed counts and adds them up. */
export function calculateCash(counts: CashCounts): CashCalculation {
  const errors: CashError[] = [];
  const rows: CashRow[] = [];
  for (const d of DENOMINATIONS) {
    const raw = counts[d.id] ?? "";
    if (!raw.trim()) continue;
    const check = checkNumber(raw, { min: 0, max: MAX_COUNT, integer: true });
    if (!check.ok) {
      errors.push({ field: d.id, code: check.code });
      continue;
    }
    if (check.value > 0) rows.push({ ...d, count: check.value, subtotal: d.value * check.value });
  }
  if (errors.length > 0) return { ok: false, errors };
  if (rows.length === 0) return { ok: false, errors: [{ field: FIRST_FIELD, code: "none" }] };
  return {
    ok: true,
    result: {
      rows,
      total: rows.reduce((sum, r) => sum + r.subtotal, 0),
      noteCount: rows.filter((r) => r.kind === "note").reduce((sum, r) => sum + r.count, 0),
      coinCount: rows.filter((r) => r.kind === "coin").reduce((sum, r) => sum + r.count, 0),
    },
  };
}

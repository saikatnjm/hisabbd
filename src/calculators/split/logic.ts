import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * Group expense split rules (documented assumptions):
 *
 * 1. Everyone shares the total equally: share = total paid ÷ number of people.
 * 2. Balance = what a person paid − their share. Positive: others owe them;
 *    negative: they owe.
 * 3. Money is handled in whole paisa so the transfers add up exactly. When
 *    the total doesn't divide evenly, the leftover paisa go one each to the
 *    first people in the list, so shares differ by at most 1 paisa.
 * 4. Settling up: the person who owes the most pays the person owed the most,
 *    repeatedly, until everyone is even. This gives at most (people − 1)
 *    payments; it is a simple, fair method, not always the fewest possible.
 * 5. A row with every box blank is ignored. A named row with a blank amount
 *    paid counts as ৳0 paid (they still share the cost). At least 2 people.
 * 6. Limits: up to 30 people; ৳0 to ৳1 crore paid each.
 */

export const MAX_PEOPLE = 30;
export const MAX_PAID = 10_000_000;

export interface PersonRowInput {
  id: number;
  name: string;
  paid: string;
}

export type SplitErrorCode = NumberErrorCode | "too-few" | "too-many" | "nothing-paid";

export interface SplitError {
  rowId: number | null;
  field: "paid" | "rows";
  code: SplitErrorCode;
}

export interface PersonResult {
  rowId: number;
  name: string;
  paid: number;
  share: number;
  /** paid − share, in Taka (exact to the paisa). */
  balance: number;
}

export interface Transfer {
  /** Indexes into `people`. */
  from: number;
  to: number;
  amount: number;
}

export interface SplitResult {
  people: PersonResult[];
  total: number;
  /** Share before leftover paisa (total ÷ people). */
  perPerson: number;
  transfers: Transfer[];
}

export type SplitCalculation = { ok: true; result: SplitResult } | { ok: false; errors: SplitError[] };

const toPaisa = (taka: number) => Math.round(roundTo(taka, 2) * 100);
const toTaka = (paisa: number) => paisa / 100;

export function isBlankPerson(row: PersonRowInput): boolean {
  return !row.name.trim() && !row.paid.trim();
}

/** Who pays whom: largest debtor to largest creditor, in paisa. */
export function settle(balancesPaisa: readonly number[]): { from: number; to: number; paisa: number }[] {
  const owed = balancesPaisa.map((b, i) => ({ i, b }));
  const transfers: { from: number; to: number; paisa: number }[] = [];
  for (;;) {
    const debtor = owed.filter((p) => p.b < 0).sort((a, b) => a.b - b.b || a.i - b.i)[0];
    const creditor = owed.filter((p) => p.b > 0).sort((a, b) => b.b - a.b || a.i - b.i)[0];
    if (!debtor || !creditor) return transfers;
    const amount = Math.min(-debtor.b, creditor.b);
    transfers.push({ from: debtor.i, to: creditor.i, paisa: amount });
    debtor.b += amount;
    creditor.b -= amount;
  }
}

export function calculateSplit(rows: readonly PersonRowInput[]): SplitCalculation {
  const errors: SplitError[] = [];
  const filled = rows.filter((row) => !isBlankPerson(row));
  if (rows.length > MAX_PEOPLE) errors.push({ rowId: null, field: "rows", code: "too-many" });
  else if (filled.length < 2) errors.push({ rowId: null, field: "rows", code: "too-few" });

  const paid: number[] = [];
  for (const row of filled) {
    const value = row.paid.trim() ? checkNumber(row.paid, { min: 0, max: MAX_PAID }) : ({ ok: true, value: 0 } as const);
    if (!value.ok) errors.push({ rowId: row.id, field: "paid", code: value.code });
    else paid.push(value.value);
  }
  if (errors.length > 0) return { ok: false, errors };

  const paidPaisa = paid.map(toPaisa);
  const totalPaisa = paidPaisa.reduce((sum, p) => sum + p, 0);
  if (totalPaisa === 0) return { ok: false, errors: [{ rowId: null, field: "rows", code: "nothing-paid" }] };

  const n = filled.length;
  const base = Math.floor(totalPaisa / n);
  const extra = totalPaisa - base * n;
  const sharePaisa = filled.map((_, i) => base + (i < extra ? 1 : 0));
  const balancesPaisa = paidPaisa.map((p, i) => p - sharePaisa[i]!);

  return {
    ok: true,
    result: {
      people: filled.map((row, i) => ({
        rowId: row.id,
        name: row.name.trim(),
        paid: toTaka(paidPaisa[i]!),
        share: toTaka(sharePaisa[i]!),
        balance: toTaka(balancesPaisa[i]!),
      })),
      total: toTaka(totalPaisa),
      perPerson: roundTo(totalPaisa / n / 100, 10),
      transfers: settle(balancesPaisa).map((t) => ({ from: t.from, to: t.to, amount: toTaka(t.paisa) })),
    },
  };
}

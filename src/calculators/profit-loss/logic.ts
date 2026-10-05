import { checkNumber, roundTo } from "@/lib/number";

/*
 * Profit/loss calculator rules and assumptions (documented):
 *
 * 1. Profit (or loss) = selling price − cost price.
 * 2. Money is treated to the nearest paisa. Both prices are rounded to 2
 *    decimals (half away from zero) before anything else, so a tiny floating-
 *    point difference such as 0.1 + 0.2 versus 0.3 can never decide the status.
 * 3. Status: "profit" if selling > cost, "loss" if selling < cost, "break-even"
 *    only when the two paisa-rounded prices are exactly equal.
 * 4. Profit/loss % on cost (also called markup) = (selling − cost) ÷ cost × 100.
 *    This is the standard figure. It is negative for a loss, and −100% when
 *    the selling price is 0.
 * 5. Profit margin % on selling price = (selling − cost) ÷ selling × 100. It is
 *    only defined when the selling price is above 0, otherwise it is null.
 *    Margin and markup are different numbers for the same deal: cost 80 and
 *    selling 100 is a 25% markup but a 20% margin.
 * 6. Limits: cost from ৳0.01 (one paisa) to 1,000,000,000,000 (10^12); selling
 *    price from 0 to the same maximum. A selling price of 0 is allowed (given away).
 */

export const MIN_COST = 0.01;
export const MAX_PRICE = 1_000_000_000_000;

export type ProfitLossStatus = "profit" | "loss" | "break-even";
export type ProfitLossField = "cost" | "selling";
export type ProfitLossErrorCode = "missing" | "invalid" | "too-small" | "too-large" | "not-integer";

export interface ProfitLossError {
  field: ProfitLossField;
  code: ProfitLossErrorCode;
}

export interface ProfitLossResult {
  /** Cost price rounded to paisa. */
  costPrice: number;
  /** Selling price rounded to paisa. */
  sellingPrice: number;
  status: ProfitLossStatus;
  /** Size of the profit or loss (never negative; 0 for break-even), in paisa precision. */
  amount: number;
  /** Profit/loss on cost, as a positive number (0 for break-even). Also called markup. */
  percentOnCost: number;
  /** Profit/loss on selling price, as a positive number; null when the selling price is 0. */
  marginPercent: number | null;
}

export type ProfitLossCalculation = { ok: true; result: ProfitLossResult } | { ok: false; errors: ProfitLossError[] };

/** Status from two prices already rounded to paisa. */
export function getStatus(cost: number, selling: number): ProfitLossStatus {
  if (selling > cost) return "profit";
  if (selling < cost) return "loss";
  return "break-even";
}

/** Signed (selling − cost) ÷ cost × 100. Cost must be above 0. */
export function percentOnCost(cost: number, selling: number): number {
  if (!(cost > 0)) throw new RangeError("cost must be greater than 0");
  return ((selling - cost) / cost) * 100;
}

/** Signed (selling − cost) ÷ selling × 100. Selling must be above 0. */
export function marginOnSelling(cost: number, selling: number): number {
  if (!(selling > 0)) throw new RangeError("selling must be greater than 0");
  return ((selling - cost) / selling) * 100;
}

/** Validates raw input and calculates profit or loss. */
export function calculateProfitLoss(rawCost: string, rawSelling: string): ProfitLossCalculation {
  const errors: ProfitLossError[] = [];
  const cost = checkNumber(rawCost, { min: MIN_COST, max: MAX_PRICE });
  if (!cost.ok) errors.push({ field: "cost", code: cost.code });
  const selling = checkNumber(rawSelling, { min: 0, max: MAX_PRICE });
  if (!selling.ok) errors.push({ field: "selling", code: selling.code });
  if (!cost.ok || !selling.ok) return { ok: false, errors };

  const costPrice = roundTo(cost.value, 2);
  const sellingPrice = roundTo(selling.value, 2);
  const status = getStatus(costPrice, sellingPrice);
  const difference = roundTo(sellingPrice - costPrice, 2);

  if (status === "break-even") {
    return {
      ok: true,
      result: {
        costPrice,
        sellingPrice,
        status,
        amount: 0,
        percentOnCost: 0,
        marginPercent: sellingPrice > 0 ? 0 : null,
      },
    };
  }

  return {
    ok: true,
    result: {
      costPrice,
      sellingPrice,
      status,
      amount: Math.abs(difference),
      percentOnCost: Math.abs(percentOnCost(costPrice, sellingPrice)),
      marginPercent: sellingPrice > 0 ? Math.abs(marginOnSelling(costPrice, sellingPrice)) : null,
    },
  };
}

import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";

/*
 * MFS (bKash / Nagad / Rocket / Upay) cash-out charge rules and assumptions:
 *
 * 1. Cash-out charges are a rate per ৳1,000, applied proportionally to any
 *    amount: charge = cash × rate ÷ 1,000. ৳13.95 per ৳1,000 is 1.395%.
 *    The charge is taken from the balance on top of the cash, so
 *    amount deducted = cash + charge.
 * 2. Two directions ("modes"):
 *      cash-out  "I want X in cash"  → charge, and the balance needed (X + charge)
 *      balance   "I have Y in balance" → the most cash Y covers,
 *                cash ≈ Y ÷ (1 + rate ÷ 1,000), and its charge.
 * 3. Rounding: no provider publishes how it rounds the charge. We round the
 *    entered amount and the charge to the nearest paisa (half away from zero).
 *    In balance mode the cash is the largest paisa amount whose cash + rounded
 *    charge still fits in the balance, so a few paisa may be left over. The
 *    page says charges in the provider's app may differ by a few paisa.
 * 4. Limits: amount from ৳0.01 to ৳1 crore; rate from 0 to 100 per ৳1,000
 *    (0% to 10%), decimals allowed. Providers' own per-transaction, daily and
 *    monthly limits (e.g. ৳30,000 per cash-out) are NOT enforced here.
 * 5. The rate is always an input. Presets below are data with a source and a
 *    "checked on" date; the widget pre-fills from them and the user can type
 *    any other rate. A preset with `ratePerThousand: null` means we could not
 *    confirm a current official figure: the user must enter the rate.
 * 6. Deliberately NOT modelled: monthly discount limits (e.g. bKash Priyo
 *    Agent's ৳50,000 a month, after which the whole transaction is charged the
 *    regular rate), remittance / salary / Islamic account variants other than
 *    those listed, campaign discounts, minimum charges and send-money fees.
 */

export const MFS_PROVIDERS = ["bkash", "nagad", "rocket", "upay"] as const;
export type MfsProvider = (typeof MFS_PROVIDERS)[number];

export interface MfsChargeSource {
  title: string;
  url: string;
}

export interface MfsChargePreset {
  provider: MfsProvider;
  /** Plain English description of the channel (the widget shows its own translated names). */
  channel: string;
  /** Charge in Taka per ৳1,000 cashed out, VAT included unless `notes` says otherwise; null = not confirmed. */
  ratePerThousand: number | null;
  notes: string;
  source: MfsChargeSource;
  /** Date the source was last checked (YYYY-MM-DD). */
  checkedOn: string;
}

/** Date every preset below was last checked against its source. Review monthly; providers change charges often. */
export const MFS_RATES_CHECKED_ON = "2026-10-28";

const BKASH_AGENT_CASH_OUT: MfsChargeSource = {
  title: "bKash: Cash Out from Agent",
  url: "https://www.bkash.com/en/products-services/cashout/cashout-from-agent",
};

const BKASH_ATM_CASH_OUT: MfsChargeSource = {
  title: "bKash: Cash Out from ATM",
  url: "https://www.bkash.com/en/products-services/cash-out-from-atm",
};

const NAGAD_CASH_OUT: MfsChargeSource = {
  title: "Nagad: Cash Out",
  url: "https://nagad.com.bd/services/?service=cash-out",
};

const ROCKET_CHARGES: MfsChargeSource = {
  title: "Dutch-Bangla Bank: Rocket charges & fees",
  url: "https://www.dutchbanglabank.com/rocket/charges-and-fees.html",
};

const UPAY_CHARGES: MfsChargeSource = {
  title: "upay: Limits and Charges",
  url: "https://www.upaybd.com/limits-and-charges",
};

/**
 * Dated news report that confirms the bKash Priyo Agent and regular agent
 * rates and that they include VAT (bkash.com could not be fetched directly).
 */
export const BKASH_NEWS_SOURCE: MfsChargeSource = {
  title: "The Business Standard, 12 July 2026: bKash lowers cash-out charge for monthly withdrawals",
  url: "https://www.tbsnews.net/economy/corporates/bkash-lowers-cash-out-charge-monthly-withdrawals-1486291",
};

/**
 * Cash-out presets. Each was checked on MFS_RATES_CHECKED_ON against the
 * provider's own page (bKash also against a dated news report).
 */
export const MFS_CHARGE_PRESETS = {
  "bkash-priyo": {
    provider: "bkash",
    channel: "Priyo Agent (app or *247#)",
    ratePerThousand: 13.95,
    notes:
      "Up to ৳50,000 per calendar month from your 2 Priyo Agent numbers. A transaction that goes over the limit is charged ৳18.50 per ৳1,000. VAT and all other costs included (TBS, 12 July 2026).",
    source: BKASH_AGENT_CASH_OUT,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "bkash-agent": {
    provider: "bkash",
    channel: "Any other agent (app or *247#)",
    ratePerThousand: 18.5,
    notes: "Any agent other than your Priyo Agents, from the bKash app or *247#. VAT included (TBS, 12 July 2026).",
    source: BKASH_AGENT_CASH_OUT,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "bkash-atm": {
    provider: "bkash",
    channel: "ATM (partner bank booths)",
    ratePerThousand: null,
    notes: "Not confirmed: we could not verify that the rate on bKash's ATM page is current. Enter the rate the app shows.",
    source: BKASH_ATM_CASH_OUT,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "nagad-app": {
    provider: "nagad",
    channel: "Nagad app (regular account)",
    ratePerThousand: null,
    notes:
      "Not confirmed: Nagad's own English and Bangla pages showed different app rates on 28 October 2026. Enter the rate the app shows.",
    source: NAGAD_CASH_OUT,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "nagad-ussd": {
    provider: "nagad",
    channel: "USSD *167# (regular and Islamic)",
    ratePerThousand: 15,
    notes: "৳13.05 plus VAT = ৳15.00 per ৳1,000. Nagad says the charges on its website prevail.",
    source: NAGAD_CASH_OUT,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "nagad-islamic-app": {
    provider: "nagad",
    channel: "Nagad Islamic app",
    ratePerThousand: 15,
    notes: "৳13.05 plus VAT = ৳15.00 per ৳1,000.",
    source: NAGAD_CASH_OUT,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "rocket-agent": {
    provider: "rocket",
    channel: "Agent (general account)",
    ratePerThousand: 16.7,
    notes: "1.67% of the amount. All fees include VAT and tax. Salary and stipend accounts pay 0.9%.",
    source: ROCKET_CHARGES,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "rocket-atm": {
    provider: "rocket",
    channel: "DBBL ATM (general account)",
    ratePerThousand: 9,
    notes: "0.9% of the amount. All fees include VAT and tax. Free for salary accounts.",
    source: ROCKET_CHARGES,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "rocket-branch": {
    provider: "rocket",
    channel: "DBBL branch (general account)",
    ratePerThousand: 9,
    notes: "0.9% of the amount. All fees include VAT and tax.",
    source: ROCKET_CHARGES,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "upay-agent": {
    provider: "upay",
    channel: "Agent (primary account)",
    ratePerThousand: 14,
    notes: "1.40% of the amount. upay's page does not say whether VAT is extra. Remittance money: 1%.",
    source: UPAY_CHARGES,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
  "upay-atm": {
    provider: "upay",
    channel: "UCB ATM (primary account)",
    ratePerThousand: 8,
    notes: "0.8% of the amount (minimum ৳500 per ATM withdrawal). upay's page does not say whether VAT is extra.",
    source: UPAY_CHARGES,
    checkedOn: MFS_RATES_CHECKED_ON,
  },
} as const satisfies Record<string, MfsChargePreset>;

export type MfsPresetKey = keyof typeof MFS_CHARGE_PRESETS;
/** A preset, or "custom" for a provider/channel not listed. */
export type MfsPresetId = MfsPresetKey | "custom";

export const MFS_PRESET_KEYS = Object.keys(MFS_CHARGE_PRESETS) as MfsPresetKey[];

/** Preset keys for one provider, in display order. */
export function presetsForProvider(provider: MfsProvider): MfsPresetKey[] {
  return MFS_PRESET_KEYS.filter((key) => MFS_CHARGE_PRESETS[key].provider === provider);
}

/** Every source used by the presets, without duplicates (for "Sources" lists). */
export const MFS_CHARGE_SOURCES: readonly MfsChargeSource[] = [
  BKASH_AGENT_CASH_OUT,
  BKASH_NEWS_SOURCE,
  NAGAD_CASH_OUT,
  ROCKET_CHARGES,
  UPAY_CHARGES,
];

export type MfsMode = "cash-out" | "balance";

/** Smallest accepted amount: one paisa. */
export const MIN_AMOUNT = 0.01;
/** ৳1 crore. Real MFS balances and limits are far lower. */
export const MAX_AMOUNT = 10_000_000;
export const MIN_RATE = 0;
/** ৳100 per ৳1,000 (10%), far above any real cash-out charge. */
export const MAX_RATE = 100;

export type MfsChargeField = "amount" | "rate";

export interface MfsChargeError {
  field: MfsChargeField;
  code: NumberErrorCode;
}

export interface MfsWholeTaka {
  /** Largest whole-Taka cash the balance covers. */
  cash: number;
  charge: number;
  total: number;
}

export interface MfsChargeResult {
  mode: MfsMode;
  /** Charge in Taka per ৳1,000, as entered. */
  ratePerThousand: number;
  /** Cash in hand, to the paisa. */
  cash: number;
  /** Charge on `cash`, rounded to paisa. */
  charge: number;
  /** Amount deducted from the balance: cash + charge. */
  total: number;
  /** Effective charge in percent (rate ÷ 10). */
  effectivePercent: number;
  /** Balance mode only: the entered balance. */
  balance: number | null;
  /** Balance mode only: what stays in the account (balance − total, a few paisa at most). */
  leftover: number | null;
  /** Balance mode only: the same answer for whole Taka notes. */
  wholeTaka: MfsWholeTaka | null;
}

export type MfsChargeCalculation = { ok: true; result: MfsChargeResult } | { ok: false; errors: MfsChargeError[] };

/** Charge on a cash amount (unrounded): cash × rate ÷ 1,000. */
export function chargeOn(cash: number, ratePerThousand: number): number {
  return (cash * ratePerThousand) / 1000;
}

/** Charge on a cash amount, rounded to the nearest paisa. */
export function roundedCharge(cash: number, ratePerThousand: number): number {
  return roundTo(chargeOn(cash, ratePerThousand), 2);
}

/** Integer paisa, avoiding float drift (amounts are already rounded to paisa). */
function toPaisa(taka: number): number {
  return Math.round(taka * 100);
}

/**
 * The largest cash amount (to the paisa) whose cash + rounded charge fits in
 * the balance. Starts from balance ÷ (1 + rate ÷ 1,000) and adjusts by a
 * paisa at a time for rounding.
 */
export function maxCashForBalance(balance: number, ratePerThousand: number): number {
  const balancePaisa = toPaisa(balance);
  const fits = (cashPaisa: number) =>
    cashPaisa + toPaisa(roundedCharge(cashPaisa / 100, ratePerThousand)) <= balancePaisa;
  let cashPaisa = Math.floor(balancePaisa / (1 + ratePerThousand / 1000));
  while (cashPaisa > 0 && !fits(cashPaisa)) cashPaisa -= 1;
  while (fits(cashPaisa + 1)) cashPaisa += 1;
  return cashPaisa / 100;
}

/** Validates raw input and works out the cash-out charge in either direction. */
export function calculateMfsCharge(mode: MfsMode, rawAmount: string, rawRate: string): MfsChargeCalculation {
  const errors: MfsChargeError[] = [];
  const amount = checkNumber(rawAmount, { min: MIN_AMOUNT, max: MAX_AMOUNT });
  if (!amount.ok) errors.push({ field: "amount", code: amount.code });
  const rate = checkNumber(rawRate, { min: MIN_RATE, max: MAX_RATE });
  if (!rate.ok) errors.push({ field: "rate", code: rate.code });
  if (!amount.ok || !rate.ok) return { ok: false, errors };

  const entered = roundTo(amount.value, 2);
  const r = rate.value;
  const effectivePercent = r / 10;

  if (mode === "cash-out") {
    const charge = roundedCharge(entered, r);
    return {
      ok: true,
      result: {
        mode,
        ratePerThousand: r,
        cash: entered,
        charge,
        total: roundTo(entered + charge, 2),
        effectivePercent,
        balance: null,
        leftover: null,
        wholeTaka: null,
      },
    };
  }

  const cash = maxCashForBalance(entered, r);
  const charge = roundedCharge(cash, r);
  const total = roundTo(cash + charge, 2);
  // The charge never decreases as the cash grows, so the whole-Taka part of
  // the paisa answer is the largest whole-Taka amount that fits.
  const wholeCash = Math.floor(cash);
  const wholeCharge = roundedCharge(wholeCash, r);
  return {
    ok: true,
    result: {
      mode,
      ratePerThousand: r,
      cash,
      charge,
      total,
      effectivePercent,
      balance: entered,
      leftover: roundTo(entered - total, 2),
      wholeTaka: { cash: wholeCash, charge: wholeCharge, total: roundTo(wholeCash + wholeCharge, 2) },
    },
  };
}

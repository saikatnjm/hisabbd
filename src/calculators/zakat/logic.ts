import { checkNumber, roundTo, type NumberErrorCode } from "@/lib/number";
import { bhoriToGrams, gramsToBhori, MAX_WEIGHT_GRAMS } from "@/calculators/gold/units";

/*
 * Zakat calculator rules and assumptions (documented, checked 29 October 2026).
 * This is a general calculation of the widely documented basics, not a fatwa.
 *
 * 1. Rate: zakat is 2.5% (one-fortieth) of net zakatable wealth that has been
 *    held for a full lunar (Hijri) year, if it is at least the nisab. The
 *    classical basis is the hadith in Sunan Abi Dawud 1573 (5 dirhams on 200
 *    dirhams of silver, half a dinar on 20 dinars of gold, once a year has
 *    passed). The calculator does not track dates: the user confirms the year
 *    has passed.
 * 2. Nisab: 7.5 bhori (tola) of gold or 52.5 bhori of silver. With 1 bhori =
 *    11.664 g (../gold/units.ts) that is 87.48 g of gold or 612.36 g of
 *    silver. Bangladeshi source for 7.5 / 52.5 tola and the one-fortieth
 *    rate: Teachers' Portal (teachers.gov.bd), "পবিত্র যাকাত উনার নিছাব কাকে
 *    বলে?", 3 February 2021, https://www.teachers.gov.bd/content/details/866596.
 *    Other countries' sources often round to 85 g / 595 g; we don't.
 * 3. Which nisab: scholars differ. Many zakat organisations in Bangladesh
 *    encourage the silver standard because the lower threshold brings more
 *    people into paying zakat; others favour gold so that people with small
 *    savings are not made payers (The Financial Express, "Setting the right
 *    nisab of Zakat", 23 March 2024,
 *    https://thefinancialexpress.com.bd/views/columns/setting-the-right-nisab-of-zakat).
 *    There is no national nisab guideline (The Financial Express, "Setting
 *    national zakat guidelines", 1 April 2023,
 *    https://thefinancialexpress.com.bd/views/columns/setting-national-zakat-guidelines).
 *    Islamic Foundation Bangladesh announces the yearly fitra rates (e.g. for
 *    1447 AH on 25 February 2026, Prothom Alo,
 *    https://www.prothomalo.com/bangladesh/oc3m03q53j) but we found NO Islamic
 *    Foundation announcement of a zakat nisab amount in Taka for 1447 or
 *    1448 (searched 29 Oct 2026). So the basis is a user choice, nothing is
 *    preset, and the page says to ask a trusted scholar.
 * 4. Nisab amount = nisab weight in bhori × the price per bhori the user
 *    enters for that metal. If the chosen metal's price is blank, that price
 *    field gets the "needed-for-nisab" error. No gold or silver price is
 *    preset: prices change often; the page links to BAJUS.
 * 5. Zakatable assets (each optional, blank = 0, ≥ 0): cash in hand; bank
 *    balances and savings (including DPS, FDR and Sanchayapatra principal);
 *    gold (weight × price per bhori); silver (weight × price per bhori);
 *    business stock at sale value; money owed to you that you expect to get
 *    back; other zakatable assets. At least one must be more than 0
 *    ("no-assets", reported on the cash field). A gold or silver weight needs
 *    that metal's price ("missing" on the price field).
 * 6. Minus: debts and bills due now (optional, ≥ 0).
 *      net = total assets − debts   (may be negative; then zakat is not due)
 *      due = net ≥ nisab   (compared to the paisa, so floating-point noise
 *                           such as 87.48 g ÷ 11.664 = 7.500000000000001
 *                           bhori never flips the answer)
 *      zakat = due ? net × 2.5 ÷ 100 : 0
 *    Otherwise full precision; the UI rounds for display.
 * 7. Weights are entered in bhori (decimals allowed: 2 bhori 8 ana = 2.5) or
 *    grams, at most MAX_WEIGHT_GRAMS. Money at most ৳10^12; price per bhori
 *    at most ৳10 crore.
 * 8. Deliberately NOT decided here (the page says to ask a scholar): whether
 *    jewellery for personal use is zakatable (scholars differ), pension and
 *    provident funds, long-term loans, shares and crypto, property and
 *    rental income, agricultural produce (ushr), which day's price to use,
 *    and whether to use the buying or selling price of gold and silver.
 */

export type NisabBasis = "silver" | "gold";
export type ZakatWeightUnit = "bhori" | "gram";

export const ZAKAT_RATE_PERCENT = 2.5;
export const NISAB_GOLD_BHORI = 7.5;
export const NISAB_SILVER_BHORI = 52.5;
export const NISAB_BHORI: Readonly<Record<NisabBasis, number>> = { gold: NISAB_GOLD_BHORI, silver: NISAB_SILVER_BHORI };
/** 87.48 g and 612.36 g. */
export const NISAB_GRAMS: Readonly<Record<NisabBasis, number>> = {
  gold: bhoriToGrams(NISAB_GOLD_BHORI),
  silver: bhoriToGrams(NISAB_SILVER_BHORI),
};

export const MAX_AMOUNT = 1_000_000_000_000;
export const MAX_PRICE_PER_BHORI = 100_000_000;
export const ZAKAT_RULES_CHECKED_ON = "2026-10-29";

export const ZAKAT_SOURCES = {
  hadith: { title: "Sunan Abi Dawud 1573 (sunnah.com)", url: "https://sunnah.com/abudawud:1573" },
  nisabBasics: {
    title: "Teachers' Portal (teachers.gov.bd), 3 February 2021: What is the nisab of zakat?",
    url: "https://www.teachers.gov.bd/content/details/866596",
  },
  nisabDebate: {
    title: "The Financial Express, 23 March 2024: Setting the right nisab of Zakat",
    url: "https://thefinancialexpress.com.bd/views/columns/setting-the-right-nisab-of-zakat",
  },
  noNationalGuideline: {
    title: "The Financial Express, 1 April 2023: Setting national zakat guidelines",
    url: "https://thefinancialexpress.com.bd/views/columns/setting-national-zakat-guidelines",
  },
  fitra1447: {
    title: "Prothom Alo, 25 February 2026: Islamic Foundation sets the 1447 fitra rates",
    url: "https://www.prothomalo.com/bangladesh/oc3m03q53j",
  },
  bajus: { title: "Bangladesh Jewellers Association (BAJUS)", url: "https://www.bajus.org" },
} as const;

/** Money fields, in form order. */
export const ZAKAT_MONEY_FIELDS = ["cash", "bank", "business", "receivables", "other"] as const;
export type ZakatMoneyField = (typeof ZAKAT_MONEY_FIELDS)[number];

export type ZakatField =
  | ZakatMoneyField
  | "goldWeight"
  | "goldPrice"
  | "silverWeight"
  | "silverPrice"
  | "debts";

export type ZakatErrorCode = NumberErrorCode | "no-assets" | "needed-for-nisab";

export interface ZakatError {
  field: ZakatField;
  code: ZakatErrorCode;
}

/** Raw form values, as typed. Missing keys count as blank. */
export interface ZakatInput {
  basis: NisabBasis;
  weightUnit: ZakatWeightUnit;
  cash?: string;
  bank?: string;
  goldWeight?: string;
  goldPrice?: string;
  silverWeight?: string;
  silverPrice?: string;
  business?: string;
  receivables?: string;
  other?: string;
  debts?: string;
}

export interface ZakatResult {
  basis: NisabBasis;
  cash: number;
  bank: number;
  /** Gold weight in bhori (0 when blank). */
  goldBhori: number;
  goldValue: number;
  silverBhori: number;
  silverValue: number;
  business: number;
  receivables: number;
  other: number;
  /** Sum of every asset above. */
  totalAssets: number;
  debts: number;
  /** totalAssets − debts; may be negative. */
  net: number;
  /** Price per bhori of the nisab metal. */
  nisabPricePerBhori: number;
  /** Nisab weight in bhori (7.5 or 52.5) and grams (87.48 or 612.36). */
  nisabBhori: number;
  nisabGrams: number;
  /** nisabBhori × nisabPricePerBhori. */
  nisab: number;
  due: boolean;
  /** 2.5% of net when due, else 0. */
  zakat: number;
}

export type ZakatCalculation = { ok: true; result: ZakatResult } | { ok: false; errors: ZakatError[] };

/** Nisab in Taka: nisab weight (bhori) × price per bhori. */
export function nisabAmount(basis: NisabBasis, pricePerBhori: number): number {
  return NISAB_BHORI[basis] * pricePerBhori;
}

/** 2.5% of net wealth (unrounded). */
export function zakatOn(net: number): number {
  return (net * ZAKAT_RATE_PERCENT) / 100;
}

type Check = { ok: true; value: number } | { ok: false; code: NumberErrorCode };

/** Blank = 0; otherwise a number from 0 to max. */
function optional(raw: string | undefined, max: number): Check {
  if (!(raw ?? "").trim()) return { ok: true, value: 0 };
  return checkNumber(raw ?? "", { min: 0, max });
}

/** Validates everything (reporting all errors together) and works out the zakat. */
export function calculateZakat(input: ZakatInput): ZakatCalculation {
  const errors: ZakatError[] = [];
  const read = (field: ZakatField, max: number): number => {
    const check = optional(input[field], max);
    if (check.ok) return check.value;
    errors.push({ field, code: check.code });
    return 0;
  };

  const cash = read("cash", MAX_AMOUNT);
  const bank = read("bank", MAX_AMOUNT);
  const goldWeightRaw = read("goldWeight", input.weightUnit === "gram" ? MAX_WEIGHT_GRAMS : gramsToBhori(MAX_WEIGHT_GRAMS));
  const goldPrice = read("goldPrice", MAX_PRICE_PER_BHORI);
  const silverWeightRaw = read(
    "silverWeight",
    input.weightUnit === "gram" ? MAX_WEIGHT_GRAMS : gramsToBhori(MAX_WEIGHT_GRAMS),
  );
  const silverPrice = read("silverPrice", MAX_PRICE_PER_BHORI);
  const business = read("business", MAX_AMOUNT);
  const receivables = read("receivables", MAX_AMOUNT);
  const other = read("other", MAX_AMOUNT);
  const debts = read("debts", MAX_AMOUNT);

  const toBhori = (w: number) => (input.weightUnit === "gram" ? gramsToBhori(w) : w);
  const goldBhori = toBhori(goldWeightRaw);
  const silverBhori = toBhori(silverWeightRaw);

  const hasError = (field: ZakatField) => errors.some((e) => e.field === field);
  // A weight needs its metal's price (rule 5).
  if (goldBhori > 0 && goldPrice === 0 && !hasError("goldPrice")) errors.push({ field: "goldPrice", code: "missing" });
  if (silverBhori > 0 && silverPrice === 0 && !hasError("silverPrice"))
    errors.push({ field: "silverPrice", code: "missing" });
  // The chosen nisab metal needs its price (rule 4).
  const nisabField: ZakatField = input.basis === "gold" ? "goldPrice" : "silverPrice";
  const nisabPrice = input.basis === "gold" ? goldPrice : silverPrice;
  if (nisabPrice === 0 && !hasError(nisabField)) errors.push({ field: nisabField, code: "needed-for-nisab" });

  const goldValue = goldBhori * goldPrice;
  const silverValue = silverBhori * silverPrice;
  const totalAssets = cash + bank + goldValue + silverValue + business + receivables + other;
  const anyAssetError = errors.some((e) =>
    ["cash", "bank", "goldWeight", "silverWeight", "business", "receivables", "other"].includes(e.field),
  );
  // A weight without a price is already reported on the price field, so it counts as an asset here.
  const anyWeight = goldBhori > 0 || silverBhori > 0;
  if (totalAssets <= 0 && !anyWeight && !anyAssetError) errors.unshift({ field: "cash", code: "no-assets" });

  if (errors.length > 0) return { ok: false, errors: sortErrors(errors) };

  const net = totalAssets - debts;
  const nisab = nisabAmount(input.basis, nisabPrice);
  const due = roundTo(net, 2) >= roundTo(nisab, 2);

  return {
    ok: true,
    result: {
      basis: input.basis,
      cash,
      bank,
      goldBhori,
      goldValue,
      silverBhori,
      silverValue,
      business,
      receivables,
      other,
      totalAssets,
      debts,
      net,
      nisabPricePerBhori: nisabPrice,
      nisabBhori: NISAB_BHORI[input.basis],
      nisabGrams: NISAB_GRAMS[input.basis],
      nisab,
      due,
      zakat: due ? zakatOn(net) : 0,
    },
  };
}

/** Form order, so the widget focuses the first problem on screen. */
const FIELD_ORDER: readonly ZakatField[] = [
  "cash",
  "bank",
  "goldWeight",
  "goldPrice",
  "silverWeight",
  "silverPrice",
  "business",
  "receivables",
  "other",
  "debts",
];

function sortErrors(errors: ZakatError[]): ZakatError[] {
  return [...errors].sort((a, b) => FIELD_ORDER.indexOf(a.field) - FIELD_ORDER.indexOf(b.field));
}

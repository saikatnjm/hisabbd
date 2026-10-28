import { checkNumber, normalizeDigits, type NumberErrorCode } from "@/lib/number";

/*
 * Taka amount in words rules and assumptions (documented):
 *
 * 1. Input is a Taka amount from 0 to 99,999 crore 99 lakh 99 thousand 999
 *    Taka 99 paisa (10^12 − 0.01). Bangla digits, commas and spaces are
 *    accepted. Negative amounts are "too-small".
 * 2. At most 2 decimal places (paisa). More decimals are "too-many-decimals",
 *    except trailing zeros ("12.500" is ৳12.50), which change nothing.
 * 3. Taka and paisa are read exactly from the typed digits (split on "."),
 *    never by multiplying a float by 100, so "0.29" is exactly 29 paisa.
 * 4. Words use the Indian (South Asian) system used in Bangladesh: crore,
 *    lakh, thousand, hundred. Amounts of a crore or more say the number of
 *    crores in the same system, so crores repeat: 1,00,000 crore is
 *    "One Lakh Crore" and 99,999 crore is "Ninety-Nine Thousand Nine Hundred
 *    Ninety-Nine Crore".
 * 5. English: Title Case, 21–99 hyphenated ("Twenty-Five"), no "and" inside
 *    the number (cheques in Bangladesh usually leave it out). Format:
 *    "<taka> Taka and <paisa> Paisa Only"; paisa only when non-zero;
 *    under 1 Taka is "<paisa> Paisa Only"; 0 is "Zero Taka Only".
 *    "Taka" and "Paisa" never take a plural "s".
 * 6. An extra English line uses the international system (thousand, million,
 *    billion) with the same Taka/Paisa wording, for readers who think in
 *    millions.
 * 7. Bangla: 0–99 are irregular words, so they come from an explicit
 *    100-entry table. Hundreds join "শত" to the digit word (একশত … নয়শত).
 *    Scale words are "লক্ষ" and "কোটি" ("লাখ" is also common; the content
 *    page says so). Format: "<টাকা> টাকা <পয়সা> পয়সা মাত্র"; 0 is
 *    "শূন্য টাকা মাত্র".
 * 8. The amount is also returned as digits with South Asian grouping, in
 *    Western ("1,25,300.50") and Bangla ("১,২৫,৩০০.৫০") digits. Paisa are
 *    shown with 2 decimals only when non-zero ("1,25,300").
 */

/** Largest accepted amount: 10^12 − 0.01 (just under one lakh crore). */
export const MAX_AMOUNT = 999_999_999_999.99;

export type AmountInWordsField = "amount";
export type AmountInWordsErrorCode = NumberErrorCode | "too-many-decimals";

export interface AmountInWordsError {
  field: AmountInWordsField;
  code: AmountInWordsErrorCode;
}

export interface AmountInWordsResult {
  /** Whole Taka (0 to 999,999,999,999). */
  taka: number;
  /** Paisa, 0–99, read exactly from the typed decimals. */
  paisa: number;
  /** "One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only" */
  english: string;
  /** Same amount in the million system: "One Hundred Twenty-Five Thousand Three Hundred Taka and …" */
  englishInternational: string;
  /** "এক লক্ষ পঁচিশ হাজার তিনশত টাকা পঞ্চাশ পয়সা মাত্র" */
  bangla: string;
  /** "1,25,300.50" (Western digits, South Asian grouping). */
  digits: string;
  /** "১,২৫,৩০০.৫০" (Bangla digits, South Asian grouping). */
  digitsBangla: string;
}

export type AmountInWordsCalculation =
  | { ok: true; result: AmountInWordsResult }
  | { ok: false; errors: AmountInWordsError[] };

const ONES = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
] as const;

const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"] as const;

/** Bangla words for 0–99, index = number. These are irregular, so they are listed, not built. */
export const BANGLA_NUMBERS_0_99: readonly string[] = [
  "শূন্য", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়",
  "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "উনিশ",
  "বিশ", "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "ঊনত্রিশ",
  "ত্রিশ", "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ",
  "চল্লিশ", "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ",
  "পঞ্চাশ", "একান্ন", "বাহান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট",
  "ষাট", "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর",
  "সত্তর", "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি",
  "আশি", "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই",
  "নব্বই", "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই",
];

const CRORE = 10_000_000;
const LAKH = 100_000;
const THOUSAND = 1_000;

/** English words for 0–99: 21 → "Twenty-One". */
function englishBelowHundred(n: number): string {
  if (n < 20) return ONES[n]!;
  const ones = n % 10;
  return ones === 0 ? TENS[Math.floor(n / 10)]! : `${TENS[Math.floor(n / 10)]}-${ONES[ones]}`;
}

/** English words for 1–999: 101 → "One Hundred One" (no "and"). */
function englishBelowThousand(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds > 0) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest > 0) parts.push(englishBelowHundred(rest));
  return parts.join(" ");
}

/** Bangla words for 1–999: 300 → "তিনশত", 101 → "একশত এক". */
function banglaBelowThousand(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds > 0) parts.push(`${BANGLA_NUMBERS_0_99[hundreds]}শত`);
  if (rest > 0) parts.push(BANGLA_NUMBERS_0_99[rest]!);
  return parts.join(" ");
}

/**
 * Splits a whole number into crore / lakh / thousand / hundreds groups and
 * words each one. The crore count is itself worded recursively, which is
 * what makes "One Lakh Crore" work.
 */
function indianWords(
  n: number,
  words: { belowHundred: (n: number) => string; belowThousand: (n: number) => string },
  scale: { crore: string; lakh: string; thousand: string },
): string {
  const parts: string[] = [];
  const crores = Math.floor(n / CRORE);
  const rest = n % CRORE;
  if (crores > 0) parts.push(`${indianWords(crores, words, scale)} ${scale.crore}`);
  const lakhs = Math.floor(rest / LAKH);
  const thousands = Math.floor((rest % LAKH) / THOUSAND);
  const hundreds = rest % THOUSAND;
  if (lakhs > 0) parts.push(`${words.belowHundred(lakhs)} ${scale.lakh}`);
  if (thousands > 0) parts.push(`${words.belowHundred(thousands)} ${scale.thousand}`);
  if (hundreds > 0) parts.push(words.belowThousand(hundreds));
  return parts.join(" ");
}

/** Whole number in English, Indian system: 125300 → "One Lakh Twenty-Five Thousand Three Hundred". 0 → "Zero". */
export function englishIndianWords(n: number): string {
  if (n === 0) return ONES[0];
  return indianWords(
    n,
    { belowHundred: englishBelowHundred, belowThousand: englishBelowThousand },
    { crore: "Crore", lakh: "Lakh", thousand: "Thousand" },
  );
}

const INTERNATIONAL_SCALES = [
  { value: 1_000_000_000_000, word: "Trillion" },
  { value: 1_000_000_000, word: "Billion" },
  { value: 1_000_000, word: "Million" },
  { value: 1_000, word: "Thousand" },
] as const;

/** Whole number in English, international system: 125300 → "One Hundred Twenty-Five Thousand Three Hundred". Up to 999 trillion. */
export function englishInternationalWords(n: number): string {
  if (n === 0) return ONES[0];
  const parts: string[] = [];
  let rest = n;
  for (const scale of INTERNATIONAL_SCALES) {
    const count = Math.floor(rest / scale.value);
    rest %= scale.value;
    if (count > 0) parts.push(`${englishBelowThousand(count)} ${scale.word}`);
  }
  if (rest > 0) parts.push(englishBelowThousand(rest));
  return parts.join(" ");
}

/** Whole number in Bangla words: 125300 → "এক লক্ষ পঁচিশ হাজার তিনশত". 0 → "শূন্য". */
export function banglaWords(n: number): string {
  if (n === 0) return BANGLA_NUMBERS_0_99[0]!;
  return indianWords(
    n,
    { belowHundred: (k) => BANGLA_NUMBERS_0_99[k]!, belowThousand: banglaBelowThousand },
    { crore: "কোটি", lakh: "লক্ষ", thousand: "হাজার" },
  );
}

/** Joins number words with "Taka … Paisa Only" (rule 5). */
function englishAmount(taka: number, paisa: number, toWords: (n: number) => string): string {
  if (paisa === 0) return `${toWords(taka)} Taka Only`;
  if (taka === 0) return `${toWords(paisa)} Paisa Only`;
  return `${toWords(taka)} Taka and ${toWords(paisa)} Paisa Only`;
}

/** Joins number words with "টাকা … পয়সা মাত্র" (rule 7). */
function banglaAmount(taka: number, paisa: number): string {
  if (paisa === 0) return `${banglaWords(taka)} টাকা মাত্র`;
  if (taka === 0) return `${banglaWords(paisa)} পয়সা মাত্র`;
  return `${banglaWords(taka)} টাকা ${banglaWords(paisa)} পয়সা মাত্র`;
}

/** Groups a whole number the South Asian way: 125300 → "1,25,300". Works on the digit string, so it is exact. */
export function groupIndian(n: number): string {
  const text = String(n);
  if (text.length <= 3) return text;
  const last3 = text.slice(-3);
  const head = text.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${head},${last3}`;
}

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Converts ASCII digits to Bangla digits, leaving other characters: "1,25,300.50" → "১,২৫,৩০০.৫০". */
export function toBanglaDigits(text: string): string {
  return text.replace(/\d/g, (d) => BANGLA_DIGITS[Number(d)]!);
}

/**
 * Reads whole Taka and paisa exactly from the typed digits (rule 3).
 * Expects input that `checkNumber` has already accepted.
 */
export function splitTakaPaisa(raw: string): { taka: number; paisa: number } | null {
  const cleaned = normalizeDigits(raw).trim().replace(/[,\s]/g, "").replace(/^[+-]/, "");
  const [whole = "", fraction = ""] = cleaned.split(".");
  const decimals = fraction.replace(/0+$/, "");
  if (decimals.length > 2) return null;
  return {
    taka: whole === "" ? 0 : Number(whole),
    paisa: decimals === "" ? 0 : Number(decimals.padEnd(2, "0")),
  };
}

/** Validates raw input and writes the amount in English and Bangla words. */
export function calculateAmountInWords(rawAmount: string): AmountInWordsCalculation {
  const amount = checkNumber(rawAmount, { min: 0, max: MAX_AMOUNT });
  if (!amount.ok) return { ok: false, errors: [{ field: "amount", code: amount.code }] };

  const parts = splitTakaPaisa(rawAmount);
  if (!parts) return { ok: false, errors: [{ field: "amount", code: "too-many-decimals" }] };
  const { taka, paisa } = parts;

  const digits = paisa === 0 ? groupIndian(taka) : `${groupIndian(taka)}.${String(paisa).padStart(2, "0")}`;

  return {
    ok: true,
    result: {
      taka,
      paisa,
      english: englishAmount(taka, paisa, englishIndianWords),
      englishInternational: englishAmount(taka, paisa, englishInternationalWords),
      bangla: banglaAmount(taka, paisa),
      digits,
      digitsBangla: toBanglaDigits(digits),
    },
  };
}

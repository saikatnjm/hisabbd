import { describe, expect, it } from "vitest";
import {
  BANGLA_NUMBERS_0_99,
  banglaWords,
  calculateAmountInWords,
  englishIndianWords,
  englishInternationalWords,
  groupIndian,
  MAX_AMOUNT,
  splitTakaPaisa,
  toBanglaDigits,
  type AmountInWordsCalculation,
} from "./logic";

function ok(amount: string) {
  const calc = calculateAmountInWords(amount);
  if (!calc.ok) throw new Error(`expected ok, got ${JSON.stringify(calc.errors)}`);
  return calc.result;
}

const errors = (calc: AmountInWordsCalculation) => (calc.ok ? [] : calc.errors);

describe("Bangla 0–99 table", () => {
  it("has exactly 100 entries, all distinct and non-empty", () => {
    expect(BANGLA_NUMBERS_0_99).toHaveLength(100);
    expect(new Set(BANGLA_NUMBERS_0_99).size).toBe(100);
    expect(BANGLA_NUMBERS_0_99.every((word) => word.length > 0)).toBe(true);
  });

  it.each([
    [0, "শূন্য"],
    [1, "এক"],
    [2, "দুই"],
    [6, "ছয়"],
    [9, "নয়"],
    [10, "দশ"],
    [11, "এগারো"],
    [14, "চৌদ্দ"],
    [16, "ষোলো"],
    [19, "উনিশ"],
    [20, "বিশ"],
    [21, "একুশ"],
    [25, "পঁচিশ"],
    [29, "ঊনত্রিশ"],
    [30, "ত্রিশ"],
    [35, "পঁয়ত্রিশ"],
    [37, "সাঁইত্রিশ"],
    [39, "ঊনচল্লিশ"],
    [42, "বিয়াল্লিশ"],
    [45, "পঁয়তাল্লিশ"],
    [49, "ঊনপঞ্চাশ"],
    [50, "পঞ্চাশ"],
    [53, "তিপ্পান্ন"],
    [59, "ঊনষাট"],
    [64, "চৌষট্টি"],
    [69, "ঊনসত্তর"],
    [71, "একাত্তর"],
    [73, "তিয়াত্তর"],
    [79, "ঊনআশি"],
    [82, "বিরাশি"],
    [89, "ঊননব্বই"],
    [90, "নব্বই"],
    [92, "বিরানব্বই"],
    [96, "ছিয়ানব্বই"],
    [99, "নিরানব্বই"],
  ])("%i is %s", (n, word) => {
    expect(BANGLA_NUMBERS_0_99[n]).toBe(word);
  });
});

describe("whole-number words", () => {
  it.each([
    [0, "Zero", "শূন্য"],
    [1, "One", "এক"],
    [11, "Eleven", "এগারো"],
    [21, "Twenty-One", "একুশ"],
    [40, "Forty", "চল্লিশ"],
    [99, "Ninety-Nine", "নিরানব্বই"],
    [100, "One Hundred", "একশত"],
    [101, "One Hundred One", "একশত এক"],
    [999, "Nine Hundred Ninety-Nine", "নয়শত নিরানব্বই"],
    [1_000, "One Thousand", "এক হাজার"],
    [1_00_000, "One Lakh", "এক লক্ষ"],
    [1_25_300, "One Lakh Twenty-Five Thousand Three Hundred", "এক লক্ষ পঁচিশ হাজার তিনশত"],
    [1_00_00_000, "One Crore", "এক কোটি"],
    [10_05_00_200, "Ten Crore Five Lakh Two Hundred", "দশ কোটি পাঁচ লক্ষ দুইশত"],
  ])("%i", (n, english, bangla) => {
    expect(englishIndianWords(n)).toBe(english);
    expect(banglaWords(n)).toBe(bangla);
  });

  it("repeats crore for crores of crores", () => {
    // 1,000 crore and 1,00,000 crore (10^12, just above the calculator's limit).
    expect(englishIndianWords(10_000_000_000)).toBe("One Thousand Crore");
    expect(englishIndianWords(1_000_000_000_000)).toBe("One Lakh Crore");
    expect(banglaWords(1_000_000_000_000)).toBe("এক লক্ষ কোটি");
  });

  it("hundreds use শত joined to the digit word", () => {
    expect([100, 200, 300, 400, 500, 600, 700, 800, 900].map(banglaWords)).toEqual([
      "একশত", "দুইশত", "তিনশত", "চারশত", "পাঁচশত", "ছয়শত", "সাতশত", "আটশত", "নয়শত",
    ]);
  });

  it("international (million) system", () => {
    expect(englishInternationalWords(0)).toBe("Zero");
    expect(englishInternationalWords(1_25_300)).toBe("One Hundred Twenty-Five Thousand Three Hundred");
    expect(englishInternationalWords(10_000_000)).toBe("Ten Million");
    expect(englishInternationalWords(1_000_000_000)).toBe("One Billion");
    expect(englishInternationalWords(999_999_999_999)).toBe(
      "Nine Hundred Ninety-Nine Billion Nine Hundred Ninety-Nine Million Nine Hundred Ninety-Nine Thousand Nine Hundred Ninety-Nine",
    );
    expect(englishInternationalWords(1_000_000_000_000)).toBe("One Trillion");
  });
});

describe("digit helpers", () => {
  it("groups the South Asian way", () => {
    expect(groupIndian(0)).toBe("0");
    expect(groupIndian(999)).toBe("999");
    expect(groupIndian(1000)).toBe("1,000");
    expect(groupIndian(125300)).toBe("1,25,300");
    expect(groupIndian(10000000)).toBe("1,00,00,000");
    expect(groupIndian(999_999_999_999)).toBe("9,99,99,99,99,999");
  });

  it("converts to Bangla digits", () => {
    expect(toBanglaDigits("1,25,300.50")).toBe("১,২৫,৩০০.৫০");
    expect(toBanglaDigits("0123456789")).toBe("০১২৩৪৫৬৭৮৯");
  });

  it("reads paisa exactly from the string", () => {
    expect(splitTakaPaisa("0.29")).toEqual({ taka: 0, paisa: 29 });
    expect(splitTakaPaisa("1.1")).toEqual({ taka: 1, paisa: 10 });
    expect(splitTakaPaisa(".5")).toEqual({ taka: 0, paisa: 50 });
    expect(splitTakaPaisa("12.")).toEqual({ taka: 12, paisa: 0 });
    expect(splitTakaPaisa("12.500")).toEqual({ taka: 12, paisa: 50 });
    expect(splitTakaPaisa("1.234")).toBeNull();
  });
});

describe("full amounts", () => {
  it("0", () => {
    const r = ok("0");
    expect(r.english).toBe("Zero Taka Only");
    expect(r.englishInternational).toBe("Zero Taka Only");
    expect(r.bangla).toBe("শূন্য টাকা মাত্র");
    expect(r.digits).toBe("0");
    expect(r.digitsBangla).toBe("০");
  });

  it.each([
    ["1", "One Taka Only", "এক টাকা মাত্র"],
    ["11", "Eleven Taka Only", "এগারো টাকা মাত্র"],
    ["21", "Twenty-One Taka Only", "একুশ টাকা মাত্র"],
    ["99", "Ninety-Nine Taka Only", "নিরানব্বই টাকা মাত্র"],
    ["100", "One Hundred Taka Only", "একশত টাকা মাত্র"],
    ["101", "One Hundred One Taka Only", "একশত এক টাকা মাত্র"],
    ["999", "Nine Hundred Ninety-Nine Taka Only", "নয়শত নিরানব্বই টাকা মাত্র"],
    ["1,000", "One Thousand Taka Only", "এক হাজার টাকা মাত্র"],
    ["1,00,000", "One Lakh Taka Only", "এক লক্ষ টাকা মাত্র"],
    ["1,00,00,000", "One Crore Taka Only", "এক কোটি টাকা মাত্র"],
    ["1,000,00,00,000", "One Thousand Crore Taka Only", "এক হাজার কোটি টাকা মাত্র"],
  ])("%s", (input, english, bangla) => {
    const r = ok(input);
    expect(r.english).toBe(english);
    expect(r.bangla).toBe(bangla);
    expect(r.paisa).toBe(0);
  });

  it("1,25,300.50 (the worked example)", () => {
    const r = ok("1,25,300.50");
    expect(r.taka).toBe(125300);
    expect(r.paisa).toBe(50);
    expect(r.english).toBe("One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only");
    expect(r.englishInternational).toBe(
      "One Hundred Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only",
    );
    expect(r.bangla).toBe("এক লক্ষ পঁচিশ হাজার তিনশত টাকা পঞ্চাশ পয়সা মাত্র");
    expect(r.digits).toBe("1,25,300.50");
    expect(r.digitsBangla).toBe("১,২৫,৩০০.৫০");
  });

  it("0.29 is exactly 29 paisa (no floating-point drift)", () => {
    // 0.29 × 100 = 28.999999999999996 in floating point.
    const r = ok("0.29");
    expect(r.taka).toBe(0);
    expect(r.paisa).toBe(29);
    expect(r.english).toBe("Twenty-Nine Paisa Only");
    expect(r.bangla).toBe("ঊনত্রিশ পয়সা মাত্র");
    expect(r.digits).toBe("0.29");
  });

  it("0.05 is five paisa", () => {
    const r = ok("0.05");
    expect(r.paisa).toBe(5);
    expect(r.english).toBe("Five Paisa Only");
    expect(r.bangla).toBe("পাঁচ পয়সা মাত্র");
    expect(r.digits).toBe("0.05");
    expect(r.digitsBangla).toBe("০.০৫");
  });

  it("one decimal means tens of paisa", () => {
    const r = ok("10.5");
    expect(r.english).toBe("Ten Taka and Fifty Paisa Only");
    expect(r.digits).toBe("10.50");
  });

  it("trailing zero paisa are dropped from the words", () => {
    const r = ok("2500.00");
    expect(r.english).toBe("Two Thousand Five Hundred Taka Only");
    expect(r.digits).toBe("2,500");
  });

  it("the maximum", () => {
    const r = ok("9,99,99,99,99,999.99");
    expect(r.taka).toBe(999_999_999_999);
    expect(r.paisa).toBe(99);
    expect(r.english).toBe(
      "Ninety-Nine Thousand Nine Hundred Ninety-Nine Crore Ninety-Nine Lakh Ninety-Nine Thousand Nine Hundred Ninety-Nine Taka and Ninety-Nine Paisa Only",
    );
    expect(r.bangla).toBe(
      "নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লক্ষ নিরানব্বই হাজার নয়শত নিরানব্বই টাকা নিরানব্বই পয়সা মাত্র",
    );
    expect(r.digits).toBe("9,99,99,99,99,999.99");
    expect(MAX_AMOUNT).toBe(999_999_999_999.99);
  });

  it("accepts Bangla digits and commas", () => {
    const r = ok("১,২৫,৩০০.৫০");
    expect(r.english).toBe("One Lakh Twenty-Five Thousand Three Hundred Taka and Fifty Paisa Only");
    expect(ok("১০০০").english).toBe("One Thousand Taka Only");
    expect(ok("  1 000 ").english).toBe("One Thousand Taka Only");
  });
});

describe("validation", () => {
  it("missing", () => {
    expect(errors(calculateAmountInWords(""))).toEqual([{ field: "amount", code: "missing" }]);
    expect(errors(calculateAmountInWords("   "))).toEqual([{ field: "amount", code: "missing" }]);
  });

  it("invalid", () => {
    for (const raw of ["abc", "12abc", "1.2.3", "1e3", "৳500", "10%"]) {
      expect(errors(calculateAmountInWords(raw))).toEqual([{ field: "amount", code: "invalid" }]);
    }
  });

  it("negative is too small", () => {
    expect(errors(calculateAmountInWords("-1"))).toEqual([{ field: "amount", code: "too-small" }]);
    expect(errors(calculateAmountInWords("-0.01"))).toEqual([{ field: "amount", code: "too-small" }]);
  });

  it("above the maximum is too large", () => {
    expect(errors(calculateAmountInWords("1000000000000"))).toEqual([{ field: "amount", code: "too-large" }]);
    expect(errors(calculateAmountInWords("1,00,000,00,00,000"))).toEqual([{ field: "amount", code: "too-large" }]);
  });

  it("more than 2 decimals is too-many-decimals", () => {
    expect(errors(calculateAmountInWords("1.234"))).toEqual([{ field: "amount", code: "too-many-decimals" }]);
    expect(errors(calculateAmountInWords("0.001"))).toEqual([{ field: "amount", code: "too-many-decimals" }]);
    expect(errors(calculateAmountInWords("১.২৩৪"))).toEqual([{ field: "amount", code: "too-many-decimals" }]);
  });
});

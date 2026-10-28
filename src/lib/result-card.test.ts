import { describe, expect, it } from "vitest";
import { cardText, wrapText } from "./result-card";

const byLength = (s: string) => s.length;

describe("wrapText", () => {
  it("wraps on spaces within the width", () => {
    expect(wrapText("one two three four", 9, byLength)).toEqual(["one two", "three", "four"]);
  });

  it("keeps an over-long word on its own line", () => {
    expect(wrapText("a supercalifragilistic b", 5, byLength)).toEqual(["a", "supercalifragilistic", "b"]);
  });

  it("respects explicit line breaks and Bangla words", () => {
    expect(wrapText("বয়স ৩১ বছর\nমোট দিন", 20, byLength)).toEqual(["বয়স ৩১ বছর", "মোট দিন"]);
  });
});

describe("cardText", () => {
  it("drops the HisabBD credit sentence", () => {
    expect(cardText("Final price ৳720. You save ৳280. Calculated with HisabBD’s Discount Calculator.")).toBe(
      "Final price ৳720. You save ৳280.",
    );
    expect(cardText("চূড়ান্ত দাম ৳720। HisabBD-র ডিসকাউন্ট ক্যালকুলেটরে হিসাব করা।")).toBe("চূড়ান্ত দাম ৳720।");
  });

  it("keeps the text when every sentence mentions HisabBD", () => {
    expect(cardText("HisabBD result.")).toBe("HisabBD result.");
  });
});

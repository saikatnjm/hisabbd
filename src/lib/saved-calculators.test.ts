import { describe, expect, it } from "vitest";
import { MAX_RECENT, sanitizeSlugs, toggled, withRecent } from "./saved-calculators";

describe("sanitizeSlugs", () => {
  it("keeps only unique, well-formed slugs", () => {
    expect(sanitizeSlugs(["age-calculator", "age-calculator", "BAD", "<script>", 5, "bmi-calculator"], 6)).toEqual([
      "age-calculator",
      "bmi-calculator",
    ]);
  });

  it("rejects non-arrays and respects the limit", () => {
    expect(sanitizeSlugs({ a: 1 }, 6)).toEqual([]);
    expect(sanitizeSlugs("age-calculator", 6)).toEqual([]);
    expect(sanitizeSlugs(["a", "b", "c"], 2)).toEqual(["a", "b"]);
  });

  it("drops overly long strings", () => {
    expect(sanitizeSlugs(["a".repeat(61), "ok"], 6)).toEqual(["ok"]);
  });
});

describe("withRecent", () => {
  it("puts the latest first without duplicates", () => {
    expect(withRecent(["a", "b", "c"], "b")).toEqual(["b", "a", "c"]);
  });

  it("keeps at most MAX_RECENT", () => {
    const list = ["a", "b", "c", "d", "e", "f"];
    expect(withRecent(list, "g")).toHaveLength(MAX_RECENT);
    expect(withRecent(list, "g")[0]).toBe("g");
  });
});

describe("toggled", () => {
  it("adds and removes", () => {
    expect(toggled(["a"], "b")).toEqual(["a", "b"]);
    expect(toggled(["a", "b"], "a")).toEqual(["b"]);
  });
});

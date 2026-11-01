/** Sources for the rod weight calculator, checked on 1 November 2026. */
export const ROD_SOURCES = {
  /** Bangla explainer of the d²/162 (per metre) and d²/532 (per foot) rule. */
  bangla: {
    title: "শিক্ষক বাতায়ন: রডের ওজন বের করার নিয়ম",
    url: "https://www.teachers.gov.bd/blog/details/762061",
  },
  /** Nominal kg per metre by diameter (0.617 for 10 mm, 0.888 for 12 mm …). */
  table: {
    title: "Infralens: Steel bar weight chart (IS 1786 nominal mass per metre)",
    url: "https://infralens.in/knowledge/rebar-weight-chart-is-1786",
  },
} as const;

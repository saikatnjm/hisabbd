/** Sources for the pregnancy calculator's rules, checked on 1 November 2026. */
export const PREGNANCY_SOURCES = {
  /** EDD = LMP + 280 days; first-trimester ultrasound and IVF dates take precedence. */
  dueDate: {
    title: "ACOG Committee Opinion No. 700: Methods for estimating the due date (2017)",
    url: "https://publications.smfm.org/publications/239-acog-committee-opinion-700-methods-for-estimating-the/",
  },
  /** Early, full, late and post-term week ranges. */
  term: {
    title: "ACOG Committee Opinion No. 579: Definition of term pregnancy (2013)",
    url: "https://publications.smfm.org/publications/148-acog-committee-opinion-579-definition-of-term-pregnancy",
  },
  /** At least eight antenatal care contacts. */
  antenatal: {
    title: "WHO: New guidelines on antenatal care for a positive pregnancy experience (7 Nov 2016)",
    url: "https://www.who.int/news/item/07-11-2016-new-guidelines-on-antenatal-care-for-a-positive-pregnancy-experience",
  },
} as const;

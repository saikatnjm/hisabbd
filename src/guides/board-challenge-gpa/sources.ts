/**
 * Sources for the board challenge guide, checked on 29 October 2026. The 2026
 * re-scrutiny notice (process and fee) was not out yet, so the guide states
 * only the dates and links to the boards; re-check once the notice publishes.
 */
export const BOARD_CHALLENGE_SOURCES = {
  /** HSC 2026 results on 31 Oct, 11:00; re-evaluation applications 1–7 Nov 2026. */
  dates: {
    title: "The Daily Star, 27 Oct 2026",
    url: "https://www.thedailystar.net/news/education/news/hsc-2026-results-october-31-how-check-your-results-online-and-sms-4308776",
  },
  /** Dhaka board chairman: re-scrutiny re-adds the marks, it does not re-mark the script (HSC 2024). */
  recheckOnly: {
    title: "bdnews24.com, 13 Nov 2024",
    url: "https://bangla.bdnews24.com/bangladesh/95c56840396d",
  },
  /** Dhaka board chairman: scripts submitted for SSC 2026 re-scrutiny were re-evaluated. */
  ssc2026Reevaluated: {
    title: "The Daily Observer, 9 Sep 2026",
    url: "https://observerbd.com/news/592425",
  },
  /** 2025 HSC process: online only, fee per paper, both papers of a two-paper subject, no refund. */
  process2025: {
    title: "Prothom Alo, 14 Oct 2025",
    url: "https://en.prothomalo.com/youth/education/m0u24brkjv",
  },
  /** Official result sites named by the boards. */
  results: {
    title: "educationboardresults.gov.bd",
    url: "https://www.educationboardresults.gov.bd/",
  },
} as const;

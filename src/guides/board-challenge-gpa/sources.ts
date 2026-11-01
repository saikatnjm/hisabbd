/**
 * Sources for the board challenge guide. Dates checked on 29 October 2026; the
 * 2026 fee and process (from the boards' notice, as reported) on 1 November
 * 2026.
 */
export const BOARD_CHALLENGE_SOURCES = {
  /** HSC 2026 results on 31 Oct, 11:00; re-evaluation applications 1–7 Nov 2026. */
  dates: {
    title: "The Daily Star, 27 Oct 2026",
    url: "https://www.thedailystar.net/news/education/news/hsc-2026-results-october-31-how-check-your-results-online-and-sms-4308776",
  },
  /** 2026 process: ৳150 per paper, 1–7 Nov, online only, both papers of a two-paper subject, no refund. */
  process2026: {
    title: "Prothom Alo, 1 Nov 2026",
    url: "https://en.prothomalo.com/youth/education/vf0o2bzxum",
  },
  /** The same 2026 fee, dates, portal and payment methods. */
  process2026DailyStar: {
    title: "The Daily Star, 31 Oct 2026",
    url: "https://www.thedailystar.net/campus/news/how-get-your-hsc-answer-scripts-rechecked-4311946",
  },
  /** Online application portal named in the notice. */
  portal: {
    title: "rescrutiny.eduboardresults.gov.bd",
    url: "https://rescrutiny.eduboardresults.gov.bd/",
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
  /** Official result sites named by the boards. */
  results: {
    title: "educationboardresults.gov.bd",
    url: "https://www.educationboardresults.gov.bd/",
  },
} as const;

/**
 * Sources for the overtime calculator, checked on 2 November 2026.
 *
 * The Act text below was read on bdlaws (print view). No official page that
 * states the monthly-hours divisor could be read, so it is NOT pre-filled:
 * the divisor is an input and the pages explain why.
 */
export const OVERTIME_SOURCES = {
  /** s.108(1): overtime at twice the ordinary rate of basic wage, dearness allowance and ad hoc or interim wage. */
  section108: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 108 (Bangladesh Labour Act 2006, section 108)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29435.html",
  },
  /** s.100: 8 hours a day, up to 10 with overtime. */
  section100: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 100 (daily working hours)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29427.html",
  },
  /** s.101: rest and meal breaks. */
  section101: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 101 (rest or meal breaks)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29428.html",
  },
  /** s.102: 48 hours a week, at most 60 in a week and 56 a week on average over a year. */
  section102: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 102 (weekly working hours)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29429.html",
  },
  /** Secondary source for the commonly used 208-hour divisor (52 weeks x 48 hours / 12 months). Not official. */
  divisor: {
    title: "BIPO Times, September 2022 (payroll guide; secondary source for the ÷ 208 convention)",
    url: "https://www.biposervice.com/wp-content/uploads/2022/10/BIPO-Times-Sep-2022-en.pdf",
  },
} as const;

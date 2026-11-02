/**
 * Sources for the earned leave calculator, checked on 2 November 2026.
 *
 * Every section below was read in full on bdlaws (print view) on that date.
 * The consolidated text there already includes the Bangladesh Labour
 * (Amendment) Act 2026 (Act 43 of 2026), which changed s.117(2)(ক), s.117(8)(ঘ)
 * and s.118(1).
 */
export const LEAVE_SOURCES = {
  /** s.117: annual leave with wages (accrual rates, carry-forward, caps, continuity). */
  section117: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 117 (মজুরীসহ বাৎসরিক ছুটি / annual leave with wages)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29444.html",
  },
  /** s.11: pay for unused annual leave when employment ends. */
  section11: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 11 (অব্যয়িত ছুটির মজুরী প্রদান / pay for unused leave)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29079.html",
  },
  /** s.119: the daily wage for leave days. */
  section119: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 119 (ছুটির সময়ের মজুরী হিসাব / wages for leave)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29446.html",
  },
  /** s.115: 10 days casual leave. */
  section115: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 115 (নৈমিত্তিক ছুটি / casual leave)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29442.html",
  },
  /** s.116: 14 days sick leave. */
  section116: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 116 (পীড়া-ছুটি / sick leave)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29443.html",
  },
  /** s.118: festival leave, 13 days after the 2026 amendment. */
  section118: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 118 (উৎসব ছুটি / festival leave)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29445.html",
  },
  /** s.10: how to apply for leave. */
  section10: {
    title: "বাংলাদেশ শ্রম আইন, 2006, ধারা 10 (ছুটির পদ্ধতি / applying for leave)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29078.html",
  },
} as const;

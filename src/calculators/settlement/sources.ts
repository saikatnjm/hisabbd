/**
 * Sources for the job exit benefit calculator, all checked on 2 November 2026.
 *
 * Each section was read in the print view on bdlaws (Laws of Bangladesh).
 * The bdlaws text on that date included the Labour (Amendment) Act 2026
 * (Act 43 of 2026) in sections 14, 23 and 27(4), and the 2013 and 2018
 * amendments elsewhere. The Act does not say how to get a day's wage from a
 * monthly wage for these sections, so that is an input, not a source.
 */
export const SETTLEMENT_SOURCES = {
  /** s.2(10) gratuity; s.2(11) retrenchment; s.2(17) discharge; s.2(49A) month. */
  section2: {
    title: "বাংলাদেশ শ্রম আইন, ২০০৬, ধারা ২ (definitions: gratuity, retrenchment, discharge, month)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29070.html",
  },
  /** s.14: "one year", "six months" and "wages" (sub-section 3). */
  section14: {
    title: "বাংলাদেশ শ্রম আইন, ২০০৬, ধারা ১৪ (counting a year, six months and wages)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29082.html",
  },
  /** s.20: retrenchment. */
  section20: {
    title: "বাংলাদেশ শ্রম আইন, ২০০৬, ধারা ২০ (retrenchment)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-30090.html",
  },
  /** s.22: discharge. */
  section22: {
    title: "বাংলাদেশ শ্রম আইন, ২০০৬, ধারা ২২ (discharge)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-30092.html",
  },
  /** s.23: dismissal and removal for misconduct (not modelled; explained). */
  section23: {
    title: "বাংলাদেশ শ্রম আইন, ২০০৬, ধারা ২৩ (misconduct, dismissal)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-30093.html",
  },
  /** s.26: termination by the employer other than by dismissal. */
  section26: {
    title: "বাংলাদেশ শ্রম আইন, ২০০৬, ধারা ২৬ (termination by the employer)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29913.html",
  },
  /** s.27: resignation. */
  section27: {
    title: "বাংলাদেশ শ্রম আইন, ২০০৬, ধারা ২৭ (resignation)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29914.html",
  },
  /** s.30: all dues within 30 working days. */
  section30: {
    title: "বাংলাদেশ শ্রম আইন, ২০০৬, ধারা ৩০ (payment of final dues)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29917.html",
  },
  /** s.11: unused annual leave paid on any exit (not calculated here). */
  section11: {
    title: "বাংলাদেশ শ্রম আইন, ২০০৬, ধারা ১১ (pay for unused leave)",
    url: "https://bdlaws.minlaw.gov.bd/act-952/section-29079.html",
  },
} as const;

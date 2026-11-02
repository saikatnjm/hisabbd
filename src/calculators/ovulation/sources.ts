/** Sources for the ovulation calculator, checked on 2 November 2026. */
export const OVULATION_SOURCES = {
  /** Ovulation "around 10 to 16 days before the next period"; sperm survive up to 7 days; 21–35 day cycles normal. Reviewed 5 Jan 2023. */
  cycle: {
    title: "NHS: Periods and fertility in the menstrual cycle",
    url: "https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/",
  },
  /** Ovulation "usually about 14 days before the start of your next period"; sex every 2–3 days. Reviewed 2 Jun 2026. */
  trying: {
    title: "NHS: Trying to get pregnant",
    url: "https://www.nhs.uk/pregnancy/trying-for-a-baby/trying-to-get-pregnant/",
  },
} as const;

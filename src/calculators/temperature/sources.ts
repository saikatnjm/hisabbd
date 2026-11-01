/** Sources for the fever check, checked on 1 November 2026. */
export const FEVER_SOURCES = {
  /** 38 °C or above is a high temperature in adults; when to get urgent advice. Reviewed 19 Oct 2026. */
  adults: {
    title: "NHS: High temperature (fever) in adults",
    url: "https://www.nhs.uk/conditions/fever-in-adults/",
  },
  /** 38 °C or more in children; under 3 months at 38 °C+, 3–6 months at 39 °C+: call for help. Reviewed 3 Jan 2024. */
  children: {
    title: "NHS: High temperature (fever) in children",
    url: "https://www.nhs.uk/conditions/fever-in-children/",
  },
} as const;

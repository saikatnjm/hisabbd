import type { CalculatorMeta } from "@/calculators/types";

export const dateDifferenceCalculator: CalculatorMeta = {
  slug: "date-difference-calculator",
  name: "Date Difference Calculator",
  nameBn: "তারিখের পার্থক্য ক্যালকুলেটর",
  category: "date-time",
  icon: "calendar-range",
  summary: "Find the time between two dates in years, months, weeks and days.",
  keywords: [
    "days between dates",
    "how many days",
    "date duration",
    "days until",
    "days since",
    "count days",
    "working days",
    "তারিখ",
    "দিন গণনা", "day counter", "date calculator", "duration", "days left", "koto din", "days between"],
  seo: {
    title: "Date Difference Calculator: Days Between Two Dates",
    description:
      "Count the days, weeks, months and years between two dates. Include or exclude the end date and see days excluding Fridays and Saturdays.",
  },
  addedOn: "2026-10-05",
  related: ["age-calculator"],
  faqs: [
    {
      question: "Is the end date counted?",
      answer:
        "Not by default: from 1 January to 2 January is 1 day. Turn on “Include the end date” to count both the first and last day, so the same dates give 2 days. That’s useful for leave, events or rental periods.",
    },
    {
      question: "How are months counted when they have different lengths?",
      answer:
        "Months are counted on the calendar, not as 30 days. From 15 March to 15 April is 1 month. If the start day doesn’t exist in a later month (for example the 31st), that month’s last day is used.",
    },
    {
      question: "What if I enter the dates in the wrong order?",
      answer:
        "The calculator swaps them and tells you, so you always get the positive time between the two dates.",
    },
    {
      question: "What does “excluding Fridays and Saturdays” mean?",
      answer:
        "It counts only the days from Sunday to Thursday, the usual working week in Bangladesh. Public holidays and other days off aren’t known to the calculator, so subtract them yourself if you need exact working days.",
    },
    {
      question: "Are leap years included?",
      answer:
        "Yes. The calculator uses the real calendar, so 29 February is counted whenever it falls between your dates.",
    },
  ],
};

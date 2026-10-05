import type { CalculatorMeta } from "@/calculators/types";

export const ageCalculator: CalculatorMeta = {
  slug: "age-calculator",
  name: "Age Calculator",
  nameBn: "বয়স ক্যালকুলেটর",
  category: "date-time",
  icon: "calendar",
  summary: "Calculate your exact age in years, months and days.",
  keywords: ["age", "date of birth", "birthday", "how old", "dob", "বয়স", "জন্ম তারিখ"],
  seo: {
    title: "Age Calculator: Exact Age in Years, Months and Days",
    description:
      "Find your exact age in years, months and days on any date. See total days and weeks lived and your next birthday. Free and works on any phone.",
  },
  addedOn: "2026-10-05",
  related: ["date-difference-calculator", "bmi-calculator"],
  faqs: [
    {
      question: "How is age calculated?",
      answer:
        "By counting complete years, then complete months, then the remaining days on the calendar, from the date of birth to the “as of” date. If a month is too short for the birth day (for example the 31st), that month’s last day is used.",
    },
    {
      question: "Can I calculate my age on a past or future date?",
      answer:
        "Yes. Change “Calculate age as of” to any date on or after the date of birth. Only the date of birth can’t be later than today.",
    },
    {
      question: "How are leap years handled?",
      answer:
        "Exactly. 29 February is counted in every leap year, so each year is 365 or 366 days long, just like the real calendar, and the totals always match it.",
    },
    {
      question: "What happens if I was born on 29 February?",
      answer:
        "In years without a 29 February, your birthday is taken as 28 February, so your age goes up on that day. Some organisations may count it differently; if the exact date matters for something official, check their rules.",
    },
    {
      question: "Can I calculate someone else's age?",
      answer:
        "Yes. Enter their date of birth. Nothing you enter is saved or sent anywhere: the calculation runs in your browser.",
    },
    {
      question: "Why is my age different from dividing days by 365?",
      answer:
        "Because leap days add up: roughly one every four years. Dividing total days by 365 ignores them, so it can show you a year older a few days before your actual birthday.",
    },
  ],
};

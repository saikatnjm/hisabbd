import type { GuideMeta } from "@/guides/types";

export const daysBetweenDatesGuide: GuideMeta = {
  slug: "days-between-dates",
  title: "How Many Days Between Two Dates: End Date, Months and Working Days",
  titleBn: "দুই তারিখের মধ্যে কত দিন: শেষ দিন, মাস-দিন ও কর্মদিবসের হিসাব",
  summary:
    "Count the days between two dates by hand: whether to include the end date, calendar months and days, leap years, and working days without Fridays and Saturdays.",
  summaryBn:
    "দুই তারিখের মধ্যে কত দিন, হাতে গুনে বের করুন: শেষ দিন ধরবেন কি না, মাস-দিনের হিসাব, অধিবর্ষ, আর শুক্র-শনি বাদে কর্মদিবস — উদাহরণসহ।",
  answer:
    "Subtract the earlier date from the later one. By the usual rule the end date isn’t counted, so 1 to 2 January is 1 day; for leave or rentals where both days count, add 1. For example, 1 January to 31 December 2026 is 364 days, or 365 with the end date.",
  answerBn:
    "পরের তারিখ থেকে আগের তারিখ বাদ দিন। সাধারণ নিয়মে শেষ দিন গোনা হয় না, তাই 1 থেকে 2 জানুয়ারি 1 দিন; ছুটি বা ভাড়ার মতো হিসাবে দুই দিনই গুনলে 1 যোগ করুন। যেমন 1 জানুয়ারি থেকে 31 ডিসেম্বর 2026 হলো 364 দিন, শেষ দিনসহ 365।",
  seo: {
    title: "Days Between Two Dates: How to Count, With Working Days",
    description:
      "How to count the days between two dates: when to include the end date, months and days, leap years, and working days excluding Fridays and Saturdays.",
  },
  seoBn: {
    title: "দুই তারিখের মধ্যে কত দিন: গণনার নিয়ম ও কর্মদিবস হিসাব",
    description:
      "দুই তারিখের মধ্যে কত দিন হাতে গোনার নিয়ম: শেষ দিন ধরবেন কি না, মাস-দিনের হিসাব, অধিবর্ষ, আর শুক্র-শনিবার বাদে কর্মদিবস হিসাব — উদাহরণসহ।",
  },
  calculator: "date-difference-calculator",
  publishedOn: "2026-10-29",
};

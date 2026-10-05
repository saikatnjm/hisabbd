import type { CalculatorMeta } from "@/calculators/types";

export const gpaCalculator: CalculatorMeta = {
  slug: "gpa-calculator",
  name: "GPA Calculator",
  nameBn: "জিপিএ ক্যালকুলেটর",
  category: "education",
  icon: "graduation",
  summary: "Work out your semester GPA from letter grades and credits on the Bangladesh university 4.00 scale.",
  keywords: [
    "gpa",
    "grade point average",
    "result",
    "university",
    "semester result",
    "grade point",
    "credit hour",
    "ugc grading",
    "জিপিএ",
    "গ্রেড পয়েন্ট",
    "রেজাল্ট",
  ],
  seo: {
    title: "GPA Calculator: Semester GPA from Grades and Credits",
    description:
      "Calculate your semester GPA from letter grades and credits on the Bangladesh university 4.00 scale (A+ to F). Decimal credits supported. Free and fast.",
  },
  addedOn: "2026-10-05",
  related: ["cgpa-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "How is GPA calculated?",
      answer:
        "Multiply each course’s grade point by its credits, add those up, and divide by the total credits. A 3-credit A (3.75) is worth 11.25 grade points, and a 3-credit B+ (3.25) is worth 9.75, so together they give 21 ÷ 6 = 3.50.",
    },
    {
      question: "Why do credits matter?",
      answer:
        "A course with more credits has more weight. A 4.00 in a 1-credit lab moves your GPA much less than a 4.00 in a 4-credit theory course, so the same grades in different courses can give a different GPA.",
    },
    {
      question: "Does an F count in my GPA?",
      answer:
        "Yes. An F adds 0 grade points but its credits are still part of the total, which pulls the GPA down. This calculator counts every course you enter, so if your university replaces an F after a retake, enter only the grade that counts.",
    },
    {
      question: "Which grading scale does this use?",
      answer:
        "The uniform 4.00 scale published by Bangladesh’s University Grants Commission, which many universities use: A+ = 4.00, A = 3.75, A- = 3.50, B+ = 3.25, B = 3.00, B- = 2.75, C+ = 2.50, C = 2.25, D = 2.00, F = 0.00. Some universities use different cut-offs or grades, so check your own handbook.",
    },
    {
      question: "Why is my official GPA a little different?",
      answer:
        "Usually rounding. This calculator rounds to 2 decimals (half up), while some institutions simply cut off the extra digits. A GPA of 3.428… shows as 3.43 here but 3.42 if truncated. Your university’s published result is the one that counts.",
    },
    {
      question: "Can I use it for SSC or HSC results?",
      answer:
        "No. School and college (SSC/HSC) GPA follows its own rules, so a simple credit-weighted average would be misleading there. This calculator is for university-style letter grades and credits.",
    },
  ],
};

import type { CalculatorMeta } from "@/calculators/types";

export const cgpaCalculator: CalculatorMeta = {
  slug: "cgpa-calculator",
  name: "CGPA Calculator",
  nameBn: "সিজিপিএ ক্যালকুলেটর",
  category: "education",
  icon: "book",
  summary: "Combine your semester GPAs and credits into one cumulative GPA (CGPA), on a 4.00 or 5.00 scale.",
  keywords: [
    "cgpa",
    "cumulative gpa",
    "cumulative grade point average",
    "gpa to cgpa",
    "semester result",
    "university",
    "credit hour",
    "সিজিপিএ",
    "জিপিএ",
    "রেজাল্ট",
  ],
  seo: {
    title: "CGPA Calculator: Cumulative GPA from Semester Results",
    description:
      "Calculate your CGPA from semester GPAs and credits, weighted correctly, on a 4.00 or 5.00 scale. Add a new semester to your current CGPA. Free and fast.",
  },
  addedOn: "2026-10-05",
  related: ["gpa-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "How is CGPA calculated?",
      answer:
        "Multiply each semester’s GPA by the credits you completed in it, add those up, and divide by the total credits. Two semesters of 3.00 (15 credits) and 4.00 (15 credits) give (45 + 60) ÷ 30 = 3.50.",
    },
    {
      question: "Why not just average my semester GPAs?",
      answer:
        "Because semesters with more credits should count for more. A plain average only matches the real CGPA when every semester has the same credits. With 3.80 on 9 credits and 3.00 on 18 credits, the plain average is 3.40 but the correct CGPA is 3.27.",
    },
    {
      question: "How do I add a new semester to my current CGPA?",
      answer:
        "Enter your current CGPA and the total credits you have completed as one row, then add the new semester’s GPA and credits as another row. The result is the same as entering every past semester separately.",
    },
    {
      question: "Should I use the 4.00 or 5.00 scale?",
      answer:
        "Use the scale your university reports your results on. The scale only sets the highest GPA you can enter; the formula is the same. Check your result sheet or handbook if you are not sure.",
    },
    {
      question: "How do I handle a retaken course?",
      answer:
        "It depends on your university’s policy: some replace the old grade, others average both attempts. This calculator uses whatever semester GPAs and credits you enter, so enter figures that follow your university’s rule.",
    },
    {
      question: "Why is my official CGPA slightly different?",
      answer:
        "Most often rounding. This calculator rounds to 2 decimals (half up), while some institutions truncate. Your university’s published CGPA is the official one.",
    },
  ],
};

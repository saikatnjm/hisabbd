import type { CalculatorMeta } from "@/calculators/types";

export const percentageCalculator: CalculatorMeta = {
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  nameBn: "শতকরা ক্যালকুলেটর",
  category: "everyday",
  icon: "percent",
  summary: "Work out a percentage of a number, a percentage change, or increase and decrease a number by a percentage.",
  keywords: ["percentage", "percent", "percent of", "percentage change", "percentage increase", "percentage decrease", "%", "শতকরা", "শতাংশ", "percent calculator", "marks percentage", "shotokora", "% calculator", "increase decrease"],
  seo: {
    title: "Percentage Calculator: Percent of, Change and More",
    description:
      "Find a percent of a number, what percent one number is of another, percentage change, or increase or decrease a number by a percent. Working shown.",
  },
  addedOn: "2026-10-05",
  related: ["discount-calculator", "profit-loss-calculator", "gpa-calculator"],
  faqs: [
    {
      question: "How do I calculate a percentage of a number?",
      answer:
        "Divide the percentage by 100 and multiply by the number. For example, 15% of 2,000 is 15 ÷ 100 × 2,000 = 300.",
    },
    {
      question: "How do I find what percent one number is of another?",
      answer:
        "Divide the first number by the second and multiply by 100. For example, 45 out of 60 is 45 ÷ 60 × 100 = 75%. The second number (the whole) can’t be 0.",
    },
    {
      question: "How is percentage change calculated?",
      answer:
        "Subtract the starting value from the new value, divide by the starting value, and multiply by 100. Going from 80 to 100 is (100 − 80) ÷ 80 × 100 = 25% higher. A negative answer means a decrease. The starting value can’t be 0.",
    },
    {
      question: "Why is a 25% increase not undone by a 25% decrease?",
      answer:
        "Because each percentage is taken from a different starting number. 100 plus 25% is 125, but 25% of 125 is 31.25, so decreasing 125 by 25% gives 93.75, not 100. To get back to 100 you need a 20% decrease.",
    },
    {
      question: "How are negative numbers handled?",
      answer:
        "They work in every mode. The percentage in “increase or decrease” must be 0 or more because you choose the direction separately. For percentage change, the size of the starting value is used, so going from −50 to −25 is a 50% increase because the value moved up.",
    },
    {
      question: "How many decimal places are shown?",
      answer:
        "Up to 4 decimal places, with trailing zeros removed. The calculation itself isn’t rounded; only the display is. A non-zero answer that is too small to show is written as less than 0.0001.",
    },
  ],
};

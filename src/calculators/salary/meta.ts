import type { CalculatorMeta } from "@/calculators/types";

export const salaryCalculator: CalculatorMeta = {
  slug: "salary-calculator",
  name: "Salary Calculator",
  nameBn: "বেতন ক্যালকুলেটর",
  category: "finance",
  icon: "wallet",
  summary: "Turn your gross salary and deductions into an estimated net, take-home salary.",
  keywords: [
    "salary",
    "take home",
    "take-home salary",
    "net salary",
    "gross salary",
    "gross to net",
    "payslip",
    "monthly salary",
    "yearly salary",
    "বেতন", "beton", "net pay", "in hand salary", "salary after deduction", "monthly to yearly"],
  seo: {
    title: "Salary Calculator BD: Gross to Net Take-Home Pay",
    description:
      "Estimate your net monthly and yearly take-home salary from your gross pay and the deductions you enter. Free, private and works on any phone.",
  },
  addedOn: "2026-10-05",
  related: ["emi-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "What is the difference between gross and net salary?",
      answer:
        "Gross salary is the total before anything is taken off. Net salary, or take-home pay, is what you receive after deductions such as tax, provident fund or loan instalments are subtracted.",
    },
    {
      question: "Does this calculator work out my income tax?",
      answer:
        "No. It does not compute Bangladesh income tax or any other statutory deduction, because rules and rates change and depend on your situation. Enter the amounts from your payslip or employer as deductions.",
    },
    {
      question: "Where do I find my deduction amounts?",
      answer:
        "Your payslip or employer’s HR or accounts team lists them. Enter each one either as a percentage of gross salary or as a fixed Taka amount per month, whichever matches how it is applied.",
    },
    {
      question: "How is the yearly figure calculated?",
      answer:
        "Yearly figures are the monthly figures multiplied by 12, assuming 12 equal months. Festival bonuses, overtime, raises during the year and other irregular payments are not included.",
    },
    {
      question: "What if I know my yearly salary only?",
      answer:
        "Choose “per year” beside the gross salary. It is divided by 12 to get the monthly amount, and percentage deductions are applied to that monthly gross.",
    },
    {
      question: "Why do I get an error about total deductions?",
      answer:
        "Your deductions add up to more than your gross salary, which would make take-home pay negative. Check the percentages and amounts, or remove a row that does not apply.",
    },
  ],
};

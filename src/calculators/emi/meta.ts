import type { CalculatorMeta } from "@/calculators/types";

export const emiCalculator: CalculatorMeta = {
  slug: "emi-calculator",
  name: "EMI / Loan Calculator",
  nameBn: "ইএমআই / লোন ক্যালকুলেটর",
  category: "finance",
  icon: "landmark",
  summary: "Work out your monthly loan instalment (EMI), total interest and total repayment.",
  keywords: [
    "emi",
    "loan",
    "instalment",
    "installment",
    "monthly payment",
    "kisti",
    "কিস্তি",
    "home loan",
    "car loan",
    "personal loan",
    "reducing balance",
    "loan interest",
    "ঋণ", "loan calculator", "bank loan", "interest calculator", "kisti calculator", "loan emi"],
  seo: {
    title: "EMI Calculator Bangladesh: Loan Instalment in Taka",
    description:
      "Calculate your monthly EMI, total interest and total repayment for a home, car or personal loan, with a year-by-year breakdown. Free, no sign-up.",
  },
  addedOn: "2026-10-05",
  related: ["salary-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "What is an EMI?",
      answer:
        "EMI stands for equated monthly instalment: a fixed amount you pay every month until the loan is fully repaid. Each EMI covers that month’s interest first, and the rest reduces the amount you owe.",
    },
    {
      question: "What is the difference between reducing-balance and flat-rate interest?",
      answer:
        "With reducing-balance interest, each month’s interest is charged only on what you still owe, so it shrinks as you repay. With a flat rate, interest is charged on the original loan amount for the whole tenure, so the same quoted percentage costs more in total. This calculator uses the reducing-balance method.",
    },
    {
      question: "Will my bank’s EMI be exactly the same?",
      answer:
        "Not necessarily. Lenders may add processing fees, insurance or other charges, round instalments differently, use flat-rate or floating-rate terms, or change the rate during the loan. This is the standard formula and does not represent any specific bank’s terms. Always check the figures in your loan offer.",
    },
    {
      question: "Why is so much of the early EMI interest?",
      answer:
        "Interest is charged on the outstanding balance, which is highest at the start. As principal is repaid the balance falls, so more of each later EMI goes towards principal. The year-by-year breakdown shows this shift.",
    },
    {
      question: "Does a longer tenure make a loan cheaper?",
      answer:
        "It lowers the monthly EMI but increases the total interest, because you owe money for longer. Try different tenures to see the trade-off between a comfortable monthly amount and the total cost.",
    },
    {
      question: "Can I enter a monthly interest rate?",
      answer:
        "Yes. Choose “per month” beside the rate. A yearly rate is divided by 12 to get the monthly rate. Make sure the unit matches your loan offer, as 1% per month is much higher than 1% per year.",
    },
  ],
};

import type { CalculatorMeta } from "@/calculators/types";

export const discountCalculator: CalculatorMeta = {
  slug: "discount-calculator",
  name: "Discount Calculator",
  nameBn: "ছাড় ক্যালকুলেটর",
  category: "finance",
  icon: "tag",
  summary: "Find the final price after a discount, how much you save, and the true total when two discounts are stacked.",
  keywords: ["discount", "sale", "offer", "price after discount", "percent off", "extra discount", "ছাড়", "অফার"],
  seo: {
    title: "Discount Calculator: Final Price and Savings in ৳",
    description:
      "Enter a price and a discount % to see the final price in Taka and how much you save. Add an extra discount to see the true combined percentage off.",
  },
  addedOn: "2026-10-05",
  related: ["percentage-calculator", "profit-loss-calculator"],
  faqs: [
    {
      question: "How do I calculate the price after a discount?",
      answer:
        "Multiply the price by (1 − discount ÷ 100). For ৳2,500 with 20% off: 2,500 × 0.80 = ৳2,000, so you pay ৳2,000 and save ৳500.",
    },
    {
      question: "What does “extra discount” mean?",
      answer:
        "It is a second percentage taken off the price that is already reduced, for example “20% off, plus an extra 10% off”. The calculator applies it to the discounted price, not to the original.",
    },
    {
      question: "Why are 20% and an extra 10% off not 30% off?",
      answer:
        "The second 10% is worked out on the lower price. On ৳1,000, 20% off leaves ৳800, and 10% of ৳800 is ৳80, not ৳100. You pay ৳720, so the total discount is 28%.",
    },
    {
      question: "Does the order of two stacked discounts matter?",
      answer:
        "No. Each one multiplies the price by a factor, and multiplication gives the same result in either order. 10% then 20% off also leaves ৳720 on ৳1,000.",
    },
    {
      question: "How are paisa shown?",
      answer:
        "Amounts are rounded to the nearest paisa. If an amount is a whole number of Taka, it is shown without paisa (৳800); otherwise it is shown with two decimals (৳849.15).",
    },
    {
      question: "Can I calculate the original price from a sale price?",
      answer:
        "Not with this calculator. To work backwards, use the “Find the whole” option in the Percentage Calculator: a price after 20% off is 80% of the original.",
    },
  ],
};

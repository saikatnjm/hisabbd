import type { CalculatorMeta } from "@/calculators/types";

export const profitLossCalculator: CalculatorMeta = {
  slug: "profit-loss-calculator",
  name: "Profit and Loss Calculator",
  nameBn: "লাভ-ক্ষতি ক্যালকুলেটর",
  category: "finance",
  icon: "trending",
  summary: "Find your profit or loss in Taka from the cost and selling price, with profit percentage and margin.",
  keywords: ["profit", "loss", "profit and loss", "profit margin", "margin", "markup", "break-even", "selling price", "cost price", "লাভ", "ক্ষতি", "লাভ ক্ষতি", "labh", "khoti", "business profit", "mark up", "profit percentage"],
  seo: {
    title: "Profit and Loss Calculator: Amount, % and Margin",
    description:
      "Enter the cost price and selling price to see your profit or loss in Taka, the percentage on cost, and the profit margin on the selling price. Free to use.",
  },
  addedOn: "2026-10-05",
  related: ["discount-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "How do I calculate profit and loss?",
      answer:
        "Subtract the cost price from the selling price. A positive result is a profit, a negative one is a loss, and zero is break-even. Selling at ৳100 something that cost ৳80 is a profit of ৳20.",
    },
    {
      question: "How is the profit percentage calculated?",
      answer:
        "Profit or loss percentage is the profit (or loss) divided by the cost price, times 100. For cost ৳80 and selling price ৳100: 20 ÷ 80 × 100 = 25%. This is the standard figure and is also called markup.",
    },
    {
      question: "What is the difference between profit margin and markup?",
      answer:
        "Both use the same profit but divide by different prices. Markup (the percentage shown on cost) divides by the cost price; margin divides by the selling price. For cost ৳80 and selling price ৳100, the markup is 25% and the margin is 20%. Margin can never reach 100%, while markup can be any size.",
    },
    {
      question: "When is it break-even?",
      answer:
        "When the selling price equals the cost price, to the paisa. Both prices are rounded to the nearest paisa before they are compared, so tiny rounding differences never create a false profit or loss.",
    },
    {
      question: "Why is there no profit margin when the selling price is ৳0?",
      answer:
        "Margin divides by the selling price, and division by zero has no answer. A loss on cost is still shown: giving away an item that cost ৳500 is a ৳500 loss, or 100% of the cost.",
    },
    {
      question: "Does this include other costs like delivery, rent or tax?",
      answer:
        "No. It compares only the two prices you enter. If you want the result to include delivery, packaging or other expenses, add them to the cost price first.",
    },
  ],
};

import type { CalculatorMeta } from "@/calculators/types";

export const profitLossCalculator: CalculatorMeta = {
  slug: "profit-loss-calculator",
  name: "Profit and Loss Calculator",
  nameBn: "লাভ-ক্ষতি ক্যালকুলেটর",
  category: "finance",
  icon: "trending",
  summary: "Find your profit or loss in Taka from the cost and selling price, with profit percentage and margin.",
  summaryBn: "ক্রয়মূল্য ও বিক্রয়মূল্য থেকে টাকায় লাভ-ক্ষতি, লাভের শতাংশ ও মার্জিন বের করুন।",
  keywords: ["profit", "loss", "profit and loss", "profit margin", "margin", "markup", "break-even", "selling price", "cost price", "লাভ", "ক্ষতি", "লাভ ক্ষতি", "labh", "khoti", "business profit", "mark up", "profit percentage"],
  seo: {
    title: "Profit and Loss Calculator: Amount, % and Margin",
    description:
      "Enter the cost price and selling price to see your profit or loss in Taka, the percentage on cost, and the profit margin on the selling price. Free to use.",
  },
  seoBn: {
    title: "লাভ-ক্ষতি ক্যালকুলেটর: টাকায় লাভ, % ও মার্জিন",
    description:
      "ক্রয়মূল্য ও বিক্রয়মূল্য দিলেই টাকায় লাভ বা ক্ষতি, খরচের ওপর লাভের শতাংশ আর বিক্রয়মূল্যের ওপর মার্জিন দেখুন। সম্পূর্ণ ফ্রি।",
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
  faqsBn: [
    {
      question: "লাভ-ক্ষতি কীভাবে হিসাব করব?",
      answer:
        "বিক্রয়মূল্য থেকে ক্রয়মূল্য বাদ দিন। ধনাত্মক হলে লাভ, ঋণাত্মক হলে ক্ষতি, আর শূন্য হলে সমান সমান। ৳80-তে কেনা জিনিস ৳100-তে বিক্রি করলে লাভ ৳20।",
    },
    {
      question: "লাভের শতাংশ কীভাবে হিসাব হয়?",
      answer:
        "লাভ (বা ক্ষতি)-কে ক্রয়মূল্য দিয়ে ভাগ করে 100 দিয়ে গুণ করুন। ক্রয়মূল্য ৳80 আর বিক্রয়মূল্য ৳100 হলে: 20 ÷ 80 × 100 = 25%। এটিই প্রচলিত সংখ্যা, একে মার্কআপও বলে।",
    },
    {
      question: "লাভের মার্জিন আর মার্কআপের পার্থক্য কী?",
      answer:
        "দুটোই একই লাভ ব্যবহার করে, কিন্তু ভাগ হয় আলাদা দামে। মার্কআপ (ক্রয়মূল্যের ওপর দেখানো শতাংশ) ভাগ হয় ক্রয়মূল্য দিয়ে; মার্জিন ভাগ হয় বিক্রয়মূল্য দিয়ে। ক্রয়মূল্য ৳80 ও বিক্রয়মূল্য ৳100 হলে মার্কআপ 25%, মার্জিন 20%। মার্জিন কখনো 100% ছুঁতে পারে না, মার্কআপ যত খুশি হতে পারে।",
    },
    {
      question: "কখন সমান সমান (ব্রেক-ইভেন) হয়?",
      answer:
        "যখন বিক্রয়মূল্য আর ক্রয়মূল্য পয়সা পর্যন্ত সমান। তুলনার আগে দুটো দামই নিকটতম পয়সায় রাউন্ড করা হয়, তাই রাউন্ডিংয়ের সামান্য পার্থক্য কখনো ভুয়া লাভ বা ক্ষতি তৈরি করে না।",
    },
    {
      question: "বিক্রয়মূল্য ৳0 হলে লাভের মার্জিন দেখা যায় না কেন?",
      answer:
        "মার্জিন ভাগ হয় বিক্রয়মূল্য দিয়ে, আর শূন্য দিয়ে ভাগের কোনো উত্তর নেই। ক্রয়মূল্যের ওপর ক্ষতি তখনো দেখানো হয়: ৳500-এর জিনিস বিনামূল্যে দিলে ক্ষতি ৳500, অর্থাৎ ক্রয়মূল্যের 100%।",
    },
    {
      question: "ডেলিভারি, ভাড়া বা ট্যাক্সের মতো খরচ কি এতে ধরা হয়?",
      answer:
        "না। এটি শুধু আপনার দেওয়া দুটি দাম তুলনা করে। ডেলিভারি, প্যাকেজিং বা অন্য খরচ ধরতে চাইলে আগে সেগুলো ক্রয়মূল্যের সাথে যোগ করে নিন।",
    },
  ],
};

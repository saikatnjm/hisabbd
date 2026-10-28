import type { CalculatorMeta } from "@/calculators/types";

export const discountCalculator: CalculatorMeta = {
  slug: "discount-calculator",
  name: "Discount Calculator",
  nameBn: "ছাড় ক্যালকুলেটর",
  category: "finance",
  icon: "tag",
  summary: "Find the final price after a discount, how much you save, and the true total when two discounts are stacked.",
  summaryBn: "ডিসকাউন্টের পর দাম, কত টাকা বাঁচল, আর দুটি ছাড় একসাথে হলে আসল মোট ছাড় বের করুন।",
  keywords: ["discount", "sale", "offer", "price after discount", "percent off", "extra discount", "ছাড়", "অফার", "sale price", "price after offer", "chhar", "discount percentage", "offer price"],
  seo: {
    title: "Discount Calculator: Final Price and Savings in ৳",
    description:
      "Enter a price and a discount % to see the final price in Taka and how much you save. Add an extra discount to see the true combined percentage off.",
  },
  seoBn: {
    title: "ডিসকাউন্ট ক্যালকুলেটর: ছাড়ের পর দাম ও সাশ্রয়",
    description:
      "দাম আর ডিসকাউন্ট % দিলেই টাকায় চূড়ান্ত দাম ও কত বাঁচল তা দেখুন। অতিরিক্ত ছাড় যোগ করে দুটি ছাড়ের আসল সম্মিলিত শতাংশও জানুন।",
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
  faqsBn: [
    {
      question: "ছাড়ের পরের দাম কীভাবে হিসাব করব?",
      answer:
        "দামকে (1 − ডিসকাউন্ট ÷ 100) দিয়ে গুণ করুন। ৳2,500-এ 20% ছাড়: 2,500 × 0.80 = ৳2,000 — অর্থাৎ দেবেন ৳2,000, সাশ্রয় ৳500।",
    },
    {
      question: "“অতিরিক্ত ছাড়” মানে কী?",
      answer:
        "এটি দ্বিতীয় একটি শতাংশ, যা আগে থেকেই কমে আসা দামের ওপর ধরা হয় — যেমন “20% ছাড়, সাথে আরও 10% ছাড়”। ক্যালকুলেটর এটি ছাড়ের পরের দামের ওপর ধরে, আসল দামের ওপর নয়।",
    },
    {
      question: "20% আর অতিরিক্ত 10% ছাড় মিলে 30% হয় না কেন?",
      answer:
        "দ্বিতীয় 10% ধরা হয় কম দামের ওপর। ৳1,000-এ 20% ছাড়ের পর থাকে ৳800, আর ৳800-এর 10% হলো ৳80, ৳100 নয়। আপনি দেন ৳720, তাই মোট ছাড় 28%।",
    },
    {
      question: "দুটি ছাড়ের ক্রমে কি কিছু যায় আসে?",
      answer:
        "না। প্রতিটি ছাড় দামকে একটি গুণনীয়ক দিয়ে গুণ করে, আর গুণের ফল ক্রম বদলালেও একই থাকে। ৳1,000-এ 10% তারপর 20% ধরলেও সেই ৳720-ই থাকে।",
    },
    {
      question: "পয়সা কীভাবে দেখানো হয়?",
      answer:
        "অঙ্কগুলো নিকটতম পয়সায় রাউন্ড করা হয়। পুরো টাকার অঙ্ক পয়সা ছাড়া (৳800), বাকিগুলো দুই দশমিকসহ (৳849.15) দেখানো হয়।",
    },
    {
      question: "বিক্রির দাম থেকে কি আসল দাম বের করা যাবে?",
      answer:
        "এই ক্যালকুলেটরে নয়। উল্টো দিকে হিসাব করতে শতকরা ক্যালকুলেটরের “পূর্ণ সংখ্যা খোঁজা” অপশনটি ব্যবহার করুন: 20% ছাড়ের পরের দাম আসল দামের 80%।",
    },
  ],
};

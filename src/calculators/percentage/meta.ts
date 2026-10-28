import type { CalculatorMeta } from "@/calculators/types";

export const percentageCalculator: CalculatorMeta = {
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  nameBn: "শতকরা ক্যালকুলেটর",
  category: "everyday",
  icon: "percent",
  summary: "Work out a percentage of a number, a percentage change, or increase and decrease a number by a percentage.",
  summaryBn: "কোনো সংখ্যার শতকরা, শতকরা পরিবর্তন, বা শতকরা হারে বাড়ানো-কমানোর হিসাব করুন।",
  keywords: ["percentage", "percent", "percent of", "percentage change", "percentage increase", "percentage decrease", "%", "শতকরা", "শতাংশ", "percent calculator", "marks percentage", "shotokora", "% calculator", "increase decrease"],
  seo: {
    title: "Percentage Calculator: Percent of, Change and More",
    description:
      "Find a percent of a number, what percent one number is of another, percentage change, or increase or decrease a number by a percent. Working shown.",
  },
  seoBn: {
    title: "শতকরা ক্যালকুলেটর: পার্সেন্টেজের সব হিসাব",
    description:
      "কোনো সংখ্যার কত শতাংশ, এক সংখ্যা আরেকটির কত শতাংশ, শতকরা পরিবর্তন, বা শতকরা হারে বাড়ানো-কমানো — ধাপে ধাপে সমাধানসহ।",
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
  faqsBn: [
    {
      question: "কোনো সংখ্যার শতকরা কীভাবে বের করব?",
      answer:
        "শতকরা হারকে 100 দিয়ে ভাগ করে সংখ্যাটি দিয়ে গুণ করুন। যেমন, 2,000-এর 15% হলো 15 ÷ 100 × 2,000 = 300।",
    },
    {
      question: "এক সংখ্যা আরেক সংখ্যার কত শতাংশ, তা কীভাবে বের করব?",
      answer:
        "প্রথম সংখ্যাকে দ্বিতীয়টি দিয়ে ভাগ করে 100 দিয়ে গুণ করুন। যেমন, 60-এর মধ্যে 45 হলো 45 ÷ 60 × 100 = 75%। দ্বিতীয় সংখ্যাটি (পূর্ণ সংখ্যা) 0 হতে পারে না।",
    },
    {
      question: "শতকরা পরিবর্তন কীভাবে হিসাব হয়?",
      answer:
        "নতুন মান থেকে শুরুর মান বাদ দিন, শুরুর মান দিয়ে ভাগ করুন, তারপর 100 দিয়ে গুণ করুন। 80 থেকে 100-তে যাওয়া মানে (100 − 80) ÷ 80 × 100 = 25% বৃদ্ধি। ঋণাত্মক উত্তর মানে হ্রাস। শুরুর মান 0 হতে পারে না।",
    },
    {
      question: "25% বাড়ার পর 25% কমালে আগের সংখ্যায় ফেরা যায় না কেন?",
      answer:
        "কারণ দুবার শতকরাটা আলাদা সংখ্যার ওপর ধরা হয়। 100-এর সাথে 25% যোগ করলে 125, কিন্তু 125-এর 25% হলো 31.25 — তাই 125-কে 25% কমালে হয় 93.75, 100 নয়। 100-তে ফিরতে 20% কমাতে হবে।",
    },
    {
      question: "ঋণাত্মক সংখ্যা কীভাবে ধরা হয়?",
      answer:
        "সব মোডেই চলে। “বাড়ানো বা কমানো”-তে শতকরা হার 0 বা তার বেশি হতে হবে, কারণ দিকটা আপনি আলাদা করে বেছে নেন। শতকরা পরিবর্তনে শুরুর মানের পরম মান ধরা হয়, তাই −50 থেকে −25 মানে 50% বৃদ্ধি — মানটা ওপরের দিকেই গেছে।",
    },
    {
      question: "কত দশমিক পর্যন্ত দেখানো হয়?",
      answer:
        "সর্বোচ্চ ৪ দশমিক পর্যন্ত, শেষের শূন্যগুলো বাদ দিয়ে। মূল হিসাবে কোনো রাউন্ডিং হয় না; শুধু দেখানোর সময় হয়। শূন্য নয় অথচ দেখানোর মতো বড় নয় — এমন উত্তর 0.0001-এর কম হিসেবে লেখা হয়।",
    },
  ],
};

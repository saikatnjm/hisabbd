import type { GuideMeta } from "@/guides/types";

export const discountCalculationGuide: GuideMeta = {
  slug: "discount-calculation",
  title: "How to Calculate a Discount: Sale Price, Savings and Stacked Offers",
  titleBn: "ডিসকাউন্ট কিভাবে হিসাব করে: ছাড়ের পর দাম, সাশ্রয় আর 20% + 10% কেন 30% নয়",
  summary:
    "The formulas for the price after a discount and the amount you save, why 20% plus an extra 10% is only 28% off, and how to find the original price, with worked examples.",
  summaryBn:
    "ছাড়ের পর দাম আর কত টাকা বাঁচল তা বের করার সূত্র, 20% আর অতিরিক্ত 10% ছাড় মিলে কেন মাত্র 28%, আর ছাড়ের দাম থেকে আসল দাম বের করার নিয়ম, উদাহরণসহ।",
  answer:
    "Price after discount = original price × (1 − discount ÷ 100), so ৳2,500 with 20% off is ৳2,000, a saving of ৳500. Two discounts multiply rather than add: 20% plus an extra 10% is 28% off, not 30%.",
  answerBn:
    "ছাড়ের পর দাম = আসল দাম × (1 − ছাড় ÷ 100), তাই ৳2,500-এ 20% ছাড়ে দাম ৳2,000, সাশ্রয় ৳500। দুটো ছাড় যোগ হয় না, গুণ হয়: 20% আর তার ওপর আরও 10% মানে মোট 28% ছাড়, 30% নয়।",
  seo: {
    title: "How to Calculate Discount: 20% Off and Stacked Offers",
    description:
      "How to calculate a discount: the price after 20% off, how much you save, why 20% + 10% off is 28% not 30%, and finding the original price. Worked examples.",
  },
  seoBn: {
    title: "ডিসকাউন্ট কিভাবে হিসাব করে: ছাড় হিসাবের সহজ নিয়ম",
    description:
      "ছাড় হিসাবের নিয়ম: 20% ছাড়ের পর দাম কত, কত টাকা বাঁচল, 20% + 10% ছাড় কেন 30% নয়, আর ছাড়ের দাম থেকে আসল দাম বের করা — টাকার উদাহরণসহ।",
  },
  calculator: "discount-calculator",
  publishedOn: "2026-10-29",
};

import type { GuideMeta } from "@/guides/types";

export const vatCalculationGuide: GuideMeta = {
  slug: "vat-calculation",
  title: "How to Calculate VAT in Bangladesh: Add and Remove 15%",
  titleBn: "ভ্যাট কীভাবে হিসাব করে: 15% ভ্যাট যোগ ও বাদ দেওয়ার নিয়ম",
  summary:
    "The formulas for adding VAT to a price and taking it out of a VAT-inclusive price, why 15% of the total is the wrong answer, and quick shortcuts, with worked examples.",
  summaryBn:
    "দামের ওপর ভ্যাট যোগ আর ভ্যাটসহ দাম থেকে ভ্যাট বাদ দেওয়ার সূত্র, মোট দামের 15% ধরা কেন ভুল, আর দ্রুত হিসাবের সহজ কৌশল, উদাহরণসহ।",
  answer:
    "To add VAT, multiply by (1 + rate ÷ 100): ৳1,000 plus 15% VAT is ৳1,150. To take VAT out of an inclusive price, use price × rate ÷ (100 + rate): ৳1,150 includes ৳150 VAT. Taking 15% of the inclusive total is the common mistake; it gives ৳172.50.",
  answerBn:
    "ভ্যাট যোগ করতে দামকে (1 + হার ÷ 100) দিয়ে গুণ করুন: ৳1,000-এ 15% ভ্যাট যোগ করলে ৳1,150। ভ্যাটসহ দাম থেকে ভ্যাট বের করতে দাম × হার ÷ (100 + হার): ৳1,150-এ ভ্যাট ৳150। মোট দামের 15% ধরা সাধারণ ভুল; তাতে আসে ৳172.50।",
  seo: {
    title: "VAT Calculation Formula Bangladesh: Add or Remove 15%",
    description:
      "How VAT is calculated in Bangladesh: add 15% to a price, find the VAT inside a VAT-inclusive price, avoid the 15%-of-total mistake. Worked examples.",
  },
  seoBn: {
    title: "ভ্যাট কিভাবে হিসাব করে: 15% ভ্যাট যোগ ও বাদের সূত্র",
    description:
      "ভ্যাট কীভাবে হিসাব করে: দামের ওপর 15% ভ্যাট যোগ, ভ্যাটসহ দাম থেকে ভ্যাট বের করা, আর মোট দামের 15% ধরার সাধারণ ভুল — টাকা-পয়সার উদাহরণসহ।",
  },
  calculator: "vat-calculator",
  publishedOn: "2026-10-29",
};

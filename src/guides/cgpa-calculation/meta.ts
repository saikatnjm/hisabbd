import type { GuideMeta } from "@/guides/types";

export const cgpaCalculationGuide: GuideMeta = {
  slug: "cgpa-calculation",
  title: "How CGPA Is Calculated: Credit-Weighted Average Explained",
  titleBn: "সিজিপিএ হিসাবের নিয়ম: সেমিস্টার জিপিএ ও ক্রেডিট দিয়ে",
  summary:
    "How universities combine semester GPAs into a CGPA: the credit-weighted formula, the UGC 4.00 scale, rounding versus truncation, with a worked example.",
  summaryBn:
    "সেমিস্টারের জিপিএ থেকে সিজিপিএ কীভাবে আসে: ক্রেডিট অনুযায়ী ভারিত গড়ের সূত্র, ইউজিসির ৪.০০ স্কেল, রাউন্ডিং আর কেটে ফেলার পার্থক্য, উদাহরণসহ।",
  answer:
    "CGPA = Σ (semester GPA × semester credits) ÷ total credits: a credit-weighted average, not a plain average of your GPAs. For example, 3.50 over 18 credits and 3.80 over 12 credits give (63 + 45.6) ÷ 30 = 3.62, while a plain average would wrongly give 3.65.",
  answerBn:
    "সিজিপিএ = Σ (সেমিস্টারের জিপিএ × ক্রেডিট) ÷ মোট ক্রেডিট, অর্থাৎ ক্রেডিট দিয়ে ভারিত গড়, জিপিএগুলোর সাধারণ গড় নয়। যেমন 18 ক্রেডিটে 3.50 আর 12 ক্রেডিটে 3.80 হলে (63 + 45.6) ÷ 30 = 3.62; সাধারণ গড় করলে ভুল করে আসত 3.65।",
  seo: {
    title: "How CGPA Is Calculated: Credit-Weighted Formula",
    description:
      "Learn how CGPA is calculated from semester GPAs and credits: the weighted formula, the UGC 4.00 scale, rounding vs truncation and common mistakes.",
  },
  seoBn: {
    title: "সিজিপিএ হিসাবের নিয়ম: সেমিস্টার জিপিএ থেকে সিজিপিএ",
    description:
      "সেমিস্টার জিপিএ ও ক্রেডিট দিয়ে সিজিপিএ হিসাবের নিয়ম: ভারিত গড়ের সূত্র, ইউজিসির ৪.০০ স্কেল, রাউন্ডিং বনাম কেটে ফেলা আর সাধারণ ভুল — উদাহরণসহ।",
  },
  calculator: "cgpa-calculator",
  publishedOn: "2026-10-28",
};

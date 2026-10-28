import type { CalculatorMeta } from "@/calculators/types";

export const gpaCalculator: CalculatorMeta = {
  slug: "gpa-calculator",
  name: "GPA Calculator",
  nameBn: "জিপিএ ক্যালকুলেটর",
  category: "education",
  icon: "graduation",
  summary: "Work out your semester GPA from letter grades and credits on the Bangladesh university 4.00 scale.",
  summaryBn: "বাংলাদেশের বিশ্ববিদ্যালয়ের ৪.০০ স্কেলে লেটার গ্রেড ও ক্রেডিট থেকে সেমিস্টার জিপিএ বের করুন।",
  keywords: [
    "gpa",
    "grade point average",
    "result",
    "university",
    "semester result",
    "grade point",
    "credit hour",
    "ugc grading",
    "জিপিএ",
    "গ্রেড পয়েন্ট",
    "রেজাল্ট", "grade calculator", "result calculator", "university gpa", "gpa calculator bd", "semester gpa"],
  seo: {
    title: "GPA Calculator Bangladesh: UGC 4.00 Grading Scale",
    description:
      "Calculate your semester GPA from letter grades and credits on the Bangladesh university 4.00 scale (A+ to F). Decimal credits supported. Free and fast.",
  },
  seoBn: {
    title: "জিপিএ ক্যালকুলেটর বাংলাদেশ: ইউজিসি ৪.০০ স্কেল",
    description:
      "লেটার গ্রেড (A+ থেকে F) ও ক্রেডিট থেকে বাংলাদেশের বিশ্ববিদ্যালয়ের ৪.০০ স্কেলে সেমিস্টার জিপিএ হিসাব করুন। দশমিক ক্রেডিটও চলে। ফ্রি ও দ্রুত।",
  },
  addedOn: "2026-10-05",
  related: ["cgpa-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "How is GPA calculated?",
      answer:
        "Multiply each course’s grade point by its credits, add those up, and divide by the total credits. A 3-credit A (3.75) is worth 11.25 grade points, and a 3-credit B+ (3.25) is worth 9.75, so together they give 21 ÷ 6 = 3.50.",
    },
    {
      question: "Why do credits matter?",
      answer:
        "A course with more credits has more weight. A 4.00 in a 1-credit lab moves your GPA much less than a 4.00 in a 4-credit theory course, so the same grades in different courses can give a different GPA.",
    },
    {
      question: "Does an F count in my GPA?",
      answer:
        "Yes. An F adds 0 grade points but its credits are still part of the total, which pulls the GPA down. This calculator counts every course you enter, so if your university replaces an F after a retake, enter only the grade that counts.",
    },
    {
      question: "Which grading scale does this use?",
      answer:
        "The uniform 4.00 scale published by Bangladesh’s University Grants Commission, which many universities use: A+ = 4.00, A = 3.75, A- = 3.50, B+ = 3.25, B = 3.00, B- = 2.75, C+ = 2.50, C = 2.25, D = 2.00, F = 0.00. Some universities use different cut-offs or grades, so check your own handbook.",
    },
    {
      question: "Why is my official GPA a little different?",
      answer:
        "Usually rounding. This calculator rounds to 2 decimals (half up), while some institutions simply cut off the extra digits. A GPA of 3.428… shows as 3.43 here but 3.42 if truncated. Your university’s published result is the one that counts.",
    },
    {
      question: "Can I use it for SSC or HSC results?",
      answer:
        "No. School and college (SSC/HSC) GPA follows its own rules, so a simple credit-weighted average would be misleading there. This calculator is for university-style letter grades and credits.",
    },
  ],
  faqsBn: [
    {
      question: "জিপিএ কীভাবে হিসাব হয়?",
      answer:
        "প্রতিটি কোর্সের গ্রেড পয়েন্টকে তার ক্রেডিট দিয়ে গুণ করুন, সব যোগ করুন, তারপর মোট ক্রেডিট দিয়ে ভাগ করুন। 3 ক্রেডিটের A (3.75) মানে 11.25 গ্রেড পয়েন্ট, আর 3 ক্রেডিটের B+ (3.25) মানে 9.75 — দুটো মিলে 21 ÷ 6 = 3.50।",
    },
    {
      question: "ক্রেডিট কেন গুরুত্বপূর্ণ?",
      answer:
        "বেশি ক্রেডিটের কোর্সের ওজনও বেশি। 1 ক্রেডিটের ল্যাবে 4.00 পাওয়া আপনার জিপিএ যতটা বদলায়, 4 ক্রেডিটের থিওরি কোর্সে 4.00 তার চেয়ে অনেক বেশি বদলায় — তাই একই গ্রেড ভিন্ন কোর্সে ভিন্ন জিপিএ দিতে পারে।",
    },
    {
      question: "F কি জিপিএ-তে ধরা হয়?",
      answer:
        "হ্যাঁ। F-এ গ্রেড পয়েন্ট যোগ হয় 0, কিন্তু ক্রেডিট মোটের মধ্যে থেকে যায়, যা জিপিএ টেনে নামায়। এই ক্যালকুলেটর আপনার দেওয়া প্রতিটি কোর্সই গোনে — রিটেকের পর আপনার বিশ্ববিদ্যালয় যদি F-টা বদলে দেয়, তাহলে শুধু যে গ্রেডটি গণনায় ধরা হয় সেটিই লিখুন।",
    },
    {
      question: "এটি কোন গ্রেডিং স্কেল ব্যবহার করে?",
      answer:
        "বাংলাদেশের বিশ্ববিদ্যালয় মঞ্জুরি কমিশনের প্রকাশিত অভিন্ন ৪.০০ স্কেল, যা অনেক বিশ্ববিদ্যালয় ব্যবহার করে: A+ = 4.00, A = 3.75, A- = 3.50, B+ = 3.25, B = 3.00, B- = 2.75, C+ = 2.50, C = 2.25, D = 2.00, F = 0.00। কিছু বিশ্ববিদ্যালয়ের সীমারেখা বা গ্রেড ভিন্ন, তাই নিজের হ্যান্ডবুক দেখে নিন।",
    },
    {
      question: "আমার আনুষ্ঠানিক জিপিএ একটু আলাদা কেন?",
      answer:
        "সাধারণত রাউন্ডিংয়ের কারণে। এই ক্যালকুলেটর ২ দশমিকে রাউন্ড করে (হাফ-আপ), আর কিছু প্রতিষ্ঠান বাড়তি অঙ্ক কেটে ফেলে। 3.428… এখানে 3.43 দেখায়, কেটে ফেললে 3.42। আপনার বিশ্ববিদ্যালয়ের প্রকাশিত ফলটিই চূড়ান্ত।",
    },
    {
      question: "এসএসসি বা এইচএসসি ফলাফলের জন্য কি ব্যবহার করা যাবে?",
      answer:
        "না। স্কুল-কলেজের (এসএসসি/এইচএসসি) জিপিএ-র নিজস্ব নিয়ম আছে — যেমন ঐচ্ছিক/চতুর্থ বিষয় — তাই সাধারণ ক্রেডিট-ওজনের গড় সেখানে বিভ্রান্তিকর হতো। এই ক্যালকুলেটর বিশ্ববিদ্যালয়ের লেটার গ্রেড ও ক্রেডিটের জন্য।",
    },
  ],
};

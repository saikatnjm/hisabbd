import type { CalculatorMeta } from "@/calculators/types";

export const cgpaCalculator: CalculatorMeta = {
  slug: "cgpa-calculator",
  name: "CGPA Calculator",
  nameBn: "সিজিপিএ ক্যালকুলেটর",
  category: "education",
  icon: "book",
  summary: "Combine your semester GPAs and credits into one cumulative GPA (CGPA), on a 4.00 or 5.00 scale.",
  summaryBn: "সেমিস্টারের জিপিএ ও ক্রেডিট মিলিয়ে ৪.০০ বা ৫.০০ স্কেলে সিজিপিএ বের করুন।",
  keywords: [
    "cgpa",
    "cumulative gpa",
    "cumulative grade point average",
    "gpa to cgpa",
    "semester result",
    "university",
    "credit hour",
    "সিজিপিএ",
    "জিপিএ",
    "রেজাল্ট", "cgpa calculator bd", "final cgpa", "total cgpa", "semester cgpa"],
  seo: {
    title: "CGPA Calculator Bangladesh: Combine Semester GPAs",
    description:
      "Calculate your CGPA from semester GPAs and credits, weighted correctly, on a 4.00 or 5.00 scale. Add a new semester to your current CGPA. Free and fast.",
  },
  seoBn: {
    title: "সিজিপিএ ক্যালকুলেটর: সেমিস্টার জিপিএ থেকে সিজিপিএ",
    description:
      "প্রতি সেমিস্টারের জিপিএ ও ক্রেডিট দিয়ে সঠিক ওজনে সিজিপিএ হিসাব করুন, ৪.০০ বা ৫.০০ স্কেলে। বর্তমান সিজিপিএ-র সাথে নতুন সেমিস্টারও যোগ করতে পারবেন।",
  },
  addedOn: "2026-10-05",
  related: ["gpa-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "How is CGPA calculated?",
      answer:
        "Multiply each semester’s GPA by the credits you completed in it, add those up, and divide by the total credits. Two semesters of 3.00 (15 credits) and 4.00 (15 credits) give (45 + 60) ÷ 30 = 3.50.",
    },
    {
      question: "Why not just average my semester GPAs?",
      answer:
        "Because semesters with more credits should count for more. A plain average only matches the real CGPA when every semester has the same credits. With 3.80 on 9 credits and 3.00 on 18 credits, the plain average is 3.40 but the correct CGPA is 3.27.",
    },
    {
      question: "How do I add a new semester to my current CGPA?",
      answer:
        "Enter your current CGPA and the total credits you have completed as one row, then add the new semester’s GPA and credits as another row. The result is the same as entering every past semester separately.",
    },
    {
      question: "Should I use the 4.00 or 5.00 scale?",
      answer:
        "Use the scale your university reports your results on. The scale only sets the highest GPA you can enter; the formula is the same. Check your result sheet or handbook if you are not sure.",
    },
    {
      question: "How do I handle a retaken course?",
      answer:
        "It depends on your university’s policy: some replace the old grade, others average both attempts. This calculator uses whatever semester GPAs and credits you enter, so enter figures that follow your university’s rule.",
    },
    {
      question: "Why is my official CGPA slightly different?",
      answer:
        "Most often rounding. This calculator rounds to 2 decimals (half up), while some institutions truncate. Your university’s published CGPA is the official one.",
    },
  ],
  faqsBn: [
    {
      question: "সিজিপিএ কীভাবে হিসাব হয়?",
      answer:
        "প্রতিটি সেমিস্টারের জিপিএ-কে সেই সেমিস্টারে সম্পন্ন ক্রেডিট দিয়ে গুণ করুন, সব যোগ করুন, তারপর মোট ক্রেডিট দিয়ে ভাগ করুন। 3.00 (15 ক্রেডিট) আর 4.00 (15 ক্রেডিট)-এর দুটি সেমিস্টার দেয় (45 + 60) ÷ 30 = 3.50।",
    },
    {
      question: "শুধু সেমিস্টারের জিপিএ-গুলোর গড় করলেই হয় না কেন?",
      answer:
        "কারণ বেশি ক্রেডিটের সেমিস্টারের ওজনও বেশি হওয়া উচিত। সব সেমিস্টারের ক্রেডিট সমান হলেই কেবল সাধারণ গড় আসল সিজিপিএ-র সাথে মেলে। 9 ক্রেডিটে 3.80 আর 18 ক্রেডিটে 3.00 হলে সাধারণ গড় 3.40, কিন্তু সঠিক সিজিপিএ 3.27।",
    },
    {
      question: "বর্তমান সিজিপিএ-র সাথে নতুন সেমিস্টার কীভাবে যোগ করব?",
      answer:
        "বর্তমান সিজিপিএ আর এ পর্যন্ত সম্পন্ন মোট ক্রেডিট একটি সারিতে লিখুন, তারপর নতুন সেমিস্টারের জিপিএ ও ক্রেডিট আরেক সারিতে। প্রতিটি পুরোনো সেমিস্টার আলাদা করে লিখলে যা আসত, ঠিক তা-ই আসবে।",
    },
    {
      question: "৪.০০ না ৫.০০ — কোন স্কেল ব্যবহার করব?",
      answer:
        "আপনার বিশ্ববিদ্যালয় যে স্কেলে ফল দেয়, সেটিই। স্কেল শুধু সর্বোচ্চ কত জিপিএ লেখা যাবে তা ঠিক করে; সূত্র একই। নিশ্চিত না হলে রেজাল্ট শিট বা হ্যান্ডবুক দেখুন।",
    },
    {
      question: "রিটেক করা কোর্স কীভাবে ধরব?",
      answer:
        "এটা আপনার বিশ্ববিদ্যালয়ের নীতির ওপর নির্ভর করে: কেউ পুরোনো গ্রেড বদলে দেয়, কেউ দুই চেষ্টার গড় নেয়। এই ক্যালকুলেটর আপনার দেওয়া সেমিস্টার জিপিএ ও ক্রেডিটই ব্যবহার করে, তাই আপনার বিশ্ববিদ্যালয়ের নিয়ম মেনে সংখ্যাগুলো দিন।",
    },
    {
      question: "আমার আনুষ্ঠানিক সিজিপিএ সামান্য আলাদা কেন?",
      answer:
        "বেশিরভাগ ক্ষেত্রে রাউন্ডিং। এই ক্যালকুলেটর ২ দশমিকে রাউন্ড করে (হাফ-আপ), কিছু প্রতিষ্ঠান কেটে ফেলে। বিশ্ববিদ্যালয়ের প্রকাশিত সিজিপিএ-ই আনুষ্ঠানিক।",
    },
  ],
};

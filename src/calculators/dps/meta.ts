import type { CalculatorMeta } from "@/calculators/types";

export const dpsCalculator: CalculatorMeta = {
  slug: "dps-calculator",
  name: "DPS Calculator",
  nameBn: "ডিপিএস ক্যালকুলেটর",
  category: "finance",
  icon: "piggy-bank",
  summary:
    "Find out what a monthly DPS grows to: total deposits, maturity value, interest, source tax, excise duty and the amount you receive, year by year.",
  summaryBn:
    "মাসিক ডিপিএস মেয়াদ শেষে কত হবে জানুন: মোট জমা, মেয়াদ শেষের অঙ্ক, সুদ, উৎসে কর, আবগারি শুল্ক ও হাতে পাওয়া টাকা, বছরভিত্তিক হিসাবসহ।",
  keywords: [
    "dps calculator",
    "dps calculator bd",
    "dps maturity calculator",
    "dps",
    "deposit pension scheme",
    "monthly deposit scheme",
    "monthly savings scheme",
    "recurring deposit",
    "dps interest",
    "dps profit",
    "savings scheme",
    "ডিপিএস",
    "ডিপিএস হিসাব",
    "ডিপিএস ক্যালকুলেটর",
    "মাসিক সঞ্চয় স্কিম",
    "মাসিক সঞ্চয় স্কিম হিসাব",
    "মাসিক সঞ্চয়",
    "ডিপোজিট পেনশন স্কিম",
    "ডিপিএসের সুদ",
    "উৎসে কর",
    "আবগারি শুল্ক",
    "dps hisab",
    "dps er hisab",
    "masik sonchoy",
  ],
  seo: {
    title: "DPS Calculator BD: Monthly Deposit Maturity & Interest",
    description:
      "See what your monthly DPS grows to: maturity value, interest, source tax and excise in Taka, with a year-by-year table. Use your bank's rate. Free.",
  },
  seoBn: {
    title: "ডিপিএস হিসাব: মাসিক সঞ্চয় স্কিমের মেয়াদ শেষের ক্যালকুলেটর",
    description:
      "মাসিক ডিপিএস মেয়াদ শেষে কত হবে: মোট জমা, সুদ, উৎসে কর ও আবগারি শুল্ক বাদে হাতে কত পাবেন, বছরভিত্তিক টেবিলসহ। ব্যাংকের হার দিন। ফ্রি।",
  },
  addedOn: "2026-10-28",
  updatedOn: "2026-10-28",
  related: ["fdr-calculator", "sanchayapatra-calculator", "emi-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "How is DPS maturity calculated?",
      answer:
        "With a deposit at the start of each month and interest compounded monthly, maturity = A × ((1 + i)^n − 1) ÷ i × (1 + i), where A is the instalment, i the yearly rate ÷ 12 ÷ 100 and n the number of months. ৳5,000 a month at 9% for 5 years grows to about ৳3,79,949 before tax.",
    },
    {
      question: "How much will a ৳5,000 DPS give after 5 years?",
      answer:
        "At 9% a year compounded monthly, you pay in ৳3,00,000 and the DPS grows to about ৳3,79,949: ৳79,949 of interest. After 10% source tax (about ৳7,995) you receive about ৳3,71,954. No excise is due because the balance stays under ৳4 lakh.",
    },
    {
      question: "What interest rate should I enter?",
      answer:
        "Use the rate your bank quotes for your DPS tenure. Rates vary by bank and change often, so this calculator has no rate presets. Your DPS form or the bank's rate sheet shows the rate.",
    },
    {
      question: "Do DPS accounts compound monthly or quarterly?",
      answer:
        "It depends on the bank. Many calculators and bank tables use monthly compounding, which is the default here, but we could not confirm one rule for all banks. Choose quarterly or yearly if your bank says so; more frequent compounding gives slightly more.",
    },
    {
      question: "How much tax is cut from DPS interest?",
      answer:
        "Banks deduct tax at source on deposit interest: 10% for individuals, or 15% if you are required to file a tax return but cannot show proof of return submission (PSR). Rates checked on 28 October 2026 under the Income Tax Act 2023; see the sources on this page.",
    },
    {
      question: "Is excise duty charged on a DPS?",
      answer:
        "Yes. Excise duty applies to DPS accounts like other bank balances, once a year. As reported for FY2026-27, nothing is due up to ৳4 lakh, then ৳150 up to ৳5 lakh, ৳500 up to ৳10 lakh and ৳3,000 up to ৳50 lakh. The calculator estimates it from each year's closing balance.",
    },
    {
      question: "What does the year-by-year table show?",
      answer:
        "For each year of the scheme: what you paid in that year, the interest earned, the total deposited so far, the balance at the end of the year and, if you use the band table, the estimated excise duty for that year.",
    },
    {
      question: "What happens if I miss an instalment or close early?",
      answer:
        "Each bank sets its own rules: usually a small late fee, a limit on missed instalments, and a lower rate (or savings-account rate) if you close before maturity. This calculator assumes every instalment is paid on time and the scheme runs to maturity.",
    },
    {
      question: "Why is my bank's maturity table different?",
      answer:
        "Banks may compound quarterly, count interest by days, round each month, deduct tax as interest is credited, or set different rates for different tenures. Treat this figure as an estimate and your bank's DPS table or statement as final.",
    },
  ],
  faqsBn: [
    {
      question: "ডিপিএসের মেয়াদ শেষের অঙ্ক কীভাবে হিসাব হয়?",
      answer:
        "প্রতি মাসের শুরুতে কিস্তি জমা ও মাসিক চক্রবৃদ্ধি সুদে মেয়াদ শেষের অঙ্ক = A × ((1 + i)^n − 1) ÷ i × (1 + i), যেখানে A মাসিক কিস্তি, i = বার্ষিক হার ÷ 12 ÷ 100 আর n মোট মাস। মাসে ৳5,000 করে 9% হারে 5 বছরে কর বাদের আগে প্রায় ৳3,79,949 হয়।",
    },
    {
      question: "মাসে ৳5,000 ডিপিএসে 5 বছর পর কত পাব?",
      answer:
        "বছরে 9% মাসিক চক্রবৃদ্ধিতে আপনি জমা দেবেন ৳3,00,000, আর মেয়াদ শেষে হবে প্রায় ৳3,79,949 — এর মধ্যে ৳79,949 সুদ। 10% উৎসে কর (প্রায় ৳7,995) বাদে হাতে পাবেন প্রায় ৳3,71,954। ব্যালান্স ৳4 লাখের নিচে থাকায় আবগারি শুল্ক লাগে না।",
    },
    {
      question: "সুদের হার কত লিখব?",
      answer:
        "আপনার ডিপিএসের মেয়াদের জন্য ব্যাংক যে হার বলছে, সেটিই লিখুন। হার ব্যাংকভেদে আলাদা ও প্রায়ই বদলায়, তাই এখানে নির্ধারিত হার নেই। ডিপিএস ফর্ম বা ব্যাংকের রেট শিটে হার লেখা থাকে।",
    },
    {
      question: "ডিপিএসে সুদ মাসিক নাকি ত্রৈমাসিক চক্রবৃদ্ধি হয়?",
      answer:
        "এটি ব্যাংকভেদে আলাদা। অনেক ক্যালকুলেটর ও ব্যাংকের টেবিল মাসিক চক্রবৃদ্ধি ধরে, তাই এখানে সেটিই শুরুতে বাছাই করা, তবে সব ব্যাংকের জন্য একটি নিয়ম আমরা নিশ্চিত করতে পারিনি। আপনার ব্যাংক ত্রৈমাসিক বা বার্ষিক বললে সেটি বেছে নিন; ঘন ঘন চক্রবৃদ্ধিতে একটু বেশি আসে।",
    },
    {
      question: "ডিপিএসের সুদ থেকে কত কর কাটে?",
      answer:
        "আমানতের সুদে ব্যাংক উৎসে কর কাটে: ব্যক্তির ক্ষেত্রে 10%, আর রিটার্ন দাখিল বাধ্যতামূলক হলেও রিটার্ন জমার প্রমাণ (PSR) দেখাতে না পারলে 15%। আয়কর আইন 2023 অনুযায়ী হারগুলো 28 অক্টোবর 2026-এ যাচাই করা; সূত্র এই পাতায় আছে।",
    },
    {
      question: "ডিপিএসে কি আবগারি শুল্ক কাটে?",
      answer:
        "হ্যাঁ। অন্য ব্যাংক ব্যালান্সের মতো ডিপিএসেও বছরে একবার আবগারি শুল্ক কাটে। 2026-27 অর্থবছরের প্রকাশিত তথ্য অনুযায়ী ৳4 লাখ পর্যন্ত কিছু লাগে না, এরপর ৳5 লাখ পর্যন্ত ৳150, ৳10 লাখ পর্যন্ত ৳500 আর ৳50 লাখ পর্যন্ত ৳3,000। ক্যালকুলেটর প্রতি বছর শেষের ব্যালান্স থেকে এটি অনুমান করে।",
    },
    {
      question: "বছরভিত্তিক টেবিলে কী দেখায়?",
      answer:
        "স্কিমের প্রতিটি বছরের জন্য: সেই বছরে কত জমা দিলেন, কত সুদ এল, এ পর্যন্ত মোট জমা, বছর শেষের ব্যালান্স, আর স্ল্যাব টেবিল ব্যবহার করলে সেই বছরের আনুমানিক আবগারি শুল্ক।",
    },
    {
      question: "কিস্তি বাদ পড়লে বা আগে ভাঙলে কী হয়?",
      answer:
        "প্রতিটি ব্যাংকের নিজস্ব নিয়ম আছে: সাধারণত সামান্য বিলম্ব ফি, কয়টি কিস্তি বাদ দেওয়া যাবে তার সীমা, আর মেয়াদের আগে ভাঙলে কম হার (বা সঞ্চয়ী হিসাবের হার)। এই ক্যালকুলেটর ধরে নেয় সব কিস্তি সময়মতো দেওয়া হয়েছে আর স্কিম মেয়াদ পূর্ণ করেছে।",
    },
    {
      question: "আমার ব্যাংকের টেবিল আলাদা কেন?",
      answer:
        "ব্যাংক ত্রৈমাসিক চক্রবৃদ্ধি ধরতে পারে, দিন গুনে সুদ হিসাব করতে পারে, প্রতি মাসে রাউন্ড করতে পারে, সুদ জমার সময় কর কাটতে পারে, বা মেয়াদভেদে আলাদা হার দিতে পারে। এই অঙ্কটিকে অনুমান আর ব্যাংকের ডিপিএস টেবিল বা স্টেটমেন্টকে চূড়ান্ত ধরুন।",
    },
  ],
};

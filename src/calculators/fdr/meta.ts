import type { CalculatorMeta } from "@/calculators/types";

export const fdrCalculator: CalculatorMeta = {
  slug: "fdr-calculator",
  name: "FDR Calculator",
  nameBn: "এফডিআর ক্যালকুলেটর",
  category: "finance",
  icon: "vault",
  summary:
    "Work out the maturity value of a fixed deposit (FDR), the interest, the 10% or 15% source tax, excise duty and what you actually receive.",
  summaryBn:
    "ফিক্সড ডিপোজিট (এফডিআর)-এর মেয়াদ শেষের অঙ্ক, সুদ, 10% বা 15% উৎসে কর, আবগারি শুল্ক আর হাতে কত পাবেন — হিসাব করুন।",
  keywords: [
    "fdr calculator bd",
    "fdr calculator",
    "fdr",
    "fixed deposit",
    "fixed deposit calculator",
    "fixed deposit interest calculator bangladesh",
    "term deposit",
    "fdr interest",
    "fdr profit",
    "bank interest",
    "source tax",
    "excise duty",
    "এফডিআর",
    "এফডিআর হিসাব",
    "এফডিআর ক্যালকুলেটর",
    "ফিক্সড ডিপোজিট",
    "স্থায়ী আমানত",
    "মেয়াদি আমানত",
    "এফডিআরের সুদ",
    "উৎসে কর",
    "আবগারি শুল্ক",
    "fdr hisab",
    "fdr er sud",
    "fixed deposit hisab",
  ],
  seo: {
    title: "FDR Calculator BD: Fixed Deposit Interest After Tax",
    description:
      "Calculate FDR maturity, interest, 10% or 15% source tax and excise duty in Taka with your bank's rate. Simple or compound. Free, private, no sign-up.",
  },
  seoBn: {
    title: "এফডিআর হিসাব: ফিক্সড ডিপোজিটের সুদ ও কর ক্যালকুলেটর",
    description:
      "ব্যাংকের হারে এফডিআরের মেয়াদ শেষের অঙ্ক, সুদ, 10% বা 15% উৎসে কর ও আবগারি শুল্ক বাদে হাতে কত পাবেন, টাকায় হিসাব করুন। ফ্রি, সাইনআপ ছাড়া।",
  },
  addedOn: "2026-10-28",
  updatedOn: "2026-10-28",
  related: ["dps-calculator", "sanchayapatra-calculator", "emi-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "How is FDR interest calculated in Bangladesh?",
      answer:
        "For an FDR that pays interest at maturity, interest = deposit × yearly rate × months ÷ 12. ৳1,00,000 at 9% for 12 months earns ৳9,000 before tax. If your bank reinvests the interest (monthly, quarterly or yearly), each credit earns interest too, so choose that compounding option.",
    },
    {
      question: "What interest rate should I enter?",
      answer:
        "Use the rate your bank quotes for your amount and term. FDR rates differ between banks and change often, so this calculator has no rate presets. Check the bank's current rate sheet or ask the branch.",
    },
    {
      question: "How much tax is deducted from FDR interest?",
      answer:
        "Banks deduct tax at source under section 102 of the Income Tax Act 2023: 10% of the interest for individuals. If you are required to file a tax return but cannot show proof of return submission (PSR), the bank deducts 50% more, i.e. 15%. Companies and trusts pay 20%. Rates checked on 28 October 2026; see the sources on this page.",
    },
    {
      question: "Is it still 10% with TIN and 15% without TIN?",
      answer:
        "That was the rule under the old Income Tax Ordinance 1984. Under the Income Tax Act 2023 the higher rate is linked to proof of return submission (PSR): 10% normally, 15% where a PSR is required but not given. Ask your bank which rate it applies to your account.",
    },
    {
      question: "What is excise duty on an FDR?",
      answer:
        "Excise duty is a fixed yearly charge on bank balances, including FDRs and DPS accounts, deducted usually in December. As reported for FY2026-27, balances up to ৳4 lakh pay nothing, ৳4–5 lakh pay ৳150, ৳5–10 lakh ৳500 and ৳10–50 lakh ৳3,000. You can switch excise off or enter your own amount.",
    },
    {
      question: "How much will I get from ৳5,00,000 at 10% for 3 years?",
      answer:
        "With interest reinvested quarterly, the FDR grows to about ৳6,72,444 before tax: ৳1,72,444 of interest. At 10% tax (৳17,244) and an estimated ৳1,500 of excise (৳500 a year), you would receive about ৳6,53,700.",
    },
    {
      question: "What is the difference between simple and compound FDR interest?",
      answer:
        "With simple interest the interest is paid out, or paid at maturity, and does not earn more interest. With compounding the bank adds the interest to your deposit every month, quarter or year, so later interest is earned on a bigger balance. Check your FDR receipt or ask the bank which applies.",
    },
    {
      question: "Why is my bank's figure a little different?",
      answer:
        "Banks may count interest by days (365 or 360 a year), round at each credit, deduct tax each time interest is credited, charge fees, or apply excise in a different calendar year. This calculator uses the standard monthly method, so treat its figure as a close estimate and your bank's statement as final.",
    },
    {
      question: "Should I choose an FDR, a DPS or Sanchayapatra?",
      answer:
        "An FDR suits a lump sum you can leave for a fixed term. A DPS suits saving a fixed amount every month. Sanchayapatra (government savings certificates) has its own rates, limits and tax rules. Compare them with the DPS and Sanchayapatra calculators linked on this page.",
    },
  ],
  faqsBn: [
    {
      question: "বাংলাদেশে এফডিআরের সুদ কীভাবে হিসাব হয়?",
      answer:
        "মেয়াদ শেষে সুদ দেয় এমন এফডিআরে সুদ = জমা × বার্ষিক হার × মাস ÷ 12। ৳1,00,000 টাকা 9% হারে 12 মাসে কর বাদের আগে ৳9,000 সুদ পায়। ব্যাংক যদি সুদ আবার জমায় যোগ করে (মাসিক, ত্রৈমাসিক বা বার্ষিক), তাহলে সেই সুদের ওপরও সুদ আসে — তখন সেই চক্রবৃদ্ধির ধরন বেছে নিন।",
    },
    {
      question: "সুদের হার কত লিখব?",
      answer:
        "আপনার টাকার অঙ্ক ও মেয়াদের জন্য ব্যাংক যে হার বলছে, সেটিই লিখুন। এফডিআরের হার ব্যাংকভেদে আলাদা ও প্রায়ই বদলায়, তাই এখানে কোনো নির্ধারিত হার দেওয়া নেই। ব্যাংকের বর্তমান রেট শিট দেখুন বা শাখায় জিজ্ঞেস করুন।",
    },
    {
      question: "এফডিআরের সুদ থেকে কত কর কাটে?",
      answer:
        "আয়কর আইন 2023-এর ধারা 102 অনুযায়ী ব্যাংক উৎসে কর কাটে: ব্যক্তির ক্ষেত্রে সুদের 10%। রিটার্ন দাখিল বাধ্যতামূলক হলেও রিটার্ন জমার প্রমাণ (PSR) দেখাতে না পারলে 50% বেশি, অর্থাৎ 15% কাটে। কোম্পানি ও ট্রাস্টের হার 20%। হারগুলো 28 অক্টোবর 2026-এ যাচাই করা; সূত্র এই পাতায় আছে।",
    },
    {
      question: "এখনো কি টিআইএন থাকলে 10% আর না থাকলে 15%?",
      answer:
        "এটি পুরোনো আয়কর অধ্যাদেশ 1984-এর নিয়ম ছিল। আয়কর আইন 2023-এ বেশি হার রিটার্ন জমার প্রমাণ (PSR)-এর সাথে যুক্ত: সাধারণত 10%, আর যেখানে PSR লাগে কিন্তু দেওয়া হয়নি সেখানে 15%। আপনার হিসাবে কোন হার প্রযোজ্য, ব্যাংকে জিজ্ঞেস করুন।",
    },
    {
      question: "এফডিআরে আবগারি শুল্ক কী?",
      answer:
        "আবগারি শুল্ক হলো ব্যাংক হিসাবের ব্যালান্সের ওপর বছরে একবারের নির্দিষ্ট চার্জ — এফডিআর ও ডিপিএসেও প্রযোজ্য, সাধারণত ডিসেম্বরে কাটে। 2026-27 অর্থবছরের জন্য প্রকাশিত তথ্য অনুযায়ী ৳4 লাখ পর্যন্ত কিছু লাগে না, ৳4–5 লাখে ৳150, ৳5–10 লাখে ৳500 আর ৳10–50 লাখে ৳3,000। চাইলে আবগারি বাদ দিতে বা নিজের অঙ্ক লিখতে পারেন।",
    },
    {
      question: "৳5,00,000 টাকা 10% হারে 3 বছরে কত হবে?",
      answer:
        "সুদ প্রতি তিন মাসে জমায় যোগ হলে কর বাদের আগে প্রায় ৳6,72,444 হয়, যার ৳1,72,444 সুদ। 10% কর (৳17,244) আর আনুমানিক ৳1,500 আবগারি শুল্ক (বছরে ৳500) বাদে হাতে পাবেন প্রায় ৳6,53,700।",
    },
    {
      question: "সরল আর চক্রবৃদ্ধি এফডিআর সুদের পার্থক্য কী?",
      answer:
        "সরল সুদে সুদ তুলে দেওয়া হয় বা মেয়াদ শেষে একসাথে দেওয়া হয়, সেই সুদ আর সুদ আনে না। চক্রবৃদ্ধিতে ব্যাংক প্রতি মাসে, তিন মাসে বা বছরে সুদ জমার সাথে যোগ করে, তাই পরের সুদ বড় ব্যালান্সের ওপর আসে। আপনার এফডিআর রসিদে কোনটি লেখা, দেখে নিন বা ব্যাংকে জিজ্ঞেস করুন।",
    },
    {
      question: "ব্যাংকের হিসাব একটু আলাদা কেন?",
      answer:
        "ব্যাংক দিন গুনে (বছরে 365 বা 360 দিন) সুদ ধরতে পারে, প্রতিবার সুদ জমার সময় রাউন্ড ও কর কাটতে পারে, ফি নিতে পারে, বা অন্য ক্যালেন্ডার বছরে আবগারি কাটতে পারে। এই ক্যালকুলেটর প্রচলিত মাসিক পদ্ধতি ব্যবহার করে, তাই এটিকে কাছাকাছি অনুমান আর ব্যাংকের স্টেটমেন্টকে চূড়ান্ত ধরুন।",
    },
    {
      question: "এফডিআর, ডিপিএস নাকি সঞ্চয়পত্র — কোনটি নেব?",
      answer:
        "একসাথে বড় অঙ্ক নির্দিষ্ট মেয়াদে রাখতে এফডিআর উপযোগী। প্রতি মাসে নির্দিষ্ট অঙ্ক জমাতে ডিপিএস। সঞ্চয়পত্রের (সরকারি সঞ্চয় সনদ) হার, সীমা ও কর নিয়ম আলাদা। এই পাতার লিংক থেকে ডিপিএস ও সঞ্চয়পত্র ক্যালকুলেটরে তুলনা করে দেখুন।",
    },
  ],
};

import type { CalculatorMeta } from "@/calculators/types";

export const sanchayapatraCalculator: CalculatorMeta = {
  slug: "sanchayapatra-calculator",
  name: "Sanchayapatra Profit Calculator",
  nameBn: "সঞ্চয়পত্রের মুনাফা ক্যালকুলেটর",
  category: "finance",
  icon: "seal",
  summary:
    "Work out the monthly, quarterly or maturity profit on Paribar, Pensioner, 3-month and 5-year Bangladesh Sanchayapatra at the official rates, after source tax.",
  summaryBn:
    "পরিবার, পেনশনার, তিন মাস অন্তর ও 5 বছর মেয়াদি বাংলাদেশ সঞ্চয়পত্রে সরকারি হারে মাসিক, ত্রৈমাসিক বা মেয়াদশেষের মুনাফা — উৎসে কর বাদ দিয়ে — হিসাব করুন।",
  keywords: [
    "sanchayapatra calculator",
    "sanchayapatra profit calculator",
    "sanchayapatra profit rate 2026",
    "savings certificate calculator bangladesh",
    "national savings certificate",
    "paribar sanchayapatra",
    "family savings certificate",
    "pensioner sanchayapatra",
    "3 month profit sanchayapatra",
    "5 year bangladesh sanchayapatra",
    "sanchayapatra interest rate",
    "sanchayapatra source tax",
    "nsd",
    "সঞ্চয়পত্র",
    "সঞ্চয়পত্রের মুনাফা",
    "সঞ্চয়পত্রের মুনাফা হিসাব",
    "সঞ্চয়পত্রের মুনাফার হার",
    "সঞ্চয়পত্র মুনাফার হার 2026",
    "পরিবার সঞ্চয়পত্র",
    "পরিবার সঞ্চয়পত্র মুনাফা",
    "পেনশনার সঞ্চয়পত্র",
    "তিন মাস অন্তর মুনাফাভিত্তিক সঞ্চয়পত্র",
    "বাংলাদেশ সঞ্চয়পত্র",
    "সঞ্চয়পত্রের উৎসে কর",
    "জাতীয় সঞ্চয় অধিদপ্তর",
    "sonchoypotro",
    "sanchaypatra",
    "sonchoy potro munafa",
    "poribar sonchoypotro",
  ],
  seo: {
    title: "Sanchayapatra Profit Calculator 2026: Rates and Tax",
    description:
      "Monthly, quarterly or maturity profit on Paribar, Pensioner, 3-month and 5-year Sanchayapatra at the official NSD rates, after source tax. Free.",
  },
  seoBn: {
    title: "সঞ্চয়পত্রের মুনাফা হিসাব 2026: হার ও উৎসে কর",
    description:
      "পরিবার, পেনশনার, তিন মাস অন্তর ও 5 বছর মেয়াদি সঞ্চয়পত্রে সরকারি হারে মাসিক বা মেয়াদশেষের মুনাফা, উৎসে কর ও হাতে পাওয়া টাকা হিসাব করুন। ফ্রি।",
  },
  addedOn: "2026-10-28",
  updatedOn: "2026-10-28",
  related: ["fdr-calculator", "dps-calculator", "emi-calculator"],
  faqs: [
    {
      question: "What are the current Sanchayapatra profit rates?",
      answer:
        "For a total investment up to ৳7.5 lakh, held to maturity: Pensioner 11.98%, Paribar (Family) 11.93%, 5-year Bangladesh 11.83% and 3-month profit-bearing 11.82% a year. Above ৳7.5 lakh: 11.80% for the 5-year schemes and 11.77% for the 3-month scheme. These rates have applied since 1 July 2025 (IRD order of 30 June 2025) and were kept unchanged in January 2026 and for July–December 2026 (checked 28 October 2026).",
    },
    {
      question: "How much monthly profit does ৳1 lakh in Paribar Sanchayapatra earn?",
      answer:
        "At 11.93% a year, ৳1,00,000 earns ৳994.17 a month before tax. With 10% source tax (৳99.42), you receive ৳894.75 a month. Over 5 years that is ৳59,650 gross, ৳5,965 tax and ৳53,685 net, and you get your ৳1,00,000 back at maturity.",
    },
    {
      question: "How much profit does ৳1 lakh earn in the 3-month profit-bearing Sanchayapatra?",
      answer:
        "At 11.82% a year it pays ৳2,955 every 3 months before tax, or ৳2,659.50 after 10% source tax. Over the 3-year term: ৳35,460 gross, ৳3,546 tax and ৳31,914 net.",
    },
    {
      question: "How much will ৳1 lakh in the 5-year Bangladesh Sanchayapatra pay at maturity?",
      answer:
        "It pays all profit at the end: ৳1,00,000 × 11.83% × 5 = ৳59,150 before tax. After 10% source tax (৳5,915) you receive ৳1,53,235 at maturity.",
    },
    {
      question: "How does the ৳7.5 lakh limit work?",
      answer:
        "The rate tier depends on your cumulative investment across all national savings schemes, not only the certificate you are buying. If your total, including this one, is above ৳7,50,000, the lower upper-tier rate applies. Choose “Above ৳7,50,000” in the calculator in that case.",
    },
    {
      question: "How much source tax is deducted from Sanchayapatra profit?",
      answer:
        "The calculator pre-fills 10%, the rate under section 105 of the Income Tax Act 2023. NBR said in February 2026 that 5% applies when your total savings-certificate investment is up to ৳5 lakh, and the NSD sheet says Pensioner Sanchayapatra up to ৳5 lakh has no source tax. The FY2026-27 budget was reported to apply 10% to all certificates as advance tax, and reports conflict, so enter the rate your office actually deducts.",
    },
    {
      question: "Is Sanchayapatra profit compounded?",
      answer:
        "No. Profit is simple: amount × rate ÷ 100 for each year. Paribar and Pensioner pay it monthly, the 3-month scheme quarterly, and the 5-year Bangladesh Sanchayapatra pays it all at maturity.",
    },
    {
      question: "What happens if I encash a Sanchayapatra before maturity?",
      answer:
        "According to the NSD scheme sheets, profit is then paid at the lower year-end rate for the years completed (for example 9.81% after 1 year for Paribar up to ৳7.5 lakh), and any extra profit already paid is deducted from your principal. This calculator assumes you hold to maturity; ask your savings office for an exact encashment figure.",
    },
    {
      question: "Who can buy Paribar and Pensioner Sanchayapatra, and how much?",
      answer:
        "Paribar: Bangladeshi women aged 18 or over, any person with a disability, and any citizen aged 65 or over, up to ৳45 lakh in a single name. Pensioner: retired government and semi-government employees and certain others, up to ৳50 lakh (from gratuity and provident fund). Bangladesh, 3-month and Paribar together are capped at ৳50 lakh single or ৳1 crore joint.",
    },
    {
      question: "Is what I enter saved or sent anywhere?",
      answer:
        "No. The calculation runs in your browser. If you leave history on, your recent calculations are kept only on this device, and you can clear them at any time.",
    },
  ],
  faqsBn: [
    {
      question: "এখন সঞ্চয়পত্রের মুনাফার হার কত?",
      answer:
        "মোট বিনিয়োগ ৳7.5 লাখ পর্যন্ত হলে, মেয়াদ পূর্ণ করলে: পেনশনার 11.98%, পরিবার 11.93%, 5 বছর মেয়াদি বাংলাদেশ 11.83% এবং তিন মাস অন্তর মুনাফাভিত্তিক 11.82% (বার্ষিক)। ৳7.5 লাখের বেশি হলে 5 বছরের স্কিমগুলোতে 11.80% এবং তিন মাস অন্তর স্কিমে 11.77%। এই হার 1 জুলাই 2025 থেকে কার্যকর (অভ্যন্তরীণ সম্পদ বিভাগের 30 জুন 2025-এর প্রজ্ঞাপন), জানুয়ারি 2026-এ এবং জুলাই–ডিসেম্বর 2026-এর জন্যও অপরিবর্তিত রাখা হয়েছে (28 অক্টোবর 2026-এ যাচাই করা)।",
    },
    {
      question: "পরিবার সঞ্চয়পত্রে 1 লাখ টাকায় মাসে কত মুনাফা পাব?",
      answer:
        "বছরে 11.93% হারে ৳1,00,000-এ কর বাদের আগে মাসে ৳994.17। 10% উৎসে কর (৳99.42) কাটার পর হাতে পাবেন মাসে ৳894.75। 5 বছরে মোট মুনাফা ৳59,650, কর ৳5,965, নিট ৳53,685; আর মেয়াদ শেষে আসল ৳1,00,000 ফেরত পাবেন।",
    },
    {
      question: "তিন মাস অন্তর মুনাফাভিত্তিক সঞ্চয়পত্রে 1 লাখ টাকায় কত মুনাফা?",
      answer:
        "বছরে 11.82% হারে প্রতি 3 মাসে কর বাদের আগে ৳2,955, 10% উৎসে কর কাটার পর ৳2,659.50। 3 বছরের মেয়াদে মোট মুনাফা ৳35,460, কর ৳3,546, নিট ৳31,914।",
    },
    {
      question: "5 বছর মেয়াদি বাংলাদেশ সঞ্চয়পত্রে 1 লাখ টাকা মেয়াদ শেষে কত হবে?",
      answer:
        "পুরো মুনাফা মেয়াদ শেষে একসাথে দেওয়া হয়: ৳1,00,000 × 11.83% × 5 = ৳59,150 (কর বাদের আগে)। 10% উৎসে কর (৳5,915) কাটার পর মেয়াদ শেষে পাবেন ৳1,53,235।",
    },
    {
      question: "৳7.5 লাখের সীমা কীভাবে ধরা হয়?",
      answer:
        "হারের ধাপ নির্ভর করে সব জাতীয় সঞ্চয় স্কিমে আপনার ক্রমপুঞ্জিভূত মোট বিনিয়োগের ওপর, শুধু এই সঞ্চয়পত্রের ওপর নয়। এটিসহ মোট বিনিয়োগ ৳7,50,000-এর বেশি হলে নিচের (ঊর্ধ্ব ধাপের) হার প্রযোজ্য। তখন ক্যালকুলেটরে “৳7,50,000-এর বেশি” বেছে নিন।",
    },
    {
      question: "সঞ্চয়পত্রের মুনাফা থেকে কত উৎসে কর কাটা হয়?",
      answer:
        "ক্যালকুলেটরে 10% আগে থেকে বসানো, যা আয়কর আইন 2023-এর ধারা 105-এর হার। NBR ফেব্রুয়ারি 2026-এ জানিয়েছিল, সব সঞ্চয়পত্রে মোট বিনিয়োগ ৳5 লাখ পর্যন্ত হলে 5%; আর NSD-র তথ্যপত্র অনুযায়ী পেনশনার সঞ্চয়পত্রে ৳5 লাখ পর্যন্ত উৎসে কর নেই। 2026-27 বাজেটে সব সঞ্চয়পত্রে 10% অগ্রিম কর করার খবর এসেছে, তবে খবরগুলো পরস্পরবিরোধী — তাই আপনার অফিস আসলে যে হারে কাটে সেটি লিখুন।",
    },
    {
      question: "সঞ্চয়পত্রের মুনাফা কি চক্রবৃদ্ধি হারে হয়?",
      answer:
        "না। মুনাফা সরল হারে: প্রতি বছর বিনিয়োগ × হার ÷ 100। পরিবার ও পেনশনার সঞ্চয়পত্র মাসে মাসে, তিন মাস অন্তর স্কিম প্রতি 3 মাসে, আর 5 বছর মেয়াদি বাংলাদেশ সঞ্চয়পত্র পুরো মুনাফা মেয়াদ শেষে দেয়।",
    },
    {
      question: "মেয়াদের আগে সঞ্চয়পত্র ভাঙালে কী হয়?",
      answer:
        "NSD-র তথ্যপত্র অনুযায়ী তখন পূর্ণ হওয়া বছরের জন্য নির্ধারিত কম হারে মুনাফা দেওয়া হয় (যেমন ৳7.5 লাখ পর্যন্ত পরিবার সঞ্চয়পত্রে 1 বছর পর 9.81%), আর আগে বেশি মুনাফা দেওয়া হয়ে থাকলে তা আসল টাকা থেকে কেটে নেওয়া হয়। এই ক্যালকুলেটর মেয়াদ পূর্ণ হবে ধরে হিসাব করে; ভাঙানোর সঠিক অঙ্ক সঞ্চয় অফিস থেকে জেনে নিন।",
    },
    {
      question: "পরিবার ও পেনশনার সঞ্চয়পত্র কারা, কত টাকা পর্যন্ত কিনতে পারেন?",
      answer:
        "পরিবার: 18 বছর বা তার বেশি বয়সী বাংলাদেশি নারী, যেকোনো শারীরিক প্রতিবন্ধী এবং 65 বছর বা তার বেশি বয়সী যেকোনো নাগরিক — একক নামে সর্বোচ্চ ৳45 লাখ। পেনশনার: অবসরপ্রাপ্ত সরকারি ও আধা-সরকারি কর্মচারীসহ কয়েকটি শ্রেণি — আনুতোষিক ও ভবিষ্য তহবিলের টাকা মিলিয়ে সর্বোচ্চ ৳50 লাখ। বাংলাদেশ, তিন মাস অন্তর ও পরিবার সঞ্চয়পত্র মিলিয়ে একক নামে ৳50 লাখ বা যুগ্ম নামে ৳1 কোটি।",
    },
    {
      question: "আমি যা লিখি তা কি কোথাও সেভ বা পাঠানো হয়?",
      answer:
        "না। হিসাব আপনার ব্রাউজারেই হয়। হিস্ট্রি চালু রাখলে সাম্প্রতিক হিসাবগুলো শুধু এই ডিভাইসে থাকে, এবং যেকোনো সময় মুছে ফেলতে পারেন।",
    },
  ],
};

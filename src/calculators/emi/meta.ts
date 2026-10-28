import type { CalculatorMeta } from "@/calculators/types";

export const emiCalculator: CalculatorMeta = {
  slug: "emi-calculator",
  name: "EMI / Loan Calculator",
  nameBn: "ইএমআই / লোন ক্যালকুলেটর",
  category: "finance",
  icon: "landmark",
  summary: "Work out your monthly loan instalment (EMI), total interest and total repayment.",
  summaryBn: "লোনের মাসিক কিস্তি (ইএমআই), মোট সুদ ও মোট পরিশোধের হিসাব করুন।",
  keywords: [
    "emi",
    "loan",
    "instalment",
    "installment",
    "monthly payment",
    "kisti",
    "কিস্তি",
    "home loan",
    "car loan",
    "personal loan",
    "reducing balance",
    "loan interest",
    "ঋণ", "loan calculator", "bank loan", "interest calculator", "kisti calculator", "loan emi"],
  seo: {
    title: "EMI Calculator Bangladesh: Loan Instalment in Taka",
    description:
      "Calculate your monthly EMI, total interest and total repayment for a home, car or personal loan, with a year-by-year breakdown. Free, no sign-up.",
  },
  seoBn: {
    title: "ইএমআই ক্যালকুলেটর বাংলাদেশ: লোনের মাসিক কিস্তি",
    description:
      "হোম, কার বা পার্সোনাল লোনের মাসিক ইএমআই, মোট সুদ ও মোট পরিশোধ হিসাব করুন, বছরভিত্তিক ভাঙা হিসাবসহ। ফ্রি, কোনো সাইনআপ লাগে না।",
  },
  addedOn: "2026-10-05",
  related: ["salary-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "What is an EMI?",
      answer:
        "EMI stands for equated monthly instalment: a fixed amount you pay every month until the loan is fully repaid. Each EMI covers that month’s interest first, and the rest reduces the amount you owe.",
    },
    {
      question: "What is the difference between reducing-balance and flat-rate interest?",
      answer:
        "With reducing-balance interest, each month’s interest is charged only on what you still owe, so it shrinks as you repay. With a flat rate, interest is charged on the original loan amount for the whole tenure, so the same quoted percentage costs more in total. This calculator uses the reducing-balance method.",
    },
    {
      question: "Will my bank’s EMI be exactly the same?",
      answer:
        "Not necessarily. Lenders may add processing fees, insurance or other charges, round instalments differently, use flat-rate or floating-rate terms, or change the rate during the loan. This is the standard formula and does not represent any specific bank’s terms. Always check the figures in your loan offer.",
    },
    {
      question: "Why is so much of the early EMI interest?",
      answer:
        "Interest is charged on the outstanding balance, which is highest at the start. As principal is repaid the balance falls, so more of each later EMI goes towards principal. The year-by-year breakdown shows this shift.",
    },
    {
      question: "Does a longer tenure make a loan cheaper?",
      answer:
        "It lowers the monthly EMI but increases the total interest, because you owe money for longer. Try different tenures to see the trade-off between a comfortable monthly amount and the total cost.",
    },
    {
      question: "Can I enter a monthly interest rate?",
      answer:
        "Yes. Choose “per month” beside the rate. A yearly rate is divided by 12 to get the monthly rate. Make sure the unit matches your loan offer, as 1% per month is much higher than 1% per year.",
    },
  ],
  faqsBn: [
    {
      question: "ইএমআই কী?",
      answer:
        "ইএমআই মানে ইকুয়েটেড মান্থলি ইনস্টলমেন্ট: লোন পুরো শোধ না হওয়া পর্যন্ত প্রতি মাসে দেওয়া একটি নির্দিষ্ট অঙ্ক। প্রতিটি ইএমআই থেকে আগে সেই মাসের সুদ যায়, বাকিটা আপনার বকেয়া কমায়।",
    },
    {
      question: "রিডিউসিং-ব্যালান্স আর ফ্ল্যাট-রেট সুদের পার্থক্য কী?",
      answer:
        "রিডিউসিং-ব্যালান্সে প্রতি মাসের সুদ ধরা হয় শুধু যা বাকি আছে তার ওপর, তাই শোধের সাথে সাথে সুদ কমে। ফ্ল্যাট রেটে পুরো মেয়াদ ধরে আসল লোনের ওপর সুদ ধরা হয়, তাই একই ঘোষিত শতাংশে মোট খরচ বেশি পড়ে। এই ক্যালকুলেটর রিডিউসিং-ব্যালান্স পদ্ধতি ব্যবহার করে।",
    },
    {
      question: "আমার ব্যাংকের ইএমআই কি হুবহু একই হবে?",
      answer:
        "না-ও হতে পারে। ঋণদাতারা প্রসেসিং ফি, বিমা বা অন্য চার্জ যোগ করতে পারে, কিস্তি অন্যভাবে রাউন্ড করতে পারে, ফ্ল্যাট বা পরিবর্তনশীল হার ব্যবহার করতে পারে, কিংবা মেয়াদের মধ্যে হার বদলাতে পারে। এটি প্রচলিত সূত্র, কোনো নির্দিষ্ট ব্যাংকের শর্ত নয়। লোন অফারের অঙ্কগুলো সবসময় মিলিয়ে নিন।",
    },
    {
      question: "শুরুর ইএমআইয়ের এত বড় অংশ সুদ কেন?",
      answer:
        "সুদ ধরা হয় বকেয়া ব্যালান্সের ওপর, যা শুরুতে সবচেয়ে বেশি। আসল শোধ হতে হতে ব্যালান্স কমে, তাই পরের ইএমআইগুলোর বড় অংশ যায় আসলে। বছরভিত্তিক হিসাবেই এই বদলটা দেখা যায়।",
    },
    {
      question: "মেয়াদ বাড়ালে কি লোন সস্তা হয়?",
      answer:
        "মাসিক ইএমআই কমে, কিন্তু মোট সুদ বাড়ে — কারণ টাকাটা বেশি দিন ধরে বকেয়া থাকে। স্বাচ্ছন্দ্যের মাসিক অঙ্ক আর মোট খরচের মধ্যে ভারসাম্য দেখতে বিভিন্ন মেয়াদ দিয়ে চেষ্টা করে দেখুন।",
    },
    {
      question: "মাসিক সুদের হার কি দেওয়া যাবে?",
      answer:
        "যাবে। হারের পাশে “মাসে” বেছে নিন। বাৎসরিক হারকে 12 দিয়ে ভাগ করে মাসিক হার বের করা হয়। এককটি আপনার লোন অফারের সাথে মিলছে কি না দেখে নিন — মাসে 1% বছরে 1%-এর চেয়ে অনেক বেশি।",
    },
  ],
};

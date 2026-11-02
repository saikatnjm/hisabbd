import type { CalculatorMeta } from "@/calculators/types";

export const flatRateCalculator: CalculatorMeta = {
  slug: "flat-rate-calculator",
  name: "Flat Rate to Real Interest Rate Calculator",
  nameBn: "ফ্ল্যাট রেট থেকে আসল সুদের হার",
  category: "finance",
  icon: "percent",
  summary:
    "Turn a flat interest rate into the real reducing-balance rate. Enter the amount, flat rate, term and monthly or weekly instalments to see the instalment and the true yearly rate.",
  summaryBn:
    "ফ্ল্যাট রেটকে আসল (ক্রমহ্রাসমান স্থিতির) সুদের হারে রূপান্তর করুন। ঋণের পরিমাণ, ফ্ল্যাট রেট, মেয়াদ আর মাসিক বা সাপ্তাহিক কিস্তি দিলেই কিস্তি আর প্রকৃত বার্ষিক হার দেখা যাবে।",
  keywords: [
    "flat rate to reducing rate",
    "flat rate to reducing rate calculator",
    "flat interest rate calculator",
    "flat vs reducing interest",
    "ngo loan interest bangladesh",
    "microfinance loan interest",
    "weekly instalment loan calculator",
    "effective interest rate calculator",
    "flat rate kisti",
    "ফ্ল্যাট রেট",
    "ফ্ল্যাট রেট থেকে আসল সুদের হার",
    "এনজিও ঋণের কিস্তি",
    "আসল সুদের হার",
    "ঋণের প্রকৃত সুদ",
    "সাপ্তাহিক কিস্তি",
    "ক্রমহ্রাসমান স্থিতি সুদ",
  ],
  seo: {
    title: "Flat Rate to Reducing Rate Calculator (Real Interest)",
    description:
      "Find the real yearly interest rate behind a flat rate, with monthly or weekly instalments and an optional upfront fee. Free, private and made for Bangladesh.",
  },
  seoBn: {
    title: "ফ্ল্যাট রেট থেকে আসল সুদের হার ক্যালকুলেটর",
    description:
      "ফ্ল্যাট রেটের আড়ালে আসল বার্ষিক সুদের হার কত, জানুন। মাসিক বা সাপ্তাহিক কিস্তি আর অগ্রিম ফিসহ এনজিও ও ব্যাংক ঋণের কিস্তি হিসাব করুন, বিনামূল্যে।",
  },
  addedOn: "2026-11-02",
  related: ["emi-calculator", "interest-calculator", "percentage-calculator"],
  faqs: [
    {
      question: "What is the real interest rate of a flat rate loan?",
      answer:
        "It is the yearly rate on the balance you actually still owe. A flat rate is charged on the full amount for the whole term, so the real (reducing-balance) rate is much higher. ৳1,00,000 at 12% flat for 12 months works out to about 21.46% a year.",
    },
    {
      question: "How do I convert a flat rate to a reducing rate?",
      answer:
        "Work out the instalment: (amount + amount × flat rate × years) ÷ number of instalments. Then find the rate at which those instalments are worth exactly the money you received. There is no simple formula; this calculator solves it for you. As a rough guide, the reducing rate is close to 1.8 times the flat rate for monthly loans repaid over a year.",
    },
    {
      question: "Why is a flat rate cheaper-looking than it is?",
      answer:
        "Because the interest is not reduced as you repay. After 6 months of a 12-month loan you owe about half the money, yet you still pay interest on all of it. On ৳1,00,000 at 12% flat, you pay ৳12,000 interest, but on average you hold only about ৳54,000 of the loan.",
    },
    {
      question: "How are weekly instalments calculated here?",
      answer:
        "Weekly means 52 instalments a year, so a 12-month loan has 52 instalments and the real rate is the weekly rate multiplied by 52. For ৳50,000 at 15% flat over 12 months the instalment is about ৳1,105.77 and the real rate about 28.14% a year. Your lender may count weeks differently, so check its schedule.",
    },
    {
      question: "How does an upfront fee change the real rate?",
      answer:
        "A fee, such as a processing or insurance charge taken out of the loan, means you receive less than you repay. Taking ৳2,000 off the ৳1,00,000 example raises the real rate from about 21.46% to about 25.40% a year. Enter the fee to include it.",
    },
    {
      question: "What is the difference between the real rate and the effective annual rate?",
      answer:
        "The real (nominal) rate is the periodic rate times the instalments a year, 21.46% in the ৳1,00,000 example. The effective annual rate also counts the compounding between instalments and is higher, about 23.70%. Compare the real rate with a bank’s quoted reducing-balance rate, and the effective rate when you want the full yearly cost.",
    },
  ],
  faqsBn: [
    {
      question: "ফ্ল্যাট রেট ঋণের আসল সুদের হার কত?",
      answer:
        "আপনার হাতে থাকা বাকি ঋণের ওপর বার্ষিক যে হার পড়ে, সেটাই আসল হার। ফ্ল্যাট রেট পুরো মেয়াদে মূল টাকার ওপর ধরা হয়, তাই আসল (ক্রমহ্রাসমান স্থিতির) হার অনেক বেশি। ৳1,00,000-এর 12% ফ্ল্যাট রেটে 12 মাসের ঋণে আসল হার প্রায় 21.46%।",
    },
    {
      question: "ফ্ল্যাট রেট থেকে আসল সুদের হার কীভাবে বের করব?",
      answer:
        "আগে কিস্তি বের করুন: (ঋণ + ঋণ × ফ্ল্যাট রেট × বছর) ÷ কিস্তির সংখ্যা। তারপর এমন হার খুঁজুন যাতে ওই কিস্তিগুলোর বর্তমান মূল্য আপনার পাওয়া টাকার সমান হয়। এর সহজ সূত্র নেই; এই ক্যালকুলেটর সেটা হিসাব করে দেয়। মোটামুটি, এক বছরের মাসিক কিস্তির ঋণে আসল হার ফ্ল্যাট রেটের প্রায় 1.8 গুণ।",
    },
    {
      question: "ফ্ল্যাট রেট দেখতে কম লাগে কেন?",
      answer:
        "কারণ কিস্তি দিলেও সুদ কমে না। 12 মাসের ঋণের 6 মাস পর প্রায় অর্ধেক টাকা বাকি, তবু সুদ পুরো টাকার ওপর দিতে হয়। ৳1,00,000-এর 12% ফ্ল্যাট রেটে সুদ ৳12,000, অথচ গড়ে আপনার হাতে থাকে ঋণের প্রায় ৳54,000।",
    },
    {
      question: "সাপ্তাহিক কিস্তি এখানে কীভাবে ধরা হয়?",
      answer:
        "সাপ্তাহিক মানে বছরে 52টি কিস্তি, তাই 12 মাসের ঋণে 52টি কিস্তি, আর আসল হার হলো সাপ্তাহিক হারকে 52 দিয়ে গুণ। ৳50,000-এর 15% ফ্ল্যাট রেটে 12 মাসে কিস্তি প্রায় ৳1,105.77 আর আসল হার প্রায় 28.14%। আপনার ঋণদাতা সপ্তাহ অন্যভাবে গুনতে পারে, তাই তার কিস্তির তালিকা মিলিয়ে নিন।",
    },
    {
      question: "অগ্রিম ফি থাকলে আসল হার কেমন বদলায়?",
      answer:
        "ঋণ থেকে কেটে নেওয়া প্রসেসিং বা বিমা ফি থাকলে আপনি যা পান তার চেয়ে বেশি ফেরত দেন। ৳1,00,000-এর উদাহরণে ৳2,000 ফি কাটলে আসল হার প্রায় 21.46% থেকে বেড়ে প্রায় 25.40% হয়। ফি ঘরে টাকার অঙ্ক দিলেই তা ধরা হবে।",
    },
    {
      question: "আসল হার আর কার্যকর বার্ষিক হারের পার্থক্য কী?",
      answer:
        "আসল (নামমাত্র) হার হলো প্রতি কিস্তির হারকে বছরের কিস্তির সংখ্যা দিয়ে গুণ, ৳1,00,000-এর উদাহরণে 21.46%। কার্যকর বার্ষিক হার কিস্তির মাঝের চক্রবৃদ্ধিও ধরে, তাই বেশি, প্রায় 23.70%। ব্যাংকের বলা ক্রমহ্রাসমান হারের সঙ্গে আসল হার মেলান, আর পুরো বার্ষিক খরচ দেখতে কার্যকর হার দেখুন।",
    },
  ],
};

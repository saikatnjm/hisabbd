import type { CalculatorMeta } from "@/calculators/types";

export const temperatureConverter: CalculatorMeta = {
  slug: "temperature-converter",
  name: "Fever Temperature Converter: °F to °C",
  nameBn: "জ্বরের তাপমাত্রা: ফারেনহাইট থেকে সেলসিয়াস",
  category: "health",
  icon: "thermometer",
  summary:
    "Convert a thermometer reading between °F and °C and see whether it counts as a fever by the NHS 38 °C (100.4 °F) rule.",
  summaryBn:
    "থার্মোমিটারের তাপমাত্রা ফারেনহাইট আর সেলসিয়াসে বদলান, আর দেখুন এনএইচএসের 38 °C (100.4 °F) নিয়মে সেটা জ্বর কি না।",
  keywords: [
    "fahrenheit to celsius",
    "celsius to fahrenheit",
    "fever temperature",
    "what temperature is a fever",
    "100 f to c",
    "102 fahrenheit in celsius",
    "body temperature converter",
    "jor koto degree",
    "জ্বর কত হলে",
    "জ্বর কত ডিগ্রি",
    "ফারেনহাইট থেকে সেলসিয়াস",
    "সেলসিয়াস থেকে ফারেনহাইট",
    "100 ডিগ্রি জ্বর কত সেলসিয়াস",
    "শরীরের তাপমাত্রা",
    "জ্বর মাপা",
    "শিশুর জ্বর কত হলে",
  ],
  seo: {
    title: "Fever Temperature: °F to °C Converter and Fever Check",
    description:
      "Convert °F to °C and check if a temperature is a fever: 38 °C (100.4 °F) or above, per the NHS. 100 °F is 37.78 °C. Free, private, in Bangla too.",
  },
  seoBn: {
    title: "জ্বর কত ডিগ্রি হলে? ফারেনহাইট থেকে সেলসিয়াস",
    description:
      "ফারেনহাইট থেকে সেলসিয়াসে বদলান আর দেখুন জ্বর কি না: এনএইচএসের মতে 38 °C (100.4 °F) বা বেশি হলে জ্বর। 100 °F = 37.78 °C। ফ্রি, তথ্য ফোনেই থাকে।",
  },
  addedOn: "2026-11-01",
  related: ["bmi-calculator", "calorie-calculator", "pregnancy-calculator", "age-calculator"],
  faqs: [
    {
      question: "What temperature is a fever?",
      answer:
        "The NHS says a high temperature (fever) is 38 °C or above, which is 100.4 °F, for adults and children. You can still have a high temperature below that if you feel hot, cold or shivery.",
    },
    {
      question: "Is 100 °F a fever?",
      answer:
        "100 °F is 37.78 °C, just under the NHS’s 38 °C line, so it doesn’t count as a high temperature by that rule. 100.4 °F (38 °C) and above does.",
    },
    {
      question: "How do I convert °F to °C?",
      answer: "Subtract 32, multiply by 5 and divide by 9. 102 °F: (102 − 32) × 5 ÷ 9 = 38.89 °C. For °C to °F, multiply by 9, divide by 5 and add 32.",
    },
    {
      question: "Why is the line 38 °C and not 37 °C?",
      answer:
        "Body temperature varies a little from person to person and through the day, so a reading slightly above 37 °C (98.6 °F) is not by itself a fever. The NHS uses 38 °C (100.4 °F) as the line for a high temperature.",
    },
    {
      question: "When should a baby with a fever see a doctor?",
      answer:
        "The NHS says to get medical help straight away if a baby under 3 months has 38 °C or higher, or a baby of 3 to 6 months has 39 °C or higher. In Bangladesh, contact a doctor or your nearest health centre.",
    },
    {
      question: "Does this tell me what is wrong?",
      answer:
        "No. It only converts the reading and compares it with the NHS fever line. It is not a diagnosis. If you are worried, or a fever lasts or gets worse, see a doctor.",
    },
  ],
  faqsBn: [
    {
      question: "জ্বর কত হলে?",
      answer:
        "এনএইচএসের মতে প্রাপ্তবয়স্ক আর শিশু, দুই ক্ষেত্রেই 38 °C বা তার বেশি তাপমাত্রা উচ্চ তাপমাত্রা (জ্বর), যা 100.4 °F। থার্মোমিটারে এর কম দেখালেও গরম, ঠান্ডা বা কাঁপুনি লাগলে জ্বর হতে পারে।",
    },
    {
      question: "100 ডিগ্রি কি জ্বর?",
      answer:
        "100 °F = 37.78 °C, এনএইচএসের 38 °C সীমার সামান্য নিচে, তাই সেই নিয়মে এটি উচ্চ তাপমাত্রা নয়। 100.4 °F (38 °C) বা তার বেশি হলে জ্বর।",
    },
    {
      question: "ফারেনহাইট থেকে সেলসিয়াস কীভাবে বের করব?",
      answer: "32 বাদ দিয়ে 5 দিয়ে গুণ করে 9 দিয়ে ভাগ করুন। 102 °F: (102 − 32) × 5 ÷ 9 = 38.89 °C। উল্টো দিকে 9 দিয়ে গুণ, 5 দিয়ে ভাগ, তারপর 32 যোগ।",
    },
    {
      question: "সীমা 37 °C না হয়ে 38 °C কেন?",
      answer:
        "শরীরের তাপমাত্রা মানুষভেদে আর দিনের সময়ভেদে কিছুটা বদলায়, তাই 37 °C (98.6 °F)-এর সামান্য বেশি হলেই তা জ্বর নয়। এনএইচএস উচ্চ তাপমাত্রার সীমা ধরে 38 °C (100.4 °F)।",
    },
    {
      question: "শিশুর জ্বর হলে কখন ডাক্তার দেখাবেন?",
      answer:
        "এনএইচএসের পরামর্শ: 3 মাসের কম বয়সী শিশুর 38 °C বা বেশি, কিংবা 3 থেকে 6 মাসের শিশুর 39 °C বা বেশি হলে দেরি না করে চিকিৎসকের সাহায্য নিন। বাংলাদেশে ডাক্তার বা নিকটস্থ স্বাস্থ্যকেন্দ্রে যোগাযোগ করুন।",
    },
    {
      question: "এটা কি রোগ বলে দেয়?",
      answer:
        "না। এটি শুধু তাপমাত্রা বদলায় আর এনএইচএসের জ্বরের সীমার সঙ্গে মেলায়; এটি রোগনির্ণয় নয়। দুশ্চিন্তা হলে, বা জ্বর না কমলে বা বাড়লে ডাক্তার দেখান।",
    },
  ],
};

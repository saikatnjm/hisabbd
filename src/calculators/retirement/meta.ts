import type { CalculatorMeta } from "@/calculators/types";

export const retirementCalculator: CalculatorMeta = {
  slug: "retirement-date-calculator",
  name: "Government Retirement Date Calculator (PRL)",
  nameBn: "সরকারি চাকরির অবসরের তারিখ (পিআরএল)",
  category: "work",
  icon: "calendar-day",
  summary:
    "When a government servant retires under the Civil Service Act 2018 (59, or 60 for freedom fighters), how long is left, the latest PRL date and the optional 25-year date.",
  summaryBn:
    "সরকারি চাকরি আইন 2018 অনুযায়ী সরকারি কর্মচারীর অবসর কবে (59, মুক্তিযোদ্ধার 60 বছরে), আর কত বাকি, পিআরএল সর্বোচ্চ কবে পর্যন্ত, আর 25 বছরে ঐচ্ছিক অবসরের তারিখ।",
  keywords: [
    "retirement date calculator bangladesh",
    "government retirement age bangladesh",
    "prl calculator",
    "civil service act 2018 retirement",
    "freedom fighter retirement age",
    "retirement countdown",
    "অবসরের তারিখ হিসাব",
    "পিআরএল ক্যালকুলেটর",
    "সরকারি চাকরির অবসরের বয়স",
    "চাকরির বয়স কত বাকি",
    "অবসর-উত্তর ছুটি",
    "মুক্তিযোদ্ধা অবসরের বয়স",
  ],
  seo: {
    title: "Government Retirement Date Calculator Bangladesh (PRL)",
    description:
      "Find a government servant’s retirement date under the Civil Service Act 2018 (59, or 60 for freedom fighters), time left, the latest PRL date and more.",
  },
  seoBn: {
    title: "সরকারি চাকরির অবসরের তারিখ ও পিআরএল হিসাব",
    description:
      "সরকারি চাকরি আইন 2018 অনুযায়ী অবসরের তারিখ (59, মুক্তিযোদ্ধার 60 বছর), আর কত দিন বাকি, পিআরএল সর্বোচ্চ কবে পর্যন্ত, আর 25 বছরে ঐচ্ছিক অবসরের তারিখ।",
  },
  addedOn: "2026-11-02",
  updatedOn: "2026-11-02",
  related: ["government-job-age-calculator", "age-calculator", "job-exit-benefit-calculator"],
  faqs: [
    {
      question: "What is the retirement age for government jobs in Bangladesh?",
      answer:
        "Under section 43 of the Civil Service Act 2018, a government servant retires on completing 59 years of age, and a freedom fighter government servant on completing 60 years.",
    },
    {
      question: "On which exact day does retirement take effect?",
      answer:
        "The Act says “on completing 59 years” but not which calendar day that is. This calculator shows the date you turn 59 (or 60); the retirement order from your office sets the exact last working day.",
    },
    {
      question: "How long is PRL?",
      answer:
        "Section 47 gives post-retirement leave (PRL) of up to 1 year, subject to the leave rules. The calculator shows the latest date it could run to: one year after the retirement date.",
    },
    {
      question: "Can I retire early?",
      answer:
        "Yes. Under section 44 you may retire any time after completing 25 years of service, by giving the appointing authority at least 30 days’ written notice. Once given, the notice can’t be changed or withdrawn.",
    },
    {
      question: "Does this apply to every government-related job?",
      answer:
        "No. Section 3(3) excludes, among others, the judiciary, defence services, public universities, autonomous bodies and state-owned enterprises, local government bodies, project posts, and contract, ad hoc or temporary jobs. Check your own service rules.",
    },
    {
      question: "What if I was born on 29 February?",
      answer:
        "In a year without 29 February, the calculator uses 28 February. Your office’s order still decides the exact date.",
    },
  ],
  faqsBn: [
    {
      question: "বাংলাদেশে সরকারি চাকরির অবসরের বয়স কত?",
      answer:
        "সরকারি চাকরি আইন 2018-এর 43 ধারা অনুযায়ী সরকারি কর্মচারী 59 বছর পূর্তিতে, আর মুক্তিযোদ্ধা সরকারি কর্মচারী 60 বছর পূর্তিতে অবসর গ্রহণ করেন।",
    },
    {
      question: "ঠিক কোন দিন থেকে অবসর কার্যকর হয়?",
      answer:
        "আইনে “59 বৎসর পূর্তিতে” বলা আছে, কিন্তু সেটি ঠিক কোন তারিখ তা বলা নেই। এই ক্যালকুলেটর আপনার 59 (বা 60) বছর পূর্ণ হওয়ার তারিখ দেখায়; শেষ কর্মদিবস আপনার অফিসের অবসরের আদেশে ঠিক হয়।",
    },
    {
      question: "পিআরএল কত দিনের?",
      answer:
        "47 ধারা অনুযায়ী বিধি সাপেক্ষে সর্বোচ্চ 1 বছর অবসর-উত্তর ছুটি (পিআরএল)। ক্যালকুলেটর সর্বোচ্চ কোন তারিখ পর্যন্ত হতে পারে, অর্থাৎ অবসরের তারিখের এক বছর পর, তা দেখায়।",
    },
    {
      question: "আগে অবসর নেওয়া যায়?",
      answer:
        "হ্যাঁ। 44 ধারা অনুযায়ী চাকরির 25 বছর পূর্ণ হওয়ার পর যেকোনো সময় নিয়োগকারী কর্তৃপক্ষকে অন্তত 30 দিন আগে লিখিতভাবে জানিয়ে অবসর নেওয়া যায়। একবার জানালে তা বদলানো বা প্রত্যাহার করা যায় না।",
    },
    {
      question: "এটা কি সব সরকারি-সংশ্লিষ্ট চাকরিতে প্রযোজ্য?",
      answer:
        "না। 3(3) ধারায় অন্যদের মধ্যে বিচার-কর্ম বিভাগ, প্রতিরক্ষা-কর্ম বিভাগ, পাবলিক বিশ্ববিদ্যালয়, স্ব-শাসিত সংস্থা ও রাষ্ট্রায়ত্ত প্রতিষ্ঠান, স্থানীয় সরকার প্রতিষ্ঠান, প্রকল্পের চাকরি আর চুক্তি, এডহক বা অস্থায়ী চাকরি বাদ। নিজের চাকরিবিধি দেখে নিন।",
    },
    {
      question: "29 ফেব্রুয়ারি জন্ম হলে?",
      answer: "যে বছরে 29 ফেব্রুয়ারি নেই, সেখানে ক্যালকুলেটর 28 ফেব্রুয়ারি ধরে। তবে সঠিক তারিখ আপনার অফিসের আদেশেই ঠিক হবে।",
    },
  ],
};

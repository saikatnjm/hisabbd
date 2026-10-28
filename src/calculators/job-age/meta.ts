import type { CalculatorMeta } from "@/calculators/types";

export const jobAgeCalculator: CalculatorMeta = {
  slug: "government-job-age-calculator",
  name: "Government Job Age Calculator",
  nameBn: "সরকারি চাকরির বয়স ক্যালকুলেটর",
  category: "date-time",
  icon: "briefcase",
  summary: "Check if you meet a BCS or government job circular’s age limit on its “age as on” date.",
  summaryBn: "বিসিএস বা সরকারি চাকরির বিজ্ঞপ্তির নির্ধারিত তারিখে আপনার বয়স বয়সসীমার মধ্যে আছে কি না দেখুন।",
  keywords: [
    "bcs age calculator",
    "bcs age limit",
    "government job age",
    "govt job age limit",
    "job age",
    "age limit",
    "circular",
    "job circular age",
    "age as on",
    "চাকরির বয়স",
    "সরকারি চাকরির বয়সসীমা",
    "বিসিএস বয়স",
    "বয়সসীমা",
    "চাকরির বয়স ক্যালকুলেটর",
    "বিজ্ঞপ্তি",
    "boyos",
    "boyosh",
    "chakrir boyos",
    "sarkari chakri",
    "boyosh sima",
    "age relaxation",
    "quota age",
  ],
  seo: {
    title: "BCS Age Calculator: Government Job Age Limit Check",
    description:
      "Check your age on a BCS or government job circular’s date, see if you meet the 21–32 or 18–32 limit, and find the eligible date-of-birth range. Free.",
  },
  seoBn: {
    title: "চাকরির বয়স ক্যালকুলেটর: বিসিএস ও সরকারি চাকরির বয়সসীমা",
    description:
      "বিজ্ঞপ্তির তারিখে আপনার বয়স কত, বিসিএস বা সরকারি চাকরির বয়সসীমার মধ্যে আছেন কি না, আর কোন জন্ম তারিখ পর্যন্ত আবেদন করা যায় তা দেখুন। ফ্রি।",
  },
  addedOn: "2026-10-28",
  updatedOn: "2026-10-28",
  related: ["age-calculator", "date-difference-calculator"],
  faqs: [
    {
      question: "What is the age limit for BCS?",
      answer:
        "Recent BCS circulars set 21 to 32 years, counted on the date the circular names. Each circular states its own limit and date, so always check the one you are applying to; its wording wins over any calculator.",
    },
    {
      question: "What is the maximum age for other government jobs?",
      answer:
        "Under the 2026 act, the maximum age for direct recruitment to government jobs is 32. The minimum is usually 18, but it depends on the post. The circular gives the exact limits; choose “Custom” to enter them.",
    },
    {
      question: "On which date is my age counted?",
      answer:
        "On the date the circular names, often written as “age as on” a date. For BCS it has been the circular’s own date; other circulars may name a different one. It is not necessarily today or the last day to apply. Enter that date in “Age counted as on”.",
    },
    {
      question: "I am 32 years and 11 months old. Can I still apply where the maximum is 32?",
      answer:
        "By the usual reading, yes: your age in completed years is still 32 until your 33rd birthday. For example, someone born on 20 May 1994 is 32 years, 5 months and 12 days old on 1 November 2026, so they meet a 21–32 limit. But some circulars read the limit as “must not have turned 32”, so check the date-of-birth range printed in the circular.",
    },
    {
      question: "What does the date-of-birth range mean?",
      answer:
        "It is every birth date that meets the limit on the circular’s date. For a 21–32 limit counted on 1 November 2026, that is anyone born from 2 November 1993 to 1 November 2005. Many circulars print a range like this; if theirs differs, theirs is the one that counts.",
    },
    {
      question: "What is age relaxation?",
      answer:
        "Some quotas or posts allow extra years above the normal maximum. The circular says who qualifies and how many years. Enter that number in “Extra years allowed” and the calculator raises the maximum by it. Leave it blank if no relaxation applies to you.",
    },
    {
      question: "I am too young now. When will I qualify?",
      answer:
        "The result shows the date you reach the minimum age. If a later circular counts age on or after that date, you meet the minimum for it.",
    },
    {
      question: "What if I was born on 29 February?",
      answer:
        "In years without 29 February your birthday is taken as 28 February, the same as our Age Calculator. If the exact day decides your eligibility, check the circular or ask the recruiting office.",
    },
    {
      question: "Is this an official eligibility check?",
      answer:
        "No. It does the date maths for you, but the circular’s own age limit, reference date and relaxation rules always decide. Nothing you enter is saved or sent anywhere: the calculation runs in your browser.",
    },
  ],
  faqsBn: [
    {
      question: "বিসিএসের বয়সসীমা কত?",
      answer:
        "সাম্প্রতিক বিসিএস বিজ্ঞপ্তিতে বয়সসীমা 21 থেকে 32 বছর, বিজ্ঞপ্তিতে উল্লেখ করা তারিখ ধরে। প্রতিটি বিজ্ঞপ্তিতে নিজস্ব বয়সসীমা ও তারিখ থাকে, তাই যেটিতে আবেদন করছেন সেটি দেখে নিন; ক্যালকুলেটরের চেয়ে বিজ্ঞপ্তির কথাই চূড়ান্ত।",
    },
    {
      question: "অন্যান্য সরকারি চাকরিতে সর্বোচ্চ বয়স কত?",
      answer:
        "2026 সালের আইন অনুযায়ী সরকারি চাকরিতে সরাসরি নিয়োগে সর্বোচ্চ বয়স 32 বছর। সর্বনিম্ন বয়স সাধারণত 18, তবে পদভেদে আলাদা হতে পারে। সঠিক সীমা বিজ্ঞপ্তিতেই থাকে; “নিজে লিখুন” বেছে সেগুলো দিন।",
    },
    {
      question: "কোন তারিখ ধরে বয়স গোনা হয়?",
      answer:
        "বিজ্ঞপ্তিতে যে তারিখ উল্লেখ থাকে, সেটি ধরে — প্রায়ই লেখা থাকে “অমুক তারিখে বয়স”। বিসিএসে এটি বিজ্ঞপ্তির নিজের তারিখ; অন্য বিজ্ঞপ্তিতে আলাদা তারিখ থাকতে পারে। এটি আজকের তারিখ বা আবেদনের শেষ দিন না-ও হতে পারে। সেই তারিখটি “যে তারিখ ধরে বয়স গোনা হবে” ঘরে দিন।",
    },
    {
      question: "আমার বয়স 32 বছর 11 মাস। সর্বোচ্চ 32 হলে কি আবেদন করতে পারব?",
      answer:
        "সাধারণ হিসাবে পারবেন: 33তম জন্মদিনের আগ পর্যন্ত পূর্ণ বছরে আপনার বয়স 32-ই থাকে। যেমন, 20 মে 1994-এ জন্ম নেওয়া কারও বয়স 1 নভেম্বর 2026-এ 32 বছর 5 মাস 12 দিন, তাই তিনি 21–32 বছরের সীমার মধ্যে আছেন। তবে কোনো কোনো বিজ্ঞপ্তি সীমাটিকে “32 পূর্ণ হওয়া চলবে না” অর্থে পড়ে, তাই বিজ্ঞপ্তিতে ছাপা জন্ম তারিখের সীমা মিলিয়ে নিন।",
    },
    {
      question: "জন্ম তারিখের সীমা মানে কী?",
      answer:
        "বিজ্ঞপ্তির তারিখে বয়সসীমা পূরণ করে এমন সব জন্ম তারিখ। 1 নভেম্বর 2026 ধরে 21–32 বছরের সীমা হলে, 2 নভেম্বর 1993 থেকে 1 নভেম্বর 2005 পর্যন্ত যাঁদের জন্ম। অনেক বিজ্ঞপ্তিতে এমন সীমা ছাপা থাকে; সেটি আলাদা হলে বিজ্ঞপ্তিরটাই গণ্য হবে।",
    },
    {
      question: "বয়সে ছাড় (রিলাক্সেশন) কী?",
      answer:
        "কিছু কোটা বা পদে স্বাভাবিক সর্বোচ্চ বয়সের চেয়ে কয়েক বছর বেশি পর্যন্ত আবেদন করা যায়। কারা পাবেন আর কত বছর, তা বিজ্ঞপ্তিতে লেখা থাকে। সেই সংখ্যাটি “অতিরিক্ত বয়স ছাড়” ঘরে দিলে ক্যালকুলেটর সর্বোচ্চ বয়স ততটা বাড়িয়ে ধরবে। আপনার ক্ষেত্রে ছাড় না থাকলে ঘরটি ফাঁকা রাখুন।",
    },
    {
      question: "এখন বয়স কম। কবে থেকে আবেদন করতে পারব?",
      answer:
        "ফলাফলে দেখানো হয় কোন তারিখে আপনি সর্বনিম্ন বয়সে পৌঁছাবেন। পরের কোনো বিজ্ঞপ্তি যদি সেই তারিখে বা তার পরে বয়স গোনে, তাহলে আপনি সর্বনিম্ন বয়সের শর্ত পূরণ করবেন।",
    },
    {
      question: "জন্ম 29 ফেব্রুয়ারিতে হলে কী হবে?",
      answer:
        "যে বছর 29 ফেব্রুয়ারি নেই, সে বছর 28 ফেব্রুয়ারিকে জন্মদিন ধরা হয়, আমাদের বয়স ক্যালকুলেটরের মতোই। ঠিক ওই দিনটির ওপর যোগ্যতা নির্ভর করলে বিজ্ঞপ্তি দেখুন বা নিয়োগকারী দপ্তরে জিজ্ঞেস করুন।",
    },
    {
      question: "এটা কি সরকারি যোগ্যতা যাচাই?",
      answer:
        "না। এটি শুধু তারিখের হিসাবটা করে দেয়; বয়সসীমা, বয়স গোনার তারিখ আর ছাড়ের নিয়ম সবসময় বিজ্ঞপ্তিই ঠিক করে। আপনি যা লেখেন তার কিছুই সেভ হয় না বা কোথাও পাঠানো হয় না: হিসাবটা আপনার ব্রাউজারেই হয়।",
    },
  ],
};

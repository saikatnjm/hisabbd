import type { CalculatorMeta } from "@/calculators/types";

export const messMealCalculator: CalculatorMeta = {
  slug: "mess-meal-calculator",
  name: "Mess Meal Calculator: Meal Rate and Balances",
  nameBn: "মেসের মিল হিসাব ক্যালকুলেটর",
  category: "everyday",
  icon: "receipt",
  summary:
    "Work out your mess’s meal rate from the month’s bazar and meals, then each member’s cost, share of fixed costs and how much they get back or owe.",
  summaryBn:
    "মাসের বাজার খরচ আর মোট মিল দিয়ে মেসের মিল রেট বের করুন, তারপর প্রত্যেক সদস্যের খরচ, স্থির খরচের ভাগ আর কে কত ফেরত পাবেন বা দেবেন।",
  keywords: [
    "mess meal calculator",
    "meal rate calculator",
    "mess hisab",
    "mess meal rate",
    "bachelor mess calculator",
    "mess manager calculator",
    "meal rate ber korar niyom",
    "মেসের মিল হিসাব",
    "মিল রেট বের করার নিয়ম",
    "মেসের হিসাব",
    "মিল রেট ক্যালকুলেটর",
    "বাজার খরচ হিসাব",
    "মেস ম্যানেজার",
    "মিলের হিসাব",
  ],
  seo: {
    title: "Mess Meal Calculator: Meal Rate and Who Owes What",
    description:
      "Enter the month’s bazar cost and each member’s meals and deposit to get the meal rate, every member’s cost and balance, and the mess’s cash in hand. Free.",
  },
  seoBn: {
    title: "মেসের মিল হিসাব: মিল রেট ও কে কত পাবে বা দেবে",
    description:
      "মাসের বাজার খরচ আর প্রত্যেকের মিল ও জমা দিন: মিল রেট, প্রত্যেক সদস্যের খরচ, কে কত ফেরত পাবেন বা দেবেন, আর ম্যানেজারের হাতে কত রইল। ফ্রি।",
  },
  addedOn: "2026-11-02",
  related: ["percentage-calculator", "electricity-bill-calculator", "discount-calculator"],
  faqs: [
    {
      question: "How is the mess meal rate calculated?",
      answer:
        "Meal rate = total bazar cost for the month ÷ total meals eaten by everyone. With ৳7,200 of bazar and 180 meals, the meal rate is 7,200 ÷ 180 = ৳40 a meal.",
    },
    {
      question: "How do I work out each member’s cost?",
      answer:
        "Multiply their meals by the meal rate, then add their share of fixed costs. At ৳40 a meal, 60 meals cost ৳2,400; with a ৳500 share of fixed costs, the total is ৳2,900.",
    },
    {
      question: "How do I know who owes money and who gets money back?",
      answer:
        "Balance = deposit − total cost. A member who deposited ৳3,000 against a cost of ৳2,900 gets ৳100 back; one who deposited ৳2,000 against ৳2,500 owes ৳500.",
    },
    {
      question: "How are cook, gas and internet bills split?",
      answer:
        "The calculator splits the fixed costs you enter equally among all members, which many messes do. If your mess splits them another way, leave that box blank and settle them separately.",
    },
    {
      question: "Should I count half meals and guest meals?",
      answer:
        "Count every meal eaten from the mess bazar, including guests’ meals (added to the member who brought the guest). Half meals can be entered as 0.5.",
    },
    {
      question: "What is the cash in hand?",
      answer:
        "Total deposits minus total costs. If it is negative, the mess spent more than it collected and the manager needs to collect the shortfall; the members’ balances add up to the same amount.",
    },
  ],
  faqsBn: [
    {
      question: "মেসের মিল রেট কীভাবে বের করে?",
      answer: "মিল রেট = মাসের মোট বাজার খরচ ÷ সবার মোট মিল। ৳7,200 বাজার আর 180 মিল হলে মিল রেট 7,200 ÷ 180 = ৳40।",
    },
    {
      question: "প্রত্যেক সদস্যের খরচ কীভাবে বের করব?",
      answer:
        "তাঁর মিলকে মিল রেট দিয়ে গুণ করুন, তারপর স্থির খরচের ভাগ যোগ করুন। মিল রেট ৳40 হলে 60 মিলে ৳2,400; স্থির খরচের ভাগ ৳500 হলে মোট ৳2,900।",
    },
    {
      question: "কে টাকা পাবে আর কে দেবে, কীভাবে বুঝব?",
      answer:
        "ব্যালান্স = জমা − মোট খরচ। কেউ ৳3,000 জমা দিয়ে ৳2,900 খরচ করলে ৳100 ফেরত পাবেন; ৳2,000 জমা দিয়ে ৳2,500 খরচ হলে ৳500 দিতে হবে।",
    },
    {
      question: "বুয়া, গ্যাস, ইন্টারনেটের বিল কীভাবে ভাগ হয়?",
      answer:
        "ক্যালকুলেটর আপনার দেওয়া স্থির খরচ সব সদস্যের মধ্যে সমান ভাগ করে, অনেক মেসে যেমন হয়। আপনার মেসে অন্যভাবে ভাগ হলে ঘরটি ফাঁকা রেখে সেগুলো আলাদা মিটিয়ে নিন।",
    },
    {
      question: "আধা মিল আর অতিথির মিল কি ধরব?",
      answer: "মেসের বাজার থেকে খাওয়া সব মিল ধরুন, অতিথির মিলও (যিনি অতিথি এনেছেন তাঁর হিসাবে)। আধা মিল 0.5 লিখুন।",
    },
    {
      question: "ম্যানেজারের হাতে কত রইল, কীভাবে বুঝব?",
      answer:
        "মোট জমা − মোট খরচ। ঋণাত্মক হলে মেস যত তুলেছে তার চেয়ে বেশি খরচ হয়েছে, ম্যানেজারকে ঘাটতি তুলতে হবে; সদস্যদের ব্যালান্স যোগ করলেও একই অঙ্ক আসে।",
    },
  ],
};

import type { GuideMeta } from "@/guides/types";

export const electricityUnitsAppliancesGuide: GuideMeta = {
  slug: "electricity-units-appliances",
  title: "How Many Units Does an AC, Fan or Fridge Use? From Watts to Your Bill",
  titleBn: "এসি, ফ্যান, ফ্রিজে কত ইউনিট বিদ্যুৎ খরচ হয়: ওয়াট থেকে বিল",
  summary:
    "Turn an appliance’s watts and hours into units (kWh), then see what those units really add to your bill once BERC’s 2026 slabs and the lifeline rule apply.",
  summaryBn:
    "যন্ত্রের ওয়াট আর চালানোর ঘণ্টা থেকে ইউনিট (কিলোওয়াট-ঘণ্টা) বের করুন, তারপর দেখুন বিইআরসির 2026 সালের ধাপ আর লাইফলাইনের নিয়মে সেই ইউনিট বিলে আসলে কত টাকা যোগ করে।",
  answer:
    "1 unit is 1 kWh: 1,000 watts running for one hour, so units = watts × hours ÷ 1,000. An AC rated 1,500 W running 8 hours a day uses up to 360 units a month. In a home that already uses 150 units, that raises the bill from ৳1,213.80 to ৳5,359.31, because the extra units fall in the dearer slabs.",
  answerBn:
    "1 ইউনিট মানে 1 কিলোওয়াট-ঘণ্টা: 1,000 ওয়াট এক ঘণ্টা চললে যতটা খরচ হয়, তাই ইউনিট = ওয়াট × ঘণ্টা ÷ 1,000। 1,500 ওয়াটের এসি দিনে 8 ঘণ্টা চললে মাসে সর্বোচ্চ 360 ইউনিট। যে বাসায় আগেই 150 ইউনিট লাগে, সেখানে বিল ৳1,213.80 থেকে বেড়ে ৳5,359.31 হয়, কারণ বাড়তি ইউনিট পড়ে বেশি দামের ধাপে।",
  seo: {
    title: "AC, Fan and Fridge Electricity Units and Cost in Bangladesh",
    description:
      "Work out how many units (kWh) an AC, fan, fridge or bulb uses from its watts and hours, and what those units add to your bill under BERC’s 2026 slabs.",
  },
  seoBn: {
    title: "এসি চালালে কত ইউনিট বিদ্যুৎ খরচ হয়, বিল কত বাড়ে",
    description:
      "ওয়াট আর ঘণ্টা থেকে এসি, ফ্যান, ফ্রিজ বা বাল্বে মাসে কত ইউনিট বিদ্যুৎ খরচ হয়, আর বিইআরসির 2026 সালের ধাপে সেই ইউনিটে বিল কত বাড়ে, উদাহরণসহ।",
  },
  calculator: "electricity-bill-calculator",
  publishedOn: "2026-10-29",
};

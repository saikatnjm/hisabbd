import type { Category, CategoryId } from "./types";

export const categories: readonly Category[] = [
  {
    id: "health",
    name: "Health",
    nameBn: "স্বাস্থ্য",
    description: "Check your BMI and other everyday health numbers.",
    descriptionBn: "বিএমআই-সহ দৈনন্দিন স্বাস্থ্যের হিসাবগুলো দেখে নিন।",
  },
  {
    id: "education",
    name: "Education",
    nameBn: "শিক্ষা",
    description: "Work out your GPA and CGPA from your grades and credits.",
    descriptionBn: "গ্রেড ও ক্রেডিট থেকে আপনার জিপিএ ও সিজিপিএ বের করুন।",
  },
  {
    id: "finance",
    name: "Finance",
    nameBn: "অর্থ",
    description: "Loan EMI, salary, discounts, and profit or loss in Taka.",
    descriptionBn: "টাকায় লোনের ইএমআই, বেতন, ডিসকাউন্ট আর লাভ-ক্ষতির হিসাব।",
  },
  {
    id: "everyday",
    name: "Everyday",
    nameBn: "দৈনন্দিন",
    description: "Percentages and quick sums for daily life.",
    descriptionBn: "দৈনন্দিন জীবনের শতকরা ও ছোটখাটো হিসাব।",
  },
  {
    id: "date-time",
    name: "Date & Time",
    nameBn: "তারিখ ও সময়",
    description: "Exact ages and the days between any two dates.",
    descriptionBn: "সঠিক বয়স আর যেকোনো দুই তারিখের মধ্যে দিনের হিসাব।",
  },
];

export function getCategory(id: CategoryId): Category {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

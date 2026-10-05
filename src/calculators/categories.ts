import type { Category, CategoryId } from "./types";

export const categories: readonly Category[] = [
  {
    id: "health",
    name: "Health",
    nameBn: "স্বাস্থ্য",
    description: "Check your BMI and other everyday health numbers.",
  },
  {
    id: "education",
    name: "Education",
    nameBn: "শিক্ষা",
    description: "Work out your GPA and CGPA from your grades and credits.",
  },
  {
    id: "finance",
    name: "Finance",
    nameBn: "অর্থ",
    description: "Loan EMI, salary, discounts, and profit or loss in Taka.",
  },
  {
    id: "everyday",
    name: "Everyday",
    nameBn: "দৈনন্দিন",
    description: "Percentages and quick sums for daily life.",
  },
  {
    id: "date-time",
    name: "Date & Time",
    nameBn: "তারিখ ও সময়",
    description: "Exact ages and the days between any two dates.",
  },
];

export function getCategory(id: CategoryId): Category {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

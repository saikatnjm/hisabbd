import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/calculators/categories";
import { pageMetadata } from "@/calculators/metadata";
import { categoryHref } from "@/calculators/paths";
import { CATEGORY_IDS } from "@/calculators/types";
import { CategoryPageView } from "@/components/pages/category-page";

type Params = Promise<{ category: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_IDS.map((category) => ({ category }));
}

function findCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const category = findCategory((await params).category);
  if (!category) return {};
  return pageMetadata({
    title: `${category.name} Calculators`,
    description: `${category.description} Free, fast and easy to use on any phone.`,
    path: categoryHref(category.id),
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const category = findCategory((await params).category);
  if (!category) notFound();
  return <CategoryPageView category={category} locale="en" />;
}

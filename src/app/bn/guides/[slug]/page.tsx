import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guideOgImage, pageMetadata } from "@/calculators/metadata";
import { GuidePage } from "@/components/pages/guide-page";
import { guidePages } from "@/guides/page-registry";
import { guidePath, guides } from "@/guides/registry";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const entry = guidePages[(await params).slug];
  if (!entry) return {};
  return pageMetadata({
    ...entry.meta.seoBn,
    path: guidePath(entry.meta.slug),
    locale: "bn",
    image: guideOgImage(entry.meta, "bn"),
  });
}

export default async function BanglaGuidePage({ params }: { params: Params }) {
  const entry = guidePages[(await params).slug];
  if (!entry) notFound();
  const { meta, ContentBn } = entry;
  return <GuidePage guide={meta} locale="bn" content={<ContentBn />} />;
}

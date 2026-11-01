import { pageMetadata } from "@/calculators/metadata";
import { MethodologyPage } from "@/components/pages/methodology-page";

export const metadata = pageMetadata({
  title: "আমরা কীভাবে হিসাব যাচাই করি",
  description:
    "HisabBD প্রতিটি সংখ্যা যেভাবে যাচাই করে: উদাহরণ দিয়ে পরীক্ষিত সূত্র, তারিখসহ অফিশিয়াল উৎস, কোনো অনুমান নয়, আর কোন নিয়ম শেষ কবে যাচাই হয়েছে।",
  path: "/methodology",
  locale: "bn",
});

export default function BanglaMethodologyPage() {
  return <MethodologyPage locale="bn" />;
}

import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

export interface BreadcrumbItem {
  name: string;
  /** Omit for the current page. */
  href?: string;
}

/** Breadcrumb trail. The same items can feed BreadcrumbList structured data later. */
export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-slate-600">
        {items.map((item, index) => (
          <li key={item.name} className="inline-flex items-center gap-1">
            {index > 0 && <ChevronRightIcon className="size-4 text-slate-400" />}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-7 items-center rounded px-0.5 font-medium underline-offset-4 hover:text-brand-800 hover:underline"
              >
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="px-0.5 font-semibold text-slate-900">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

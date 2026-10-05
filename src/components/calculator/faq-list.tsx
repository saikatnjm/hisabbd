import type { FaqItem } from "@/calculators/types";
import { PlusIcon } from "@/components/ui/icons";

/** Native <details> accordion: keyboard accessible and works without JavaScript. */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-semibold text-slate-900 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            {item.question}
            <PlusIcon className="size-5 shrink-0 text-brand-600 transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="px-5 pb-5 text-slate-700">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

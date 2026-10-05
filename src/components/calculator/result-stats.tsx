import { cn } from "@/lib/cn";

export interface ResultStat {
  label: string;
  value: React.ReactNode;
  /** Span both columns (for long values). */
  wide?: boolean;
}

/** Secondary figures under a main result, as a two-column definition list. */
export function ResultStats({ items, className }: { items: readonly ResultStat[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-4", className)}>
      {items.map((item) => (
        <div key={item.label} className={item.wide ? "col-span-2" : undefined}>
          <dt className="text-sm text-slate-600">{item.label}</dt>
          <dd className="font-semibold break-words text-slate-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

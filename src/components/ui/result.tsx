import { cn } from "@/lib/cn";

interface ResultPanelProps {
  /** Heading for the result, e.g. "Age on 5 October 2026". */
  title: string;
  titleId?: string;
  /** Main result, shown large. */
  value: React.ReactNode;
  /** Optional breakdown/details below the main value. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Prominent calculation result. Announce changes with a separate, short
 * live region in the calculator rather than making this whole panel live.
 */
export function ResultPanel({ title, titleId, value, children, className }: ResultPanelProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn("rounded-2xl border-2 border-brand-600 bg-brand-50 p-5 sm:p-6", className)}
    >
      <h2 id={titleId} className="font-display text-base font-semibold text-brand-800">
        {title}
      </h2>
      <div className="mt-2 text-slate-900">{value}</div>
      {children && <div className="mt-5 text-slate-700">{children}</div>}
    </section>
  );
}

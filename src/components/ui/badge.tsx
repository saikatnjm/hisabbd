import { cn } from "@/lib/cn";

/** Small label. Pass colour classes (e.g. a category theme) via className. */
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}

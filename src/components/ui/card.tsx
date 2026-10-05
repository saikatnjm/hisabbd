import { cn } from "@/lib/cn";

export const cardClasses = "rounded-xl border border-slate-200 bg-white";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(cardClasses, "p-5", className)} {...props} />;
}

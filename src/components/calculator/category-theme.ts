import type { CategoryId } from "@/calculators/types";

/** Semantic colour classes per category (tokens live in globals.css). */
export const categoryTheme: Record<CategoryId, { soft: string; ink: string }> = {
  health: { soft: "bg-health-soft", ink: "text-health-ink" },
  education: { soft: "bg-education-soft", ink: "text-education-ink" },
  finance: { soft: "bg-finance-soft", ink: "text-finance-ink" },
  everyday: { soft: "bg-everyday-soft", ink: "text-everyday-ink" },
  "date-time": { soft: "bg-date-time-soft", ink: "text-date-time-ink" },
};

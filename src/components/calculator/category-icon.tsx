import type { CategoryId } from "@/calculators/types";
import {
  BanknoteIcon,
  CalculatorIcon,
  CalendarIcon,
  GraduationIcon,
  HeartIcon,
} from "@/components/ui/icons";
import { categoryTheme } from "@/components/calculator/category-theme";
import { cn } from "@/lib/cn";

const icons: Record<CategoryId, (p: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
  health: HeartIcon,
  education: GraduationIcon,
  finance: BanknoteIcon,
  everyday: CalculatorIcon,
  "date-time": CalendarIcon,
};

type TileSize = "sm" | "md" | "lg";

const sizes: Record<TileSize, { tile: string; icon: string }> = {
  sm: { tile: "size-9 rounded-lg", icon: "size-5" },
  md: { tile: "size-11 rounded-xl", icon: "size-6" },
  lg: { tile: "size-12 rounded-2xl", icon: "size-6" },
};

/** Coloured icon tile for a category. Calculators use their category's icon. */
export function CategoryIcon({
  category,
  size = "md",
  className,
}: {
  category: CategoryId;
  size?: TileSize;
  className?: string;
}) {
  const Icon = icons[category];
  const theme = categoryTheme[category];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        sizes[size].tile,
        theme.soft,
        theme.ink,
        className,
      )}
    >
      <Icon className={sizes[size].icon} />
    </span>
  );
}

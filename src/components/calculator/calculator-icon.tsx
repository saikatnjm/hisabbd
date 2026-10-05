import type { CalculatorIconName, CategoryId } from "@/calculators/types";
import {
  BookIcon,
  CalendarIcon,
  CalendarRangeIcon,
  GraduationIcon,
  LandmarkIcon,
  PercentIcon,
  ScaleIcon,
  TagIcon,
  TrendingIcon,
  WalletIcon,
} from "@/components/ui/icons";
import { categoryTheme } from "@/components/calculator/category-theme";
import { cn } from "@/lib/cn";

const icons: Record<CalculatorIconName, (p: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
  calendar: CalendarIcon,
  "calendar-range": CalendarRangeIcon,
  scale: ScaleIcon,
  graduation: GraduationIcon,
  book: BookIcon,
  percent: PercentIcon,
  tag: TagIcon,
  trending: TrendingIcon,
  landmark: LandmarkIcon,
  wallet: WalletIcon,
};

const sizes = {
  sm: { tile: "size-9 rounded-lg", icon: "size-5" },
  md: { tile: "size-11 rounded-xl", icon: "size-6" },
  lg: { tile: "size-12 rounded-2xl", icon: "size-6" },
} as const;

/** A calculator's own icon on a tile coloured by its category. */
export function CalculatorIconTile({
  icon,
  category,
  size = "md",
  className,
}: {
  icon: CalculatorIconName;
  category: CategoryId;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const Icon = icons[icon];
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

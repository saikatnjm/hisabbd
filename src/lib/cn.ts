/** Joins class names, skipping falsy values. Pass additive classes only (no conflict merging). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

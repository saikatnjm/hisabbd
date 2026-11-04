"use client";

import { useId } from "react";
import { SegmentedControl } from "@/components/ui/form";
import { useLocale } from "@/i18n/locale-context";
import { ui } from "@/i18n/ui";
import { usePreference } from "@/lib/use-preference";
import { applyTheme, themePreference, type ThemeChoice } from "@/lib/theme";

/** Auto / Light / Dark switch. Remembered on this device only. */
export function ThemeToggle() {
  const t = ui[useLocale()].theme;
  const [choice, setChoice] = usePreference(themePreference);
  const name = useId();

  function choose(next: ThemeChoice) {
    setChoice(next);
    applyTheme(next);
  }

  return (
    <SegmentedControl
      name={`theme-${name}`}
      legend={t.label}
      value={choice}
      onChange={choose}
      options={[
        { value: "auto", label: t.auto },
        { value: "light", label: t.light },
        { value: "dark", label: t.dark },
      ]}
    />
  );
}

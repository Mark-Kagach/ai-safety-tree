"use client";

import { useTheme, type Theme } from "@/lib/useTheme";

const NEXT: Record<Theme, Theme> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const LABEL: Record<Theme, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const ICON: Record<Theme, string> = {
  system: "\u25cf",
  light: "\u2600",
  dark: "\u263e",
};

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Theme"
        suppressHydrationWarning
        className="text-fg-muted px-2 py-1 rounded border border-border hover:bg-canvas-elev-hover hover:text-fg transition-colors uppercase tracking-wide"
      >
        {"\u25cf"} Theme
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT[theme])}
      aria-label={`Theme: ${LABEL[theme]} (click to change)`}
      title={`Theme: ${LABEL[theme]}`}
      className="text-fg-muted px-2 py-1 rounded border border-border hover:bg-canvas-elev-hover hover:text-fg transition-colors uppercase tracking-wide"
    >
      <span aria-hidden className="mr-1">
        {ICON[theme]}
      </span>
      {LABEL[theme]}
    </button>
  );
}

"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle light or dark theme"
      className="p-1.5 rounded-full hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
    >
      <Sun size={17} weight="regular" className="hidden dark:block" aria-hidden />
      <Moon size={17} weight="regular" className="dark:hidden" aria-hidden />
    </button>
  );
}

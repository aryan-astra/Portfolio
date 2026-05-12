"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="w-7 h-7 block" aria-hidden />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="p-1.5 rounded-full hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
    >
      {theme === "dark" ? <Sun size={14} weight="bold" /> : <Moon size={14} weight="bold" />}
    </button>
  );
}

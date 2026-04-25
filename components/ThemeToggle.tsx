"use client";

import { useCallback, useState } from "react";
import { Moon, Sun } from "lucide-react";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("theme") === "dark";
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

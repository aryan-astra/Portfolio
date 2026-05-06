"use client";

import { useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onThemeChange = () => onStoreChange();
  window.addEventListener("storage", onThemeChange);
  window.addEventListener("themechange", onThemeChange);

  return () => {
    window.removeEventListener("storage", onThemeChange);
    window.removeEventListener("themechange", onThemeChange);
  };
}

function getThemeSnapshot() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
}

export default function ThemeToggle() {
  const [override, setOverride] = useState<boolean | null>(null);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const systemTheme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    () => false,
  );
  const isDark = override ?? systemTheme;

  const toggle = () => {
    const next = !isDark;
    setOverride(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("themechange"));
  };

  if (!mounted) {
    return (
      <button
        aria-hidden="true"
        className="p-2 rounded-md text-muted-foreground opacity-0"
      >
        <Sun size={15} />
      </button>
    );
  }

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

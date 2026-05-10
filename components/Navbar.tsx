"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "Work", href: "#featured" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#skills" },
  { label: "Hackathons", href: "#hackathons" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section tracking
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/74 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <nav
        className="content-shell h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollToTop}
            className="transition-colors duration-200"
            aria-label="Scroll to top"
          >
            <span className="font-mono text-sm font-medium text-foreground transition-colors duration-200 hover:text-accent-blue">
              aryan.
            </span>
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative transition-colors duration-200"
                aria-current={isActive ? "location" : undefined}
              >
                <span className={isActive ? "text-[0.95rem] text-accent-blue" : "text-[0.95rem] text-muted-foreground hover:text-foreground"}>
                  {link.label}
                </span>
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-1 left-0 h-px w-full bg-accent-blue"
                  initial={false}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  style={{ transformOrigin: "left" }}
                />
              </a>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <span className="font-mono text-sm leading-none select-none" aria-hidden="true">
              {mobileOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden bg-background/92 backdrop-blur-md"
          >
            <div className="content-shell py-4 flex flex-col gap-4">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className="transition-colors duration-200"
                >
                  <span className={isActive ? "text-[0.95rem] text-accent-blue" : "text-[0.95rem] text-muted-foreground hover:text-foreground"}>
                    {link.label}
                  </span>
                </a>
              );
            })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

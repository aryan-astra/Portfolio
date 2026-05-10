"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "Work", href: "/#featured", type: "anchor" as const },
  { label: "Projects", href: "/#projects", type: "anchor" as const },
  { label: "Stack", href: "/#skills", type: "anchor" as const },
  { label: "Hackathons", href: "/#hackathons", type: "anchor" as const },
  { label: "Writing", href: "/writing", type: "route" as const },
  { label: "Contact", href: "/#contact", type: "anchor" as const },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (pathname !== "/") {
        setActiveSection("");
        return;
      }

      const sections = navLinks.filter((link) => link.type === "anchor").map((link) => link.href.split("#")[1]);
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
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  const isWritingRoute = pathname.startsWith("/writing");

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
            const isActive = link.type === "route" ? isWritingRoute : activeSection === link.href.split("#")[1];

            if (link.type === "route") {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative transition-colors duration-200"
                  aria-current={isActive ? "page" : undefined}
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
                </Link>
              );
            }

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-[60] flex md:hidden bg-background/96 backdrop-blur-2xl"
          >
            <div className="content-shell flex min-h-full flex-col py-5">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">Navigation</p>
                <button
                  onClick={closeMobile}
                  aria-label="Close menu"
                  className="rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-4 py-10">
                {navLinks.map((link, index) => {
                  const isActive = link.type === "route" ? isWritingRoute : activeSection === link.href.split("#")[1];
                  const shared = "block text-[clamp(2rem,7vw,4.1rem)] leading-none tracking-[-0.05em] transition-colors duration-200";

                  return link.type === "route" ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobile}
                      className={shared}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className={isActive ? "text-foreground" : "text-muted-foreground"}
                      >
                        {link.label}
                      </motion.span>
                    </Link>
                  ) : (
                    <a key={link.href} href={link.href} onClick={closeMobile} className={shared} aria-current={isActive ? "location" : undefined}>
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className={isActive ? "text-foreground" : "text-muted-foreground"}
                      >
                        {link.label}
                      </motion.span>
                    </a>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-border/70 pt-4">
                <p className="max-w-[18rem] text-xs leading-relaxed text-muted-foreground">No feed, no noise, just the parts of the site that do real work.</p>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

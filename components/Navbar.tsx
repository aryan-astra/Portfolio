"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "work", href: "/#projects" },
  { label: "writing", href: "/writing" },
  { label: "resume", href: "/resume" },
  { label: "contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);
  const isSubPage = pathname !== "/";

  return (
    <>
      {/* Floating pill nav */}
      <AnimatePresence>
        {(visible || isSubPage) && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 right-0 top-4 z-50 flex justify-center pointer-events-none"
            aria-label="Site navigation"
          >
            <nav className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-background/85 backdrop-blur-md px-3 py-2 shadow-sm">
              {/* Logo */}
              <Link
                href="/"
                onClick={close}
                className="font-mono text-[0.72rem] font-semibold text-foreground hover:text-accent transition-colors px-2 py-1 rounded-full hover:bg-secondary/60"
              >
                aryan<span className="text-accent">.</span>sh
              </Link>

              {/* Separator */}
              <span className="w-px h-3.5 bg-border mx-1" aria-hidden />

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-0.5">
                {navLinks.map((link) => {
                  const isRoute = !link.href.includes("#");
                  const active = isRoute && pathname.startsWith(link.href);
                  const Comp = isRoute ? Link : "a";
                  return (
                    <Comp
                      key={link.href}
                      href={link.href}
                      className={`font-mono text-[0.68rem] tracking-wider px-3 py-1.5 rounded-full transition-all ${
                        active
                          ? "bg-accent text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Comp>
                  );
                })}
              </div>

              {/* Separator */}
              <span className="hidden md:block w-px h-3.5 bg-border mx-1" aria-hidden />

              {/* Theme toggle */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-1.5 rounded-full hover:bg-secondary/60 transition-colors ml-1"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={15} weight="bold" /> : <List size={15} weight="bold" />}
              </button>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col bg-background/96 backdrop-blur-lg"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  {link.href.includes("#") ? (
                    <a
                      href={link.href}
                      onClick={close}
                      className="font-display text-3xl font-light text-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={close}
                      className="font-display text-3xl font-light text-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-4"
              >
                <ThemeToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}

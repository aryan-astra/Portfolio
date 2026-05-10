"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";

const navLinks = [
  { label: "work", href: "/#featured" },
  { label: "projects", href: "/#projects" },
  { label: "writing", href: "/writing" },
  { label: "contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isWritingRoute = pathname.startsWith("/writing") || pathname.startsWith("/projects");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border bg-background/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="content-shell flex h-14 items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <Link
          href="/"
          onClick={close}
          className="font-mono text-sm text-foreground hover:text-highlight transition-colors"
        >
          aryan<span className="text-highlight">.</span>sh
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isRoute = !link.href.includes("#");
            const active = isRoute ? isWritingRoute && pathname.startsWith(link.href.split("?")[0]) : false;
            return isRoute ? (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-[0.72rem] tracking-wider transition-colors ${
                  active ? "text-highlight" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[0.72rem] tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="grid h-9 w-9 place-items-center text-muted-foreground transition-colors hover:text-foreground md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 bg-background md:hidden"
          >
            <button
              onClick={close}
              aria-label="Close menu"
              className="absolute right-5 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={22} />
            </button>
            {navLinks.map((link, i) => {
              const isRoute = !link.href.includes("#");
              const El = isRoute ? Link : "a";
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <El
                    href={link.href}
                    onClick={close}
                    className="font-serif text-foreground hover:text-highlight transition-colors"
                    style={{ fontSize: "clamp(2.5rem, 12vw, 4.5rem)", lineHeight: 1 }}
                  >
                    {link.label}
                  </El>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


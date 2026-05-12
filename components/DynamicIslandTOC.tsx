"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────── */
/*  DynamicIslandTOC                                                   */
/*  Fixed floating pill at bottom of viewport.                        */
/*  Collapsed → shows active heading + progress ring.                  */
/*  Expanded  → full TOC list (340 × 400 max-h panel).                */
/*  Auto-scans: article h1–h4, .prose h1–h4, [data-toc]              */
/* ─────────────────────────────────────────────────────────────────── */

const HEADING_SELECTOR =
  "article h1, article h2, article h3, article h4, " +
  ".prose h1, .prose h2, .prose h3, .prose h4, " +
  "[data-toc]";

interface HeadingData {
  id: string;
  text: string;
  level: number;
  element: Element;
}

/* ── SVG progress ring ── */
function CircleProgress({ value }: { value: number }) {
  const R = 10;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - value / 100);

  return (
    <svg width={28} height={28} viewBox="0 0 28 28" aria-hidden>
      <circle
        cx={14}
        cy={14}
        r={R}
        fill="none"
        strokeWidth={2.5}
        stroke="var(--muted)"
      />
      <circle
        cx={14}
        cy={14}
        r={R}
        fill="none"
        strokeWidth={2.5}
        stroke="var(--foreground)"
        strokeDasharray={C}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 14 14)"
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
    </svg>
  );
}

/* ── Ensure a heading has an id ── */
function ensureId(el: Element, fallback: string): string {
  if (!el.id) {
    el.id = fallback
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  return el.id;
}

interface DynamicIslandTOCProps {
  children: React.ReactNode;
  headingSelector?: string;
}

export function DynamicIslandTOC({
  children,
  headingSelector = HEADING_SELECTOR,
}: DynamicIslandTOCProps) {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ── Collect headings after mount ── */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(headingSelector));
    if (els.length === 0) return;

    const data: HeadingData[] = els.map((el, i) => ({
      id: ensureId(el, el.textContent ?? `heading-${i}`),
      text: el.getAttribute("data-toc-label") || (el.textContent?.trim() ?? ""),
      level: parseInt(el.tagName.replace("H", ""), 10) || 2,
      element: el,
    }));

    setHeadings(data);
    setActiveId(data[0]?.id ?? null);
  }, [headingSelector]);

  /* ── IntersectionObserver for active heading ── */
  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    for (const h of headings) {
      observerRef.current.observe(h.element);
    }

    return () => observerRef.current?.disconnect();
  }, [headings]);

  /* ── Scroll progress ── */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const viewportBottom = window.scrollY + window.innerHeight;
      const total = doc.scrollHeight;
      const pct = total > 0 ? Math.min(100, Math.round((viewportBottom / total) * 100)) : 0;
      setProgress(pct);

      // Bottom guard: when near the page end, force the last heading active
      // (short trailing sections never cross the IntersectionObserver band).
      if (pct >= 98 && headings.length > 0) {
        setActiveId(headings[headings.length - 1].id);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  /* ── Scroll to heading ── */
  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsExpanded(false);
  }, []);

  /* ── Close on outside click ── */
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isExpanded]);

  if (headings.length === 0) return <>{children}</>;

  const activeHeading = headings.find((h) => h.id === activeId);

  /* ── spring config ── */
  const spring: Transition = { type: "spring", damping: 24, stiffness: 280 };

  return (
    <>
      {children}

      {/* Fixed pill at bottom-center */}
      <div
        ref={containerRef}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* ── Collapsed pill ── */
            <motion.button
              key="pill"
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.94 }}
              transition={spring}
              onClick={() => setIsExpanded(true)}
              aria-label="Open table of contents"
              className={cn(
                "flex items-center gap-2 rounded-full border border-border",
                "bg-background/90 backdrop-blur-md px-4 py-2 shadow-lg",
                "text-xs text-foreground hover:bg-secondary/80 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              )}
            >
              <CircleProgress value={progress} />
              <span className="max-w-[180px] truncate text-muted-foreground">
                {activeHeading?.text ?? "Contents"}
              </span>
            </motion.button>
          ) : (
            /* ── Expanded panel ── */
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={spring}
              className={cn(
                "w-[340px] max-h-[400px] rounded-2xl border border-border",
                "bg-background/95 backdrop-blur-md shadow-xl overflow-hidden",
                "flex flex-col"
              )}
              role="navigation"
              aria-label="Table of contents"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <CircleProgress value={progress} />
                  <span className="text-xs font-medium text-foreground">
                    {progress}% · {headings.length} sections
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close table of contents"
                  className="rounded p-1 hover:bg-secondary/60 transition-colors text-muted-foreground"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Heading list */}
              <div className="overflow-y-auto flex-1 py-2">
                {headings.map((h) => {
                  const isActive = h.id === activeId;
                  const isHovered = h.id === hoveredId;
                  const indent = Math.max(0, h.level - 2) * 12;

                  return (
                    <button
                      key={h.id}
                      onClick={() => scrollToHeading(h.id)}
                      onMouseEnter={() => setHoveredId(h.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={cn(
                        "w-full text-left px-4 py-1.5 text-xs transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",
                        isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      style={{ paddingLeft: `${16 + indent}px` }}
                    >
                      <span className="flex items-center gap-2">
                        {isActive && (
                          <span className="inline-block w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                        )}
                        <span className={cn("truncate", isActive ? "text-accent" : "")}>
                          {h.text}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

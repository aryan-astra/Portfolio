"use client";

import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────
 *  CustomCursor — lerp-followed dot with a "heading hover" mode
 *  that mimics the pet's perch-on-section behaviour: when the
 *  pointer is over any h1/h2/h3 (or an element flagged with
 *  data-cursor="heading"), the cursor expands into a soft ring.
 * ────────────────────────────────────────────────────────────── */

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [onHeading, setOnHeading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    const ringPos = { x: pos.x, y: pos.y };
    let raf = 0;
    let active = false;
    let heading = false;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!active) {
        active = true;
        setVisible(true);
        document.body.classList.add("custom-cursor-active");
      }

      const el = e.target as Element | null;
      const isHeading = !!el?.closest(
        'h1,h2,h3,[data-cursor="heading"]',
      );
      if (isHeading !== heading) {
        heading = isHeading;
        setOnHeading(isHeading);
      }
    };

    const onLeave = () => {
      active = false;
      setVisible(false);
      document.body.classList.remove("custom-cursor-active");
    };

    const tick = () => {
      // dot follows fast
      pos.x += (target.x - pos.x) * 0.35;
      pos.y += (target.y - pos.y) * 0.35;
      // ring trails softer
      ringPos.x += (target.x - ringPos.x) * 0.14;
      ringPos.y += (target.y - ringPos.y) * 0.14;

      dot.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x - 18}px, ${ringPos.y - 18}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Trailing ring — expands and glows when over a heading */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[199] rounded-full"
        style={{
          width: 36,
          height: 36,
          border: "1.5px solid color-mix(in srgb, var(--highlight) 70%, transparent)",
          background: onHeading
            ? "color-mix(in srgb, var(--highlight) 14%, transparent)"
            : "transparent",
          boxShadow: onHeading
            ? "0 0 30px color-mix(in srgb, var(--highlight) 55%, transparent)"
            : "0 0 0 transparent",
          transform: "translate3d(50vw, 50vh, 0)",
          transition:
            "background 180ms ease, box-shadow 220ms ease, scale 220ms cubic-bezier(.2,.8,.2,1)",
          scale: onHeading ? "1.55" : "1",
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] rounded-full"
        style={{
          width: 8,
          height: 8,
          background: "var(--highlight)",
          boxShadow:
            "0 0 14px color-mix(in srgb, var(--highlight) 70%, transparent)",
          transform: "translate3d(50vw, 50vh, 0)",
          transition: "scale 200ms cubic-bezier(.2,.8,.2,1), opacity 200ms ease",
          scale: onHeading ? "0.4" : "1",
          opacity: onHeading ? 0.7 : 1,
        }}
      />
    </>
  );
}

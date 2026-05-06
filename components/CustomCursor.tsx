"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;

    let raf = 0;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const update = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      node.style.transform = `translate3d(${pos.x - 10}px, ${pos.y - 10}px, 0)`;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed z-[9999] h-5 w-5 rounded-full bg-accent-blue/90 shadow-[0_6px_20px_rgba(37,99,235,0.12)] transition-transform duration-150"
      style={{ transform: "translate3d(50vw,50vh,0)" }}
    />
  );
}

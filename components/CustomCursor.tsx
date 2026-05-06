"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let raf = 0;
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let isActive = false;

    const onMouseEnter = () => {
      isActive = true;
      setIsVisible(true);
      document.body.classList.add("custom-cursor-active");
    };

    const onMouseLeave = () => {
      isActive = false;
      setIsVisible(false);
      document.body.classList.remove("custom-cursor-active");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isActive) {
        isActive = true;
        setIsVisible(true);
        document.body.classList.add("custom-cursor-active");
      }
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const update = () => {
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;
      cursor.style.transform = `translate3d(${pos.x - 6}px, ${pos.y - 6}px, 0)`;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed z-[200] h-3 w-3 rounded-full"
      style={{
        background: "rgba(242, 239, 236, 0.9)",
        border: "1px solid rgba(13, 12, 11, 0.3)",
        transform: "translate3d(50vw, 50vh, 0)",
      }}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { prepareWithSegments, layoutWithLines, type PreparedTextWithSegments } from "@chenglou/pretext";

interface ReactiveTextProps {
  text: string;
  font?: string;
  lineHeight?: number;
  maxWidth?: number;
  className?: string;
}

export default function ReactiveText({
  text,
  font = '400 16px "DM Sans", sans-serif',
  lineHeight = 24,
  maxWidth = 800,
  className = "",
}: ReactiveTextProps) {
  const [lines, setLines] = useState<{ words: string[]; offset: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let active = true;
    const prepare = async () => {
      if ("fonts" in document) await document.fonts.ready;
      if (!active) return;

      const prepared: PreparedTextWithSegments = prepareWithSegments(text, font);
      const laidOut = layoutWithLines(prepared, maxWidth, lineHeight);

      let cursor = 0;
      const normalized = laidOut.lines.map((line) => {
        const words = line.text.trim().split(" ").filter(Boolean);
        const offset = cursor;
        cursor += words.length;
        return { words, offset };
      });

      setLines(normalized);
    };
    prepare();
    return () => { active = false; };
  }, [text, font, maxWidth, lineHeight]);

  useEffect(() => {
    let rafId: number;
    const animate = () => {
      const radius = 80;
      const strength = 18;
      const epsilon = 0.001;

      wordRefs.current.forEach((span) => {
        if (!span) return;
        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        const dx = cx - mousePos.current.x;
        const dy = cy - mousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + epsilon;

        if (dist < radius) {
          const power = (1 - dist / radius) * strength;
          const tx = (dx / dist) * power;
          const ty = (dy / dist) * power;
          span.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
          span.style.color = "color-mix(in oklab, var(--foreground) 60%, var(--highlight) 40%)";
        } else {
          span.style.transform = "translate3d(0, 0, 0)";
          span.style.color = "";
        }
      });
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [lines]);

  return (
    <div ref={containerRef} className={`select-none cursor-default ${className}`}>
      {lines.map((line, li) => (
        <div key={li} className="flex flex-wrap gap-x-[0.35em] mb-[0.2em]">
          {line.words.map((word, wi) => (
            <span
              key={wi}
              ref={(el) => {
                const idx = line.offset + wi;
                wordRefs.current[idx] = el;
              }}
              className="inline-block will-change-transform transition-[transform,color] duration-200"
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

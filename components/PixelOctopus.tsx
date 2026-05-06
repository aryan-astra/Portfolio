"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Point = { x: number; y: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function PixelOctopus() {
  const [position, setPosition] = useState<Point>({ x: 110, y: 130 });
  const [isAfraid, setIsAfraid] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const targetRef = useRef<Point>({ x: 110, y: 130 });
  const velocityRef = useRef<Point>({ x: 0, y: 0 });
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const prevMouseRef = useRef<Point>({ x: 0, y: 0 });
  const posRef = useRef<Point>({ x: 110, y: 130 });

  useEffect(() => {
    const sectionIds = ["hero", "featured", "projects", "skills", "hackathons", "writing", "contact"];

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
      const mdx = mouseRef.current.x - prevMouseRef.current.x;
      const mdy = mouseRef.current.y - prevMouseRef.current.y;
      const speed = Math.sqrt(mdx * mdx + mdy * mdy);
      prevMouseRef.current = { ...mouseRef.current };

      const dx = mouseRef.current.x - posRef.current.x;
      const dy = mouseRef.current.y - posRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 140 && speed > 18) {
        setIsAfraid(true);
        const runScale = 2.6;
        targetRef.current = {
          x: clamp(posRef.current.x - dx * runScale, 36, window.innerWidth - 36),
          y: clamp(posRef.current.y - dy * runScale, 64, window.innerHeight - 36),
        };
        return;
      }

      if (dist < 230 && speed < 2.5) {
        setIsAfraid(false);
        targetRef.current = {
          x: clamp(posRef.current.x + dx * 0.06, 36, window.innerWidth - 36),
          y: clamp(posRef.current.y + dy * 0.06, 64, window.innerHeight - 36),
        };
      }
    };

    const handleScroll = () => {
      if (isAfraid) return;

      let nearestTop = Number.POSITIVE_INFINITY;
      let nearestY = 150;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < nearestTop) {
          nearestTop = distance;
          nearestY = clamp(rect.top + window.scrollY + 60, 64, window.innerHeight - 40);
        }
      }

      targetRef.current = {
        x: clamp(targetRef.current.x, 36, window.innerWidth - 36),
        y: nearestY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const roamTimer = window.setInterval(() => {
      if (isAfraid) return;
      targetRef.current = {
        x: clamp(targetRef.current.x + (Math.random() - 0.5) * 240, 36, window.innerWidth - 36),
        y: clamp(targetRef.current.y + (Math.random() - 0.5) * 120, 64, window.innerHeight - 36),
      };
    }, 2800);

    let rafId = 0;
    const tick = () => {
      const stiffness = 0.05;
      const damping = 0.9;

      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      velocityRef.current.x = (velocityRef.current.x + dx * stiffness) * damping;
      velocityRef.current.y = (velocityRef.current.y + dy * stiffness) * damping;

      posRef.current = {
        x: posRef.current.x + velocityRef.current.x,
        y: posRef.current.y + velocityRef.current.y,
      };

      setIsMoving(distance > 1.5);
      setPosition(posRef.current);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.clearInterval(roamTimer);
      window.cancelAnimationFrame(rafId);
    };
  }, [isAfraid]);

  return (
    <div
      className="fixed z-[90] pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    >
      <motion.div
        animate={{ rotate: isMoving ? [0, -4, 4, 0] : 0, y: isMoving ? [0, -2, 0] : 0 }}
        transition={{ repeat: Infinity, duration: isMoving ? 1.2 : 2.5, ease: "easeInOut" }}
        className="relative"
      >
        <svg viewBox="0 0 90 90" className="h-14 w-14 drop-shadow-[0_8px_18px_rgba(213,63,140,0.34)]">
          <defs>
            <radialGradient id="octoBody" cx="36%" cy="26%" r="70%">
              <stop offset="0%" stopColor="#ffe4ef" />
              <stop offset="36%" stopColor="#fbb6ce" />
              <stop offset="72%" stopColor="#f687b3" />
              <stop offset="100%" stopColor="#d53f8c" />
            </radialGradient>
          </defs>

          <ellipse cx="45" cy="36" rx="24" ry="21" fill="url(#octoBody)" />

          <path d="M26 49c-7 4-9 9-9 14 0 5 3 8 7 8 4 0 8-3 9-7" stroke="#b83280" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M36 52c-5 4-6 8-6 12 0 5 3 8 6 8 4 0 7-3 7-7" stroke="#b83280" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M54 52c5 4 6 8 6 12 0 5-3 8-6 8-4 0-7-3-7-7" stroke="#b83280" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M64 49c7 4 9 9 9 14 0 5-3 8-7 8-4 0-8-3-9-7" stroke="#b83280" strokeWidth="4" strokeLinecap="round" fill="none" />

          <ellipse cx="37" cy="35" rx="7" ry="8" fill="#ffffff" />
          <ellipse cx="53" cy="35" rx="7" ry="8" fill="#ffffff" />
          <circle cx="37" cy="36" r="3" fill={isAfraid ? "#ef4444" : "#111827"} />
          <circle cx="53" cy="36" r="3" fill={isAfraid ? "#ef4444" : "#111827"} />

          <ellipse cx="35" cy="26" rx="12" ry="6" fill="#ffffff" fillOpacity="0.42" />
        </svg>

        {isAfraid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -right-2 -top-2 rounded-full bg-[#ef4444] px-1.5 py-0.5 text-[9px] font-bold text-white"
          >
            !
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * RevealBlock — fade-up on scroll into view with optional stagger delay.
 * Respects prefers-reduced-motion.
 */
export default function RevealBlock({ children, delay = 0, className }: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

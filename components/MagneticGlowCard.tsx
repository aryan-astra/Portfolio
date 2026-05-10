"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface MagneticGlowCardProps {
  children: ReactNode;
  className?: string;
}

export default function MagneticGlowCard({ children, className = "" }: MagneticGlowCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={`relative overflow-hidden rounded-xl border border-border/60 bg-card/70 transition-colors duration-200 hover:border-border group ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(26,24,22,0.08),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_38%)]" />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

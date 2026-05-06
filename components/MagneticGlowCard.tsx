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
      className={`relative overflow-hidden rounded-xl border border-border/60 bg-card/70 transition-colors duration-200 hover:border-border group ${className}`}
    >
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

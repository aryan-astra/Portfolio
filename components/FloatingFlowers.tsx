"use client";

import { motion } from "framer-motion";

type Flower = {
  id: string;
  left: string;
  top: string;
  scale: number;
  rotate: number;
  delay: number;
};

const FLOWERS: Flower[] = [
  { id: "f1", left: "6%", top: "22%", scale: 0.9, rotate: -12, delay: 0 },
  { id: "f2", left: "12%", top: "74%", scale: 0.8, rotate: 8, delay: 0.3 },
  { id: "f3", left: "86%", top: "26%", scale: 0.95, rotate: 10, delay: 0.2 },
  { id: "f4", left: "91%", top: "70%", scale: 0.82, rotate: -8, delay: 0.5 },
  { id: "f5", left: "48%", top: "10%", scale: 0.76, rotate: 5, delay: 0.6 },
  { id: "f6", left: "52%", top: "84%", scale: 0.86, rotate: -5, delay: 0.4 },
];

function FlowerSprite() {
  return (
    <svg viewBox="0 0 80 120" className="h-20 w-12 sm:h-24 sm:w-14">
      <path d="M40 48c-5 8-7 16-6 24 1 11 5 22 6 40" stroke="#3f7f53" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M39 65c-13-7-21-6-25 3 9 3 17 3 24-1" fill="#6bae75" fillOpacity="0.9" />
      <path d="M41 72c13-7 21-6 25 3-9 3-17 3-24-1" fill="#6bae75" fillOpacity="0.9" />

      <circle cx="40" cy="32" r="9" fill="#f7f0ff" />
      <ellipse cx="40" cy="18" rx="8" ry="12" fill="#a78bfa" />
      <ellipse cx="52" cy="24" rx="8" ry="11" fill="#8b5cf6" transform="rotate(35 52 24)" />
      <ellipse cx="28" cy="24" rx="8" ry="11" fill="#8b5cf6" transform="rotate(-35 28 24)" />
      <ellipse cx="50" cy="38" rx="8" ry="11" fill="#7c3aed" transform="rotate(65 50 38)" />
      <ellipse cx="30" cy="38" rx="8" ry="11" fill="#7c3aed" transform="rotate(-65 30 38)" />
      <circle cx="40" cy="31" r="5" fill="#fef08a" />
    </svg>
  );
}

export default function FloatingFlowers() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {FLOWERS.map((flower) => (
        <motion.div
          key={flower.id}
          className="absolute"
          style={{ left: flower.left, top: flower.top }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.55, y: [0, -6, 0], rotate: [flower.rotate, flower.rotate + 2, flower.rotate] }}
          transition={{ duration: 6, delay: flower.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div style={{ transform: `scale(${flower.scale})` }}>
            <FlowerSprite />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const FLOWER_LINES = [
  "           *  *",
  "        *   ***  *",
  "       * *  ***  * *",
  "      *  * *****  * *",
  "     * * * ***** * * *",
  "    *  * * **O** * * *",
  "     * * * ***** * * *",
  "      *  * *****  * *",
  "       * *  ***  * *",
  "        *   ***  *",
  "           *  *",
];

type Props = {
  onComplete?: () => void;
};

export default function AsciiFlowerLoader({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total animation time: stagger (11 * 0.045s) + initial 0.5s + 1s pause + 0.6s fade = ~2.8s
    // Then exit animation 0.6s
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(6px)",
            transition: { duration: 0.6 },
          }}
          onAnimationComplete={(animation) => {
            if (animation === "exit" && onComplete) onComplete();
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[color:var(--background)]"
        >
          <div className="font-mono text-center" style={{ color: "var(--foreground)", opacity: 0.55 }}>
            {FLOWER_LINES.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: idx * 0.045,
                }}
                className="text-[0.85rem] leading-snug"
              >
                {line.split("").map((char, charIdx) => (
                  <span
                    key={`${idx}-${charIdx}`}
                    style={
                      char === "O"
                        ? {
                            color: "var(--highlight)",
                            opacity: 1,
                            textShadow: "0 0 8px var(--highlight)",
                          }
                        : undefined
                    }
                  >
                    {char}
                  </span>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
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
          animate={{ opacity: 1 }}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: idx * 0.045,
                }}
                className="whitespace-pre text-[0.85rem] leading-snug"
              >
                {line.split("").map((char, charIdx) => (
                  <span
                    key={`${idx}-${charIdx}`}
                    style={
                      char === "O"
                        ? {
                            color: "var(--highlight)",
                            textShadow: "0 0 8px var(--highlight)",
                          }
                        : { opacity: 1 }
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

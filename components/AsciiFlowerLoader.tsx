"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FLOWER_LINES = [
  "           8X8",
  "        @S  @@xx88",
  "        @##XSS@XXXX",
  "       @@@@XXX8#@",
  "      #@@@0S@@00S#",
  "    @  X##S@@@@@  @8@",
  "  @@  XX#S@@@@  S#S8XX0",
  " @3@ X S 0S00@@##00S08SS @@",
  "  @@8  S08S88S@S00#S@@@6@X",
  "     X 0XX38@@@S08X  08S0S0@",
  "      8X XX@ 08  #X80X#0@",
  "          0X#@ #X89@@@@8",
  "           x8  @ S#@@@@SS0",
  "   @          SSS0G@#@@@@S#",
  "   #00         @ X X8 0S@",
  "    XX0S        #8S XXXX 8",
  "      S8X  X          D88XX88BS",
  "                       XX880S#",
  "                        XX88",
  "                 @ @",
  "                 X08",
  "                  S",
  "              S",
  "           0 X",
  "        @  #",
  "         88 X",
  "        S8",
  "   @00008X",
];

export default function AsciiFlowerLoader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Flower blooms for 3.5 seconds before fading out
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 1200); // Wait for fade out animation
    }, 3800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.15 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          <div className="relative flex flex-col items-center justify-center font-mono text-sm sm:text-base md:text-lg leading-[1.05] select-none tracking-tighter">
            {FLOWER_LINES.map((line, index) => {
              const isTop = index < 11;
              const isMiddle = index >= 11 && index < 19;
              const isStem = index >= 19;

              let baseColor = "rgba(255, 120, 200, 1)"; // Pink
              let glowColor = "rgba(255, 0, 150, 0.8)";
              
              if (isTop) {
                baseColor = "rgba(150, 200, 255, 1)"; // Light blue
                glowColor = "rgba(50, 100, 255, 0.8)";
              } else if (isMiddle) {
                baseColor = "rgba(230, 130, 255, 1)"; // Fuchsia
                glowColor = "rgba(180, 0, 255, 0.8)";
              } else if (isStem) {
                baseColor = "rgba(100, 255, 200, 1)"; // Cyan
                glowColor = "rgba(0, 150, 150, 0.8)";
              }

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ 
                    duration: 1.8, 
                    delay: index * 0.06, 
                    ease: [0.2, 0.8, 0.2, 1] 
                  }}
                  className="relative whitespace-pre font-bold"
                  style={{
                    color: baseColor,
                    // The core of intense bloom is multiple layered shadows
                    textShadow: `
                      0 0 5px ${baseColor}, 
                      0 0 15px ${glowColor}, 
                      0 0 30px ${glowColor}, 
                      0 0 50px ${glowColor}, 
                      0 0 80px ${glowColor}
                    `,
                  }}
                >
                  {line}
                </motion.div>
              );
            })}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0.1] }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{
              background: "radial-gradient(circle at center, rgba(167, 139, 250, 0.2) 0%, transparent 50%)"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

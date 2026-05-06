"use client";

import { useEffect, useState, useRef } from "react";

const EYE_FRAMES = {
  center: [
    "   .-------.   ",
    "  /         \\  ",
    " |   ( O )   | ",
    "  \\         /  ",
    "   '-------'   "
  ],
  up: [
    "   .-------.   ",
    "  /  ( O )  \\  ",
    " |           | ",
    "  \\         /  ",
    "   '-------'   "
  ],
  down: [
    "   .-------.   ",
    "  /         \\  ",
    " |           | ",
    "  \\  ( O )  /  ",
    "   '-------'   "
  ],
  left: [
    "   .-------.   ",
    "  /         \\  ",
    " | ( O )     | ",
    "  \\         /  ",
    "   '-------'   "
  ],
  right: [
    "   .-------.   ",
    "  /         \\  ",
    " |     ( O ) | ",
    "  \\         /  ",
    "   '-------'   "
  ],
  upLeft: [
    "   .-------.   ",
    "  / ( O )   \\  ",
    " |           | ",
    "  \\         /  ",
    "   '-------'   "
  ],
  upRight: [
    "   .-------.   ",
    "  /   ( O ) \\  ",
    " |           | ",
    "  \\         /  ",
    "   '-------'   "
  ],
  downLeft: [
    "   .-------.   ",
    "  /         \\  ",
    " |           | ",
    "  \\ ( O )   /  ",
    "   '-------'   "
  ],
  downRight: [
    "   .-------.   ",
    "  /         \\  ",
    " |           | ",
    "  \\   ( O ) /  ",
    "   '-------'   "
  ]
};

export default function AsciiEye() {
  const [direction, setDirection] = useState<keyof typeof EYE_FRAMES>("center");
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      
      const rect = eyeRef.current.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;
      
      const dx = e.clientX - eyeX;
      const dy = e.clientY - eyeY;
      
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < 50) {
        setDirection("center");
      } else {
        if (angle > -22.5 && angle <= 22.5) setDirection("right");
        else if (angle > 22.5 && angle <= 67.5) setDirection("downRight");
        else if (angle > 67.5 && angle <= 112.5) setDirection("down");
        else if (angle > 112.5 && angle <= 157.5) setDirection("downLeft");
        else if (angle > 157.5 || angle <= -157.5) setDirection("left");
        else if (angle > -157.5 && angle <= -112.5) setDirection("upLeft");
        else if (angle > -112.5 && angle <= -67.5) setDirection("up");
        else if (angle > -67.5 && angle <= -22.5) setDirection("upRight");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={eyeRef} 
      className="font-mono text-accent-blue whitespace-pre leading-tight select-none flex flex-col items-center justify-center min-h-[16rem] transition-colors duration-300"
    >
      {EYE_FRAMES[direction].join("\n")}
    </div>
  );
}

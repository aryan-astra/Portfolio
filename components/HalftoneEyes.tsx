"use client";

import { useEffect, useRef } from "react";

export default function HalftoneEyes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const dotSpacing = 5;
      const cols = Math.ceil(w / dotSpacing);
      const rows = Math.ceil(h / dotSpacing);

      // Eye parameters for two eyes
      const eyeCenters = [
        { x: w * 0.35, y: h * 0.5 },
        { x: w * 0.65, y: h * 0.5 }
      ];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * dotSpacing;
          const py = r * dotSpacing;

          let intensity = 0;

          eyeCenters.forEach((center) => {
            const dx = px - center.x;
            const dy = (py - center.y) * 1.5; // Flatten eyes
            const distSq = dx * dx + dy * dy;
            
            // Eye shape (almond-ish)
            const eyeRadius = 45;
            if (distSq < eyeRadius * eyeRadius) {
              // Iris & Pupil logic
              const mdx = mousePos.current.x - center.x;
              const mdy = mousePos.current.y - center.y;
              const mDist = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
              const limit = 15;
              const offX = (mdx / mDist) * Math.min(mDist, limit);
              const offY = (mdy / mDist) * Math.min(mDist, limit);

              const pdx = px - (center.x + offX);
              const pdy = py - (center.y + offY);
              const pDistSq = pdx * pdx + pdy * pdy;

              if (pDistSq < 15 * 15) {
                intensity = 1.0; // Pupil
              } else if (pDistSq < 28 * 28) {
                intensity = 0.7; // Iris
              } else {
                intensity = 0.2; // Sclera (whites)
              }
              
              // Eyelid/Eyelash intensity (top and bottom edges)
              const edgeDist = Math.abs(Math.sqrt(distSq) - eyeRadius);
              if (edgeDist < 8) {
                intensity = Math.max(intensity, (8 - edgeDist) / 8);
              }
            }
          });

          if (intensity > 0) {
            const radius = (intensity * dotSpacing) / 2;
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
            ctx.fill();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ background: "transparent" }} />;
}

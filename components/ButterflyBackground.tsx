"use client";

import { useEffect, useRef } from "react";

interface Bloom {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

export default function ButterflyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const blooms = useRef<Bloom[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Add new bloom occasionally on move
      if (Math.random() > 0.8) {
        const colors = ["#ff9aa2", "#b5ead7", "#c7ceea", "#ffdac1", "#e2f0cb"];
        blooms.current.push({
          x: e.clientX,
          y: e.clientY,
          size: 40 + Math.random() * 60,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.3,
          life: 1.0
        });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw Dot Grid (Subtle Warm)
      const dotSpacing = 32;
      ctx.fillStyle = "rgba(180, 160, 140, 0.15)";
      for (let x = 0; x < w; x += dotSpacing) {
        for (let y = 0; y < h; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Update and Draw Blooms
      ctx.globalCompositeOperation = "screen";
      blooms.current = blooms.current.filter((b) => b.life > 0);
      blooms.current.forEach((b) => {
        b.life -= 0.01;
        b.alpha = b.life * 0.3;
        
        const alphaHex = Math.max(0, Math.floor(b.alpha * 255)).toString(16).padStart(2, '0');
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size);
        grad.addColorStop(0, b.color + alphaHex);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";

      // 3. Main Mouse Halo
      const haloGrad = ctx.createRadialGradient(
        mousePos.current.x, mousePos.current.y, 0,
        mousePos.current.x, mousePos.current.y, 180
      );
      haloGrad.addColorStop(0, "rgba(255, 245, 230, 0.15)");
      haloGrad.addColorStop(1, "transparent");
      ctx.fillStyle = haloGrad;
      ctx.fillRect(0, 0, w, h);

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ filter: "blur(12px) contrast(1.1)" }}
    />
  );
}

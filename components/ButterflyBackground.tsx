"use client";

import { useEffect, useRef } from "react";

export default function ButterflyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Particle = {
      x: number;
      y: number;
      alpha: number;
      radius: number;
    };

    const trail: Particle[] = [];
    let mouseX = -999;
    let mouseY = -999;
    let rafId = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      trail.push({
        x: mouseX,
        y: mouseY,
        alpha: 1.0,
        radius: 4,
      });
      if (trail.length > 28) trail.shift();
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.alpha -= 0.038;
        p.radius = 4 * p.alpha;

        if (p.alpha <= 0) {
          trail.splice(i, 1);
          continue;
        }

        const isHead = i === trail.length - 1;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.radius, 0.5), 0, Math.PI * 2);

        if (isHead) {
          ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue("--highlight")
            .trim() || "#2563EB";
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue("--foreground")
            .trim() || "#1A1816";
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ mixBlendMode: "normal" }}
    />
  );
}

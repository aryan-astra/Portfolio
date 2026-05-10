"use client";

import { useEffect, useRef } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  age: number;
  size: number;
};

export default function ButterflyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    const pointer = { x: -999, y: -999, prevX: -999, prevY: -999 };
    let rafId = 0;
    let particleId = 0;
    const MAX_PARTICLES = 28;

    const highlight = () => getComputedStyle(document.documentElement).getPropertyValue("--highlight").trim() || "#2563EB";
    const foreground = () => getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#1A1816";

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = e.clientX;
      pointer.y = e.clientY;

      const dx = pointer.x - pointer.prevX;
      const dy = pointer.y - pointer.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      const createParticle = (offsetX = 0, offsetY = 0, scale = 1) => {
        particles.push({
          id: particleId++,
          x: pointer.x + offsetX,
          y: pointer.y + offsetY,
          vx: dx * 0.02 * scale + (Math.random() - 0.5) * 0.18,
          vy: dy * 0.02 * scale + (Math.random() - 0.5) * 0.18,
          life: 1,
          age: 0,
          size: 1.8 + Math.min(4.4, speed * 0.04) * scale,
        });
      };

      createParticle();

      if (speed > 10) {
        createParticle(-dx * 0.08, -dy * 0.08, 0.82);
      }

      while (particles.length > MAX_PARTICLES) {
        particles.shift();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const fg = foreground();
      const hl = highlight();

      ctx.globalCompositeOperation = "lighter";

      particles.forEach((particle, index) => {
        particle.age += 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.965;
        particle.vy *= 0.965;
        particle.life *= 0.965;

        const fade = Math.max(0, particle.life);
        const isHead = index === particles.length - 1;
        const radius = particle.size + index * 0.08;
        const alpha = isHead ? 0.95 * fade : 0.22 * fade;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = hl;
        ctx.shadowBlur = isHead ? 18 : 8;
        ctx.fillStyle = isHead ? hl : fg;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, isHead ? radius * 1.2 : radius, 0, Math.PI * 2);
        ctx.fill();

        if (isHead) {
          ctx.globalAlpha = 0.45 * fade;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, radius * 2.1, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      while (particles.length > 0 && particles[0].life < 0.06) {
        particles.shift();
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
      style={{ mixBlendMode: "screen" }}
    />
  );
}

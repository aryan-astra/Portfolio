"use client";

import { useEffect, useRef } from "react";

export default function ButterflyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Cell = {
      x: number;
      y: number;
      energy: number;
      rotation: number;
      targetRotation: number;
      pulse: number;
      seed: number;
    };

    const cells: Cell[] = [];
    const pointer = { x: -999, y: -999, prevX: -999, prevY: -999 };
    const gridStep = 42;
    const influenceRadius = 128;
    let rafId = 0;

    const highlight = () => getComputedStyle(document.documentElement).getPropertyValue("--highlight").trim() || "#2563EB";
    const foreground = () => getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#1A1816";

    const buildGrid = () => {
      cells.length = 0;
      for (let y = gridStep * 0.5; y < window.innerHeight + gridStep; y += gridStep) {
        for (let x = gridStep * 0.5; x < window.innerWidth + gridStep; x += gridStep) {
          cells.push({
            x,
            y,
            energy: 0,
            rotation: 0,
            targetRotation: 0,
            pulse: Math.random() * Math.PI * 2,
            seed: Math.random(),
          });
        }
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    };

    const onMouseMove = (e: MouseEvent) => {
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = e.clientX;
      pointer.y = e.clientY;

      const dx = pointer.x - pointer.prevX;
      const dy = pointer.y - pointer.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      for (const cell of cells) {
        const distX = cell.x - pointer.x;
        const distY = cell.y - pointer.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        if (distance > influenceRadius) continue;

        const proximity = 1 - distance / influenceRadius;
        cell.energy = Math.min(1, cell.energy + proximity * 0.55 + speed * 0.004);
        cell.targetRotation = Math.atan2(dy || 0.001, dx || 0.001) * 0.25;
        cell.pulse = 0;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "source-over";

      const fg = foreground();
      const hl = highlight();

      // Subtle grid skeleton so the field always feels structured.
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = fg;
      ctx.lineWidth = 1;
      for (let x = 0; x < window.innerWidth; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, window.innerHeight);
        ctx.stroke();
      }
      for (let y = 0; y < window.innerHeight; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(window.innerWidth, y + 0.5);
        ctx.stroke();
      }
      ctx.restore();

      ctx.globalCompositeOperation = "lighter";

      for (const cell of cells) {
        cell.energy *= 0.92;
        cell.rotation += (cell.targetRotation - cell.rotation) * 0.11;
        cell.targetRotation *= 0.92;
        cell.pulse += 0.04;

        const energy = Math.max(0, cell.energy);
        const size = 12 + energy * 14;
        const inner = size * 0.36;
        const petalSize = inner * 0.72 + Math.sin(cell.pulse + cell.seed * 10) * 0.8;
        const alpha = 0.08 + energy * 0.86;

        ctx.save();
        ctx.translate(cell.x, cell.y);
        ctx.rotate(cell.rotation);
        ctx.globalAlpha = alpha;
        ctx.shadowColor = hl;
        ctx.shadowBlur = 8 + energy * 18;

        // Outer square frame.
        ctx.strokeStyle = energy > 0.2 ? hl : fg;
        ctx.lineWidth = 1.1;
        ctx.strokeRect(-size * 0.52, -size * 0.52, size * 1.04, size * 1.04);

        // Four petals that feel like a tiny flower opening/closing.
        ctx.fillStyle = energy > 0.55 ? hl : fg;
        const offsets = [
          [0, -petalSize - 2],
          [petalSize + 2, 0],
          [0, petalSize + 2],
          [-petalSize - 2, 0],
        ];

        for (const [ox, oy] of offsets) {
          ctx.beginPath();
          ctx.roundRect(ox - 2.5, oy - 2.5, 5, 5, 1.5);
          ctx.fill();
        }

        // Center bloom.
        ctx.shadowBlur = 0;
        ctx.fillStyle = hl;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(1.6, inner * 0.55), 0, Math.PI * 2);
        ctx.fill();

        // Tiny inner brackets give the impression of flip/hinge motion.
        ctx.strokeStyle = fg;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-inner, -inner * 0.15);
        ctx.lineTo(-inner * 0.35, -inner * 0.15);
        ctx.moveTo(inner * 0.35, -inner * 0.15);
        ctx.lineTo(inner, -inner * 0.15);
        ctx.stroke();

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
      style={{ mixBlendMode: "multiply" }}
    />
  );
}

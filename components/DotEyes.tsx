"use client";

import { useEffect, useRef } from "react";

const CANVAS_W = 260;
const CANVAS_H = 110;
const DOT_GAP = 7;
const EYE_L = { cx: 72, cy: 55 };
const EYE_R = { cx: 188, cy: 55 };
const EYE_RX = 46;
const EYE_RY = 26;
const IRIS_R = 20;
const PUPIL_R = 9;
const MAX_DRIFT = 8;
const BLINK_DUR = 160;
const CENTER = [EYE_L, EYE_R] as const;

const C_PUPIL_DEEP = "#0a0906";
const C_PUPIL_EDGE = "#1a0d07";
const C_IRIS_INNER = "#2a1508";
const C_IRIS_MID = "#5c3018";
const C_IRIS_OUTER = "#8b5a32";
const C_IRIS_RIM = "#a86b3a";
const C_SCLERA = "#e8dece";
const C_SCLERA_NEAR = "#d4c8b4";

type Dot = { x: number; y: number };
type Eye = { cx: number; cy: number; px: number; py: number };

function buildDots(cx: number, cy: number): Dot[] {
  const dots: Dot[] = [];
  for (let x = cx - EYE_RX - DOT_GAP; x <= cx + EYE_RX + DOT_GAP; x += DOT_GAP) {
    for (let y = cy - EYE_RY - DOT_GAP; y <= cy + EYE_RY + DOT_GAP; y += DOT_GAP) {
      const nx = (x - cx) / EYE_RX;
      const ny = (y - cy) / EYE_RY;
      if (nx * nx + ny * ny <= 1.05) dots.push({ x, y });
    }
  }
  return dots;
}

const DOTS = [buildDots(EYE_L.cx, EYE_L.cy), buildDots(EYE_R.cx, EYE_R.cy)] as const;

function drawEye(ctx: CanvasRenderingContext2D, dots: Dot[], eye: Eye, blink: number) {
  const open = 1 - blink;
  for (const dot of dots) {
    const y = eye.cy + (dot.y - eye.cy) * open;
    if (Math.abs(dot.y - eye.cy) * open > EYE_RY + 1) continue;

    const irisDistance = Math.hypot(dot.x - eye.px, dot.y - eye.py);
    let color: string;
    let radius: number;
    if (irisDistance < PUPIL_R * 0.5) [color, radius] = [C_PUPIL_DEEP, 2.8];
    else if (irisDistance < PUPIL_R) [color, radius] = [C_PUPIL_EDGE, 2.6];
    else if (irisDistance < IRIS_R * 0.55) [color, radius] = [C_IRIS_INNER, 2.4];
    else if (irisDistance < IRIS_R * 0.75) [color, radius] = [C_IRIS_MID, 2.2];
    else if (irisDistance < IRIS_R * 0.95) [color, radius] = [C_IRIS_OUTER, 2];
    else if (irisDistance < IRIS_R * 1.2) [color, radius] = [C_IRIS_RIM, 1.8];
    else [color, radius] = [Math.abs(dot.x - eye.cx) / EYE_RX > 0.6 ? C_SCLERA_NEAR : C_SCLERA, 1.4];

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(dot.x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const hx = eye.px - 5;
  const hy = eye.py - 5;
  const highlightY = eye.cy + (hy - eye.cy) * open;
  if (Math.abs(hy - eye.cy) * open <= EYE_RY) {
    ctx.fillStyle = "rgba(255, 252, 245, 0.92)";
    ctx.beginPath();
    ctx.arc(hx, highlightY, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paint(ctx: CanvasRenderingContext2D, eyes: Eye[], blink: number) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  drawEye(ctx, DOTS[0], eyes[0], blink);
  drawEye(ctx, DOTS[1], eyes[1], blink);
}

export default function DotEyes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const eyes: Eye[] = CENTER.map(({ cx, cy }) => ({ cx, cy, px: cx, py: cy }));
    const targets = CENTER.map(({ cx, cy }) => ({ x: cx, y: cy }));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let reduced = reducedMotion.matches;
    let fine = finePointer.matches && !reduced;
    let visible = !document.hidden;
    let inViewport = false;
    let frame = 0;
    let blinkTimer = 0;
    let blinkStart = 0;
    let blinking = false;
    let blink = 0;
    let pointerX = 0;
    let pointerY = 0;

    const active = () => visible && inViewport;
    const cancelWork = () => {
      if (frame) cancelAnimationFrame(frame);
      if (blinkTimer) window.clearTimeout(blinkTimer);
      frame = 0;
      blinkTimer = 0;
    };
    const setCenterTargets = () => {
      CENTER.forEach(({ cx, cy }, i) => {
        targets[i] = { x: cx, y: cy };
        if (reduced || !fine) {
          eyes[i].px = cx;
          eyes[i].py = cy;
        }
      });
    };
    const requestFrame = () => {
      if (!frame && active()) frame = requestAnimationFrame(drawFrame);
    };
    const scheduleBlink = () => {
      if (!active() || reduced) return;
      if (blinkTimer) window.clearTimeout(blinkTimer);
      blinkTimer = window.setTimeout(() => {
        blinkTimer = 0;
        blinking = true;
        blinkStart = performance.now();
        requestFrame();
      }, 3000 + Math.random() * 5000);
    };
    const drawFrame = (now: number) => {
      frame = 0;
      if (!active()) return;

      let settling = false;
      if (fine && !reduced) {
        eyes.forEach((eye, i) => {
          eye.px += (targets[i].x - eye.px) * 0.12;
          eye.py += (targets[i].y - eye.py) * 0.12;
          if (Math.abs(targets[i].x - eye.px) > 0.05 || Math.abs(targets[i].y - eye.py) > 0.05) settling = true;
        });
      }

      if (blinking) {
        const t = Math.min((now - blinkStart) / BLINK_DUR, 1);
        blink = t < 0.5 ? t * 2 : (1 - t) * 2;
        if (t === 1) {
          blink = 0;
          blinking = false;
          scheduleBlink();
        }
      }

      paint(ctx, eyes, blink);
      if (settling || blinking) requestFrame();
    };

    const updateTarget = (clientX: number, clientY: number) => {
      if (!active()) return;
      pointerX = clientX;
      pointerY = clientY;
      if (!fine || reduced) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      CENTER.forEach(({ cx, cy }, i) => {
        const x = ((pointerX - rect.left) / rect.width) * CANVAS_W;
        const y = ((pointerY - rect.top) / rect.height) * CANVAS_H;
        const angle = Math.atan2(y - cy, x - cx);
        const drift = Math.min(Math.hypot(x - cx, y - cy) * 0.4, MAX_DRIFT);
        targets[i] = { x: cx + Math.cos(angle) * drift, y: cy + Math.sin(angle) * drift };
      });
      requestFrame();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      updateTarget(event.clientX, event.clientY);
    };
    const onPointerLeave = () => {
      CENTER.forEach(({ cx, cy }, i) => { targets[i] = { x: cx, y: cy }; });
      requestFrame();
    };
    const updateActive = () => {
      const nextVisible = !document.hidden;
      if (visible && inViewport && (!nextVisible || reduced)) {
        cancelWork();
        blink = 0;
        blinking = false;
      }
      visible = nextVisible;
      if (active()) {
        requestFrame();
        scheduleBlink();
      }
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      fine = finePointer.matches && !reduced;
      setCenterTargets();
      if (reduced) {
        cancelWork();
        blink = 0;
        blinking = false;
      }
      if (active()) {
        requestFrame();
        scheduleBlink();
      }
    };
    const onPointerCapabilityChange = () => {
      fine = finePointer.matches && !reduced;
      setCenterTargets();
      requestFrame();
    };

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          inViewport = entry.isIntersecting;
          if (!inViewport) {
            cancelWork();
            blink = 0;
            blinking = false;
          } else {
            requestFrame();
            scheduleBlink();
          }
        }, { threshold: 0 });
    if (observer) observer.observe(canvas);
    else inViewport = true;

    document.addEventListener("visibilitychange", updateActive);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    reducedMotion.addEventListener("change", onMotionChange);
    finePointer.addEventListener("change", onPointerCapabilityChange);
    if (active()) {
      requestFrame();
      scheduleBlink();
    }

    return () => {
      cancelWork();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updateActive);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      reducedMotion.removeEventListener("change", onMotionChange);
      finePointer.removeEventListener("change", onPointerCapabilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} aria-hidden style={{ display: "block", width: "100%", maxWidth: CANVAS_W }} />;
}

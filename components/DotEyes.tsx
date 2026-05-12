"use client";

import { useEffect, useRef, useCallback } from "react";

/*
  Natural dot-matrix eyes inspired by warm dark brown eyes.
  Two eyes, almond-shaped, with:
  - Warm off-white sclera dots
  - Dark hazel/brown iris dots (NOT pink)
  - Very dark pupil center
  - Highlight glint
  - Mouse-tracking pupils (gentle lerp)
  - Occasional natural blink
*/

const CANVAS_W = 260;
const CANVAS_H = 110;
const DOT_GAP = 7;

// Eye geometry
const EYE_L = { cx: 72, cy: 55 };
const EYE_R = { cx: 188, cy: 55 };
const EYE_RX = 46;  // eye oval x-radius
const EYE_RY = 26;  // eye oval y-radius
const IRIS_R = 20;  // iris radius
const PUPIL_R = 9;  // pupil radius
const MAX_DRIFT = 8;

// Color palette — warm dark brown, no pink
const C_PUPIL_DEEP   = "#0a0906";
const C_PUPIL_EDGE   = "#1a0d07";
const C_IRIS_INNER   = "#2a1508";
const C_IRIS_MID     = "#5c3018";
const C_IRIS_OUTER   = "#8b5a32";
const C_IRIS_RIM     = "#a86b3a";
const C_SCLERA       = "#e8dece";
const C_SCLERA_NEAR  = "#d4c8b4";

interface Eye {
  cx: number;
  cy: number;
  px: number; // pupil x (lerped)
  py: number;
}

function buildDots(cx: number, cy: number) {
  const dots: { x: number; y: number }[] = [];
  for (let x = cx - EYE_RX - DOT_GAP; x <= cx + EYE_RX + DOT_GAP; x += DOT_GAP) {
    for (let y = cy - EYE_RY - DOT_GAP; y <= cy + EYE_RY + DOT_GAP; y += DOT_GAP) {
      const nx = (x - cx) / EYE_RX;
      const ny = (y - cy) / EYE_RY;
      // Almond shape: standard ellipse with slight corner pinch
      if (nx * nx + ny * ny <= 1.05) {
        dots.push({ x, y });
      }
    }
  }
  return dots;
}

const DOTS_L = buildDots(EYE_L.cx, EYE_L.cy);
const DOTS_R = buildDots(EYE_R.cx, EYE_R.cy);

interface Props {
  mouseX: number;
  mouseY: number;
  canvasRect: DOMRect | null;
}

export default function DotEyes({ mouseX, mouseY, canvasRect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eyeLRef = useRef<Eye>({ ...EYE_L, px: EYE_L.cx, py: EYE_L.cy });
  const eyeRRef = useRef<Eye>({ ...EYE_R, px: EYE_R.cx, py: EYE_R.cy });
  const blinkRef = useRef(0); // 0=open, 1=closed
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);

  const scheduleBlink = useCallback(() => {
    const delay = 3000 + Math.random() * 5000;
    blinkTimerRef.current = setTimeout(() => {
      const start = performance.now();
      const BLINK_DUR = 160;
      const animBlink = (now: number) => {
        const t = Math.min((now - start) / BLINK_DUR, 1);
        blinkRef.current = t < 0.5 ? t * 2 : (1 - t) * 2;
        if (t < 1) requestAnimationFrame(animBlink);
        else { blinkRef.current = 0; scheduleBlink(); }
      };
      requestAnimationFrame(animBlink);
    }, delay);
  }, []);

  useEffect(() => {
    scheduleBlink();
    return () => { if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current); };
  }, [scheduleBlink]);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const canvas = canvasRef.current;
      if (!canvas) { rafRef.current = requestAnimationFrame(tick); return; }
      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(tick); return; }

      // Update pupil targets from mouse
      for (const [eye, eDef] of [[eyeLRef.current, EYE_L], [eyeRRef.current, EYE_R]] as const) {
        let tPx = eDef.cx;
        let tPy = eDef.cy;
        if (canvasRect) {
          const rx = CANVAS_W / canvasRect.width;
          const ry = CANVAS_H / canvasRect.height;
          const mx = (mouseX - canvasRect.left) * rx;
          const my = (mouseY - canvasRect.top) * ry;
          const angle = Math.atan2(my - eDef.cy, mx - eDef.cx);
          const drift = Math.min(Math.hypot(mx - eDef.cx, my - eDef.cy) * 0.4, MAX_DRIFT);
          tPx = eDef.cx + Math.cos(angle) * drift;
          tPy = eDef.cy + Math.sin(angle) * drift;
        }
        eye.px = lerp(eye.px, tPx, 0.09);
        eye.py = lerp(eye.py, tPy, 0.09);
      }

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      const blink = blinkRef.current; // 0=open, 1=closed
      const openFactor = 1 - blink;   // 1=open, 0=closed

      for (const [dots, eDef, eye] of [
        [DOTS_L, EYE_L, eyeLRef.current],
        [DOTS_R, EYE_R, eyeRRef.current],
      ] as const) {
        for (const dot of dots) {
          // Blink squish — scale y around eye center
          const drawY = eDef.cy + (dot.y - eDef.cy) * openFactor;

          // Skip dots that are outside the blinked range
          if (Math.abs(dot.y - eDef.cy) * openFactor > EYE_RY + 1) continue;

          const dFromIris = Math.hypot(dot.x - eye.px, dot.y - eye.py);
          const dFromCenter = Math.hypot(dot.x - eDef.cx, dot.y - eDef.cy);

          let fillColor: string;
          let radius: number;

          if (dFromIris < PUPIL_R * 0.5) {
            fillColor = C_PUPIL_DEEP;
            radius = 2.8;
          } else if (dFromIris < PUPIL_R) {
            fillColor = C_PUPIL_EDGE;
            radius = 2.6;
          } else if (dFromIris < IRIS_R * 0.55) {
            fillColor = C_IRIS_INNER;
            radius = 2.4;
          } else if (dFromIris < IRIS_R * 0.75) {
            fillColor = C_IRIS_MID;
            radius = 2.2;
          } else if (dFromIris < IRIS_R * 0.95) {
            fillColor = C_IRIS_OUTER;
            radius = 2.0;
          } else if (dFromIris < IRIS_R * 1.2) {
            fillColor = C_IRIS_RIM;
            radius = 1.8;
          } else {
            // Sclera — vary slightly by horizontal position for depth
            const t = Math.abs(dot.x - eDef.cx) / EYE_RX;
            fillColor = t > 0.6 ? C_SCLERA_NEAR : C_SCLERA;
            radius = 1.4;
          }

          ctx.fillStyle = fillColor;
          ctx.beginPath();
          ctx.arc(dot.x, drawY, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Highlight glint — small bright spot offset upper-left of pupil
        const hx = eye.px - 5;
        const hy = eye.py - 5;
        const hDrawY = eDef.cy + (hy - eDef.cy) * openFactor;
        if (Math.abs(hy - eDef.cy) * openFactor <= EYE_RY) {
          ctx.fillStyle = "rgba(255, 252, 245, 0.92)";
          ctx.beginPath();
          ctx.arc(hx, hDrawY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mouseX, mouseY, canvasRect]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      aria-hidden
      className="w-full"
      style={{ maxWidth: CANVAS_W }}
    />
  );
}

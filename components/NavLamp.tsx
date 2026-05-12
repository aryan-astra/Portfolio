"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// ── SVG geometry (all in SVG units = screen pixels, 1:1) ───────
const W            = 36;
const CX           = W / 2; // 18

// Lamp shade — compact trapezoid
const SHADE_TOP_Y  = 2;   // y where shade top edge begins
const SHADE_BOT_Y  = 24;  // y where shade bottom edge ends (22px tall shade)
const SHADE_TOP_HW = 7;   // half-width at top → full width 14px
const SHADE_BOT_HW = 16;  // half-width at bottom → full width 32px

// Bulb — inside shade
const BULB_CY = 14;  // bulb centre y  (shade spans y=2..24, so 14 is inside)
const BULB_R  = 8;   // bulb radius (≤ half shade width at that y)

// Socket / pipe below shade
const SOCK_Y1  = SHADE_BOT_Y;      // 24
const SOCK_Y2  = SHADE_BOT_Y + 7;  // 31
const SOCK_HW  = 4;

// String + bead physics
const STR_AY       = SOCK_Y2;      // 31 — string attaches here
const HDL_REST_Y   = 58;           // bead rest pos = ~navbar bottom (h-14 = 56px)
const HDL_R        = 4;            // bead radius (small, tactile)
const MIN_PULL     = 12;           // minimum pull distance to arm the toggle
const MAX_PULL     = 46;           // bead cannot go below REST_Y + MAX_PULL

// Spring (multiplicative damping → realistic snap)
const SPRING_K    = 0.15;  // stiffness
const SPRING_DAMP = 0.75;  // velocity *= DAMP each frame
const SNAP_VEL    = 3.0;   // min |vy| at rest crossing to trigger toggle

const SVG_H = HDL_REST_Y + MAX_PULL + HDL_R + 8; // 116 — total SVG height

// ── Web Audio — lazy click sound ───────────────────────────────
let _ac: AudioContext | null = null;
function playTick() {
  try {
    if (!_ac) _ac = new AudioContext();
    if (_ac.state === "suspended") _ac.resume();
    const osc  = _ac.createOscillator();
    const gain = _ac.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(820, _ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, _ac.currentTime + 0.055);
    gain.gain.setValueAtTime(0.09, _ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, _ac.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(_ac.destination);
    osc.start(_ac.currentTime);
    osc.stop(_ac.currentTime + 0.09);
  } catch { /* AudioContext blocked (incognito / autoplay policy) */ }
}

// ── Theme helpers ──────────────────────────────────────────────
function applyTheme(dark: boolean) {
  const root = document.documentElement;
  if (dark) {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

// ── Full-screen overlay animation ─────────────────────────────
function runOverlay(
  turningOn: boolean,
  bx: number,
  by: number,
  switchCb: () => void,
) {
  const el = document.createElement("div");
  Object.assign(el.style, {
    position:      "fixed",
    inset:         "0",
    zIndex:        "5000",
    pointerEvents: "none",
    willChange:    "clip-path, opacity",
  } as Partial<CSSStyleDeclaration>);

  const maxR =
    Math.ceil(
      Math.hypot(
        Math.max(bx, window.innerWidth  - bx),
        Math.max(by, window.innerHeight - by),
      ),
    ) + 80;

  if (turningOn) {
    el.style.background =
      "radial-gradient(circle, rgba(255,252,200,0.98) 10%, rgba(255,236,100,0.96) 100%)";
    el.style.clipPath = `circle(0px at ${bx}px ${by}px)`;
    document.body.appendChild(el);
    el.getBoundingClientRect(); // force reflow
    el.style.transition = "clip-path 520ms cubic-bezier(0.22,1,0.36,1)";
    el.style.clipPath   = `circle(${maxR}px at ${bx}px ${by}px)`;
    setTimeout(switchCb, 310);
    setTimeout(() => {
      el.style.transition = "opacity 280ms ease";
      el.style.opacity    = "0";
      setTimeout(() => el.remove(), 290);
    }, 530);
  } else {
    el.style.background = "#0d0d0d";
    el.style.clipPath   = `circle(0px at ${bx}px ${by}px)`;
    document.body.appendChild(el);
    el.getBoundingClientRect();
    el.style.transition = "clip-path 440ms cubic-bezier(0.64,0,0.78,0)";
    el.style.clipPath   = `circle(${maxR}px at ${bx}px ${by}px)`;
    setTimeout(switchCb, 180);
    setTimeout(() => el.remove(), 450);
  }
}

// ── Component ─────────────────────────────────────────────────
export default function NavLamp() {
  const svgRef     = useRef<SVGSVGElement>(null);
  const prefersReduced = useReducedMotion();
  const reducedRef = useRef(prefersReduced);
  useEffect(() => { reducedRef.current = prefersReduced; }, [prefersReduced]);

  const [isDark, setIsDark] = useState(false);
  const [beadY, setBeadY]   = useState(HDL_REST_Y);

  const draggingRef = useRef(false);
  const toggledRef  = useRef(false); // toggled this pull cycle?
  const pulledRef   = useRef(false); // pulled past MIN_PULL?
  const beadRef     = useRef({ y: HDL_REST_Y, vy: 0 });
  const rafRef      = useRef(0);
  const animRef     = useRef(false);

  // Sync isDark from DOM
  useEffect(() => {
    const sync = () => setIsDark(document.documentElement.classList.contains("dark"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Spring animation — reads all state via refs, no stale-closure risk
  const startSpring = useCallback(() => {
    if (animRef.current) return;
    animRef.current = true;

    const step = () => {
      const b      = beadRef.current;
      const prevY  = b.y;

      // Multiplicative-damped spring: realistic oscillation
      b.vy = b.vy * SPRING_DAMP + (-SPRING_K * (b.y - HDL_REST_Y));
      b.y += b.vy;

      // Hard bounds
      if (b.y < STR_AY + 2)            { b.y = STR_AY + 2;            b.vy = Math.abs(b.vy) * 0.3; }
      if (b.y > HDL_REST_Y + MAX_PULL) { b.y = HDL_REST_Y + MAX_PULL; b.vy = 0; }

      // Snap-through detection: bead crosses rest from below with enough speed
      if (
        !toggledRef.current &&
        pulledRef.current &&
        prevY > HDL_REST_Y + 2 &&
        b.y  <= HDL_REST_Y &&
        Math.abs(b.vy) >= SNAP_VEL
      ) {
        toggledRef.current = true;
        const svg = svgRef.current;
        const r   = svg?.getBoundingClientRect();
        const bx  = r ? r.left + (CX  / W    ) * r.width  : window.innerWidth - 34;
        const by  = r ? r.top  + (BULB_CY / SVG_H) * r.height : 16;
        const currentlyDark = document.documentElement.classList.contains("dark");
        playTick();
        if (reducedRef.current) {
          applyTheme(currentlyDark);
        } else {
          runOverlay(currentlyDark, bx, by, () => applyTheme(currentlyDark));
        }
      }

      setBeadY(Math.round(b.y));

      // Settle check
      if (Math.abs(b.y - HDL_REST_Y) < 0.3 && Math.abs(b.vy) < 0.1) {
        b.y  = HDL_REST_Y;
        b.vy = 0;
        animRef.current = false;
        setBeadY(HDL_REST_Y);
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, []); // stable — reads only refs and DOM

  // Drag handlers on the pull bead (setPointerCapture routes events to element)
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    toggledRef.current  = false;
    pulledRef.current   = false;
    animRef.current     = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const svg    = svgRef.current;
    // SVG is position:fixed top:0 → rect.top ≈ 0. clientY maps directly to SVG y.
    const svgTop = svg ? svg.getBoundingClientRect().top : 0;
    const newY   = Math.max(STR_AY + 2, Math.min(HDL_REST_Y + MAX_PULL, e.clientY - svgTop));
    beadRef.current.y  = newY;
    beadRef.current.vy = 0;
    setBeadY(Math.round(newY));
    if (newY > HDL_REST_Y + MIN_PULL) pulledRef.current = true;
  }, []);

  const onPointerUp = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    startSpring();
  }, [startSpring]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ── Visual derived state ───────────────────────────────────
  const bulbOn      = !isDark;
  const shade       = isDark ? "#3b1a6e" : "#5b21b6";
  const shadeBorder = "#4c1d95";
  const socket      = "#3b0764";
  const strColor    = isDark ? "#6d28d9" : "#7c3aed";
  const beadFill    = isDark ? "#7c3aed" : "#5b21b6";

  return (
    <svg
      ref={svgRef}
      width={W}
      height={SVG_H}
      viewBox={`0 0 ${W} ${SVG_H}`}
      style={{
        position:      "fixed",
        top:           0,
        right:         16,
        zIndex:        400,
        overflow:      "visible",
        pointerEvents: "none",
      }}
      aria-label="Theme toggle — pull the lamp string"
      role="img"
    >
      {/* Ceiling cord */}
      <line
        x1={CX} y1={0}
        x2={CX} y2={SHADE_TOP_Y}
        stroke={shadeBorder}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Shade (trapezoid) */}
      <path
        d={`M${CX - SHADE_TOP_HW} ${SHADE_TOP_Y} L${CX + SHADE_TOP_HW} ${SHADE_TOP_Y} L${CX + SHADE_BOT_HW} ${SHADE_BOT_Y} L${CX - SHADE_BOT_HW} ${SHADE_BOT_Y}Z`}
        fill={shade}
        stroke={shadeBorder}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Bulb glow halo (when light is on) */}
      {bulbOn && (
        <circle cx={CX} cy={BULB_CY} r={BULB_R + 6} fill="rgba(251,191,36,0.14)" />
      )}

      {/* Bulb */}
      <defs>
        <radialGradient id="nlamp-bulb" cx="42%" cy="35%" r="60%">
          {bulbOn ? (
            <>
              <stop offset="0%"   stopColor="#fffde0" />
              <stop offset="55%"  stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </>
          ) : (
            <>
              <stop offset="0%"   stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#2d1455" />
            </>
          )}
        </radialGradient>
      </defs>
      <circle
        cx={CX}
        cy={BULB_CY}
        r={BULB_R}
        fill="url(#nlamp-bulb)"
      />

      {/* Socket/pipe */}
      <rect
        x={CX - SOCK_HW}
        y={SOCK_Y1}
        width={SOCK_HW * 2}
        height={SOCK_Y2 - SOCK_Y1}
        fill={socket}
        rx={1}
      />

      {/* String */}
      <line
        x1={CX} y1={STR_AY}
        x2={CX} y2={beadY}
        stroke={strColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Pull bead — interactive */}
      <circle
        cx={CX}
        cy={beadY}
        r={HDL_R}
        fill={beadFill}
        stroke={shadeBorder}
        strokeWidth={1}
        style={{ pointerEvents: "all", cursor: "ns-resize", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </svg>
  );
}

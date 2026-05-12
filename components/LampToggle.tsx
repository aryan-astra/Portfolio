"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// ── SVG geometry (all in SVG user units) ───────────────────────
const W        = 54;
const CX       = W / 2;          // 27 — horizontal center

const CORD_Y1  = 0;
const CORD_Y2  = 14;             // shade top-y

const SHADE_H  = 36;
const SHADE_BY = CORD_Y2 + SHADE_H;  // 50 — shade bottom-y
const SHADE_TW = 20;             // shade top width
const SHADE_BW = 48;             // shade bottom width

const BULB_CY  = SHADE_BY + 13; // 63
const BULB_R   = 13;

const STR_AX   = CX;             // string attaches at bulb bottom center
const STR_AY   = BULB_CY + BULB_R; // 76

const REST_LEN = 84;             // string rest length
const REST_X   = STR_AX;
const REST_Y   = STR_AY + REST_LEN; // 160

const HDL_R    = 7;              // handle radius
const SVG_H    = REST_Y + HDL_R + 6; // 173

// ── Spring physics constants ───────────────────────────────────
const SPRING_K    = 0.14;
const SPRING_DAMP = 0.68;
const SNAP_VEL    = 2.6;        // min speed (px/frame) to trigger snap

// ── Web Audio API — lazy singleton context ─────────────────────
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
  } catch { /* ignore AudioContext errors (incognito, etc.) */ }
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
//   turningOn = true  → warm burst expands from bulb (dark→light)
//   turningOn = false → darkness expands from bulb  (light→dark)
function runOverlay(
  turningOn: boolean,
  bx: number,
  by: number,
  switchCb: () => void,
) {
  const el = document.createElement("div");
  Object.assign(el.style, {
    position: "fixed",
    inset: "0",
    zIndex: "5000",
    pointerEvents: "none",
    willChange: "clip-path, opacity",
  } as CSSStyleDeclaration);

  const maxR =
    Math.ceil(
      Math.hypot(
        Math.max(bx, window.innerWidth - bx),
        Math.max(by, window.innerHeight - by),
      ),
    ) + 80;

  if (turningOn) {
    // Warm light burst expanding from bulb
    el.style.background =
      "radial-gradient(circle, rgba(255,252,200,0.98) 10%, rgba(255,236,100,0.96) 100%)";
    el.style.clipPath = `circle(0px at ${bx}px ${by}px)`;
    document.body.appendChild(el);
    el.getBoundingClientRect(); // force reflow
    el.style.transition = "clip-path 520ms cubic-bezier(0.22,1,0.36,1)";
    el.style.clipPath = `circle(${maxR}px at ${bx}px ${by}px)`;
    setTimeout(switchCb, 310);
    setTimeout(() => {
      el.style.transition = "opacity 280ms ease";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 290);
    }, 530);
  } else {
    // Darkness expands from bulb
    el.style.background = "#0d0d0d";
    el.style.clipPath = `circle(0px at ${bx}px ${by}px)`;
    document.body.appendChild(el);
    el.getBoundingClientRect();
    el.style.transition = "clip-path 440ms cubic-bezier(0.64,0,0.78,0)";
    el.style.clipPath = `circle(${maxR}px at ${bx}px ${by}px)`;
    setTimeout(switchCb, 180);
    setTimeout(() => el.remove(), 450);
  }
}

// ══════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════
export default function LampToggle() {
  const reduced   = useReducedMotion();
  const svgRef    = useRef<SVGSVGElement>(null);
  const rafRef    = useRef(0);
  const dragging  = useRef(false);
  const toggled   = useRef(false);   // only trigger once per spring session
  const animating = useRef(false);   // block double-toggle during overlay

  // Physics state — mutable, not state so RAF doesn't re-render
  const ps = useRef({ x: REST_X, y: REST_Y, vx: 0, vy: 0 });

  // Render handle position
  const [handle, setHandle] = useState({ x: REST_X, y: REST_Y });

  // Dark-mode for visual branch (syncs via MutationObserver)
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark")),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // Filament glow state after turning off
  // true → opacity:1, transition:none  →  (60ms later) false → opacity:0, transition:1.5s
  const [filamentGlow, setFilamentGlow] = useState(false);

  // Get bulb center in viewport (screen) coordinates
  const bulbScreen = useCallback((): { x: number; y: number } => {
    if (!svgRef.current) return { x: window.innerWidth - 30, y: 60 };
    const r  = svgRef.current.getBoundingClientRect();
    const sx = r.width  / W;
    const sy = r.height / SVG_H;
    return { x: r.left + CX * sx, y: r.top + BULB_CY * sy };
  }, []);

  // Perform light toggle with overlay animation
  const doToggle = useCallback(() => {
    if (animating.current) return;
    animating.current = true;
    setTimeout(() => { animating.current = false; }, 900); // safety reset

    const currentlyDark = document.documentElement.classList.contains("dark");
    const { x, y }      = bulbScreen();

    const afterSwitch = () => {
      const nowDark = document.documentElement.classList.contains("dark");
      setDark(nowDark);
      if (nowDark) {
        // Just went dark → flash filament on, then let CSS fade it out
        setFilamentGlow(true);
        setTimeout(() => setFilamentGlow(false), 60);
      }
    };

    if (reduced) {
      applyTheme(!currentlyDark);
      setDark(!currentlyDark);
      if (!currentlyDark) {
        setFilamentGlow(true);
        setTimeout(() => setFilamentGlow(false), 60);
      }
      animating.current = false;
      return;
    }

    // currentlyDark=true → turningOn=true (warm burst); false → darkness
    runOverlay(currentlyDark, x, y, () => {
      applyTheme(!currentlyDark);
      afterSwitch();
    });
  }, [reduced, bulbScreen]);

  // Spring physics loop
  const startSpring = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    toggled.current = false;

    const step = () => {
      const p  = ps.current;
      const dx = p.x - REST_X;
      const dy = p.y - REST_Y;

      const prevDist = Math.sqrt(dx * dx + dy * dy);

      p.vx += -SPRING_K * dx - SPRING_DAMP * p.vx;
      p.vy += -SPRING_K * dy - SPRING_DAMP * p.vy;
      p.x  += p.vx;
      p.y  += p.vy;

      const ndx  = p.x - REST_X;
      const ndy  = p.y - REST_Y;
      const dist = Math.sqrt(ndx * ndx + ndy * ndy);
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

      // Snap trigger: crossing through rest with enough momentum
      if (!toggled.current && prevDist > 5 && dist < 5 && speed > SNAP_VEL) {
        toggled.current = true;
        playTick();
        doToggle();
      }

      setHandle({ x: p.x, y: p.y });

      const energy = Math.abs(ndx) + Math.abs(ndy) + Math.abs(p.vx) + Math.abs(p.vy);
      if (energy > 0.12) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        p.x = REST_X; p.y = REST_Y; p.vx = 0; p.vy = 0;
        setHandle({ x: REST_X, y: REST_Y });
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [doToggle]);

  // Mouse drag tracking (window-level, so handle can move outside SVG bounds)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !svgRef.current) return;
      const r  = svgRef.current.getBoundingClientRect();
      const lx = ((e.clientX - r.left) / r.width)  * W;
      const ly = ((e.clientY - r.top)  / r.height) * SVG_H;
      const ny = Math.max(STR_AY + 4, ly);
      ps.current.x = lx;
      ps.current.y = ny;
      setHandle({ x: lx, y: ny });
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current    = false;
      ps.current.vx = 0;
      ps.current.vy = 0;
      startSpring();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [startSpring]);

  // Cleanup RAF on unmount
  useEffect(() => () => { cancelAnimationFrame(rafRef.current); }, []);

  // ── Handle pointer-down (only on fine-pointer devices) ───────
  const onHandleMouseDown = (e: React.MouseEvent) => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    e.preventDefault();
    dragging.current = true;
    cancelAnimationFrame(rafRef.current);
  };

  // ── Click-to-toggle (touch / no-physics fallback) ────────────
  const onHandleClick = (e: React.MouseEvent) => {
    // Only fire on touch (fine-pointer uses drag mechanic)
    if (window.matchMedia("(pointer: fine)").matches) return;
    e.stopPropagation();
    playTick();
    doToggle();
  };

  // ── Derived geometry ──────────────────────────────────────────
  const cpX     = (STR_AX + handle.x) / 2;
  const cpY     = (STR_AY + handle.y) / 2 - 12;
  const stringD = `M ${STR_AX} ${STR_AY} Q ${cpX} ${cpY} ${handle.x} ${handle.y}`;

  const shadePoints = [
    `${CX - SHADE_TW / 2},${CORD_Y2}`,
    `${CX + SHADE_TW / 2},${CORD_Y2}`,
    `${CX + SHADE_BW / 2},${SHADE_BY}`,
    `${CX - SHADE_BW / 2},${SHADE_BY}`,
  ].join(" ");

  // ── Colors ────────────────────────────────────────────────────
  const cordCol     = dark ? "#555"    : "#9ca3af";
  const shadeCol    = dark ? "#2a2a2a" : "#7c3aed";
  const shadeBorder = dark ? "#3a3a3a" : "#5b21b6";
  const socketCol   = dark ? "#333"    : "#6d28d9";
  const bulbFill    = dark ? (filamentGlow ? "#3d2000" : "#1a1a1a") : "#fef9c3";
  const bulbBorder  = dark ? "#3a3a3a" : "#ca8a04";
  const strCol      = dark ? "#555"    : "#a78bfa";
  const hdlFill     = dark ? "#333"    : "#ede9fe";
  const hdlBorder   = dark ? "#555"    : "#7c3aed";
  const filColor    = filamentGlow     ? "#ff9500" : (dark ? "#882200" : "#b45309");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 16,
        zIndex: 400,
        userSelect: "none",
        touchAction: "none",
        // Shade area should not block navbar — only handle is interactive
        pointerEvents: "none",
      }}
    >
      <svg
        ref={svgRef}
        width={W}
        height={SVG_H}
        viewBox={`0 0 ${W} ${SVG_H}`}
        style={{ display: "block", overflow: "visible" }}
        aria-label={dark ? "Turn light on — pull the string" : "Turn light off — pull the string"}
        role="img"
      >
        <defs>
          {/* Bulb glow when on */}
          <radialGradient id="lmp-bulbOn" cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#fffde0" />
            <stop offset="65%"  stopColor="#fde68a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
          {/* Inner shade light */}
          <radialGradient id="lmp-shadeIn" cx="50%" cy="100%" r="70%">
            <stop offset="0%"   stopColor="rgba(255,240,100,0.55)" />
            <stop offset="100%" stopColor="rgba(255,240,100,0)" />
          </radialGradient>
          {/* Shade gloss (3-D feel) */}
          <linearGradient id="lmp-shadeGloss" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.28)" />
            <stop offset="40%"  stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
          </linearGradient>
          {/* Filament glow filter */}
          <filter id="lmp-fglow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Ceiling cord ── */}
        <line
          x1={CX} y1={CORD_Y1} x2={CX} y2={CORD_Y2}
          stroke={cordCol} strokeWidth={1.5}
          pointerEvents="none"
        />

        {/* ── Lamp shade ── */}
        <polygon points={shadePoints} fill={shadeCol} stroke={shadeBorder} strokeWidth={1} pointerEvents="none" />
        {/* Shade gloss */}
        <polygon points={shadePoints} fill="url(#lmp-shadeGloss)" pointerEvents="none" />
        {/* Shade inner glow (light on) */}
        {!dark && (
          <polygon points={shadePoints} fill="url(#lmp-shadeIn)" opacity={0.65} pointerEvents="none" />
        )}

        {/* ── Light cone below shade (light on) ── */}
        {!dark && (
          <path
            d={`M ${CX - SHADE_BW / 2} ${SHADE_BY} L ${CX - SHADE_BW / 2 - 10} ${SHADE_BY + 22} L ${CX + SHADE_BW / 2 + 10} ${SHADE_BY + 22} L ${CX + SHADE_BW / 2} ${SHADE_BY} Z`}
            fill="rgba(255,248,160,0.20)"
            pointerEvents="none"
          />
        )}

        {/* ── Bulb socket ring ── */}
        <rect
          x={CX - 8} y={SHADE_BY - 2}
          width={16} height={7}
          rx={2}
          fill={socketCol} stroke={shadeBorder} strokeWidth={0.5}
          pointerEvents="none"
        />

        {/* ── Bulb halo (light on) ── */}
        {!dark && (
          <circle cx={CX} cy={BULB_CY} r={BULB_R + 9} fill="rgba(255,248,160,0.13)" pointerEvents="none" />
        )}

        {/* ── Bulb body ── */}
        <circle
          cx={CX} cy={BULB_CY} r={BULB_R}
          fill={bulbFill} stroke={bulbBorder} strokeWidth={1}
          pointerEvents="none"
        />
        {!dark && (
          <circle cx={CX} cy={BULB_CY} r={BULB_R} fill="url(#lmp-bulbOn)" pointerEvents="none" />
        )}

        {/* ── Filament wires ── */}
        <g
          style={{
            opacity: dark ? (filamentGlow ? 1 : 0) : 0.6,
            // When filamentGlow turns false: slow fade to 0 (the "cooling" effect)
            transition: dark && !filamentGlow ? "opacity 1500ms ease-out" : "opacity 0ms",
          }}
          filter={dark && filamentGlow ? "url(#lmp-fglow)" : undefined}
          pointerEvents="none"
        >
          <polyline
            points={`
              ${CX - 5},${BULB_CY + 4}
              ${CX - 2},${BULB_CY - 3}
              ${CX + 1},${BULB_CY + 4}
              ${CX + 4},${BULB_CY - 3}
              ${CX + 6},${BULB_CY + 3}
            `}
            stroke={filColor}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ── Pull string ── */}
        <path
          d={stringD}
          stroke={strCol} strokeWidth={1.5}
          fill="none" strokeLinecap="round"
          pointerEvents="none"
        />

        {/* ── Pull handle (only interactive element) ── */}
        <circle
          cx={handle.x} cy={handle.y} r={HDL_R}
          fill={hdlFill} stroke={hdlBorder} strokeWidth={1.5}
          style={{
            cursor: dragging.current ? "grabbing" : "grab",
            pointerEvents: "all",   // override parent none
          }}
          onMouseDown={onHandleMouseDown}
          onClick={onHandleClick}
        />
        {/* Handle specular dot */}
        <circle
          cx={handle.x - 2} cy={handle.y - 2.5} r={2}
          fill="rgba(255,255,255,0.38)"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}

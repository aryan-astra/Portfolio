"use client";

/**
 * ScatterField — butterfly.so-style decorative glyphs scattered across a section.
 * Pointer-events: none, aria-hidden. Pure visual texture.
 */

type ScatterPos = {
  left: string;
  top: string;
  sym: string;
  size: string;
  opacity: number;
};

const PRESETS: Record<string, ScatterPos[]> = {
  hero: [
    { left: "8%",  top: "15%", sym: "×", size: "0.55rem", opacity: 0.30 },
    { left: "92%", top: "22%", sym: "✿", size: "0.70rem", opacity: 0.25 },
    { left: "5%",  top: "70%", sym: "◆", size: "0.50rem", opacity: 0.20 },
    { left: "96%", top: "65%", sym: "+", size: "0.60rem", opacity: 0.35 },
    { left: "15%", top: "88%", sym: "·", size: "0.80rem", opacity: 0.40 },
    { left: "80%", top: "88%", sym: "●", size: "0.45rem", opacity: 0.20 },
    { left: "50%", top: "5%",  sym: "◎", size: "0.55rem", opacity: 0.20 },
  ],
  projects: [
    { left: "6%",  top: "10%", sym: "+", size: "0.55rem", opacity: 0.22 },
    { left: "94%", top: "18%", sym: "×", size: "0.50rem", opacity: 0.25 },
    { left: "3%",  top: "55%", sym: "●", size: "0.42rem", opacity: 0.18 },
    { left: "97%", top: "72%", sym: "◆", size: "0.55rem", opacity: 0.22 },
    { left: "12%", top: "92%", sym: "·", size: "0.85rem", opacity: 0.30 },
    { left: "88%", top: "94%", sym: "✿", size: "0.60rem", opacity: 0.20 },
  ],
  writing: [
    { left: "4%",  top: "12%", sym: "·", size: "0.85rem", opacity: 0.35 },
    { left: "96%", top: "8%",  sym: "+", size: "0.55rem", opacity: 0.25 },
    { left: "8%",  top: "82%", sym: "◎", size: "0.50rem", opacity: 0.22 },
    { left: "92%", top: "78%", sym: "✿", size: "0.60rem", opacity: 0.20 },
    { left: "50%", top: "96%", sym: "◆", size: "0.45rem", opacity: 0.18 },
  ],
  hackathons: [
    { left: "5%",  top: "20%", sym: "×", size: "0.55rem", opacity: 0.22 },
    { left: "95%", top: "30%", sym: "·", size: "0.80rem", opacity: 0.35 },
    { left: "10%", top: "85%", sym: "◆", size: "0.50rem", opacity: 0.18 },
    { left: "90%", top: "88%", sym: "+", size: "0.55rem", opacity: 0.25 },
  ],
};

type Props = {
  variant?: keyof typeof PRESETS;
};

export default function ScatterField({ variant = "hero" }: Props) {
  const positions = PRESETS[variant] ?? PRESETS.hero;
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {positions.map((p, i) => (
        <span
          key={i}
          className="absolute font-mono text-muted-foreground select-none"
          style={{
            left: p.left,
            top: p.top,
            fontSize: p.size,
            opacity: p.opacity,
            transform: "translate(-50%, -50%)",
          }}
        >
          {p.sym}
        </span>
      ))}
    </div>
  );
}

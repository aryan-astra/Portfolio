"use client";

import { useEffect, useState } from "react";

type FlowerConfig = {
  id: string;
  top: string;
  left: string;
  depth: number;
  cellSize: number;
  scale: number;
  rotation: number;
  phase: number;
  delay: number;
  opacity: number;
  pattern: number[][];
  palette: Record<number, string>;
};

const BLOOM_A: number[][] = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0],
  [1, 1, 1, 2, 2, 2, 2, 3, 2, 2, 2, 1, 1, 1, 0],
  [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 3, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0],
];

const BLOOM_B: number[][] = [
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0],
  [1, 1, 1, 2, 2, 2, 2, 3, 2, 2, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0],
];

const FLOWERS: FlowerConfig[] = [
  {
    id: "flower-pink",
    top: "-3%",
    left: "-7%",
    depth: 0.024,
    cellSize: 10,
    scale: 1.92,
    rotation: -12,
    phase: 0.3,
    delay: 0,
    opacity: 0.14,
    pattern: BLOOM_A,
    palette: {
      1: "rgba(236, 72, 153, 0.26)",
      2: "rgba(250, 204, 21, 0.28)",
      3: "rgba(34, 197, 94, 0.22)",
    },
  },
  {
    id: "flower-ice",
    top: "11%",
    left: "95%",
    depth: 0.03,
    cellSize: 9,
    scale: 1.78,
    rotation: 14,
    phase: 1.1,
    delay: 0.6,
    opacity: 0.14,
    pattern: BLOOM_B,
    palette: {
      1: "rgba(59, 130, 246, 0.24)",
      2: "rgba(191, 219, 254, 0.3)",
      3: "rgba(125, 211, 252, 0.2)",
    },
  },
  {
    id: "flower-lilac",
    top: "77%",
    left: "-3%",
    depth: 0.028,
    cellSize: 11,
    scale: 1.88,
    rotation: 8,
    phase: 2.2,
    delay: 1,
    opacity: 0.12,
    pattern: BLOOM_B,
    palette: {
      1: "rgba(167, 139, 250, 0.2)",
      2: "rgba(253, 224, 71, 0.24)",
      3: "rgba(74, 222, 128, 0.18)",
    },
  },
  {
    id: "flower-peach",
    top: "84%",
    left: "92%",
    depth: 0.026,
    cellSize: 10,
    scale: 1.92,
    rotation: -10,
    phase: 3.4,
    delay: 1.4,
    opacity: 0.13,
    pattern: BLOOM_A,
    palette: {
      1: "rgba(251, 146, 60, 0.18)",
      2: "rgba(254, 240, 138, 0.22)",
      3: "rgba(134, 239, 172, 0.18)",
    },
  },
];

function PixelFlower({
  pattern,
  palette,
  cellSize,
}: {
  pattern: number[][];
  palette: Record<number, string>;
  cellSize: number;
}) {
  const columns = pattern[0]?.length ?? 0;

  return (
    <div
      className="pixel-flower-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${pattern.length}, ${cellSize}px)`,
      }}
    >
      {pattern.flatMap((row, y) =>
        row.map((cell, x) => {
          if (cell === 0) return null;
          return (
            <span
              key={`${y}-${x}`}
              className="pixel-cell"
              style={{
                gridColumnStart: x + 1,
                gridRowStart: y + 1,
                backgroundColor: palette[cell] ?? "transparent",
              }}
            />
          );
        }),
      )}
    </div>
  );
}

export default function PixelBloomField() {
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  return (
    <div className="pixel-bloom-field" aria-hidden="true">
      {FLOWERS.map((flower) => {
        const drift = reducedMotion ? 0 : scrollY * flower.depth;
        const sway = reducedMotion ? 0 : Math.sin(scrollY / 430 + flower.phase) * 16;

        return (
          <div
            key={flower.id}
            className="pixel-bloom-node pixel-bloom-breathe"
            style={{
              top: flower.top,
              left: flower.left,
              opacity: flower.opacity,
              transform: `translate3d(${sway}px, ${drift}px, 0) scale(${flower.scale}) rotate(${flower.rotation}deg)`,
              animationDelay: `${flower.delay}s`,
            }}
          >
            <PixelFlower pattern={flower.pattern} palette={flower.palette} cellSize={flower.cellSize} />
          </div>
        );
      })}
    </div>
  );
}

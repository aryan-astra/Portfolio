"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export default function Portrait() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; offsetX: number; offsetY: number; limit: number } | null>(null);
  const reset = () => { drag.current = null; setDragging(false); setOffset({ x: 0, y: 0 }); };
  return (
    <div className="portrait-holder">
      <button type="button" className={`portrait ${dragging ? "portrait-dragging" : ""}`}
        style={{ transform: `translate(${offset.x}px,${offset.y}px)`, touchAction: "none" }}
        onPointerDown={event => {
          if (event.button !== 0) return;
          const position = new DOMMatrixReadOnly(getComputedStyle(event.currentTarget).transform);
          drag.current = { x: event.clientX, y: event.clientY, offsetX: position.m41, offsetY: position.m42, limit: matchMedia("(pointer: fine)").matches ? 140 : 48 };
          setOffset({ x: position.m41, y: position.m42 });
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (!drag.current) return;
          setOffset({ x: clamp(drag.current.offsetX + event.clientX - drag.current.x, -32, drag.current.limit), y: clamp(drag.current.offsetY + event.clientY - drag.current.y, -32, 64) });
        }} onPointerUp={reset} onPointerCancel={reset} onLostPointerCapture={reset} onDoubleClick={reset}
        onKeyDown={event => {
          const movement: Record<string, [number, number]> = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] };
          if (["Escape", "Enter", " "].includes(event.key)) { event.preventDefault(); reset(); }
          const delta = movement[event.key];
          if (delta) { event.preventDefault(); setOffset(value => ({ x: clamp(value.x + delta[0], -32, 48), y: clamp(value.y + delta[1], -32, 64) })); }
        }} aria-label="Move Aryan's avatar" aria-describedby="portrait-help">
        <Image src="/images/aryan.webp" alt="Aryan's GitHub avatar" width={80} height={80} priority draggable={false} />
      </button>
      <span id="portrait-help" className="sr-only">Drag and release. Keyboard: arrow keys to move, Enter or Escape to reset.</span>
      <span className="portrait-note" aria-hidden>psst. drag me</span>
    </div>
  );
}

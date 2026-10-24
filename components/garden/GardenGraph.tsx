"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { GardenItem } from "@/lib/garden";
import LinkedText from "@/components/garden/LinkedText";

type Props = { items: GardenItem[]; relations: Record<string, string[]> };
const width = 760;
const height = 430;

export default function GardenGraph({ items, relations }: Props) {
  const [selected, setSelected] = useState("");
  const [filter, setFilter] = useState("all");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);
  const visible = items.filter((item) => filter === "all" || item.type === filter);
  const visibleIds = new Set(visible.map(item => item.id));
  const points = useMemo(() => new Map(items.map((item, index) => {
    const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2;
    const ring = item.type === "concept" ? 0.23 : item.type === "post" ? 0.39 : 0.49;
    return [item.id, { x: width / 2 + Math.cos(angle) * width * ring, y: height / 2 + Math.sin(angle) * height * 0.39 }];
  })), [items]);
  const selectedItem = items.find((item) => item.id === selected);
  const neighborIds = new Set(selected ? relations[selected] ?? [] : []);
  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches || event.button !== 0 || (event.target as Element).closest("a")) return;
    drag.current = { x: event.clientX, y: event.clientY, originX: pan.x, originY: pan.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const scale = width / event.currentTarget.getBoundingClientRect().width;
    setPan({ x: drag.current.originX + (event.clientX - drag.current.x) * scale, y: drag.current.originY + (event.clientY - drag.current.y) * scale });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="mono-label flex items-center gap-2 text-muted-foreground">Show
            <select className="border border-border bg-card px-2 py-1 text-foreground" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">Everything</option><option value="post">Writing</option><option value="project">Projects</option><option value="concept">Concepts</option>
            </select>
          </label>
          <button className="border border-border px-2 py-1 font-mono text-xs" onClick={() => setZoom((value) => Math.min(1.6, value + 0.15))} aria-label="Zoom in">+</button>
          <button className="border border-border px-2 py-1 font-mono text-xs" onClick={() => setZoom((value) => Math.max(0.7, value - 0.15))} aria-label="Zoom out">−</button>
          <button className="border border-border px-2 py-1 font-mono text-xs" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} aria-label="Reset graph view">Reset</button>
          <span className="mono-label text-muted-foreground">Drag to pan · select a node to preview</span>
        </div>
        <div className="overflow-hidden border border-border bg-card" onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
          <svg viewBox={`0 0 ${width} ${height}`} className="block w-full touch-pan-y" aria-label="Knowledge garden graph" onPointerDown={onPointerDown} onPointerMove={onPointerMove}>
            <g transform={`translate(${pan.x} ${pan.y}) translate(${width / 2} ${height / 2}) scale(${zoom}) translate(${-width / 2} ${-height / 2})`}>
              {visible.flatMap((item) => (relations[item.id] ?? []).filter((to) => item.id < to && visibleIds.has(to)).map((to) => {
                const a = points.get(item.id)!; const b = points.get(to)!;
                const active = !selected || item.id === selected || to === selected || neighborIds.has(item.id) || neighborIds.has(to);
                return <line key={`${item.id}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border)" strokeWidth="1.2" opacity={active ? 0.85 : 0.18} />;
              }))}
              {visible.map((item) => {
                const point = points.get(item.id)!;
                const active = !selected || item.id === selected || neighborIds.has(item.id);
                const radius = item.type === "concept" ? 7 : item.type === "post" ? 6 : 5;
                return <a key={item.id} href={item.href} onFocus={() => setSelected(item.id)} onPointerEnter={() => { if (window.matchMedia("(pointer: fine)").matches) setSelected(item.id); }} onClick={(event) => { if (!event.metaKey && !event.ctrlKey) { event.preventDefault(); setSelected(item.id); } }} aria-label={`${item.type}: ${item.title}`}>
                  <circle cx={point.x} cy={point.y} r={16} fill="transparent" />
                  <circle cx={point.x} cy={point.y} r={radius + (item.id === selected ? 3 : 0)} fill={item.type === "concept" ? "var(--accent)" : "var(--foreground)"} opacity={active ? 0.95 : 0.22} />
                  <text x={point.x} y={point.y + radius + 13} textAnchor="middle" fill="var(--muted-foreground)" fontSize="10" opacity={active ? 1 : 0.35}>{item.title.length > 20 ? `${item.title.slice(0, 18)}…` : item.title}</text>
                </a>;
              })}
            </g>
          </svg>
        </div>
        <nav aria-label="Garden graph items" className="mt-4 grid gap-x-5 border-t border-border pt-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => <button key={item.id} className="flex min-h-10 items-center gap-2 text-left text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent" onClick={() => setSelected(item.id)} aria-pressed={selected === item.id}>
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: item.type === "concept" ? "var(--accent)" : "var(--foreground)" }} />{item.title}
          </button>)}
        </nav>
        <noscript><ul>{items.map(item => <li key={item.id}><Link prefetch={false} href={item.href}>{item.title}</Link></li>)}</ul></noscript>
      </div>
      <aside aria-live="polite" className="min-h-40 border-l border-border pl-5">
        {selectedItem ? <>
          <p className="section-label">{selectedItem.type}</p>
          <h2 className="font-serif text-2xl leading-tight">{selectedItem.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground"><LinkedText text={selectedItem.excerpt} /></p>
          <Link prefetch={false} href={selectedItem.href} className="site-link mono-label mt-4 inline-block">Open source ↗</Link>
          <p className="mono-label mt-5 text-muted-foreground">Connected items</p>
          {(relations[selectedItem.id] ?? []).map((id) => {
            const item = items.find((entry) => entry.id === id);
            return item ? <button key={id} className="mt-2 block text-left text-sm text-accent hover:underline" onClick={() => setSelected(id)}>{item.title}</button> : null;
          })}
        </> : <p className="text-sm leading-relaxed text-muted-foreground">Choose a node or use the list to inspect its source and connections.</p>}
      </aside>
    </div>
  );
}

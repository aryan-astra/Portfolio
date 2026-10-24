"use client";

import { useEffect, useRef, useState } from "react";

export default function OrbitNote() {
  const [running, setRunning] = useState(false);
  const host = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) setRunning(false); });
    if (host.current) observer.observe(host.current);
    const pause = () => { if (document.hidden) setRunning(false); };
    document.addEventListener("visibilitychange", pause);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", pause); };
  }, []);
  return <section ref={host} className={`orbit-note ${running ? "orbit-running" : ""}`} aria-labelledby="orbit-title"><div><p className="eyebrow">A small reminder from Pluto</p><h2 id="orbit-title">Find your<br /><em>own orbit.</em></h2><p>A little room for the things that don’t fit neatly into a category.</p><button type="button" className="quiet-link" onClick={() => setRunning(!running)} aria-pressed={running}>{running ? "Pause the orbit" : "Let Pluto wander"} <span aria-hidden>↗</span></button></div><svg viewBox="0 0 400 260" role="img" aria-label="An illustration of Pluto following its own tilted orbit"><g fill="none" stroke="currentColor" strokeWidth="1"><ellipse cx="200" cy="135" rx="55" ry="16"/><ellipse cx="200" cy="135" rx="100" ry="30"/><ellipse cx="200" cy="135" rx="155" ry="45"/><ellipse cx="200" cy="135" rx="185" ry="58" transform="rotate(-28 200 135)" className="pluto-orbit"/></g><circle cx="200" cy="135" r="5" fill="currentColor"/><g className="pluto-dot"><circle cx="344" cy="54" r="7" fill="var(--accent)"/><text x="313" y="33" fill="currentColor" fontSize="12" fontFamily="monospace">pluto</text></g><text x="180" y="163" fill="currentColor" fontSize="10" fontFamily="monospace">you are here</text></svg></section>;
}

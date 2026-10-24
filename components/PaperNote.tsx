"use client";

import { useState } from "react";

export default function PaperNote() {
  const [open, setOpen] = useState(false);
  return <div className={`paper-note ${open ? "paper-open" : ""}`}><button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="paper-message"><span className="eyebrow">A note for you</span><strong>{open ? "Glad you found this." : "A small thought, folded."}</strong><span>{open ? "Fold it back ↙" : "Unfold me ↗"}</span></button><div id="paper-message" hidden={!open}><p>Good projects usually start with a small, slightly inconvenient question. If you have one, I’d love to hear it.</p><a href="mailto:aryanworks@hotmail.com">Let’s make something ↗</a></div></div>;
}

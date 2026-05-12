"use client";

/**
 * LetterPill — butterfly.so-style per-character rounded pill treatment.
 * Each character (excluding whitespace) gets its own bordered pill.
 * Whitespace renders as a small gap to preserve word boundaries.
 */

type Props = {
  text: string;
  className?: string;
  pillClassName?: string;
};

export default function LetterPill({ text, className = "", pillClassName = "" }: Props) {
  const chars = Array.from(text);
  return (
    <span className={`inline-flex flex-wrap items-center gap-[2px] ${className}`}>
      {chars.map((ch, i) => {
        if (ch === " ") {
          return <span key={i} className="inline-block w-1.5" aria-hidden="true" />;
        }
        return (
          <span
            key={i}
            className={`inline-flex items-center justify-center rounded-full border border-border bg-card/60 px-[0.4em] py-[0.05em] font-mono text-[0.6rem] uppercase leading-none tracking-[0.04em] ${pillClassName}`}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

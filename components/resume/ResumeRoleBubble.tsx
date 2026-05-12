"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Check } from "@phosphor-icons/react";
import { ROLE_VARIANTS, type RoleVariant } from "@/lib/resume";

interface Props {
  onSelect: (role: RoleVariant) => void;
  selectedId?: string;
}

const DISMISS_KEY = "resumeRoleBubbleDismissed";

/**
 * A minimal card in the bottom-right that lets the visitor swap the
 * downloaded PDF/JPEG for a role-tailored variant. No mascot, no fluff —
 * just a title, the role chips, and a dismiss control.
 */
export default function ResumeRoleBubble({ onSelect, selectedId }: Props) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [tailoringId, setTailoringId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    const t = window.setTimeout(
      () => setVisible(true),
      reducedMotion ? 200 : 4500
    );
    return () => window.clearTimeout(t);
  }, [reducedMotion]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const pick = (r: RoleVariant) => {
    setTailoringId(r.id);
    window.setTimeout(
      () => {
        onSelect(r);
        setTailoringId(null);
      },
      reducedMotion ? 60 : 450
    );
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="resume-role-bubble"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-5 right-5 z-30 max-w-[min(320px,calc(100vw-2rem))]"
          role="dialog"
          aria-label="Tailor resume for a role"
        >
          <div
            className="relative overflow-hidden rounded-xl border shadow-lg"
            style={{
              padding: "12px 14px 12px 14px",
              background:
                "linear-gradient(140deg, rgba(251, 246, 233, 0.72) 0%, rgba(245, 241, 234, 0.62) 100%)",
              borderColor: "rgba(42, 37, 32, 0.18)",
              backdropFilter: "blur(14px) saturate(140%)",
              WebkitBackdropFilter: "blur(14px) saturate(140%)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            {/* Grain overlay */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={{ opacity: 0.35, mixBlendMode: "multiply" }}
            >
              <filter id="bubbleGrain">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="2"
                  seed="5"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.16  0 0 0 0 0.14  0 0 0 0 0.12  0 0 0 0.28 0"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#bubbleGrain)" />
            </svg>
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-1.5 right-1.5 text-[#2a2520]/45 hover:text-[#2a2520] transition-colors p-0.5"
              aria-label="Dismiss"
            >
              <X size={11} weight="bold" />
            </button>
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="inline-block w-1 h-3 bg-[#2a2520]"
                aria-hidden="true"
              />
              <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#2a2520]/70">
                Tailor this resume
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {ROLE_VARIANTS.map((r) => {
                const isSelected = selectedId === r.id;
                const isTailoring = tailoringId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => pick(r)}
                    disabled={isTailoring}
                    className={`group flex items-center gap-1 text-[11px] font-mono px-2 py-[3px] rounded border transition-colors ${
                      isSelected
                        ? "bg-[#2a2520] text-[#fbf6e9] border-[#2a2520]"
                        : "border-[#2a2520]/25 text-[#2a2520]/80 hover:bg-[#2a2520]/5 hover:text-[#2a2520] hover:border-[#2a2520]/40"
                    } ${isTailoring ? "opacity-60" : ""}`}
                  >
                    {isSelected && (
                      <Check size={9} weight="bold" className="-mt-px" />
                    )}
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

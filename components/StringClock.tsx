"use client";

import { useEffect, useRef, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

export default function StringClock() {
  const [time, setTime] = useState<string | null>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let inView = true;
    const sync = () => {
      clearInterval(interval);
      if (document.hidden || !inView) return;
      setTime(formatter.format(new Date()));
      interval = setInterval(() => setTime(formatter.format(new Date())), 1000);
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    if (clockRef.current) observer.observe(clockRef.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { clearInterval(interval); observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return (
    <div className="string-clock" ref={clockRef}>
      <span className="clock-caption eyebrow">Meanwhile, in India</span>
      <div className="clock-rail" aria-hidden />
      <time className="clock-digits" aria-label={time ? `${time}, India Standard Time` : "Clock loading, India Standard Time"}>
        <span className="sr-only">{time ?? "India Standard Time"}</span>
        {(time ?? "--:--:--").split("").map((digit, index) => digit === ":" ? <span className="clock-colon" aria-hidden key={index}>:</span> : (
          <span className="clock-string" key={index} aria-hidden><span className="clock-bead" key={digit}>{digit}</span></span>
        ))}
      </time>
      <span className="clock-timezone eyebrow">IST / UTC +05:30</span>
    </div>
  );
}

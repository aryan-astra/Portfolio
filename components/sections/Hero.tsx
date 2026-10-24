import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { contact } from "@/lib/data";
import Portrait from "@/components/Portrait";
import StringClock from "@/components/StringClock";
import DotEyes from "@/components/DotEyes";

export default function Hero() {
  return (
    <section className="workshop-hero content-shell" aria-labelledby="intro-title">
      <div className="hero-topline">
        <p className="eyebrow">A personal corner of the internet</p>
        <span className="eyebrow">Chennai, India <span className="status-dot" /></span>
      </div>
      <div className="hero-composition">
        <div className="hero-copy">
          <div className="identity-line">
            <Portrait />
            <p>Aryan Shukla<span>Developer & curious human</span></p>
          </div>
          <h1 id="intro-title">A little curious.<br />Always <em>building.</em></h1>
          <p className="hero-bio">I study computer science at SRMIST and build tools for the things that bother me. From local AI to the little app that makes university a little less chaotic.</p>
          <div className="hero-actions">
            <a href="#projects" className="ink-button">Explore my work <ArrowUpRight size={18} aria-hidden /></a>
            <a href={`mailto:${contact.email}`} className="quiet-link">Say hello <ArrowUpRight size={15} aria-hidden /></a>
          </div>
        </div>
        <aside className="hero-objects" aria-label="A small desk experiment">
          <StringClock />
          <div className="watching-eyes"><DotEyes /><span className="eyebrow">Still figuring things out.</span></div>
          <span className="desk-caption">a work in progress.<br />like most good things.</span>
        </aside>
      </div>
      <div className="hero-bottomline">
        <a href="#projects" className="eyebrow inline-flex items-center gap-2">Scroll to explore <ArrowDown size={14} aria-hidden /></a>
        <Link prefetch={false} href="/garden" className="eyebrow">Software / notes / things in orbit ↗</Link>
      </div>
    </section>
  );
}

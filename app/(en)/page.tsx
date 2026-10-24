import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Writing from "@/components/sections/Writing";
import Contact from "@/components/sections/Contact";
import OrbitNote from "@/components/OrbitNote";
import { hackathons } from "@/lib/data";

export default function Home() {
  return <><Hero /><Projects /><Writing /><div className="content-shell"><OrbitNote /></div><section className="event-section content-shell" id="hackathons"><div className="editorial-heading"><p className="eyebrow">03 / Out in the world</p><h2>Short clocks.<br /><em>Long lessons.</em></h2><p>A few experiments under pressure.</p></div><div className="event-index">{hackathons.map(event=><details key={event.event}><summary><span className="eyebrow">{event.year}</span><span>{event.event}</span><span aria-hidden>+</span></summary><div><h3>{event.project}</h3><p>{event.description}</p>{event.team&&<p>Team: {event.team}</p>}<p>{event.result}</p></div></details>)}</div></section><Contact /></>;
}

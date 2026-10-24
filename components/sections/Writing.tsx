import Link from "next/link";
import { posts } from "@/lib/data";

export default function Writing() {
  return (
    <section id="writing" className="writing-section content-shell">
      <div className="editorial-heading"><p className="eyebrow">02 / Field notes</p><h2>Thinking in <em>public.</em></h2><Link prefetch={false} className="quiet-link" href="/writing">All writing ↗</Link></div>
      <div className="notes-layout"><p className="notes-aside">Notes from the space between<br />“what if” and “it works.”<Link prefetch={false} href="/garden">Follow the connections ↗</Link></p><div className="notes-index">{posts.map(post => <Link prefetch={false} href={`/writing/${post.slug}`} key={post.slug}><div><p className="eyebrow">{new Date(post.date).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" })} / Note</p><h3>{post.title}</h3><p>{post.description}</p></div><span aria-hidden>↗</span></Link>)}</div></div>
    </section>
  );
}

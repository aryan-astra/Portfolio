import Link from "next/link";

export default function NotFound() {
  return <section className="section-block"><div className="content-shell"><p className="section-label">404 / Outside the orbit</p><h1 className="font-display text-5xl mb-6">A little too far out.</h1><p className="text-muted-foreground mb-6">This page isn’t here. There are still a few good places to land.</p><Link prefetch={false} className="ink-button" href="/">Back to the workbench ↗</Link><Link prefetch={false} className="quiet-link ml-6" href="/search">Search the site</Link></div></section>;
}

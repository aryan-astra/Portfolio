import type { Metadata } from "next";
/* eslint-disable @next/next/no-html-link-for-pages -- This standalone document must cross independent root layouts. */

export const metadata: Metadata = { title: "Outside the orbit — Aryan Shukla", robots: { index: false, follow: false }, metadataBase: new URL("https://aryans.is-a.dev") };

export default function GlobalNotFound() {
  return <html lang="en"><body style={{ margin: 0, background: "#f5f3ed", color: "#111", fontFamily: "Georgia,serif" }}><main style={{ maxWidth: "40rem", padding: "12vh 1.5rem", margin: "auto" }}><p style={{ fontFamily: "monospace", fontSize: ".75rem" }}>404 / OUTSIDE THE ORBIT</p><h1 style={{ fontSize: "clamp(2rem,7vw,4rem)", fontWeight: 400 }}>A little too far out.</h1><p>This page isn’t here. There are still a few good places to land.</p><nav aria-label="Find your way back" style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}><a href="/" style={{ color: "#2563eb" }}>Back to the workbench ↗</a><a href="/search" style={{ color: "#2563eb" }}>Search the site</a></nav></main></body></html>;
}

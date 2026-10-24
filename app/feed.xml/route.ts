import { posts } from "@/lib/data";
import { notes } from "@/lib/notes";

export const dynamic = "force-static";
const escape = (text: string) => text.replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!);

export function GET() {
  const entries = [
    ...posts.map(post => ({ ...post, url: `/writing/${post.slug}`, excerpt: post.description })),
    ...notes.map(note => ({ ...note, url: `${note.language === "ru" ? "/ru" : ""}/notes/${note.slug}` })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const items = entries.map(entry => `<item><title>${escape(entry.title)}</title><link>https://aryans.is-a.dev${entry.url}</link><guid>https://aryans.is-a.dev${entry.url}</guid><pubDate>${new Date(`${entry.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escape(entry.excerpt)}</description></item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Aryan Shukla — Writing</title><link>https://aryans.is-a.dev/writing</link><description>Software, experiments, and notes.</description>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

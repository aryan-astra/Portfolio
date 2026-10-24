import { concepts } from "@/lib/concepts";

export type TextPart = { text: string; href?: string };

export function linkConcepts(text: string): TextPart[] {
  const protectedRanges = [...text.matchAll(/```[\s\S]*?```|`[^`\n]*`|\[[^\]]+\]\([^)]*\)|<a\b[^>]*>[\s\S]*?<\/a>/gi)]
    .map(match => [match.index!, match.index! + match[0].length]);
  const matches = concepts.flatMap(concept => concept.aliases.flatMap(alias => {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return [...text.matchAll(new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, "giu"))]
      .map(match => ({ start: match.index!, end: match.index! + match[0].length, text: match[0], href: `/garden/${concept.id}` }));
  })).filter(match => !protectedRanges.some(([start, end]) => match.start < end && match.end > start))
    .sort((a, b) => a.start - b.start || b.end - a.end);
  const linked = new Set<string>();
  const parts: TextPart[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start < cursor || linked.has(match.href)) continue;
    if (match.start > cursor) parts.push({ text: text.slice(cursor, match.start) });
    parts.push({ text: match.text, href: match.href });
    linked.add(match.href);
    cursor = match.end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}

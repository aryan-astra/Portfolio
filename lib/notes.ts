import snapshot from "@/content/notion-posts.json";
import { validateContent } from "@/lib/content-schema.mjs";

export type NotePart = { text: string; href?: string; marks?: Record<string, boolean> };
export type NoteBlock = { type: string; content?: NotePart[]; url?: string; caption?: NotePart[]; language?: string; children?: NoteBlock[] };
export type Note = { id: string; slug: string; title: string; date: string; language: "en" | "ru"; excerpt: string; tags: string[]; blocks: NoteBlock[]; published?: boolean; kind?: "note" | "essay" | "research" | "concept" | "person" | "book" | "film" | "experiment"; rating?: number };

validateContent(snapshot);
export const notes = (snapshot as Note[]).filter(note => note.published !== false);
export function noteText(note: Note): string {
  const walk = (blocks: NoteBlock[]): string => blocks.map(block => `${block.content?.map(part => part.text).join("") ?? ""} ${block.children ? walk(block.children) : ""}`).join(" ");
  return walk(note.blocks);
}

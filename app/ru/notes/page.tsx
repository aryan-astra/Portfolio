import type { Metadata } from "next";
import Link from "next/link";
import { notes } from "@/lib/notes";
import { RuPageTitle } from "@/components/ru/RuShell";

export const metadata: Metadata = { title: "Заметки", alternates: { canonical: "https://aryans.is-a.dev/ru/notes", languages: { en: "https://aryans.is-a.dev/notes", ru: "https://aryans.is-a.dev/ru/notes" } } };
export default function RussianNotes() {
  const entries = notes.filter(note => note.language === "ru");
  return <><RuPageTitle eyebrow="Блокнот">Заметки</RuPageTitle>{entries.length ? <ul>{entries.map(note => <li key={note.id}><Link href={`/ru/notes/${note.slug}`}>{note.title}</Link> — {note.excerpt}</li>)}</ul> : <p>Опубликованных заметок пока нет. Можно <Link href="/ru/writing">прочитать существующие тексты</Link>.</p>}</>;
}

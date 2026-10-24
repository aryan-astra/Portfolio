import type { Metadata } from "next";
import Link from "next/link";
import { shelves } from "@/lib/shelves";
import { RuPageTitle } from "@/components/ru/RuShell";

export const metadata: Metadata = { title: "Библиотека", alternates: { canonical: "https://aryans.is-a.dev/ru/library", languages: { en: "https://aryans.is-a.dev/library", ru: "https://aryans.is-a.dev/ru/library" } } };
export default function LibraryPage() { return <><RuPageTitle eyebrow="Открытые полки">Библиотека</RuPageTitle><ul>{shelves.map(shelf => <li key={shelf.slug}><Link href={`/ru/library/${shelf.slug}`}>{shelf.ru}</Link> — {shelf.ruDescription}</li>)}</ul><p>Разделы будут пополняться опубликованными заметками. Здесь нет выдуманных рецензий или оценок.</p></>; }

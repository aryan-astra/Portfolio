import type { Metadata } from "next";
import Link from "next/link";
import { concepts } from "@/lib/concepts";
import { ruConcepts } from "@/lib/ru-garden";
import { RuPageTitle } from "@/components/ru/RuShell";

export const metadata: Metadata = { title: "Сад идей", alternates: { canonical: "https://aryans.is-a.dev/ru/garden", languages: { en: "https://aryans.is-a.dev/garden", ru: "https://aryans.is-a.dev/ru/garden" } } };
export default function Garden() { return <><RuPageTitle eyebrow="Связи между текстами">Сад идей</RuPageTitle><p>Указатель тем, которые встречаются в проектах и текстах. Каждая ссылка ведёт к источникам с контекстом.</p><ul>{concepts.map(concept => <li key={concept.id}><Link href={`/ru/garden/${concept.id}`}>{ruConcepts[concept.id]}</Link></li>)}</ul><p><Link href="/ru/library">Книги, кино и люди в библиотеке</Link></p></>; }

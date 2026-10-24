import type { Metadata } from "next";
import Link from "next/link";
import { ruWriting } from "@/lib/ru";
import { RuPageTitle } from "@/components/ru/RuShell";

const base = "https://aryans.is-a.dev";
export const metadata: Metadata = {
  title: "Тексты",
  description: "Заметки о выпуске проектов, локальном ИИ и хакатонах.",
  alternates: { canonical: `${base}/ru/writing`, languages: { en: `${base}/writing`, ru: `${base}/ru/writing` } },
};

export default function RussianWritingIndex() {
  return <>
    <RuPageTitle eyebrow="Указатель · заметки">Тексты</RuPageTitle>
    <p className="ru-lede">Случаи из практики, локальный ИИ, хакатоны и детали выпуска проектов, которые не помещаются в карточку.</p>
    {ruWriting.map((post) => <article className="ru-record" key={post.slug}>
      <time className="ru-date" dateTime={post.date}>{post.date}</time>
      <div><h2><Link href={`/ru/writing/${post.slug}`}>{post.title}</Link></h2><p>{post.description}</p></div>
    </article>)}
  </>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/data";
import { ruPosts } from "@/lib/ru";
import { RuPageTitle } from "@/components/ru/RuShell";

const base = "https://aryans.is-a.dev";
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = ruPosts[slug];
  return post ? {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${base}/ru/writing/${slug}`, languages: { en: `${base}/writing/${slug}`, ru: `${base}/ru/writing/${slug}` } },
  } : { title: "Текст не найден" };
}

export default async function RussianPostPage({ params }: Props) {
  const { slug } = await params;
  const source = posts.find((post) => post.slug === slug);
  const post = ruPosts[slug];
  if (!source || !post) notFound();
  return <>
    <p className="ru-small"><Link href="/ru/writing">← Все тексты</Link></p>
    <RuPageTitle eyebrow={`Заметка · ${source.date}`}>{post.title}</RuPageTitle>
    <p className="ru-lede">{post.description}</p>
    <nav className="ru-contents" aria-label="Содержание">{post.body.map((_, index) => <a key={index} href={`#paragraph-${index + 1}`}>{String(index + 1).padStart(2, "0")}</a>)}</nav>
    <article>{post.body.map((paragraph, index) => <section className="ru-section" id={`paragraph-${index + 1}`} key={index}><p><span className="ru-date">{String(index + 1).padStart(2, "0")}　</span>{paragraph}</p></section>)}</article>
  </>;
}

import type { ReactNode } from "react";
import Image from "next/image";
import type { NoteBlock, NotePart } from "@/lib/notes";
import LinkedText from "@/components/garden/LinkedText";

function RichText({ parts, link = true }: { parts: NotePart[]; link?: boolean }) {
  return <>{parts.map((part, index) => {
    let value: ReactNode = link && !part.href && !part.marks?.code ? <LinkedText text={part.text} /> : part.text;
    if (part.marks?.bold) value = <strong>{value}</strong>;
    if (part.marks?.italic) value = <em>{value}</em>;
    if (part.marks?.strikethrough) value = <del>{value}</del>;
    if (part.marks?.code) value = <code>{value}</code>;
    return <span key={index}>{part.href ? <a href={part.href} rel="noreferrer">{value}</a> : value}</span>;
  })}</>;
}

export default function NoteBody({ blocks, locale = "en" }: { blocks: NoteBlock[]; locale?: "en" | "ru" }) {
  const rendered: ReactNode[] = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    const content = <RichText parts={block.content ?? []} link={locale === "en"} />;
    const key = index;
    if (block.type.endsWith("list_item")) {
      const type = block.type;
      const items: ReactNode[] = [];
      while (blocks[index]?.type === type) {
        items.push(<li key={index}><RichText parts={blocks[index].content ?? []} link={locale === "en"} /></li>);
        index++;
      }
      index--;
      rendered.push(type === "numbered_list_item" ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>);
    } else if (block.type === "heading_1") rendered.push(<h2 id={`note-${index}`} key={key}>{content}</h2>);
    else if (block.type === "heading_2") rendered.push(<h3 id={`note-${index}`} key={key}>{content}</h3>);
    else if (block.type === "heading_3") rendered.push(<h4 id={`note-${index}`} key={key}>{content}</h4>);
    else if (block.type === "code") rendered.push(<pre key={key}><code>{block.content?.map(part => part.text).join("")}</code></pre>);
    else if (block.type === "divider") rendered.push(<hr key={key} />);
    else if (block.type === "quote" || block.type === "callout") rendered.push(<blockquote key={key}>{content}</blockquote>);
    else if (block.type === "bookmark") rendered.push(<p key={key}><a href={block.url}><RichText parts={block.caption?.length ? block.caption : [{ text: block.url! }]} link={false} /></a></p>);
    else if (block.type === "image") rendered.push(<figure key={key}><Image src={block.url!} alt={block.caption?.map(part => part.text).join("") || (locale === "ru" ? "Иллюстрация к заметке" : "Illustration for this note")} width={1200} height={800} unoptimized loading="lazy" style={{ width: "100%", height: "auto" }} />{block.caption?.length ? <figcaption><RichText parts={block.caption} link={false} /></figcaption> : null}</figure>);
    else if (block.type === "toggle") rendered.push(<details key={key}><summary>{content}</summary><NoteBody blocks={block.children ?? []} locale={locale} /></details>);
    else rendered.push(<p key={key}>{content}</p>);
  }
  return <div className="note-body">{rendered}</div>;
}

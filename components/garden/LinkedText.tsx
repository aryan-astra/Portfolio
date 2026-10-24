import Link from "next/link";
import { linkConcepts } from "@/lib/linking";

export default function LinkedText({ text }: { text: string }) {
  return <>{linkConcepts(text).map((part, index) => part.href
    ? <Link prefetch={false} key={`${part.href}-${index}`} href={part.href} className="site-link">{part.text}</Link>
    : <span key={index}>{part.text}</span>)}</>;
}

import { contact } from "@/lib/data";
import PaperNote from "@/components/PaperNote";

export default function Contact() {
  return <section id="contact" className="contact-section content-shell"><div><p className="eyebrow">04 / Leave a little signal</p><h2>Have something<br /><em>on your mind?</em></h2><a href={`mailto:${contact.email}`} className="contact-email">{contact.email} ↗</a><div className="contact-socials"><a href={contact.github}>GitHub ↗</a><a href={contact.linkedin}>LinkedIn ↗</a><a href={contact.twitter}>X ↗</a></div></div><PaperNote /></section>;
}

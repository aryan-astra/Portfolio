"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { List, X, MagnifyingGlass } from "@phosphor-icons/react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [["Work", "/#projects"], ["Writing", "/writing"], ["Garden", "/garden"], ["Résumé", "/resume"]];

export default function Navbar() {
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const close = () => menu.current?.close();
  useEffect(() => {
    const dialog = menu.current;
    const release = () => { document.body.style.overflow = ""; };
    dialog?.addEventListener("close", release);
    return () => { release(); dialog?.removeEventListener("close", release); };
  }, []);
  return (
    <header className="site-header content-shell">
      <Link prefetch={false} href="/" className="wordmark" aria-label="as — Aryan Shukla home">as<span aria-hidden>✳</span></Link>
      <nav aria-label="Main navigation" className="desktop-navigation">
        {links.map(([label, href]) => <Link prefetch={false} key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
      </nav>
      <div className="navigation-tools">
        <Link prefetch={false} href="/search" className="icon-control" aria-label="Search the site"><MagnifyingGlass size={18} aria-hidden /></Link>
        <ThemeToggle />
        <Link prefetch={false} href="/ru" className="language-link" lang="ru" hrefLang="ru">РУ</Link>
        <button className="icon-control mobile-menu-button" type="button" aria-label="Open navigation" onClick={() => { menu.current?.showModal(); document.body.style.overflow = "hidden"; }}><List size={21} aria-hidden /></button>
      </div>
      <dialog ref={menu} className="navigation-dialog" aria-label="Site navigation" onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="navigation-sheet">
          <button type="button" className="icon-control menu-close" onClick={close} aria-label="Close navigation"><X size={22} aria-hidden /></button>
          <p className="eyebrow">Where to?</p>
          <nav aria-label="Mobile navigation">{links.map(([label, href]) => <Link prefetch={false} href={href} key={href} onClick={close}>{label} <span aria-hidden>↗</span></Link>)}<Link prefetch={false} href="/#contact" onClick={close}>Contact <span aria-hidden>↗</span></Link></nav>
          <a href="/og/" onClick={close} className="quiet-link">Visit the original site ↗</a>
        </div>
      </dialog>
    </header>
  );
}

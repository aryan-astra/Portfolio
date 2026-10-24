import Link from "next/link";
import { ruHome } from "@/lib/ru";

export function RuHeader() {
  return (
    <header className="ru-masthead">
      <Link className="ru-wordmark" href="/ru/">Архив Арьяна Шуклы</Link>
      <nav aria-label="Основная навигация">
        <Link href="/ru/projects">Проекты</Link>
        <Link href="/ru/writing">Тексты</Link>
        <Link href="/ru/notes">Заметки</Link>
        <Link href="/ru/library">Библиотека</Link>
        <Link href="/ru/garden">Сад идей</Link>
        <Link href="/ru/resume">Резюме</Link>
        <Link href="/ru/#contact">Контакты</Link>
      </nav>
      <Link className="ru-language" href="/">English</Link>
    </header>
  );
}

export function RuFooter() {
  return (
    <footer className="ru-footer">
      <p>Арьян Шукла · SRMIST · {new Date().getFullYear()}</p>
      <p>{ruHome.status}</p>
      <Link href="/ru/privacy">Конфиденциальность</Link>
      <a href="mailto:aryanworks@hotmail.com">Написать письмо</a>
    </footer>
  );
}

export function RuLayoutFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="ru-site" lang="ru">
      <div className="ru-page">
        <RuHeader />
        <main id="main-content">{children}</main>
        <RuFooter />
      </div>
    </div>
  );
}

export function RuPageTitle({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <header className="ru-title-block">
      <p className="ru-eyebrow">{eyebrow}</p>
      <h1>{children}</h1>
    </header>
  );
}

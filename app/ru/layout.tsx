import type { Metadata } from "next";
import "./ru.css";
import { RuLayoutFrame } from "@/components/ru/RuShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://aryans.is-a.dev"),
  title: { default: "Архив Арьяна Шуклы", template: "%s — Арьян Шукла" },
  description: "Проекты, заметки и резюме Арьяна Шуклы. Русский перевод, ожидающий редакторской проверки.",
  openGraph: {
    locale: "ru_RU",
    images: [{ url: "https://aryans.is-a.dev/social.png", width: 1200, height: 630, alt: "Арьян Шукла — проекты и заметки" }],
  },
  twitter: { card: "summary_large_image", images: ["https://aryans.is-a.dev/social.png"] },
};

export default function RussianLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <RuLayoutFrame>{children}</RuLayoutFrame>
      </body>
    </html>
  );
}


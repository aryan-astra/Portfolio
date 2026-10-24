import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aryans.is-a.dev"),
  title: {
    default: "Aryan Shukla",
    template: "%s — Aryan Shukla",
  },
  description:
    "Aryan Shukla — software, small experiments, and a growing garden of ideas. Computer science at SRMIST.",
  alternates: { canonical: "/", languages: { en: "/", ru: "/ru" }, types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    title: "Aryan Shukla",
    description: "Software, small experiments, and a growing garden of ideas.",
    url: "https://aryans.is-a.dev",
    siteName: "Aryan Shukla",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan Shukla",
    description: "Software, small experiments, and a growing garden of ideas. Computer science at SRMIST.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased relative overflow-x-clip">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: "Aryan Shukla", url: "https://aryans.is-a.dev", sameAs: ["https://github.com/aryan-astra", "https://linkedin.com/in/aryanworks"] }) }} />
        <ThemeProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <Navbar />
          <main className="flex-1 relative z-10" id="main-content" tabIndex={-1}>
            {children}
          </main>
          <div className="relative z-10" id="site-footer">
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aryans.is-a.dev"),
  title: {
    default: "Aryan Shukla",
    template: "%s — Aryan Shukla",
  },
  description:
    "CSE student at SRMIST building tools, apps, and AI systems that get used daily.",
  openGraph: {
    title: "Aryan Shukla",
    description: "Builder. CSE @ SRMIST. 300+ daily users on my projects.",
    url: "https://aryans.is-a.dev",
    siteName: "Aryan Shukla",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan Shukla",
    description: "CSE student at SRMIST. I build things that get used.",
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
      className={`${dmSans.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t!=='light')document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased relative overflow-x-clip">
        <CustomCursor />
        <Navbar />
        <main className="flex-1 relative z-10" id="main-content">
          {children}
        </main>
        <div className="relative z-10" id="site-footer">
          <Footer />
        </div>
      </body>
    </html>
  );
}

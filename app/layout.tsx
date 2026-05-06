import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ButterflyBackground from "@/components/ButterflyBackground";

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
  title: "Aryan Shukla — I build things people actually use",
  description:
    "CSE student at SRMIST. I build PWAs, Android apps, offline AI agents, and tools that get used daily.",
  openGraph: {
    title: "Aryan Shukla",
    description: "Builder. CSE @ SRMIST. 300+ daily users on my projects.",
    url: "https://aryans.is-a.dev",
    siteName: "Aryan Shukla",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Aryan Shukla — Builder",
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
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased relative overflow-x-clip">
        <ButterflyBackground />
        <Navbar />
        <main className="flex-1 relative z-10" id="main-content">
          {children}
        </main>
        <div className="relative z-10" id="contact">
          <Footer />
        </div>
      </body>
    </html>
  );
}

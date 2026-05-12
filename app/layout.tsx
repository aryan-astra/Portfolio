import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
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
  axes: ["SOFT", "WONK"],
  weight: "variable",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aryan.sh"),
  title: {
    default: "Aryan Shukla",
    template: "%s — Aryan Shukla",
  },
  description:
    "CS sophomore at SRMIST. I make stuff. Some of it breaks. Most of it ships.",
  openGraph: {
    title: "Aryan Shukla",
    description: "Builder. CSE @ SRMIST. 300+ daily users on my projects.",
    url: "https://aryan.sh",
    siteName: "Aryan Shukla",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan Shukla",
    description: "CS sophomore at SRMIST. I make stuff. Some of it ships.",
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
        <ThemeProvider>
          <CustomCursor />
          <Navbar />
          <main className="flex-1 relative z-10" id="main-content">
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

// src/app/layout.tsx
// Root layout — wraps every page with Header and Footer.
//
// Typography:
//   Archivo Black  → headings, navigation, CTAs  (--font-display)
//   Inter          → body copy, tables, notes     (--font-sans)
//
// Both fonts are loaded here once via next/font/google and exposed as CSS
// variables consumed by globals.css @theme tokens.

import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",           // Archivo Black only has weight 400
  variable: "--font-archivo-black",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eva Scolaro Talent Studio",
    template: "%s | Eva Scolaro Talent Studio",
  },
  description:
    "Dance and performing arts classes for children in Sanur and Canggu, Bali. Ballet, Hip-Hop, Contemporary, Acrobatics and more.",
  metadataBase: new URL("https://www.evascolarotalentstudio.com"),
  openGraph: {
    siteName: "Eva Scolaro Talent Studio",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${archivoBlack.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

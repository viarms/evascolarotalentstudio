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
import { Archivo_Black, Alumni_Sans, Inter, Licorice } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import FeedbackModal from "@/components/modals/FeedbackModal";
import JoinUsModal from "@/components/modals/JoinUsModal";
import BookTrialModal from "@/components/modals/BookTrialModal";

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

const licorice = Licorice({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-licorice",
  display: "swap",
});

const alumniSans = Alumni_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-alumni-sans",
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
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
    <html lang="id" className={`${archivoBlack.variable} ${inter.variable} ${licorice.variable} ${alumniSans.variable}`}>
      <GoogleTagManager gtmId="GTM-NKCTQ2DW" />
      <body className="min-h-screen flex flex-col text-[#DDDDDD] antialiased bg-[#121212]">
        <SmoothScrollProvider>
          <Header />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <FeedbackModal />
          <JoinUsModal />
          <BookTrialModal />
        </SmoothScrollProvider>
      </body>
      <GoogleAnalytics gaId="G-1JDY0MTPSV" />
    </html>
  );
}

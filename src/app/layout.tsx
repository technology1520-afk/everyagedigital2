import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "../context/WishlistContext";
import { SiteHeader } from "../components/ui/SiteHeader";
import { SiteFooter } from "../components/ui/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://everyagedigital.com'),
  title: {
    default: "EveryAge Digital — Curated Products, Books & Digital Resources",
    template: "%s | EveryAge Digital"
  },
  description: "A curated affiliate commerce storefront and digital-product store helping you discover useful everyday products, books, and knowledge resources.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://everyagedigital.com",
    siteName: "EveryAge Digital",
    title: "EveryAge Digital — Curated Products, Books & Digital Resources",
    description: "Curated products, useful books, digital resources, and everyday essentials recommended with editorial clarity."
  },
  twitter: {
    card: "summary_large_image",
    title: "EveryAge Digital",
    description: "Curated affiliate commerce storefront and digital store."
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-[#151515]">
        {/* Skip to Content for WCAG 2.2 AA Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1D438A] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-hidden"
        >
          Skip to main content
        </a>
        <WishlistProvider>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </WishlistProvider>
      </body>
    </html>
  );
}

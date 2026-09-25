import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { WishlistProvider } from "../context/WishlistContext";
import { SiteHeader } from "../components/ui/SiteHeader";
import { SiteFooter } from "../components/ui/SiteFooter";
import { MobileTabBar } from "../components/ui/MobileTabBar";

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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 min-h-screen relative overflow-x-hidden flex flex-col antialiased selection:bg-blue-500/30 selection:text-white">
        {/* Persistent ambient blur glow spheres in fixed positions */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {/* Top-left: Indigo/Blue orb */}
          <div className="h-[500px] w-[500px] bg-blue-600/15 blur-[160px] pointer-events-none fixed -top-40 -left-40 z-0 rounded-full" />
          {/* Center-right: Violet/Purple orb */}
          <div className="h-[600px] w-[600px] bg-indigo-600/10 blur-[180px] pointer-events-none fixed top-1/3 -right-40 z-0 rounded-full" />
          {/* Bottom-left: Subtle emerald or cyan orb */}
          <div className="h-[500px] w-[500px] bg-sky-500/10 blur-[160px] pointer-events-none fixed -bottom-40 left-1/4 z-0 rounded-full" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Skip to Content for WCAG 2.2 AA Accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-hidden"
            >
              Skip to main content
            </a>
            <WishlistProvider>
              <SiteHeader />
              <main id="main-content" className="flex-1 pb-16 md:pb-0">
                {children}
              </main>
              <SiteFooter />
              <MobileTabBar />
            </WishlistProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

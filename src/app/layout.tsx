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
  title: "EveryAge Digital | Curated Commerce",
  description: "A curated affiliate commerce storefront and digital-product store helping you discover useful everyday products, books, and knowledge resources.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://everyagedigital.com",
    siteName: "EveryAge Digital",
    title: "EveryAge Digital — Curated Products, Books & Digital Resources",
    description: "Curated products, useful books, digital resources, and everyday essentials recommended with editorial clarity.",
    images: [{
      url: '/logo.png',
      width: 1024,
      height: 1024,
      alt: 'EveryAge Digital'
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "EveryAge Digital",
    description: "Curated affiliate commerce storefront and digital store.",
    images: ['/logo.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-screen bg-[#f4f0fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden flex flex-col antialiased selection:bg-purple-500/30 selection:text-purple-900 dark:selection:bg-blue-500/30 dark:selection:text-white">
        {/* Persistent ambient blur glow spheres in fixed positions (lavender day / indigo dark) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {/* Top-left orb */}
          <div className="h-[500px] w-[500px] bg-purple-300/40 dark:bg-blue-600/15 blur-[150px] pointer-events-none fixed -top-40 -left-40 z-0 rounded-full transition-colors duration-500" />
          {/* Center-right orb */}
          <div className="h-[600px] w-[600px] bg-fuchsia-200/30 dark:bg-indigo-600/10 blur-[180px] pointer-events-none fixed top-1/3 -right-40 z-0 rounded-full transition-colors duration-500" />
          {/* Bottom-left orb */}
          <div className="h-[500px] w-[500px] bg-indigo-200/30 dark:bg-sky-500/10 blur-[150px] pointer-events-none fixed -bottom-40 left-1/4 z-0 rounded-full transition-colors duration-500" />
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

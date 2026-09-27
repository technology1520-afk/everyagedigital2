import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { WishlistProvider } from "../context/WishlistContext";
import { SiteHeader } from "../components/ui/SiteHeader";
import { SiteFooter } from "../components/ui/SiteFooter";
import { MobileTabBar } from "../components/ui/MobileTabBar";
import { HalloweenAmbientOverlay } from "../components/ui/HalloweenAmbientOverlay";
import { getSupabaseAdminClient } from "../lib/supabase/server";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { catalogRepository } from "../lib/db/repository";

export const dynamic = 'force-dynamic'; // Prevent Vercel CDN from freezing stale theme state across browsers

async function getLiveSeasonalTheme(): Promise<{ active: boolean; theme: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'seasonal_theme')
        .maybeSingle();

      if (!error && data?.value) {
        const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        return {
          active: Boolean(val.active),
          theme: String(val.theme || 'halloween')
        };
      }
    }
  } catch (err) {
    console.warn('[RootLayout] Supabase seasonal theme fetch warning:', err);
  }
  return catalogRepository.getSeasonalTheme();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.everyagedigital.store'),
  title: {
    default: 'EveryAge Digital | Curated Tools, Hardware & Systems',
    template: '%s | EveryAge Digital',
  },
  description: 'Vetted everyday essentials, ergonomic tools, books, and digital systems for remote professionals and builders.',
  keywords: ['ergonomic desk setup', 'Logitech MX Master 3S', 'productivity gear', 'remote work tools'],
  authors: [{ name: 'EveryAge Digital' }],
  creator: 'EveryAge Digital',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EveryAge Digital | Curated Storefront',
    description: 'Tested hardware, workspace ergonomics, and digital toolkits.',
    url: 'https://www.everyagedigital.store',
    siteName: 'EveryAge Digital',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EveryAge Digital Catalog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: 'EveryAge Digital | Curated Tools, Hardware & Systems',
    description: 'Tested hardware, workspace ergonomics, and digital toolkits.',
    images: ['/og-image.png'],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seasonalTheme = await getLiveSeasonalTheme();
  const isHalloween = Boolean(seasonalTheme.active && (seasonalTheme.theme === 'halloween' || !seasonalTheme.theme));

  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      data-seasonal={isHalloween ? 'halloween' : undefined}
      className={`${geistSans.variable} ${geistMono.variable} ${isHalloween ? 'dark' : ''} h-full antialiased`}
    >
      <body 
        suppressHydrationWarning 
        data-seasonal={isHalloween ? 'halloween' : undefined}
        className="min-h-screen bg-[#f4f0fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden flex flex-col antialiased selection:bg-purple-500/30 selection:text-purple-900 dark:selection:bg-blue-500/30 dark:selection:text-white"
      >
        {isHalloween && <HalloweenAmbientOverlay />}
        {/* Persistent ambient blur glow spheres in fixed positions (lavender day / indigo dark) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {/* Top-left orb */}
          <div className="h-[500px] w-[500px] bg-purple-300/40 dark:bg-blue-600/15 blur-[150px] pointer-events-none fixed -top-40 -left-40 z-0 rounded-full transition-colors duration-500" />
          {/* Center-right orb */}
          <div className="h-[600px] w-[600px] bg-fuchsia-200/30 dark:bg-indigo-600/10 blur-[180px] pointer-events-none fixed top-1/3 -right-40 z-0 rounded-full transition-colors duration-500" />
          {/* Bottom-left orb */}
          <div className="h-[500px] w-[500px] bg-indigo-200/30 dark:bg-sky-500/10 blur-[150px] pointer-events-none fixed -bottom-40 left-1/4 z-0 rounded-full transition-colors duration-500" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem forcedTheme={isHalloween ? 'dark' : undefined}>
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Skip to Content for WCAG 2.2 AA Accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-hidden"
            >
              Skip to main content
            </a>
            <WishlistProvider>
              <SiteHeader isHalloween={isHalloween} />
              <main id="main-content" className="flex-1 pb-16 md:pb-0 w-full">
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

// app/layout.tsx
import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  weight: ["600", "700", "800"],
  display: "swap",
});

const BASE_URL = "https://kebbidailynews.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Titles ────────────────────────────────────────────────────
  title: {
    default: "Kebbi Daily News — Breaking News from Kebbi State, Nigeria",
    template: "%s | Kebbi Daily News",
  },

  // ── Description ───────────────────────────────────────────────
  description:
    "Kebbi Daily News is Kebbi State's most trusted source for breaking news, politics, security, economy, health, education, and sports. Updated daily from Birnin Kebbi, Nigeria.",

  // ── Keywords ──────────────────────────────────────────────────
  keywords: [
    "Kebbi news",
    "Kebbi State news",
    "Birnin Kebbi",
    "Nigeria breaking news",
    "Kebbi politics",
    "Kebbi security",
    "Kebbi economy",
    "Kebbi Daily News",
    "Northwest Nigeria news",
    "Kebbi governor",
  ],

  // ── Authorship / Publisher ────────────────────────────────────
  authors: [{ name: "Kebbi Daily News", url: BASE_URL }],
  creator: "Kebbi Daily News",
  publisher: "Kebbi Daily News",

  // ── Canonical / Alternate ─────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Robots ───────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Icons / Favicons ──────────────────────────────────────────
  // Next.js uses this to generate <link> tags in <head>.
  // logo.png (512×512) is the high-res icon Google uses for the
  // Knowledge Panel and rich results.
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png",          sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  // ── Open Graph ────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: BASE_URL,
    siteName: "Kebbi Daily News",
    title: "Kebbi Daily News — Breaking News from Kebbi State",
    description:
      "The latest breaking news, politics, security, economy, and sports from Kebbi State, Nigeria.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kebbi Daily News — Breaking News from Kebbi State, Nigeria",
        type: "image/jpeg",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@kebbidailynews",
    creator: "@kebbidailynews",
    title: "Kebbi Daily News — Breaking News from Kebbi State",
    description:
      "Breaking news, politics, security and local stories from Kebbi State, Nigeria.",
    images: ["/og-image.jpg"],
  },

  // ── App / PWA ─────────────────────────────────────────────────
  applicationName: "Kebbi Daily News",
  category: "news",
  classification: "News & Media",

  // ── Other ─────────────────────────────────────────────────────
  other: {
    "DC.title": "Kebbi Daily News",
    "DC.language": "en",
    "DC.publisher": "Kebbi Daily News",
    "DC.coverage": "Kebbi State, Nigeria",
    "geo.region": "NG-KB",
    "geo.placename": "Birnin Kebbi, Kebbi State, Nigeria",
    "geo.position": "12.4539;4.1975",
    ICBM: "12.4539, 4.1975",
    news_keywords:
      "Kebbi, Kebbi State, Birnin Kebbi, Nigeria, breaking news, politics, security",
  },
};

// ── Website + NewsMediaOrganization Schema ─────────────────────
//
// Feeds Google's Knowledge Graph (logo + social links panel in search).
// Also registers the Sitelinks Search Box.
//
// Requirements for the Knowledge Panel to appear:
//   1. Each sameAs URL must list kebbidailynews.com in that profile's
//      website/bio field on the platform.
//   2. /public/logo.png must be reachable at https://kebbidailynews.com/logo.png
//   3. Re-request indexing of the homepage in Google Search Console.
//   4. Validate at: https://search.google.com/test/rich-results
//
const websiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    // ── 1. WebSite — Sitelinks Search Box ────────────────────────
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Kebbi Daily News",
      description: "Breaking news from Kebbi State, Nigeria",
      inLanguage: "en-NG",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          // Ensure /search?q= returns real results or Google ignores this.
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },

    // ── 2. NewsMediaOrganization — Knowledge Panel ───────────────
    {
      "@type": "NewsMediaOrganization",
      "@id": `${BASE_URL}/#organization`,
      name: "Kebbi Daily News",
      alternateName: "KDN",
      url: BASE_URL,

      // logo.png: 512×512px square — used by Google in the Knowledge Panel
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
        width: 512,
        height: 512,
      },

      // Larger hero image for rich results
      image: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
      },

      // Each profile below must link back to kebbidailynews.com
      // in its bio/about/website field for Google to connect them.
      sameAs: [
        "https://www.facebook.com/kebbidailynews",
        "https://twitter.com/kebbidailynews",
        "https://www.instagram.com/kebbidailynews",
        "https://www.youtube.com/@kebbidailynews",
        "https://www.linkedin.com/company/kebbidailynews",
        "https://www.tiktok.com/@kebbidailynews",
      ],

      foundingDate: "2024",

      areaServed: {
        "@type": "AdministrativeArea",
        name: "Kebbi State",
        containedInPlace: { "@type": "Country", name: "Nigeria" },
      },

      contactPoint: {
        "@type": "ContactPoint",
        contactType: "editorial",
        email: "editor@kebbidailynews.com",
        areaServed: "NG",
        availableLanguage: "English",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <head>
        {/* ── Google AdSense ── */}
        <meta name="google-adsense-account" content="ca-pub-8458799741626167" />

        {/* ── Favicons (also declared in metadata.icons above,
               kept here as fallback for older crawlers) ── */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32"  href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16"  href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ── Theme ── */}
        <meta name="theme-color" content="#CC0000" />
        <meta name="msapplication-TileColor" content="#CC0000" />

        {/* ── Viewport ── */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* ── DNS Prefetch ── */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── News Sitemap ── */}
        <link
          rel="sitemap"
          type="application/xml"
          title="Kebbi Daily News — News Sitemap"
          href="/sitemap-news.xml"
        />

        {/* ── Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>

      <body className="bg-[#F0EEEA] text-gray-900 font-sans antialiased">
        <Ticker />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
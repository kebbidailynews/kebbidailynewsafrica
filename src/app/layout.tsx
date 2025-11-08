// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kebbi Daily News",
  description: "Your trusted source for news in Kebbi State, Nigeria",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domain = "https://kebbidailynews.com";

  return (
    <html lang="en">
      <head>
        {/* Google Adsense */}
        <meta name="google-adsense-account" content="ca-pub-8458799741626167" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8458799741626167"
          crossOrigin="anonymous"
        ></script>

        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* PWA / Mobile */}
        <meta name="theme-color" content="#1E40AF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Kebbi Daily News" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* SEO / Social */}
        <meta name="description" content="Latest news and updates from Kebbi State, Nigeria." />
        <meta property="og:title" content="Kebbi Daily News" />
        <meta property="og:description" content="Your trusted source for news in Kebbi State, Nigeria." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon-32x32.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kebbi Daily News" />
        <meta name="twitter:description" content="Your trusted source for news in Kebbi State, Nigeria." />
        <meta name="twitter:image" content="/favicon-32x32.png" />

        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              "name": "Kebbi Daily News",
              "url": domain,
              "logo": `${domain}/favicon-32x32.png`,
              "sameAs": [
                "https://twitter.com/kebbidailynews",
                "https://facebook.com/kebbidailynews"
              ]
            })
          }}
        />

        {/* Structured Data: Breadcrumbs (top-level categories from Header) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": domain },
                { "@type": "ListItem", "position": 2, "name": "Politics", "item": `${domain}/category/politics` },
                { "@type": "ListItem", "position": 3, "name": "Security", "item": `${domain}/category/security` },
                { "@type": "ListItem", "position": 4, "name": "Health", "item": `${domain}/category/health` },
                { "@type": "ListItem", "position": 5, "name": "Economy", "item": `${domain}/category/economy` },
                { "@type": "ListItem", "position": 6, "name": "Education", "item": `${domain}/category/education` },
                { "@type": "ListItem", "position": 7, "name": "Sports", "item": `${domain}/category/sports` },
                { "@type": "ListItem", "position": 8, "name": "Opinion", "item": `${domain}/category/opinion` }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        {/* TOP TICKER */}
        <Ticker />

        {/* MAIN HEADER */}
        <Header />

        {/* PAGE CONTENT */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

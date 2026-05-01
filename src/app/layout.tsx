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

export const metadata: Metadata = {
  metadataBase: new URL("https://kebbidailynews.com"),
  title: {
    default: "Kebbi Daily News",
    template: "%s | Kebbi Daily News",
  },
  description:
    "Breaking news, politics, security, and local stories from Kebbi State, Nigeria.",
  keywords: [
    "Kebbi news",
    "Kebbi State",
    "Birnin Kebbi",
    "Nigeria news",
    "breaking news",
  ],
  openGraph: {
    title: "Kebbi Daily News",
    description: "Latest news from Kebbi State, Nigeria",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kebbi Daily News",
    description: "Breaking news from Kebbi State",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
    >
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-8458799741626167"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#CC0000" />
      </head>

      <body className="bg-[#F0EEEA] text-gray-900 font-sans antialiased">
        {/* Breaking news ticker */}
        <Ticker />

        {/* Main header */}
        <Header />

        {/* Page content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
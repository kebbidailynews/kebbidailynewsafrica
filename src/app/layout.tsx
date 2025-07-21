import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kebbi Daily News",
  description: "Your trusted source for news in Kebbi State, Nigeria",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-8458799741626167" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8458799741626167"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
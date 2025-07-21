import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kebbi Daily News",
  description: "Your trusted source for news and updates from Kebbi State, Nigeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Header />
        <main className="container mx-auto px-4 py-8 min-h-screen">{children}</main>
      </body>
    </html>
  );
}

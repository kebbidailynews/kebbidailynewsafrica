// app/sitemap-news.xml/route.ts
import { getAllPosts } from "@/lib/markdown";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Revalidate every hour (or lower to 300 for more frequent updates)

// Optional: Limit to last 48-72 hours (Google recommendation)
const HOURS_TO_INCLUDE = 72;

function formatDateForNews(dateString: string): string {
  return new Date(dateString).toISOString();
}

export async function GET() {
  try {
    const allPosts = await getAllPosts();

    // Filter to only recent posts (last 72 hours)
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - HOURS_TO_INCLUDE);

    const recentPosts = allPosts.filter((post) => {
      const postDate = new Date(post.date);
      return postDate >= cutoffDate && !post.draft;
    });

    // Build the XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

    for (const post of recentPosts) {
      const pubDate = formatDateForNews(post.date);
      const articleUrl = `https://kebbidailynews.com/news/${encodeURIComponent(post.slug)}`;
      const cleanTitle = post.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      xml += `
  <url>
    <loc>${articleUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>Kebbi Daily News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
    </news:news>
  </url>`;
    }

    xml += "\n</urlset>";

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error generating news sitemap:", error);
    // Fallback empty sitemap
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"></urlset>`;

    return new NextResponse(emptyXml, {
      headers: { "Content-Type": "application/xml" },
    });
  }
}
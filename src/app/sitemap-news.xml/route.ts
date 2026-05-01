// app/sitemap-news.xml/route.ts
import { getAllPosts } from "@/lib/markdown";
import { NextResponse } from "next/server";

export const revalidate = 300; // better for news SEO (5 mins)

const HOURS_TO_INCLUDE = 72; // FIXED: real 72 hours

function formatDateForNews(dateString: string): string {
  return new Date(dateString).toISOString();
}

// Proper XML escaping
function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const allPosts = await getAllPosts();

    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - HOURS_TO_INCLUDE);

    let recentPosts = allPosts.filter((post) => {
      if (!post?.slug || !post?.date || post?.draft) return false;

      const postDate = new Date(post.date);
      return postDate >= cutoffDate;
    });

    // 🔥 IMPORTANT: prevent empty sitemap (Google error fix)
    if (recentPosts.length === 0 && allPosts.length > 0) {
      // fallback to latest post
      recentPosts = [allPosts[0]];
    }

    const baseUrl = "https://kebbidailynews.com";

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

    for (const post of recentPosts) {
      const pubDate = formatDateForNews(post.date);

      const articleUrl = `${baseUrl}/news/${encodeURIComponent(post.slug)}`;
      const cleanTitle = escapeXml(post.title || "News Article");

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

    xml += `
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error generating news sitemap:", error);

    // Safe fallback (ALWAYS valid XML with at least 1 url)
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://kebbidailynews.com/</loc>
  </url>
</urlset>`;

    return new NextResponse(fallbackXml, {
      headers: { "Content-Type": "application/xml" },
    });
  }
}
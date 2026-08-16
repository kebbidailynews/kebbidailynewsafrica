// app/sitemap-news.xml/route.ts
import { getAllPosts } from "@/lib/markdown";
import { NextResponse } from "next/server";

export const revalidate = 300; // 5-minute revalidation — optimal for news SEO

const HOURS_TO_INCLUDE = 72; // Google News indexes articles up to 3 days old
const BASE_URL = "https://kebbidailynews.com";
const PUBLICATION_NAME = "Kebbi Daily News";
const PUBLICATION_LANGUAGE = "en";

// Map your category slugs to Google News genres
// Valid genres: PressRelease | Satire | Blog | OpEd | Opinion | UserGenerated
const GENRE_MAP: Record<string, string> = {
  opinion: "Opinion",
  "op-ed": "OpEd",
  // All other categories (politics, security, etc.) get no genre tag —
  // omitting it tells Google it's standard editorial journalism
};

// Map category slugs to human-readable keywords
const KEYWORD_MAP: Record<string, string> = {
  politics:  "Kebbi politics, Nigeria government, APC, PDP, Kebbi State",
  security:  "Kebbi security, bandits, Lakurawa, Nigeria security news",
  health:    "Kebbi health, Nigeria health news, primary healthcare",
  economy:   "Kebbi economy, Nigeria economy, agriculture, rice farming",
  education: "Kebbi education, schools, UBEC, Kebbi students",
  sports:    "Kebbi sports, Nigeria sports news",
  opinion:   "Kebbi opinion, Nigeria commentary, editorial",
  default:   "Kebbi State news, Kebbi Daily News, Nigeria news, Birnin Kebbi",
};

function formatDateForNews(dateString: string): string {
  return new Date(dateString).toISOString();
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Derive keywords from post tags (NewsPost has no category field — tags drive everything)
function getKeywords(post: { tags?: string[] }): string {
  const primaryTag = post.tags?.[0]?.toLowerCase() ?? "";
  const base = KEYWORD_MAP[primaryTag] ?? KEYWORD_MAP.default;

  // Append remaining tags from the post itself
  const extraTags =
    post.tags && post.tags.length > 1
      ? ", " + post.tags.slice(1).map(escapeXml).join(", ")
      : "";

  return escapeXml(base + extraTags);
}

// Only add <news:genres> for opinion/press release content — derived from first tag
function getGenreTag(post: { tags?: string[] }): string {
  const primaryTag = post.tags?.[0]?.toLowerCase() ?? "";
  const genre = GENRE_MAP[primaryTag];
  return genre ? `<news:genres>${genre}</news:genres>` : "";
}

const FALLBACK_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
  </url>
</urlset>`;

export async function GET() {
  try {
    const allPosts = await getAllPosts();

    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - HOURS_TO_INCLUDE);

    let recentPosts = allPosts.filter((post) => {
      if (!post?.slug || !post?.date || post?.draft) return false;
      return new Date(post.date) >= cutoffDate;
    });

    // Prevent empty sitemap — fallback to the single latest post
    if (recentPosts.length === 0 && allPosts.length > 0) {
      recentPosts = [allPosts[0]];
    }

    if (recentPosts.length === 0) {
      return new NextResponse(FALLBACK_XML, {
        headers: { "Content-Type": "application/xml" },
      });
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

    for (const post of recentPosts) {
      const pubDate    = formatDateForNews(post.date);
      const articleUrl = `${BASE_URL}/news/${encodeURIComponent(post.slug)}`;
      const cleanTitle = escapeXml(post.title || "News Article");
      const keywords   = getKeywords(post);
      const genreTag   = getGenreTag(post);

      xml += `
  <url>
    <loc>${articleUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>${PUBLICATION_NAME}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
      ${genreTag}
      <news:keywords>${keywords}</news:keywords>
    </news:news>
  </url>`;
    }

    xml += `\n</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
        // 5 min cache, serve stale for up to 10 min while revalidating
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        // Tells Google this is a news sitemap — belt and suspenders
        "X-Robots-Tag": "noarchive",
      },
    });
  } catch (error) {
    console.error("[sitemap-news] Error generating news sitemap:", error);
    return new NextResponse(FALLBACK_XML, {
      headers: { "Content-Type": "application/xml" },
    });
  }
}
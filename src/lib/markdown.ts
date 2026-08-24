// lib/markdown.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

// Normalise a raw filename-derived slug so curly quotes, smart apostrophes,
// and other non-ASCII punctuation don't end up in URLs.
// e.g. "continent\u2019s" → "continents"
function sanitizeSlug(raw: string): string {
  return raw
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "") // curly/smart single quotes
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, "") // curly/smart double quotes
    .replace(/[^\w\s-]/g, "")                                // strip any remaining non-word chars
    .replace(/\s+/g, "-")                                    // spaces → hyphens
    .replace(/-{2,}/g, "-")                                  // collapse multiple hyphens
    .toLowerCase()
    .trim();
}

export interface NewsPost {
  slug: string;
  title: string;
  excerpt: string;
  summary: string;
  author: string;
  date: string;
  draft: boolean;
  tags: string[];
  image?: string;
  content: string;
}

// ==========================
// Get All Posts
// ==========================
export async function getAllPosts(): Promise<NewsPost[]> {
  const newsDir = path.join(process.cwd(), "content/news");
  const files = await fs.readdir(newsDir);

  const posts: (NewsPost | null)[] = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const rawSlug = file.replace(/\.md$/, "");
        const slug = sanitizeSlug(rawSlug);
        const filePath = path.join(newsDir, file);

        try {
          const fileContents = await fs.readFile(filePath, "utf8");
          const { data, content: bodyContent } = matter(fileContents);
          const rawContent = (data.content as string) || bodyContent || "";
          const finalContent = rawContent.trim();

          if (!data.title && !finalContent) {
            console.warn(`Skipping empty post: ${slug}`);
            return null;
          }

          return {
            slug,
            title: (data.title as string) || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            excerpt: (data.excerpt as string) || finalContent.slice(0, 160) + "...",
            summary: (data.summary as string) || "",
            author: (data.author as string) || "Kebbi Daily News",
            date: (data.date as string) || new Date().toISOString().split("T")[0],
            draft: (data.draft as boolean) ?? false,
            tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
            image: data.image as string | undefined,
            content: finalContent,
          };
        } catch (error) {
          console.error(`Error reading post file: ${file}`, error);
          return null;
        }
      })
  );

  // Filter out nulls and drafts, then sort by date descending
  return posts
    .filter((post): post is NewsPost => post !== null && !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ==========================
// Get Single Post by Slug
// ==========================
export async function getPostBySlug(slug: string): Promise<NewsPost> {
  const newsDir = path.join(process.cwd(), "content/news");

  // Decode the incoming slug (handles %E2%80%99 curly apostrophes etc.)
  // then sanitize so it matches the cleaned slug we store on posts.
  const decodedSlug  = decodeURIComponent(slug);
  const cleanedSlug  = sanitizeSlug(decodedSlug);

  // Strategy 1: try the sanitized slug as a filename directly (fast path)
  const directPath = path.join(newsDir, `${cleanedSlug}.md`);
  if (!directPath.startsWith(newsDir)) throw new Error("Invalid path");

  try {
    const fileContents = await fs.readFile(directPath, "utf8");
    return parsePost(cleanedSlug, fileContents);
  } catch {
    // File not found at the clean path — fall through to scan
  }

  // Strategy 2: scan all .md files and match via sanitizeSlug.
  // This catches files whose names still contain curly quotes (legacy files
  // that haven't been renamed yet) by comparing their sanitized slugs.
  const files = await fs.readdir(newsDir);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const fileSlug = sanitizeSlug(file.replace(/\.md$/, ""));
    if (fileSlug === cleanedSlug) {
      const filePath = path.join(newsDir, file);
      if (!filePath.startsWith(newsDir)) continue; // path traversal guard
      try {
        const fileContents = await fs.readFile(filePath, "utf8");
        return parsePost(cleanedSlug, fileContents);
      } catch {
        break;
      }
    }
  }

  console.error(`Post not found: ${cleanedSlug}`);
  throw new Error("Post not found");
}

// Shared parser so both lookup paths return identical shaped objects
function parsePost(slug: string, fileContents: string): NewsPost {
  const { data, content: bodyContent } = matter(fileContents);
  const rawContent  = (data.content as string) || bodyContent || "";
  const finalContent = rawContent.trim();

  if (!data.title && !finalContent) throw new Error("Missing title and content");

  return {
    slug,
    title:   (data.title   as string)  || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    excerpt: (data.excerpt as string)  || finalContent.slice(0, 160) + "...",
    summary: (data.summary as string)  || "",
    author:  (data.author  as string)  || "Kebbi Daily News",
    date:    (data.date    as string)  || new Date().toISOString().split("T")[0],
    draft:   (data.draft   as boolean) ?? false,
    tags:    Array.isArray(data.tags) ? (data.tags as string[]) : [],
    image:   data.image as string | undefined,
    content: finalContent,
  };
}

// ==========================
// NEW: Get Posts by Author (for author pages)
// ==========================
export async function getPostsByAuthor(authorSlug: string): Promise<NewsPost[]> {
  const allPosts = await getAllPosts();

  // Convert author slug to normalized form for matching
  const normalizedAuthorSlug = authorSlug.toLowerCase().replace(/[^a-z0-9]/g, "");

  return allPosts
    .filter((post) => {
      const postAuthorSlug = post.author
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/\s+/g, "-");
      return postAuthorSlug === normalizedAuthorSlug || post.author.toLowerCase() === authorSlug.toLowerCase();
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Optional helper: Get unique authors (useful for an "Our Authors" page later)
export async function getAllAuthors(): Promise<string[]> {
  const posts = await getAllPosts();
  const authors = new Set(posts.map((post) => post.author));
  return Array.from(authors).sort();
}
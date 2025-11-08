// lib/markdown.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

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

  // Annotate posts as (NewsPost | null)[]
  const posts: (NewsPost | null)[] = await Promise.all(
    files
      .filter(file => file.endsWith(".md"))
      .map(async (file) => {
        const slug = file.replace(/\.md$/, "");
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
            title: (data.title as string) || slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
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
  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(process.cwd(), "content/news", `${decodedSlug}.md`);

  // Prevent path traversal
  if (!filePath.startsWith(path.join(process.cwd(), "content/news"))) {
    throw new Error("Invalid path");
  }

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const { data, content: bodyContent } = matter(fileContents);

    const rawContent = (data.content as string) || bodyContent || "";
    const finalContent = rawContent.trim();

    if (!data.title && !finalContent) {
      throw new Error("Missing title and content");
    }

    return {
      slug: decodedSlug,
      title: (data.title as string) || decodedSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
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
    console.error(`Error loading post: ${decodedSlug}`, error);
    throw new Error("Post not found");
  }
}

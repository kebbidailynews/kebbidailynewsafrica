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

export async function getAllPosts(): Promise<NewsPost[]> {
  const newsDir = path.join(process.cwd(), "content/news");
  const files = await fs.readdir(newsDir);
  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(newsDir, file);
      const fileContents = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContents);
      const slug = file.replace(/\.md$/, "");
      console.log(`Parsed post: ${slug}, Content length: ${content.length}`);
      return {
        slug,
        title: data.title || "",
        excerpt: data.excerpt || "",
        summary: data.summary || "",
        author: data.author || "Unknown",
        date: data.date || new Date().toISOString(),
        draft: data.draft ?? false,
        tags: data.tags || [],
        image: data.image,
        content: content || data.content || "", // Fallback to content field if body is used
      };
    })
  );
  return posts
    .filter((post) => !post.draft) // Exclude draft posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<NewsPost> {
  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(process.cwd(), "content/news", `${decodedSlug}.md`);
  console.log(`Attempting to load slug: ${decodedSlug}, File path: ${filePath}`);
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContents);
    console.log(`Loaded post: ${decodedSlug}, Content length: ${content.length}`);
    return {
      slug: decodedSlug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      summary: data.summary || "",
      author: data.author || "Unknown",
      date: data.date || new Date().toISOString(),
      draft: data.draft ?? false,
      tags: data.tags || [],
      image: data.image,
      content: content || data.content || "",
    };
  } catch (error) {
    console.error(`Error loading post: ${decodedSlug}`, error);
    throw new Error("Post not found");
  }
}
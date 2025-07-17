import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface NewsPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
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
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        image: data.image,
        content,
      };
    })
  );
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<NewsPost> {
  const filePath = path.join(process.cwd(), "content/news", `${slug}.md`);
  const fileContents = await fs.readFile(filePath, "utf8").catch(() => {
    throw new Error("Post not found");
  });
  const { data, content } = matter(fileContents);
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    image: data.image,
    content,
  };
}
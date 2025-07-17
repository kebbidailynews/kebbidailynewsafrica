import fs from "fs";
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

export function getAllPosts(): NewsPost[] {
  const newsDir = path.join(process.cwd(), "content/news");
  const files = fs.readdirSync(newsDir);
  return files.map((file) => {
    const filePath = path.join(newsDir, file);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      image: data.image,
      content,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): NewsPost {
  const filePath = path.join(process.cwd(), "content/news", `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error("Post not found");
  }
  const fileContents = fs.readFileSync(filePath, "utf8");
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
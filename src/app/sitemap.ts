// app/sitemap.ts
import { getAllPosts } from "@/lib/markdown";
import { MetadataRoute } from "next";

const CATEGORIES = [
  { slug: "politics", priority: 0.8 },
  { slug: "security", priority: 0.8 },
  { slug: "health", priority: 0.7 },
  { slug: "economy", priority: 0.7 },
  { slug: "education", priority: 0.7 },
  { slug: "sports", priority: 0.7 },
  { slug: "opinion", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kebbidailynews.com";
  const allPosts = await getAllPosts();
  
  // Article URLs
  const newsUrls = allPosts.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Category URLs
  const categoryUrls = CATEGORIES.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: category.priority,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryUrls,
    ...newsUrls,
  ];
}
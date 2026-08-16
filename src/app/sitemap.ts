// app/sitemap.ts
import { getAllPosts } from "@/lib/markdown";
import { MetadataRoute } from "next";

const BASE_URL = "https://kebbidailynews.com";

const CATEGORIES = [
  { slug: "politics",  priority: 0.9 },
  { slug: "security",  priority: 0.9 },
  { slug: "health",    priority: 0.8 },
  { slug: "economy",   priority: 0.8 },
  { slug: "education", priority: 0.8 },
  { slug: "sports",    priority: 0.7 },
  { slug: "opinion",   priority: 0.7 },
];

// Determine priority by article age — breaking news scores highest
function getArticlePriority(dateString: string): number {
  const ageHours =
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60);
  if (ageHours <= 6)   return 0.95; // breaking / just published
  if (ageHours <= 24)  return 0.90; // same-day news
  if (ageHours <= 72)  return 0.80; // within 3 days
  if (ageHours <= 168) return 0.70; // within a week
  return 0.60;                       // older archive
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getAllPosts();

  // Article URLs — "hourly" tells Google to re-crawl breaking news fast
  const newsUrls = allPosts.map((post) => ({
    url: `${BASE_URL}/news/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "hourly" as const, // ✅ FIXED: was "weekly"
    priority: getArticlePriority(post.date),
  }));

  // Category URLs
  const categoryUrls = CATEGORIES.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: category.priority,
  }));

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...categoryUrls, ...newsUrls];
}
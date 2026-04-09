// app/news/[slug]/page.tsx
import { getPostBySlug, type NewsPost } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

// Helper: safely decode slug (handles %E2%80%99 → ’)
function safeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// Generate author slug (e.g., "Ekemini Thompson" → "ekemini-thompson")
function getAuthorSlug(author: string): string {
  return author
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // Remove special characters
    .replace(/\s+/g, "-");          // Replace spaces with hyphens
}

// Optional: generate smart excerpt
function generateExcerpt(content: string, maxLength = 160) {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const slice = trimmed.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  return slice.slice(0, lastSpace) + "...";
}

export default async function NewsPost({ params }: { params: { slug: string } }) {
  const decodedSlug = safeSlug(params.slug);

  let post: NewsPost | null = null;
  try {
    post = await getPostBySlug(decodedSlug);
  } catch (error) {
    console.warn(`Post not found or invalid: ${decodedSlug}`, error);
    notFound();
  }

  if (!post?.content?.trim()) {
    notFound();
  }

  // Ensure excerpt exists
  const excerpt = post.excerpt || generateExcerpt(post.content);

  // Format date to ISO 8601 for Google News
  const formattedDate = new Date(post.date).toISOString();

  // Make image URL absolute
  const imageUrls = post.image
    ? [
        post.image.startsWith("http")
          ? post.image
          : `https://kebbidailynews.com${post.image.startsWith("/") ? "" : "/"}${post.image}`,
      ]
    : [];

  // Full NewsArticle schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kebbidailynews.com/news/${decodedSlug}`,
    },
    "headline": post.title,
    "image": imageUrls,
    "datePublished": formattedDate,
    "dateModified": formattedDate,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": `https://kebbidailynews.com/author/${getAuthorSlug(post.author)}`,   // ← Improved
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kebbi Daily News",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kebbidailynews.com/favicon-32x32.png",
      },
    },
    "description": excerpt,
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <article className="prose prose-lg max-w-3xl mx-auto p-6">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg mb-6 shadow-md"
            priority
          />
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{post.title}</h1>

        {/* Clickable Author Name */}
        <p className="text-gray-500 text-sm">
          By{" "}
          <Link
            href={`/author/${getAuthorSlug(post.author)}`}
            className="text-red-700 hover:underline font-medium"
          >
            <strong>{post.author}</strong>
          </Link>{" "}
          on{" "}
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {post.summary && <p className="text-gray-600 italic mt-2">{post.summary}</p>}
        {!post.summary && <p className="text-gray-600 italic mt-2">{excerpt}</p>}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 my-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 border-t pt-6">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </>
  );
}
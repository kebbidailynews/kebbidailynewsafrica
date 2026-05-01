// app/news/[slug]/page.tsx
import { getPostBySlug, getAllPosts, type NewsPost } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import ShareButtons from "@/components/ShareButtons";

function safeSlug(slug: string): string {
  try { return decodeURIComponent(slug); } catch { return slug; }
}

function getAuthorSlug(author: string): string {
  return author.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

function generateExcerpt(content: string, maxLength = 160): string {
  const stripped = content.replace(/#{1,6}\s/g, "").replace(/\*\*/g, "").trim();
  if (stripped.length <= maxLength) return stripped;
  const slice = stripped.slice(0, maxLength);
  return slice.slice(0, slice.lastIndexOf(" ")) + "...";
}

function getCategoryColor(tags: string[]): string {
  const tag = tags[0]?.toLowerCase() || "";
  if (tag.includes("politi"))  return "#003366";
  if (tag.includes("securi"))  return "#8B0000";
  if (tag.includes("health"))  return "#006837";
  if (tag.includes("econom"))  return "#1A5490";
  if (tag.includes("educat"))  return "#2F5496";
  if (tag.includes("sport"))   return "#004225";
  if (tag.includes("opinion")) return "#4A4A4A";
  return "#CC0000";
}

function getCategorySlug(tags: string[]): string {
  const tag = tags[0]?.toLowerCase() || "";
  if (tag.includes("politi"))  return "politics";
  if (tag.includes("securi"))  return "security";
  if (tag.includes("health"))  return "health";
  if (tag.includes("econom"))  return "economy";
  if (tag.includes("educat"))  return "education";
  if (tag.includes("sport"))   return "sports";
  if (tag.includes("opinion")) return "opinion";
  return tag;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const decodedSlug = safeSlug(params.slug);
  try {
    const post = await getPostBySlug(decodedSlug);
    const excerpt = post.excerpt || generateExcerpt(post.content);
    const imageUrl = post.image?.startsWith("http")
      ? post.image
      : `https://kebbidailynews.com${post.image?.startsWith("/") ? "" : "/"}${post.image}`;
    return {
      title: post.title,
      description: excerpt,
      openGraph: {
        title: post.title,
        description: excerpt,
        images: post.image ? [{ url: imageUrl }] : [],
        type: "article",
        publishedTime: new Date(post.date).toISOString(),
        authors: [post.author],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: excerpt,
        images: post.image ? [imageUrl] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const decodedSlug = safeSlug(params.slug);

  let post: NewsPost | null = null;
  try {
    post = await getPostBySlug(decodedSlug);
  } catch (error) {
    console.warn(`Post not found: ${decodedSlug}`, error);
    notFound();
  }

  if (!post?.content?.trim()) notFound();

  const excerpt      = post.excerpt || generateExcerpt(post.content);
  const formattedDate = new Date(post.date).toISOString();
  const catColor     = getCategoryColor(post.tags);
  const catSlug      = getCategorySlug(post.tags);
  const primaryTag   = post.tags[0] || "News";
  const articleUrl    = `https://kebbidailynews.com/news/${decodedSlug}`;

  const imageUrl = post.image
    ? (post.image.startsWith("http")
        ? post.image
        : `https://kebbidailynews.com${post.image.startsWith("/") ? "" : "/"}${post.image}`)
    : "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://kebbidailynews.com/news/${decodedSlug}`,
    },
    headline: post.title,
    image: imageUrl ? [imageUrl] : [],
    datePublished: formattedDate,
    dateModified: formattedDate,
    author: {
      "@type": "Person",
      name: post.author,
      url: `https://kebbidailynews.com/author/${getAuthorSlug(post.author)}`,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Kebbi Daily News",
      logo: {
        "@type": "ImageObject",
        url: "https://kebbidailynews.com/favicon-32x32.png",
      },
    },
    description: excerpt,
  };

  // Related posts (same category, exclude current)
  let relatedPosts: NewsPost[] = [];
  try {
    const all = await getAllPosts();
    relatedPosts = all
      .filter((p) => p.slug !== post!.slug && p.tags.some((t) => t.toLowerCase().includes(catSlug)))
      .slice(0, 3);
  } catch { /* non-critical */ }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-10 sm:pb-14">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8">

          {/* ── MAIN ARTICLE ─────────────────────────────────── */}
          <article className="lg:col-span-8">

            {/* Breadcrumb - Mobile friendly */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-3 sm:mb-4 flex-wrap">
              <Link href="/" className="hover:text-[#CC0000] transition-colors">Home</Link>
              <span className="text-gray-300">|</span>
              <Link
                href={`/category/${catSlug}`}
                className="hover:text-[#CC0000] transition-colors uppercase"
                style={{ color: catColor }}
              >
                {primaryTag}
              </Link>
            </nav>

            {/* Category badge + headline - Responsive typography */}
            <div className="mb-4 sm:mb-5">
              <div
                className="font-bold text-[10px] sm:text-xs tracking-wider text-white px-2.5 sm:px-3 py-1 sm:py-1.5 uppercase inline-block mb-3 sm:mb-4 rounded-sm"
                style={{ backgroundColor: catColor }}
              >
                {primaryTag.toUpperCase()}
              </div>

              <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight sm:leading-[1.1] text-gray-900 mb-3 sm:mb-5 tracking-tight">
                {post.title}
              </h1>

              {/* Excerpt / deck - Responsive text size */}
              <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed font-normal mb-3 sm:mb-5">
                {post.summary || excerpt}
              </p>
            </div>

            {/* Byline - Responsive layout */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-gray-200 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-gray-500 text-[10px] sm:text-xs">By</span>
                <Link
                  href={`/author/${getAuthorSlug(post.author)}`}
                  className="font-bold text-xs sm:text-sm hover:underline text-[#003D7A] transition-colors"
                >
                  {post.author}
                </Link>
              </div>
              <span className="text-gray-300">|</span>
              <time className="text-gray-500 text-[10px] sm:text-xs">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {/* Hero image - Responsive with proper aspect ratio */}
            {post.image && (
              <div className="mb-6 sm:mb-8">
                <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                    style={{ maxHeight: '540px' }}
                  />
                  {/* Fox News signature red bar at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#CC0000]" />
                </div>
                {/* Image caption - responsive padding */}
                <div className="bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 border-l-4 border-[#CC0000]">
                  <p className="text-[10px] sm:text-xs text-gray-600 italic line-clamp-2">
                    {post.title}
                  </p>
                </div>
              </div>
            )}

            {/* Article body - mobile-optimized typography */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
                          prose-headings:font-bold prose-headings:text-gray-900 
                          prose-p:text-gray-700 prose-p:leading-relaxed
                          prose-a:text-[#CC0000] prose-a:no-underline hover:prose-a:underline
                          prose-img:rounded-lg prose-img:shadow-md">
              <MDXRemote source={post.content} />
            </div>

            {/* Social share bar - responsive */}
            {/* Social share bar */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 pb-4 sm:pb-6 border-y border-gray-200">
              <ShareButtons url={articleUrl} title={post.title} />
            </div>

            {/* Tags - responsive wrap */}
            {post.tags.length > 0 && (
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Topics:
                </span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/category/${tag.toLowerCase()}`}
                    className="text-[10px] sm:text-xs font-semibold text-[#003D7A] hover:underline uppercase tracking-wide"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Related stories - responsive grid */}
            {relatedPosts.length > 0 && (
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-4 border-[#CC0000]">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">More {primaryTag}</h2>
                  <Link
                    href={`/category/${catSlug}`}
                    className="text-[10px] sm:text-xs font-bold text-[#003D7A] hover:underline uppercase tracking-wide"
                  >
                    See All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {relatedPosts.map((p) => (
                    <NewsCard key={p.slug} post={p} />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ── SIDEBAR - Hidden on mobile, visible on tablet/desktop ── */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">

              {/* Trending section */}
              {relatedPosts.length > 0 && (
                <div className="border-t-4 border-[#CC0000] bg-white shadow-sm">
                  <div className="bg-gray-900 px-4 py-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Trending in {primaryTag}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {relatedPosts.map((p, i) => (
                      <div key={p.slug} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                        <span className="flex-shrink-0 w-7 h-7 bg-[#CC0000] text-white font-bold text-sm flex items-center justify-center rounded">
                          {i + 1}
                        </span>
                        <Link
                          href={`/news/${p.slug}`}
                          className="text-sm font-bold text-gray-900 leading-tight hover:text-[#CC0000] transition-colors line-clamp-3"
                        >
                          {p.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <Link
                      href={`/category/${catSlug}`}
                      className="text-xs font-bold text-[#003D7A] hover:underline uppercase tracking-wide"
                    >
                      View All {primaryTag} →
                    </Link>
                  </div>
                </div>
              )}

              {/* Ad slots */}
              <div className="bg-gray-100 border border-gray-200">
                <div className="bg-gray-200 px-3 py-2 border-b border-gray-300">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Advertisement
                  </span>
                </div>
                <div className="flex items-center justify-center h-[250px] text-gray-400 text-xs font-semibold">
                  300 × 250
                </div>
              </div>

              {/* Newsletter signup */}
              <div className="border-t-4 border-[#CC0000] bg-gradient-to-b from-gray-50 to-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Newsletter
                </h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Get breaking news and daily headlines delivered to your email inbox.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000]"
                />
                <button className="w-full bg-[#CC0000] text-white font-bold text-sm py-2 rounded hover:bg-[#A30000] transition-colors uppercase tracking-wide">
                  Subscribe
                </button>
              </div>

              {/* Ad slot bottom */}
              <div className="bg-gray-100 border border-gray-200">
                <div className="bg-gray-200 px-3 py-2 border-b border-gray-300">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Advertisement
                  </span>
                </div>
                <div className="flex items-center justify-center h-[600px] text-gray-400 text-xs font-semibold">
                  300 × 600
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}

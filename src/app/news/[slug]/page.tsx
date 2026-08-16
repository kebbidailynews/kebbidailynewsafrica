// app/news/[slug]/page.tsx
import { getPostBySlug, getAllPosts, type NewsPost } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import ShareButtons from "@/components/ShareButtons";
import Sidebar from "@/components/Sidebar";

// ── Single source of truth for the canonical domain ──────────────
const BASE_URL = "https://kebbidailynews.com";

// ── SSG: pre-build every article at deploy time ──────────────────
// This switches /news/[slug] from ƒ Dynamic → ● SSG so Googlebot
// gets full HTML on the first request instead of a blank page.
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({
      slug: encodeURIComponent(post.slug),
    }));
  } catch {
    return [];
  }
}

// Only serve slugs that were pre-built — anything else → 404.
// Remove this line if you want unknown slugs to fall back to SSR.
export const dynamicParams = false;

// ── Helpers ───────────────────────────────────────────────────────
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

function buildImageUrl(image: string | undefined | null): string | null {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${BASE_URL}/${image.replace(/^\/+/, "")}`;
}

// ── Metadata (OG + Twitter cards for WhatsApp/social previews) ───
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const decodedSlug = safeSlug(params.slug);
  try {
    const post = await getPostBySlug(decodedSlug);
    const excerpt  = post.excerpt || generateExcerpt(post.content);
    const imageUrl = buildImageUrl(post.image);

    return {
      title: post.title,
      description: excerpt,
      alternates: {
        canonical: `${BASE_URL}/news/${decodedSlug}`,
      },
      openGraph: {
        title: post.title,
        description: excerpt,
        url: `${BASE_URL}/news/${decodedSlug}`,
        siteName: "Kebbi Daily News",
        type: "article",
        publishedTime: new Date(post.date).toISOString(),
        authors: [post.author],
        images: imageUrl
          ? [{ url: imageUrl, width: 1200, height: 630, alt: post.title }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: excerpt,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return {};
  }
}

// ── Page ──────────────────────────────────────────────────────────
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

  const excerpt       = post.excerpt || generateExcerpt(post.content);
  const formattedDate = new Date(post.date).toISOString();
  const catColor      = getCategoryColor(post.tags);
  const catSlug       = getCategorySlug(post.tags);
  const primaryTag    = post.tags[0] || "News";
  const articleUrl    = `${BASE_URL}/news/${decodedSlug}`;
  const imageUrl      = buildImageUrl(post.image) ?? "";

  // ── Article structured data (Google News rich results) ──────────
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",

    // ── Core identity ────────────────────────────────────────────
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    headline:      post.title,
    description:   excerpt,
    url:           articleUrl,
    datePublished: formattedDate,
    dateModified:  formattedDate,
    inLanguage:    "en-NG",

    // ── Image — required for Top Stories eligibility ─────────────
    image: imageUrl
      ? [
          {
            "@type":  "ImageObject",
            url:      imageUrl,
            width:    1200,
            height:   630,
          },
        ]
      : [],

    // ── Author ───────────────────────────────────────────────────
    author: {
      "@type": "Person",
      name:    post.author,
      url:     `${BASE_URL}/author/${getAuthorSlug(post.author)}`,
    },

    // ── Publisher ────────────────────────────────────────────────
    publisher: {
      "@type": "NewsMediaOrganization",
      name:    "Kebbi Daily News",
      url:     BASE_URL,
      logo: {
        "@type":  "ImageObject",
        url:      `${BASE_URL}/logo.png`,
        width:    512,
        height:   512,
      },
      sameAs: [
        "https://www.facebook.com/kebbidailynews",
        "https://twitter.com/kebbidailynews",
        "https://www.instagram.com/kebbidailynews",
        "https://www.youtube.com/@kebbidailynews",
      ],
    },

    // ── Article section + keywords ───────────────────────────────
    articleSection: primaryTag,
    keywords: ["Kebbi State", "Kebbi Daily News", primaryTag, ...post.tags].join(", "),

    // ── Breadcrumb — boosts Top Stories placement ────────────────
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type":    "ListItem",
          position:   1,
          name:       "Home",
          item:       BASE_URL,
        },
        {
          "@type":    "ListItem",
          position:   2,
          name:       primaryTag,
          item:       `${BASE_URL}/category/${catSlug}`,
        },
        {
          "@type":    "ListItem",
          position:   3,
          name:       post.title,
          item:       articleUrl,
        },
      ],
    },
  };

  // ── Related posts (same category, exclude current) ───────────────
  let relatedPosts: NewsPost[] = [];
  try {
    const all = await getAllPosts();
    relatedPosts = all
      .filter((p) => p.slug !== post!.slug && p.tags.some((t) => t.toLowerCase().includes(catSlug)))
      .slice(0, 3);

    if (relatedPosts.length === 0) {
      relatedPosts = all
        .filter((p) => p.slug !== post!.slug)
        .slice(0, 3);
    }
  } catch { /* non-critical */ }

  const featuredRelated = relatedPosts[0] ?? null;
  const restRelated     = relatedPosts.slice(1);

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

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-3 sm:mb-4 flex-wrap">
              <Link href="/" className="hover:text-[#CC0000] transition-colors">Home</Link>
              <span className="text-gray-300">|</span>
              <Link
                href={`/category/${catSlug}`}
                className="hover:text-[#CC0000] transition-colors uppercase"
              >
                {primaryTag}
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-gray-400 line-clamp-1">{post.title}</span>
            </nav>

            {/* Category badge + headline */}
            <div className="mb-4 sm:mb-6">
              <Link
                href={`/category/${catSlug}`}
                className="inline-block font-condensed font-black text-[10px] sm:text-xs tracking-[2px] uppercase text-white px-3 py-1 mb-3 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: catColor }}
              >
                {primaryTag}
              </Link>

              <h1 className="font-condensed font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-gray-900 mb-3 sm:mb-4">
                {post.title}
              </h1>

              <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed font-normal mb-3 sm:mb-5">
                {post.summary || excerpt}
              </p>
            </div>

            {/* Byline */}
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
              <time className="text-gray-500 text-[10px] sm:text-xs" dateTime={formattedDate}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {/* Hero image */}
            {post.image && (
              <div className="mb-6 sm:mb-8">
                <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                    style={{ maxHeight: "540px" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#CC0000]" />
                </div>
                <div className="bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 border-l-4 border-[#CC0000]">
                  <p className="text-[10px] sm:text-xs text-gray-600 italic line-clamp-2">
                    {post.title}
                  </p>
                </div>
              </div>
            )}

            {/* Article body */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-p:text-gray-700 prose-p:leading-relaxed
                            prose-a:text-[#CC0000] prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-lg prose-img:shadow-md">
              <MDXRemote source={post.content} />
            </div>

            {/* Social share bar */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 pb-4 sm:pb-6 border-y border-gray-200">
              <ShareButtons url={articleUrl} title={post.title} />
            </div>

            {/* Tags */}
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

            {/* ── RELATED STORIES ───────────────────────────── */}
            {relatedPosts.length > 0 && (
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-4" style={{ borderColor: catColor }}>

                {/* Section header */}
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="font-condensed font-black text-2xl sm:text-3xl uppercase leading-none tracking-tight"
                    style={{ color: catColor }}
                  >
                    More {primaryTag}
                  </h2>
                  <Link
                    href={`/category/${catSlug}`}
                    className="font-condensed font-black text-[9px] tracking-[2px] uppercase text-white px-4 py-1.5 hover:opacity-90 transition-opacity flex-shrink-0"
                    style={{ backgroundColor: catColor }}
                  >
                    See All →
                  </Link>
                </div>

                {/* Featured related story */}
                {featuredRelated && (
                  <article className="bg-white border border-gray-200 overflow-hidden mb-6">
                    {featuredRelated.image && (
                      <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                        <Link href={`/news/${featuredRelated.slug}`}>
                          <Image
                            src={featuredRelated.image}
                            alt={featuredRelated.title}
                            fill
                            className="object-cover hover:opacity-90 transition-opacity"
                            sizes="(max-width: 768px) 100vw, 800px"
                          />
                          <div
                            className="absolute bottom-0 left-0 right-0 h-[3px]"
                            style={{ backgroundColor: catColor }}
                          />
                        </Link>
                        <div
                          className="absolute top-3 left-3 font-condensed font-black text-[10px] tracking-[2px] uppercase text-white px-3 py-1"
                          style={{ backgroundColor: catColor }}
                        >
                          Related
                        </div>
                      </div>
                    )}

                    <div className="p-6 sm:p-8">
                      <h3 className="font-condensed font-black text-2xl sm:text-3xl leading-tight text-gray-900 mb-3 hover:text-[#CC0000] transition-colors">
                        <Link href={`/news/${featuredRelated.slug}`}>{featuredRelated.title}</Link>
                      </h3>

                      {(featuredRelated.excerpt || featuredRelated.content) && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                          {featuredRelated.excerpt || generateExcerpt(featuredRelated.content)}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-gray-400 border-t border-gray-100 pt-4">
                        <span>By</span>
                        <span className="font-bold" style={{ color: catColor }}>
                          {featuredRelated.author}
                        </span>
                        <span className="text-gray-200">|</span>
                        <time>
                          {new Date(featuredRelated.date).toLocaleDateString("en-US", {
                            month: "long", day: "numeric", year: "numeric",
                          })}
                        </time>
                        <Link
                          href={`/news/${featuredRelated.slug}`}
                          className="ml-auto font-condensed font-black text-[9px] tracking-[2px] uppercase text-white px-4 py-1.5 hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: catColor }}
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                )}

                {/* Remaining 2 stories in a grid */}
                {restRelated.length > 0 && (
                  <div>
                    <div className="section-header mb-4" style={{ borderColor: catColor }}>
                      <h3
                        className="font-condensed font-black text-base uppercase"
                        style={{ color: catColor }}
                      >
                        Also in {primaryTag}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {restRelated.map((p) => (
                        <NewsCard key={p.slug} post={p} variant="large" />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </article>

          {/* ── SIDEBAR ──────────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <Sidebar currentCategory={catSlug} />
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
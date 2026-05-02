// app/news/[slug]/page.tsx
import { getPostBySlug, getAllPosts, type NewsPost } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import ShareButtons from "@/components/ShareButtons";
import Sidebar from "@/components/Sidebar";

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

  const excerpt       = post.excerpt || generateExcerpt(post.content);
  const formattedDate = new Date(post.date).toISOString();
  const catColor      = getCategoryColor(post.tags);
  const catSlug       = getCategorySlug(post.tags);
  const primaryTag    = post.tags[0] || "News";
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

    // Fallback: if no tag matches, just grab the 3 most recent posts
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
                style={{ color: catColor }}
              >
                {primaryTag}
              </Link>
            </nav>

            {/* Category badge + headline */}
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
              <time className="text-gray-500 text-[10px] sm:text-xs">
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

            {/* ── RELATED STORIES — category page style ─────── */}
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
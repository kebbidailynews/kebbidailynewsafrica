// app/page.tsx
import { getAllPosts } from "@/lib/markdown";
import NewsCard from "@/components/NewsCard";
import FeaturedStory from "@/components/FeaturedStory";
import Sidebar from "@/components/Sidebar";
import InviteRedirect from "@/components/InviteRedirect";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const revalidate = 60;

// ======================
// SEO METADATA (UPGRADED)
// ======================
export const metadata: Metadata = {
  metadataBase: new URL("https://kebbidailynews.com"),

  title: {
    default: "Kebbi Daily News - Latest News in Kebbi State, Nigeria",
    template: "%s | Kebbi Daily News",
  },

  description:
    "Breaking news, politics, security updates, business, and local stories from Kebbi State, Nigeria. Stay informed with Kebbi Daily News.",

  keywords: [
    "Kebbi news",
    "Kebbi State news",
    "Birnin Kebbi",
    "Nigeria breaking news",
    "Kebbi politics",
    "Kebbi security",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Kebbi Daily News",
    description:
      "Trusted source for breaking news, politics, and local stories in Kebbi State, Nigeria.",
    url: "/",
    siteName: "Kebbi Daily News",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kebbi Daily News",
      },
    ],
    locale: "en_NG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kebbi Daily News",
    description:
      "Breaking news and local stories from Kebbi State, Nigeria.",
    images: ["/og-image.jpg"],
  },

  category: "news",
};

// ======================
// HELPERS
// ======================
function generateExcerpt(content: string, maxLength = 160) {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const slice = trimmed.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  return slice.slice(0, lastSpace) + "...";
}

function getAuthorSlug(author: string): string {
  return author
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ======================
// PAGE
// ======================
export default async function Home() {
  const posts = (await getAllPosts()).filter((p) => p.content?.trim());

  const featured = posts[0] || null;
  const breaking = posts.slice(1, 4);
  const latest = posts.slice(4, 10);
  const opinion = posts.filter((p) => p.tags.includes("Opinion")).slice(0, 3);
  const sports = posts.filter((p) => p.tags.includes("Sports")).slice(0, 3);
  const moreNews = posts.slice(10);

  // ======================
  // STRUCTURED DATA (GOOGLE NEWS READY)
  // ======================
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        name: "Kebbi Daily News",
        url: "https://kebbidailynews.com",
        logo: {
          "@type": "ImageObject",
          url: "https://kebbidailynews.com/favicon-32x32.png",
        },
        sameAs: [
          "https://twitter.com/kebbidailynews",
          "https://facebook.com/kebbidailynews",
        ],
        areaServed: {
          "@type": "Place",
          name: "Kebbi State, Nigeria",
        },
      },
      {
        "@type": "WebSite",
        url: "https://kebbidailynews.com",
        name: "Kebbi Daily News",
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://kebbidailynews.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        name: "Homepage",
        url: "https://kebbidailynews.com",
        description:
          "Latest news, politics, security updates and local stories from Kebbi State.",
      },
    ],
  };

  return (
    <>
      <InviteRedirect />

      {/* SEO: Hidden H1 for Google */}
      <h1 className="sr-only">
        Kebbi Daily News - Latest News in Kebbi State, Nigeria
      </h1>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Featured */}
        {featured && <FeaturedStory post={featured} />}

        {/* Breaking */}
        {breaking.length > 0 && (
          <section>
            <SectionHeader title="BREAKING NEWS" color="red" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {breaking.map((post) => (
                <NewsCard key={post.slug} post={post} variant="breaking" />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-8 space-y-12">
            {/* Latest */}
            {latest.length > 0 && (
              <section>
                <SectionHeader title="LATEST STORIES" color="blue" />
                <div className="space-y-8">
                  {latest.map((post, i) => {
                    const excerpt =
                      post.excerpt || generateExcerpt(post.content);

                    return (
                      <article
                        key={post.slug}
                        className="flex gap-4 border-b pb-8 last:border-0"
                      >
                        <div className="text-4xl font-black text-gray-200">
                          {String(i + 1).padStart(2, "0")}
                        </div>

                        <div className="flex-1">
                          <Link
                            href={`/news/${post.slug}`}
                            className="group block"
                          >
                            <h2 className="text-2xl font-bold group-hover:text-blue-700">
                              {post.title}
                            </h2>

                            <p className="text-gray-600 mt-2 line-clamp-3">
                              {excerpt}
                            </p>

                            <div className="flex gap-3 mt-3 text-sm text-gray-500">
                              <Link
                                href={`/author/${getAuthorSlug(post.author)}`}
                                className="hover:underline"
                              >
                                {post.author}
                              </Link>

                              <span>•</span>

                              <time suppressHydrationWarning>
                                {new Date(post.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </time>
                            </div>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Opinion + Sports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <SectionHeader title="OPINION" color="purple" />
                <div className="space-y-6">
                  {opinion.map((post) => (
                    <OpinionCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>

              <section>
                <SectionHeader title="SPORTS" color="green" />
                <div className="space-y-6">
                  {sports.map((post) => (
                    <SportsCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-10 rounded-2xl text-center">
          <h2 className="text-3xl font-black mb-3">
            Stay Informed About Kebbi State
          </h2>
          <p className="text-lg mb-6">
            Get daily news updates delivered to your inbox.
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-xl text-gray-900"
            />
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl">
              Subscribe
            </button>
          </form>
        </div>

        {/* More */}
        {moreNews.length > 0 && (
          <section>
            <SectionHeader title="MORE NEWS" color="gray" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moreNews.map((post) => (
                <NewsCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

// ======================
// COMPONENTS (UNCHANGED)
// ======================
function SectionHeader({ title, color }: { title: string; color: string }) {
  const colors: Record<string, string> = {
    red: "bg-red-600",
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    green: "bg-green-600",
    gray: "bg-gray-600",
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-1.5 h-8 ${colors[color]}`} />
      <h2 className="text-2xl font-black uppercase tracking-widest text-gray-900">
        {title}
      </h2>
    </div>
  );
}

function OpinionCard({ post }: { post: any }) {
  return (
    <Link href={`/news/${post.slug}`} className="block group">
      <div className="flex gap-3">
        {post.image ? (
          <Image src={post.image} alt={post.title} width={80} height={80} className="object-cover rounded" />
        ) : (
          <div className="w-20 h-20 bg-purple-100 rounded flex items-center justify-center text-2xl font-bold text-purple-700">
            OP
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-bold text-base group-hover:text-purple-700 line-clamp-2">
            {post.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">By {post.author}</p>
        </div>
      </div>
    </Link>
  );
}

function SportsCard({ post }: { post: any }) {
  const excerpt = post.excerpt || generateExcerpt(post.content);
  return (
    <Link href={`/news/${post.slug}`} className="block group p-4 bg-green-50 rounded-xl hover:bg-green-100">
      <h4 className="font-bold group-hover:text-green-700 line-clamp-2">
        {post.title}
      </h4>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{excerpt}</p>
      <p className="text-xs text-gray-500 mt-3">By {post.author}</p>
    </Link>
  );
}
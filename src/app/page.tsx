// app/page.tsx
import { getAllPosts, type NewsPost } from "@/lib/markdown";
import NewsCard from "@/components/NewsCard";
import FeaturedStory from "@/components/FeaturedStory";
import Sidebar from "@/components/Sidebar";
import InviteRedirect from "@/components/InviteRedirect";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: "Kebbi Daily News — Latest News from Kebbi State",
  description:
    "Breaking news, politics, security, and local stories from Kebbi State, Nigeria.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

function generateExcerpt(content: string, maxLength = 160): string {
  const stripped = content.replace(/#{1,6}\s/g, "").replace(/\*\*/g, "").trim();
  if (stripped.length <= maxLength) return stripped;
  const slice = stripped.slice(0, maxLength);
  return slice.slice(0, slice.lastIndexOf(" ")) + "...";
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000);
  const diffD = Math.floor(diffH / 24);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default async function Home() {
  let allPosts: NewsPost[] = [];

  try {
    allPosts = await getAllPosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  const featured   = allPosts[0];
  const breaking   = allPosts.slice(1, 5);
  const subHero    = allPosts.slice(1, 4);
  const latest     = allPosts.slice(4, 10);
  const politics   = allPosts.filter((p) => p.tags.some((t) => t.toLowerCase().includes("politi"))).slice(0, 3);
  const security   = allPosts.filter((p) => p.tags.some((t) => t.toLowerCase().includes("securi"))).slice(0, 4);
  const moreNews   = allPosts.slice(10, 22);

  return (
    <>
      <InviteRedirect />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-10 sm:pb-14">

        {/* ── HERO ───────────────────────────────────────────── */}
        {featured && (
          <div className="mb-3 sm:mb-4">
            <FeaturedStory post={featured} isHero />
          </div>
        )}

        {/* ── SUB-HERO (Mobile: Stacked, Tablet/Desktop: 3-column) ── */}
        {subHero.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 border-0 sm:border border-gray-200 bg-white mb-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {subHero.map((post) => (
              <div key={post.slug} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <span className="bg-[#CC0000] text-white font-condensed font-bold text-[9px] sm:text-[9px] tracking-[1.5px] px-2 py-0.5 uppercase inline-block mb-2">
                  {post.tags[0]?.toUpperCase() || "NEWS"}
                </span>
                <h3 className="font-condensed font-bold text-sm sm:text-[15px] leading-snug hover:text-[#CC0000] transition-colors">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1.5">{timeAgo(post.date)}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── BREAKING NEWS TICKER (Mobile optimized) ────────── */}
        {breaking.length > 0 && (
          <div className="flex items-center bg-[#CC0000] text-white mb-6 sm:mb-8 overflow-hidden rounded-sm">
            <div className="flex-shrink-0 bg-black text-white font-condensed font-black text-[9px] sm:text-[10px] tracking-[2px] px-3 sm:px-4 py-2 uppercase whitespace-nowrap">
              Breaking
            </div>
            <div className="flex-1 overflow-hidden py-2 px-3 sm:px-4">
              <div className="flex gap-6 sm:gap-10 animate-marquee whitespace-nowrap text-xs sm:text-sm font-semibold">
                {[...breaking, ...breaking].map((post, i) => (
                  <Link key={i} href={`/news/${post.slug}`} className="hover:underline flex-shrink-0 truncate max-w-[200px] sm:max-w-none">
                    {post.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN 2-COLUMN LAYOUT (Mobile: 1 column, Desktop: 12-col grid) ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8">

          {/* CONTENT */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-12">

            {/* Latest News */}
            {latest.length > 0 && (
              <section>
                <div className="section-header flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Latest News</h2>
                  <Link href="/news" className="text-[#CC0000] font-condensed font-bold text-xs tracking-wide hover:underline uppercase">
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {latest.map((post) => (
                    <NewsCard key={post.slug} post={post} variant="large" />
                  ))}
                </div>
              </section>
            )}

            {/* Politics */}
            {politics.length > 0 && (
              <section>
                <div className="section-header section-header--blue flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-700">Politics</h2>
                  <Link href="/category/politics" className="text-blue-600 font-condensed font-bold text-xs tracking-wide hover:underline uppercase">
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {politics.map((post) => (
                    <NewsCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Security */}
            {security.length > 0 && (
              <section>
                <div className="section-header section-header--orange flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-orange-700">Security</h2>
                  <Link href="/category/security" className="text-orange-600 font-condensed font-bold text-xs tracking-wide hover:underline uppercase">
                    View All →
                  </Link>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  {security.map((post) => (
                    <article
                      key={post.slug}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-5 pb-4 sm:pb-5 border-b border-gray-100 last:border-0 last:pb-0 group"
                    >
                      {post.image && (
                        <div className="relative w-full sm:w-36 h-48 sm:h-24 flex-shrink-0 bg-gray-200 overflow-hidden rounded-sm">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="bg-orange-700 text-white font-condensed font-bold text-[9px] tracking-[1.5px] px-2 py-0.5 uppercase inline-block mb-1.5">
                          Security
                        </span>
                        <h3 className="font-condensed font-bold text-base sm:text-lg leading-tight mb-1.5 hover:text-[#CC0000] transition-colors">
                          <Link href={`/news/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-2">
                          {post.excerpt || generateExcerpt(post.content)}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-gray-400">
                          By{" "}
                          <span className="text-orange-700 font-semibold">{post.author}</span>
                          {" • "}
                          {timeAgo(post.date)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* More Stories */}
            {moreNews.length > 0 && (
              <section>
                <div className="section-header section-header--gray mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">More Stories</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {moreNews.map((post) => (
                    <NewsCard key={post.slug} post={post} />
                  ))}
                </div>

                {/* Load more button */}
                <div className="text-center mt-6 sm:mt-8">
                  <Link
                    href="/news"
                    className="inline-block border-2 border-[#CC0000] text-[#CC0000] font-condensed font-black text-xs sm:text-sm tracking-[2px] uppercase px-6 sm:px-10 py-2.5 sm:py-3 hover:bg-[#CC0000] hover:text-white transition-colors rounded-sm"
                  >
                    Load More Stories
                  </Link>
                </div>
              </section>
            )}

          </div>

          {/* SIDEBAR (Hidden on mobile, visible on tablet/desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
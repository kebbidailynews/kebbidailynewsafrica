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
  const subHero    = allPosts.slice(1, 4);   // 3 cards under hero
  const latest     = allPosts.slice(4, 10);
  const politics   = allPosts.filter((p) => p.tags.some((t) => t.toLowerCase().includes("politi"))).slice(0, 3);
  const security   = allPosts.filter((p) => p.tags.some((t) => t.toLowerCase().includes("securi"))).slice(0, 4);
  const moreNews   = allPosts.slice(10, 22);

  return (
    <>
      <InviteRedirect />

      <div className="max-w-7xl mx-auto px-4 pt-5 pb-14">

        {/* ── HERO ───────────────────────────────────────────── */}
        {featured && (
          <div className="mb-4">
            <FeaturedStory post={featured} isHero />
          </div>
        )}

        {/* ── SUB-HERO 3-COLUMN STRIP ─────────────────────────── */}
        {subHero.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-gray-200 bg-white mb-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {subHero.map((post) => (
              <div key={post.slug} className="p-4 hover:bg-gray-50 transition-colors">
                <span className="bg-[#CC0000] text-white font-condensed font-bold text-[9px] tracking-[1.5px] px-2 py-0.5 uppercase inline-block mb-2">
                  {post.tags[0]?.toUpperCase() || "NEWS"}
                </span>
                <h3 className="font-condensed font-bold text-[15px] leading-snug hover:text-[#CC0000] transition-colors">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1.5">{timeAgo(post.date)}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── BREAKING NEWS TICKER BAR ─────────────────────────── */}
        {breaking.length > 0 && (
          <div className="flex items-center bg-[#CC0000] text-white mb-8 overflow-hidden">
            <div className="flex-shrink-0 bg-black text-white font-condensed font-black text-[10px] tracking-[2px] px-4 py-2.5 uppercase whitespace-nowrap">
              Breaking
            </div>
            <div className="flex-1 overflow-hidden py-2.5 px-4">
              <div className="flex gap-10 animate-marquee whitespace-nowrap text-sm font-semibold">
                {[...breaking, ...breaking].map((post, i) => (
                  <Link key={i} href={`/news/${post.slug}`} className="hover:underline flex-shrink-0">
                    {post.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN 2-COLUMN LAYOUT ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* CONTENT */}
          <div className="lg:col-span-8 space-y-12">

            {/* Latest News */}
            {latest.length > 0 && (
              <section>
                <div className="section-header">
                  <h2>Latest News</h2>
                  <Link href="/news" className="text-[#CC0000] font-condensed font-bold text-xs tracking-wide hover:underline uppercase">
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {latest.map((post) => (
                    <NewsCard key={post.slug} post={post} variant="large" />
                  ))}
                </div>
              </section>
            )}

            {/* Politics */}
            {politics.length > 0 && (
              <section>
                <div className="section-header section-header--blue">
                  <h2 className="text-blue-700">Politics</h2>
                  <Link href="/category/politics" className="text-blue-600 font-condensed font-bold text-xs tracking-wide hover:underline uppercase">
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {politics.map((post) => (
                    <NewsCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Security */}
            {security.length > 0 && (
              <section>
                <div className="section-header section-header--orange">
                  <h2 className="text-orange-700">Security</h2>
                  <Link href="/category/security" className="text-orange-600 font-condensed font-bold text-xs tracking-wide hover:underline uppercase">
                    View All →
                  </Link>
                </div>
                <div className="space-y-5">
                  {security.map((post) => (
                    <article
                      key={post.slug}
                      className="flex gap-5 pb-5 border-b border-gray-100 last:border-0 last:pb-0 group"
                    >
                      {post.image && (
                        <div className="relative w-36 h-24 flex-shrink-0 bg-gray-200 overflow-hidden">
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
                        <h3 className="font-condensed font-bold text-lg leading-tight mb-1.5 hover:text-[#CC0000] transition-colors">
                          <Link href={`/news/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                          {post.excerpt || generateExcerpt(post.content)}
                        </p>
                        <p className="text-[11px] text-gray-400">
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
                <div className="section-header section-header--gray">
                  <h2>More Stories</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {moreNews.map((post) => (
                    <NewsCard key={post.slug} post={post} />
                  ))}
                </div>

                {/* Load more */}
                <div className="text-center mt-8">
                  <Link
                    href="/news"
                    className="inline-block border-2 border-[#CC0000] text-[#CC0000] font-condensed font-black text-sm tracking-[2px] uppercase px-10 py-3 hover:bg-[#CC0000] hover:text-white transition-colors"
                  >
                    Load More Stories
                  </Link>
                </div>
              </section>
            )}

          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
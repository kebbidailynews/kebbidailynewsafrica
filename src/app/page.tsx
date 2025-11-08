// app/page.tsx
import { getAllPosts } from "@/lib/markdown";
import NewsCard from "@/components/NewsCard";
import FeaturedStory from "@/components/FeaturedStory";
import Sidebar from "@/components/Sidebar";
import InviteRedirect from "@/components/InviteRedirect";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60; // ISR: refresh every 60s

// Helper: generate smart excerpt if none provided
function generateExcerpt(content: string, maxLength = 160) {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const slice = trimmed.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  return slice.slice(0, lastSpace) + "...";
}

export default async function Home() {
  const posts = (await getAllPosts()).filter(p => p.content?.trim());
  const featured = posts[0] || null;
  const breaking = posts.slice(1, 4);
  const latest = posts.slice(4, 10);
  const opinion = posts.filter(p => p.tags.includes("Opinion")).slice(0, 3);
  const sports = posts.filter(p => p.tags.includes("Sports")).slice(0, 3);
  const moreNews = posts.slice(10);

  return (
    <>
      <InviteRedirect />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {/* HERO: FULL-WIDTH FEATURED STORY */}
        {featured && <FeaturedStory post={featured} />}

        {/* BREAKING NEWS GRID */}
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
          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 space-y-10">
            {/* LATEST STORIES */}
            {latest.length > 0 && (
              <section>
                <SectionHeader title="LATEST STORIES" color="blue" />
                <div className="space-y-6">
                  {latest.map((post, i) => {
                    const excerpt = post.excerpt || generateExcerpt(post.content);
                    return (
                      <div key={post.slug} className="flex gap-4 border-b pb-6 last:border-0">
                        <div className="text-4xl font-black text-gray-300">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div className="flex-1">
                          <Link href={`/news/${post.slug}`} className="block group">
                            <h3 className="text-xl font-bold group-hover:text-blue-700 transition">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{excerpt}</p>
                            <div className="flex gap-3 mt-2 text-xs text-gray-500">
                              <span>{post.author}</span>
                              <span>•</span>
                              <time>
                                {new Date(post.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </time>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* OPINION & SPORTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <SectionHeader title="OPINION" color="purple" />
                <div className="space-y-4">
                  {opinion.length > 0
                    ? opinion.map((post) => <OpinionCard key={post.slug} post={post} />)
                    : <p className="text-gray-500">No opinion pieces yet.</p>}
                </div>
              </section>

              <section>
                <SectionHeader title="SPORTS" color="green" />
                <div className="space-y-4">
                  {sports.length > 0
                    ? sports.map((post) => <SportsCard key={post.slug} post={post} />)
                    : <p className="text-gray-500">No sports news yet.</p>}
                </div>
              </section>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>

        {/* CALL TO ACTION */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-xl text-center">
          <h2 className="text-3xl font-black mb-3">Stay Informed. Stay Ahead.</h2>
          <p className="text-lg mb-6">Get the latest Kebbi news delivered to your inbox daily.</p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition">
              Subscribe
            </button>
          </form>
        </div>

        {/* MORE NEWS */}
        {moreNews.length > 0 && (
          <section className="mt-12">
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

// =========================
// Reusable Components
// =========================
function SectionHeader({ title, color }: { title: string; color: "red" | "blue" | "purple" | "green" | "gray" }) {
  const colors: Record<string, string> = {
    red: "bg-red-700",
    blue: "bg-blue-700",
    purple: "bg-purple-700",
    green: "bg-green-700",
    gray: "bg-gray-700",
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-1 h-8 ${colors[color]}`} />
      <h2 className="text-2xl font-black uppercase tracking-wider text-gray-900">{title}</h2>
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
        <div>
          <h4 className="font-bold text-sm group-hover:text-purple-700 line-clamp-2">{post.title}</h4>
          <p className="text-xs text-gray-500 mt-1">By {post.author}</p>
        </div>
      </div>
    </Link>
  );
}

function SportsCard({ post }: { post: any }) {
  const excerpt = post.excerpt || generateExcerpt(post.content);
  return (
    <Link href={`/news/${post.slug}`} className="block group p-3 bg-green-50 rounded-lg hover:bg-green-100 transition">
      <h4 className="font-bold text-sm group-hover:text-green-700 line-clamp-2">{post.title}</h4>
      <p className="text-xs text-gray-600 mt-1">{excerpt}</p>
    </Link>
  );
}

// components/Sidebar.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";

export default async function Sidebar() {
  let allPosts: Awaited<ReturnType<typeof getAllPosts>> = [];

  try {
    allPosts = await getAllPosts();
  } catch {
    // Silently fail — sidebar is non-critical
  }

  const trending = allPosts.slice(0, 6);
  const opinions = allPosts
    .filter((p) => p.tags.some((t) => t.toLowerCase().includes("opinion")))
    .slice(0, 2);

  return (
    <aside className="space-y-5">

      {/* Ad Slot (top) */}
      <div className="sidebar-widget">
        <div className="sidebar-widget__head">Advertisement</div>
        <div className="ad-slot h-[250px]">
          <span>300 × 250</span>
        </div>
      </div>

      {/* Trending Now */}
      {trending.length > 0 && (
        <div className="sidebar-widget">
          <div className="sidebar-widget__head">Trending Now</div>
          <div className="divide-y divide-gray-100">
            {trending.map((post, i) => (
              <div key={post.slug} className="flex items-start gap-3 p-3">
                <span className="trending-num">{i + 1}</span>
                <Link
                  href={`/news/${post.slug}`}
                  className="text-[13px] font-semibold text-gray-800 leading-snug hover:text-[#CC0000] transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opinion / Analysis */}
      {opinions.length > 0 && (
        <div className="sidebar-widget">
          <div className="sidebar-widget__head">Opinion & Analysis</div>
          <div className="divide-y divide-gray-100">
            {opinions.map((post) => (
              <div key={post.slug} className="p-4">
                <p className="font-condensed font-black text-[15px] leading-tight mb-1 hover:text-[#CC0000]">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </p>
                <p className="text-[11px] text-gray-400">
                  By <span className="text-[#CC0000] font-semibold">{post.author}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100">
            <Link
              href="/category/opinion"
              className="text-[11px] text-[#CC0000] font-bold tracking-wide hover:underline uppercase"
            >
              View All Opinion →
            </Link>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="sidebar-widget">
        <div className="sidebar-widget__head">Browse by Section</div>
        <div className="p-3 grid grid-cols-2 gap-2">
          {[
            { name: "Politics", href: "/category/politics", color: "#1A56CC" },
            { name: "Security", href: "/category/security", color: "#E06800" },
            { name: "Health",   href: "/category/health",   color: "#166534" },
            { name: "Economy",  href: "/category/economy",  color: "#6D28D9" },
            { name: "Education",href: "/category/education",color: "#0E7490" },
            { name: "Sports",   href: "/category/sports",   color: "#065F46" },
          ].map(({ name, href, color }) => (
            <Link
              key={name}
              href={href}
              className="text-white font-condensed font-bold text-[11px] tracking-[1px] uppercase py-2 px-3 text-center hover:opacity-90 transition-opacity"
              style={{ backgroundColor: color }}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>

      {/* Ad Slot (bottom) */}
      <div className="sidebar-widget">
        <div className="sidebar-widget__head">Advertisement</div>
        <div className="ad-slot h-[200px]">
          <span>300 × 200</span>
        </div>
      </div>
    </aside>
  );
}
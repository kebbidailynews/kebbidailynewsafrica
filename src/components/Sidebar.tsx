// components/Sidebar.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";

interface SidebarProps {
  currentCategory?: string;
}

export default async function Sidebar({ currentCategory }: SidebarProps = {}) {
  let allPosts: Awaited<ReturnType<typeof getAllPosts>> = [];

  try {
    allPosts = await getAllPosts();
  } catch {
    // Silently fail — sidebar is non-critical
  }

  // Filter trending based on current category if provided
  let trending = allPosts.slice(0, 6);
  let categorySpecificPosts: Awaited<ReturnType<typeof getAllPosts>> = [];
  
  if (currentCategory) {
    categorySpecificPosts = allPosts
      .filter((p) => p.tags.some((t) => t.toLowerCase().includes(currentCategory)))
      .slice(0, 4);
  }

  const opinions = allPosts
    .filter((p) => p.tags.some((t) => t.toLowerCase().includes("opinion")))
    .slice(0, 2);

  // Category display names
  const categories = [
    { name: "Politics", href: "/category/politics", color: "#1A56CC" },
    { name: "Security", href: "/category/security", color: "#E06800" },
    { name: "Health",   href: "/category/health",   color: "#166534" },
    { name: "Economy",  href: "/category/economy",  color: "#6D28D9" },
    { name: "Education",href: "/category/education",color: "#0E7490" },
    { name: "Sports",   href: "/category/sports",   color: "#065F46" },
  ];

  return (
    <aside className="space-y-4 sm:space-y-5">

      {/* Ad Slot (top) - Mobile optimized */}
      <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="sidebar-widget__head bg-gray-800 text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5">
          Advertisement
        </div>
        <div className="ad-slot h-[200px] sm:h-[250px] flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-xs font-semibold">300 × 250</span>
        </div>
      </div>

      {/* Category-specific section (shown when on category page) */}
      {currentCategory && categorySpecificPosts.length > 0 && (
        <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div 
            className="sidebar-widget__head text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5"
            style={{ backgroundColor: categories.find(c => c.href.includes(currentCategory))?.color || "#CC0000" }}
          >
            More in {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
          </div>
          <div className="divide-y divide-gray-100">
            {categorySpecificPosts.map((post) => (
              <div key={post.slug} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <h4 className="font-condensed font-bold text-sm sm:text-[15px] leading-snug mb-1 hover:text-[#CC0000] transition-colors line-clamp-2">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </h4>
                <p className="text-[10px] sm:text-[11px] text-gray-400">
                  {new Date(post.date).toLocaleDateString("en-US", { 
                    month: "short", 
                    day: "numeric" 
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Now - Responsive */}
      {trending.length > 0 && (
        <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="sidebar-widget__head bg-gray-800 text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5">
            Trending Now
          </div>
          <div className="divide-y divide-gray-100">
            {trending.map((post, i) => (
              <div key={post.slug} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <span className="trending-num flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#CC0000] text-white font-bold text-[10px] sm:text-xs flex items-center justify-center rounded-full">
                  {i + 1}
                </span>
                <Link
                  href={`/news/${post.slug}`}
                  className="text-[12px] sm:text-[13px] font-semibold text-gray-800 leading-snug hover:text-[#CC0000] transition-colors line-clamp-2 flex-1"
                >
                  {post.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opinion / Analysis - Responsive */}
      {opinions.length > 0 && (
        <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="sidebar-widget__head bg-gray-800 text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5">
            Opinion & Analysis
          </div>
          <div className="divide-y divide-gray-100">
            {opinions.map((post) => (
              <div key={post.slug} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <p className="font-condensed font-black text-sm sm:text-[15px] leading-tight mb-1 hover:text-[#CC0000] transition-colors">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] sm:text-[11px] text-gray-400">
                    By <span className="text-[#CC0000] font-semibold">{post.author}</span>
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-gray-400">
                    {new Date(post.date).toLocaleDateString("en-US", { 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 sm:p-3 border-t border-gray-100 bg-gray-50">
            <Link
              href="/category/opinion"
              className="text-[10px] sm:text-[11px] text-[#CC0000] font-bold tracking-wide hover:underline uppercase flex items-center justify-between"
            >
              <span>View All Opinion</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}

      {/* Categories Grid - Mobile optimized */}
      <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="sidebar-widget__head bg-gray-800 text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5">
          Browse by Section
        </div>
        <div className="p-2 sm:p-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {categories.map(({ name, href, color }) => (
              <Link
                key={name}
                href={href}
                className={`text-white font-condensed font-bold text-[10px] sm:text-[11px] tracking-[1px] uppercase py-2 sm:py-2.5 px-2 text-center hover:opacity-90 transition-opacity rounded ${
                  currentCategory === href.split('/').pop() ? 'ring-2 ring-offset-1' : ''
                }`}
                style={{ 
                  backgroundColor: color,
                  ...(currentCategory === href.split('/').pop() && { ringColor: color })
                }}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup - Mobile friendly */}
      <div className="sidebar-widget bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-sm overflow-hidden">
        <div className="p-4 sm:p-5">
          <h3 className="text-white font-bold text-base sm:text-lg mb-2">Newsletter</h3>
          <p className="text-gray-300 text-[11px] sm:text-xs mb-3 leading-relaxed">
            Get the latest news from Kebbi State delivered to your inbox.
          </p>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000]"
          />
          <button className="w-full bg-[#CC0000] text-white font-bold text-[11px] sm:text-xs py-2 rounded hover:bg-[#A30000] transition-colors uppercase tracking-wide">
            Subscribe Now
          </button>
          <p className="text-gray-400 text-[9px] sm:text-[10px] mt-2 text-center">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Ad Slot (bottom) - Mobile optimized */}
      <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="sidebar-widget__head bg-gray-800 text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5">
          Advertisement
        </div>
        <div className="ad-slot h-[150px] sm:h-[200px] flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-xs font-semibold">300 × 200</span>
        </div>
      </div>

      {/* Social Follow - Mobile friendly */}
      <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="sidebar-widget__head bg-gray-800 text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5">
          Follow Us
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex justify-around gap-2">
            <a href="#" className="flex-1 bg-[#1877F2] text-white text-center py-2 rounded text-[11px] sm:text-xs font-bold hover:opacity-90 transition-opacity">
              Facebook
            </a>
            <a href="#" className="flex-1 bg-black text-white text-center py-2 rounded text-[11px] sm:text-xs font-bold hover:opacity-90 transition-opacity">
              Twitter
            </a>
            <a href="#" className="flex-1 bg-[#0A66C2] text-white text-center py-2 rounded text-[11px] sm:text-xs font-bold hover:opacity-90 transition-opacity">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
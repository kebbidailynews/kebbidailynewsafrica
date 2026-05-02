// components/Sidebar.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";
import NewsletterForm from "./NewsletterForm";

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

  const categories = [
    { name: "Politics",  href: "/category/politics",  color: "#1A56CC" },
    { name: "Security",  href: "/category/security",  color: "#E06800" },
    { name: "Health",    href: "/category/health",    color: "#166534" },
    { name: "Economy",   href: "/category/economy",   color: "#6D28D9" },
    { name: "Education", href: "/category/education", color: "#0E7490" },
    { name: "Sports",    href: "/category/sports",    color: "#065F46" },
  ];

  const socials = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/kebbidailynews",
      bg: "#1877F2",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H8.08V12h2.36v-2.05c0-2.33 1.39-3.62 3.51-3.62.7 0 1.44.06 2.13.18v2.35h-1.2c-1.18 0-1.55.73-1.55 1.49V12h2.64l-.42 2.88h-2.22v6.99A10 10 0 0 0 22 12z" />
        </svg>
      ),
    },
    {
      name: "Twitter / X",
      href: "https://www.x.com/kebbidailynews",
      bg: "#000000",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/kebbidailynews",
      bg: "#E1306C",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@kebbidailynewstv",
      bg: "#FF0000",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://whatsapp.com/channel/kebbidailynews",
      bg: "#25D366",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/kebbi-daily-news",
      bg: "#0A66C2",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="space-y-4 sm:space-y-5">

      {/* Ad Slot (top) */}
      <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="sidebar-widget__head bg-gray-800 text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5">
          Advertisement
        </div>
        <div className="ad-slot h-[200px] sm:h-[250px] flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-xs font-semibold">300 × 250</span>
        </div>
      </div>

      {/* Category-specific section */}
      {currentCategory && categorySpecificPosts.length > 0 && (
        <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div
            className="sidebar-widget__head text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5"
            style={{ backgroundColor: categories.find((c) => c.href.includes(currentCategory))?.color || "#CC0000" }}
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
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Now */}
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

      {/* Opinion & Analysis */}
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
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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

      {/* Browse by Section */}
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
                  currentCategory === href.split("/").pop() ? "ring-2 ring-offset-1" : ""
                }`}
                style={{
                  backgroundColor: color,
                  ...(currentCategory === href.split("/").pop() && { ringColor: color }),
                }}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="sidebar-widget bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-sm overflow-hidden">
        <div className="p-4 sm:p-5">
          <h3 className="text-white font-bold text-base sm:text-lg mb-2">Newsletter</h3>
          <p className="text-gray-300 text-[11px] sm:text-xs mb-3 leading-relaxed">
            Get the latest news from Kebbi State delivered to your inbox.
          </p>
          <NewsletterForm />
          <p className="text-gray-400 text-[9px] sm:text-[10px] mt-2 text-center">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Follow Us */}
      <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="sidebar-widget__head bg-gray-800 text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5">
          Follow Kebbi Daily News
        </div>
        <div className="p-3 sm:p-4 space-y-2">
          {socials.map(({ name, href, bg, icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded text-white text-[11px] sm:text-xs font-bold hover:opacity-90 transition-opacity w-full"
              style={{ backgroundColor: bg }}
            >
              {icon}
              <span>{name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Ad Slot (bottom) */}
      <div className="sidebar-widget bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="sidebar-widget__head bg-gray-800 text-white font-condensed font-bold text-[9px] sm:text-[10px] tracking-[2px] uppercase px-3 sm:px-4 py-2 sm:py-2.5">
          Advertisement
        </div>
        <div className="ad-slot h-[150px] sm:h-[200px] flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-xs font-semibold">300 × 200</span>
        </div>
      </div>

    </aside>
  );
}
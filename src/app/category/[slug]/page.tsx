// app/category/[slug]/page.tsx
import { getAllPosts } from "@/lib/markdown";
import NewsCard from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { notFound } from "next/navigation";

const CATEGORY_MAP: Record<string, { label: string; color: string; description: string }> = {
  politics:  { label: "Politics",  color: "#1A56CC", description: "Coverage of Kebbi State government, elected officials, and political developments." },
  security:  { label: "Security",  color: "#E06800", description: "Security updates, armed forces operations, and safety news across Kebbi State." },
  health:    { label: "Health",    color: "#166534", description: "Healthcare news, medical developments, and wellness stories from Kebbi State." },
  economy:   { label: "Economy",   color: "#6D28D9", description: "Business, agriculture, trade, and economic policy news from Kebbi State." },
  education: { label: "Education", color: "#0E7490", description: "Schools, universities, scholarships, and education policy in Kebbi State." },
  sports:    { label: "Sports",    color: "#065F46", description: "Football, athletics, and all sporting news from Kebbi State." },
  opinion:   { label: "Opinion",   color: "#374151", description: "Editorials, op-eds, and analysis from Kebbi Daily News contributors." },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = CATEGORY_MAP[params.slug.toLowerCase()];
  if (!cat) return {};
  return {
    title: `${cat.label} News — Kebbi Daily News`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = params.slug.toLowerCase();
  const cat = CATEGORY_MAP[category];

  if (!cat) notFound();

  const posts = await getAllPosts();
  const filtered = posts.filter((post) =>
    post.tags.some((tag) => tag.toLowerCase().includes(category))
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.label} - Kebbi Daily News`,
    description: cat.description,
    url: `https://kebbidailynews.com/category/${category}`,
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Kebbi Daily News",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: filtered.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://kebbidailynews.com/news/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-14">

        {/* Category Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-condensed font-bold tracking-[1.5px] uppercase text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#CC0000] transition-colors">Home</Link>
            <span>›</span>
            <span style={{ color: cat.color }}>{cat.label}</span>
          </div>

          {/* Title row */}
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-14 flex-shrink-0" style={{ backgroundColor: cat.color }} />
            <div>
              <h1
                className="font-condensed font-black text-5xl uppercase leading-none tracking-tight"
                style={{ color: cat.color }}
              >
                {cat.label}
              </h1>
              <p className="text-gray-500 text-sm mt-1.5">{cat.description}</p>
            </div>
          </div>

          {/* Article count */}
          <div className="mt-4 flex items-center gap-3">
            <span
              className="font-condensed font-bold text-[10px] tracking-[2px] uppercase text-white px-3 py-1"
              style={{ backgroundColor: cat.color }}
            >
              {filtered.length} {filtered.length === 1 ? "Story" : "Stories"}
            </span>
            <span className="text-gray-400 text-xs">
              Latest {cat.label.toLowerCase()} news from Kebbi State, Nigeria
            </span>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24 bg-white border border-gray-200">
            <div
              className="font-condensed font-black text-6xl mb-4 opacity-10"
              style={{ color: cat.color }}
            >
              {cat.label.toUpperCase()}
            </div>
            <p className="text-gray-500 text-lg mb-6 font-condensed">
              No articles in this category yet.
            </p>
            <Link
              href="/"
              className="inline-block text-white font-condensed font-bold text-sm tracking-widest uppercase px-8 py-3 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: cat.color }}
            >
              ← Back to Homepage
            </Link>
          </div>
        )}

        {/* Content */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Main content */}
            <div className="lg:col-span-8">

              {/* Featured top story */}
              {featured && (
                <div className="mb-8">
                  <div className="section-header" style={{ borderColor: cat.color }}>
                    <h2 style={{ color: cat.color }}>Top Story</h2>
                  </div>
                  <article className="news-card group flex flex-col sm:flex-row overflow-hidden">
                    {featured.image && (
                      <div className="relative sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-gray-200 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={featured.image}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                          className="absolute top-3 left-3 font-condensed font-bold text-[9px] tracking-[1.5px] text-white px-2 py-0.5 uppercase"
                          style={{ backgroundColor: cat.color }}
                        >
                          {cat.label}
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex flex-col justify-center">
                      <h2 className="font-condensed font-black text-2xl leading-tight mb-3 hover:text-[#CC0000] transition-colors">
                        <Link href={`/news/${featured.slug}`}>{featured.title}</Link>
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                        {featured.excerpt || featured.content.slice(0, 200) + "..."}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-[11px] text-gray-400">
                          By{" "}
                          <span className="font-semibold" style={{ color: cat.color }}>
                            {featured.author}
                          </span>{" "}
                          •{" "}
                          {new Date(featured.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <Link
                          href={`/news/${featured.slug}`}
                          className="ml-auto text-white font-condensed font-bold text-[10px] tracking-widest uppercase px-4 py-1.5 flex-shrink-0 hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: cat.color }}
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Rest of articles grid */}
              {rest.length > 0 && (
                <div>
                  <div className="section-header" style={{ borderColor: cat.color }}>
                    <h2 style={{ color: cat.color }}>More {cat.label} Stories</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rest.map((post) => (
                      <NewsCard key={post.slug} post={post} variant="large" />
                    ))}
                  </div>
                </div>
              )}

              {filtered.length > 13 && (
                <p className="text-center text-gray-400 font-condensed text-sm tracking-wide mt-10 border-t border-gray-100 pt-6">
                  Showing all {filtered.length} stories • Check back for updates
                </p>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
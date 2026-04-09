// app/category/[slug]/page.tsx
import { getAllPosts } from "@/lib/markdown";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { notFound } from "next/navigation";

const CATEGORY_MAP: Record<string, string> = {
  politics: "Politics",
  security: "Security",
  health: "Health",
  economy: "Economy",
  education: "Education",
  sports: "Sports",
  opinion: "Opinion",
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = params.slug.toLowerCase();
  const displayName = CATEGORY_MAP[category];

  if (!displayName) notFound();

  const posts = await getAllPosts();
  const filtered = posts.filter((post) =>
    post.tags.some((tag) => tag.toLowerCase().includes(category))
  );

  // Breadcrumb + Category Schema (helps Google understand your site structure)
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${displayName} - Kebbi Daily News`,
    "description": `Latest ${displayName.toLowerCase()} news and updates from Kebbi State, Nigeria.`,
    "url": `https://kebbidailynews.com/category/${category}`,
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "Kebbi Daily News",
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filtered.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://kebbidailynews.com/news/${post.slug}`,
        "name": post.title,
      })),
    },
  };

  return (
    <>
      {/* Structured Data for Category Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-12 bg-red-700 rounded" />
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              {displayName}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""} • 
            Latest {displayName.toLowerCase()} news from Kebbi State
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 text-xl mb-4">
              No articles found in this category yet.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-red-700 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition font-medium"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {/* Optional: Pagination hint for future growth */}
        {filtered.length > 12 && (
          <div className="text-center mt-12 text-gray-500">
            Showing latest articles • More stories coming soon
          </div>
        )}
      </div>
    </>
  );
}
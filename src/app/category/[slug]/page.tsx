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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-2 h-12 bg-red-700" />
          {displayName}
        </h1>
        <p className="text-gray-600 mt-2">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No articles in this category yet. <Link href="/" className="text-red-700 hover:underline">Back to home</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
import { getAllPosts } from "@/lib/markdown";
import InfiniteFeed from "@/components/InfiniteFeed";

export const metadata = {
  title: "All News - Kebbi Daily News",
};

export default async function NewsPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-8 uppercase">
        All News
      </h1>

      <InfiniteFeed posts={posts} />
    </div>
  );
}
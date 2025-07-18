import { getAllPosts } from "@/lib/markdown";
import NewsCard from "@/components/NewsCard";
import InviteRedirect from "@/components/InviteRedirect";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div>
      {/* Redirect handler */}
      <InviteRedirect />

      <h1 className="text-3xl font-bold mb-8">Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <NewsCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { NewsPost } from "@/lib/markdown";

export default function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link href={`/news/${post.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
          <p className="text-gray-600 mt-2">{post.excerpt}</p>
          <p className="text-gray-500 text-sm mt-2">By {post.author} on {new Date(post.date).toDateString()}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
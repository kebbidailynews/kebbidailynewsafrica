// components/NewsCard.tsx
import Link from "next/link";
import Image from "next/image";

export default function NewsCard({ post, variant }: { post: any; variant?: "breaking" }) {
  if (variant === "breaking") {
    return (
      <Link href={`/news/${post.slug}`} className="group block">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
          {post.image ? (
            <div className="relative h-48">
              <Image src={post.image} alt="" fill className="object-cover" />
              <div className="absolute top-2 left-2 bg-red-700 text-white px-2 py-1 text-xs font-bold uppercase">
                Breaking
              </div>
            </div>
          ) : (
            <div className="h-48 bg-red-700 flex items-center justify-center">
              <span className="text-white text-3xl font-black">!</span>
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-bold group-hover:text-red-700 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
          </div>
        </article>
      </Link>
    );
  }

  // Default card (for sidebar, etc.)
  return (
    <Link href={`/news/${post.slug}`} className="block group">
      <h4 className="font-semibold group-hover:text-blue-700 line-clamp-2">
        {post.title}
      </h4>
      <p className="text-xs text-gray-500 mt-1">{post.author}</p>
    </Link>
  );
}
// components/FeaturedStory.tsx
import Link from "next/link";
import Image from "next/image";

export default function FeaturedStory({ post }: { post: any }) {
  return (
    <Link href={`/news/${post.slug}`} className="block group relative h-96 md:h-[600px] rounded-xl overflow-hidden shadow-2xl">
      {post.image ? (
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
        />
      ) : (
        <div className="bg-gradient-to-br from-red-700 to-black h-full" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
        <span className="bg-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Exclusive
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mt-3 leading-tight drop-shadow-lg">
          {post.title}
        </h1>
        <p className="text-lg md:text-xl mt-3 opacity-90 max-w-4xl drop-shadow">
          {post.summary || post.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="font-bold">{post.author}</span>
          <span>•</span>
          <time>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
        </div>
      </div>
    </Link>
  );
}
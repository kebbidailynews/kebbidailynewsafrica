// components/FeaturedStory.tsx
import Link from "next/link";
import Image from "next/image";
import { type NewsPost } from "@/lib/markdown";

function generateExcerpt(content: string, maxLength = 200): string {
  const stripped = content.replace(/#{1,6}\s/g, "").replace(/\*\*/g, "").trim();
  if (stripped.length <= maxLength) return stripped;
  const slice = stripped.slice(0, maxLength);
  return slice.slice(0, slice.lastIndexOf(" ")) + "...";
}

function getCategoryColor(tags: string[]): string {
  const tag = tags[0]?.toLowerCase() || "";
  if (tag.includes("politi")) return "bg-blue-700";
  if (tag.includes("securi")) return "bg-orange-700";
  if (tag.includes("health")) return "bg-green-700";
  if (tag.includes("economy") || tag.includes("econom")) return "bg-purple-700";
  if (tag.includes("education")) return "bg-teal-700";
  if (tag.includes("sport")) return "bg-emerald-700";
  if (tag.includes("opinion")) return "bg-gray-700";
  return "bg-[#CC0000]";
}

interface FeaturedStoryProps {
  post: NewsPost;
  isHero?: boolean;
}

export default function FeaturedStory({ post, isHero = false }: FeaturedStoryProps) {
  const excerpt = post.excerpt || generateExcerpt(post.content);
  const categoryColor = getCategoryColor(post.tags);
  const primaryTag = post.tags[0]?.toUpperCase() || "NEWS";

  if (isHero) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-gray-200 overflow-hidden">
        {/* Left: Image */}
        <div className="relative h-72 lg:h-auto min-h-[320px] bg-gray-800">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <span className="text-gray-500 font-condensed text-xs tracking-widest uppercase">No Image</span>
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />

          {/* Category pill on image */}
          <div className={`absolute top-4 left-4 ${categoryColor} text-white font-condensed font-bold text-[10px] tracking-[2px] px-3 py-1 uppercase`}>
            {primaryTag}
          </div>
        </div>

        {/* Right: Text */}
        <div className="p-8 flex flex-col justify-center border-l-0 lg:border-l border-gray-200">
          {/* Top label */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#CC0000] text-white font-condensed font-black text-[10px] tracking-[2px] px-3 py-1 uppercase">
              TOP STORY
            </span>
            <span className="text-gray-400 text-xs font-condensed tracking-wide uppercase">
              {primaryTag}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-condensed font-black text-3xl xl:text-4xl leading-tight text-gray-900 mb-4 hover:text-[#CC0000] transition-colors">
            <Link href={`/news/${post.slug}`}>{post.title}</Link>
          </h1>

          {/* Excerpt */}
          <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
            <span>
              By{" "}
              <Link
                href={`/author/${post.author.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[#CC0000] font-semibold hover:underline"
              >
                {post.author}
              </Link>
            </span>
            <span className="text-gray-300">|</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Read more */}
          <div className="mt-5">
            <Link
              href={`/news/${post.slug}`}
              className="inline-flex items-center gap-2 bg-[#CC0000] text-white font-condensed font-bold text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#AA0000] transition-colors"
            >
              READ FULL STORY
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Non-hero variant (used in sidebar or secondary featured slot)
  return (
    <div className="news-card overflow-hidden">
      {post.image && (
        <div className="relative h-48 bg-gray-800">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
          <div className={`absolute top-3 left-3 ${categoryColor} text-white font-condensed font-bold text-[10px] tracking-[2px] px-2 py-0.5 uppercase`}>
            {primaryTag}
          </div>
        </div>
      )}
      <div className="p-5">
        <h2 className="news-card__title text-xl mb-2">
          <Link href={`/news/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{excerpt}</p>
        <p className="text-xs text-gray-400">
          By <span className="text-[#CC0000] font-semibold">{post.author}</span> •{" "}
          {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
      </div>
    </div>
  );
}
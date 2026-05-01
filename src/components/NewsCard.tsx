// components/NewsCard.tsx
import Link from "next/link";
import Image from "next/image";
import { type NewsPost } from "@/lib/markdown";

function generateExcerpt(content: string, maxLength = 130): string {
  const stripped = content.replace(/#{1,6}\s/g, "").replace(/\*\*/g, "").trim();
  if (stripped.length <= maxLength) return stripped;
  const slice = stripped.slice(0, maxLength);
  return slice.slice(0, slice.lastIndexOf(" ")) + "...";
}

function getCategoryStyle(tags: string[]): { bg: string; label: string } {
  const tag = tags[0]?.toLowerCase() || "";
  if (tag.includes("politi"))  return { bg: "#1A56CC", label: "POLITICS" };
  if (tag.includes("securi"))  return { bg: "#E06800", label: "SECURITY" };
  if (tag.includes("health"))  return { bg: "#166534", label: "HEALTH" };
  if (tag.includes("econom"))  return { bg: "#6D28D9", label: "ECONOMY" };
  if (tag.includes("educat"))  return { bg: "#0E7490", label: "EDUCATION" };
  if (tag.includes("sport"))   return { bg: "#065F46", label: "SPORTS" };
  if (tag.includes("opinion")) return { bg: "#374151", label: "OPINION" };
  return { bg: "#CC0000", label: tags[0]?.toUpperCase() || "NEWS" };
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface NewsCardProps {
  post: NewsPost;
  variant?: "default" | "large" | "compact" | "horizontal";
}

export default function NewsCard({ post, variant = "default" }: NewsCardProps) {
  const excerpt = post.excerpt || generateExcerpt(post.content);
  const { bg, label } = getCategoryStyle(post.tags);

  // ── Horizontal (used in Security section list) ────────────────
  if (variant === "horizontal") {
    return (
      <article className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
        {post.image && (
          <div className="relative w-28 h-20 flex-shrink-0 bg-gray-200">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div
            className="font-condensed font-bold text-[9px] tracking-[1.5px] text-white px-2 py-0.5 inline-block mb-1.5"
            style={{ backgroundColor: bg }}
          >
            {label}
          </div>
          <h3 className="font-condensed font-bold text-sm leading-tight mb-1.5 hover:text-[#CC0000] transition-colors">
            <Link href={`/news/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-[11px] text-gray-500">
            <span className="font-semibold" style={{ color: bg }}>{post.author}</span>
            {" • "}
            {timeAgo(post.date)}
          </p>
        </div>
      </article>
    );
  }

  // ── Compact (numbered list style for sidebar) ─────────────────
  if (variant === "compact") {
    return (
      <article className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
        <div
          className="font-condensed font-bold text-[9px] tracking-[1.5px] text-white px-2 py-0.5 inline-block mb-1"
          style={{ backgroundColor: bg }}
        >
          {label}
        </div>
        <h3 className="font-condensed font-bold text-sm leading-snug hover:text-[#CC0000] transition-colors">
          <Link href={`/news/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(post.date)}</p>
      </article>
    );
  }

  // ── Large (2-col grid, has excerpt) ──────────────────────────
  if (variant === "large") {
    return (
      <article className="news-card group">
        {/* Image */}
        <div className="relative h-52 bg-gray-200 overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-400 font-condensed text-xs tracking-widest">NO IMAGE</span>
            </div>
          )}
          {/* Category pill */}
          <div
            className="absolute top-3 left-3 font-condensed font-bold text-[10px] tracking-[1.5px] text-white px-2.5 py-0.5"
            style={{ backgroundColor: bg }}
          >
            {label}
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="news-card__title text-xl mb-2 leading-tight">
            <Link href={`/news/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
            {excerpt}
          </p>
          <p className="text-[11px] text-gray-400">
            By{" "}
            <span className="font-semibold" style={{ color: bg }}>
              {post.author}
            </span>{" "}
            • {timeAgo(post.date)}
          </p>
        </div>
      </article>
    );
  }

  // ── Default card ──────────────────────────────────────────────
  return (
    <article className="news-card group">
      {/* Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 font-condensed text-[10px] tracking-widest">NO IMAGE</span>
          </div>
        )}
        <div
          className="absolute top-2.5 left-2.5 font-condensed font-bold text-[9px] tracking-[1.5px] text-white px-2 py-0.5"
          style={{ backgroundColor: bg }}
        >
          {label}
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <h3 className="news-card__title text-[15px] mb-1.5 leading-snug">
          <Link href={`/news/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-[11px] text-gray-400">
          <span className="font-semibold" style={{ color: bg }}>{post.author}</span>
          {" • "}
          {timeAgo(post.date)}
        </p>
      </div>
    </article>
  );
}
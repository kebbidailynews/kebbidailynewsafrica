'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  tags: string[];
};

type Props = {
  posts: Post[];
  title: string;
};

// Helper: Convert author name to slug
function getAuthorSlug(author: string): string {
  return author
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Helper: generate excerpt
function generateExcerpt(content: string, maxLength = 160) {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const slice = trimmed.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  return slice.slice(0, lastSpace) + "...";
}

export default function ScrollMorphGrid({ posts, title }: Props) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'rows' | 'masonry' | 'columns'>('grid');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      // Calculate scroll progress through this section
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + sectionHeight)
      ));

      // Change layout based on scroll progress
      if (scrollProgress < 0.25) {
        setLayoutMode('grid');
      } else if (scrollProgress < 0.5) {
        setLayoutMode('rows');
      } else if (scrollProgress < 0.75) {
        setLayoutMode('masonry');
      } else {
        setLayoutMode('columns');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[120vh]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 bg-blue-700 rounded-full" />
          <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            {title}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
        </div>
        
        {/* Layout Indicator */}
        <div className="hidden md:flex gap-2 items-center bg-gray-100 px-4 py-2 rounded-full">
          <span className="text-xs font-semibold text-gray-600">LAYOUT:</span>
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full transition-colors ${layoutMode === 'grid' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${layoutMode === 'rows' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${layoutMode === 'masonry' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${layoutMode === 'columns' ? 'bg-blue-600' : 'bg-gray-300'}`} />
          </div>
        </div>
      </div>

      <div className="relative">
        {layoutMode === 'grid' && <GridLayout posts={posts} />}
        {layoutMode === 'rows' && <RowsLayout posts={posts} />}
        {layoutMode === 'masonry' && <MasonryLayout posts={posts} />}
        {layoutMode === 'columns' && <ColumnsLayout posts={posts} />}
      </div>
    </section>
  );
}

// =========================
// Layout Components
// =========================

function GridLayout({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {posts.map((post, i) => (
        <Link
          key={post.slug}
          href={`/news/${post.slug}`}
          className="block group"
        >
          <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            {post.image ? (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  #{i + 1}
                </div>
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-white text-6xl font-black opacity-20">KDN</span>
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
              {post.tags[0] && (
                <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                  {post.tags[0]}
                </span>
              )}
              <h3 className="font-bold text-lg group-hover:text-blue-700 transition mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                {post.excerpt || generateExcerpt(post.content)}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Link
                  href={`/author/${getAuthorSlug(post.author)}`}
                  className="hover:text-red-700 hover:underline"
                >
                  {post.author}
                </Link>
                <span>•</span>
                <time suppressHydrationWarning>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

function RowsLayout({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {posts.map((post, i) => (
        <Link
          key={post.slug}
          href={`/news/${post.slug}`}
          className="block group"
        >
          <article className="flex gap-6 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex-shrink-0">
              <div className="text-5xl font-black text-gray-200 w-16 text-center">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
            
            {post.image && (
              <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            )}
            
            <div className="flex-1">
              {post.tags[0] && (
                <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                  {post.tags[0]}
                </span>
              )}
              <h3 className="text-2xl font-bold group-hover:text-blue-700 transition mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {post.excerpt || generateExcerpt(post.content)}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Link
                  href={`/author/${getAuthorSlug(post.author)}`}
                  className="font-semibold hover:text-red-700 hover:underline"
                >
                  {post.author}
                </Link>
                <span>•</span>
                <time suppressHydrationWarning>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

function MasonryLayout({ posts }: { posts: Post[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 animate-fadeIn">
      {posts.map((post, i) => (
        <Link
          key={post.slug}
          href={`/news/${post.slug}`}
          className="block group mb-6 break-inside-avoid"
        >
          <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            {post.image && (
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {post.tags[0] && (
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                    {post.tags[0]}
                  </span>
                )}
                <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
              </div>
              <h3 className="font-bold text-lg group-hover:text-blue-700 transition mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {post.excerpt || generateExcerpt(post.content, 120)}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Link
                  href={`/author/${getAuthorSlug(post.author)}`}
                  className="hover:text-red-700 hover:underline"
                >
                  {post.author}
                </Link>
                <span>•</span>
                <time suppressHydrationWarning>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

function ColumnsLayout({ posts }: { posts: Post[] }) {
  // Split posts into 3 columns
  const columns = [
    posts.filter((_, i) => i % 3 === 0),
    posts.filter((_, i) => i % 3 === 1),
    posts.filter((_, i) => i % 3 === 2),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      {columns.map((columnPosts, colIndex) => (
        <div key={colIndex} className="space-y-6">
          {columnPosts.map((post, i) => {
            const originalIndex = i * 3 + colIndex;
            return (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="block group"
              >
                <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  {post.image && (
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded">
                        #{originalIndex + 1}
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    {post.tags[0] && (
                      <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                        {post.tags[0]}
                      </span>
                    )}
                    <h3 className="font-bold text-base group-hover:text-blue-700 transition mb-2 line-clamp-3">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="truncate">{post.author}</span>
                      <span>•</span>
                      <time suppressHydrationWarning>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
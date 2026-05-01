"use client";

import { useEffect, useRef, useState } from "react";
import NewsCard from "@/components/NewsCard";

const PAGE_SIZE = 9;

export default function InfiniteFeed({ posts }: { posts: any[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = () => setVisible((v) => v + PAGE_SIZE);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, visible).map((post) => (
          <NewsCard key={post.slug} post={post} />
        ))}
      </div>

      <div ref={loaderRef} className="h-10 flex justify-center mt-10">
        {visible < posts.length ? (
          <p className="text-gray-500 text-sm">Loading more stories...</p>
        ) : (
          <p className="text-gray-400 text-sm">No more stories</p>
        )}
      </div>
    </>
  );
}
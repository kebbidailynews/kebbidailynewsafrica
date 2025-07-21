import { getAllPosts, getPostBySlug, type NewsPost } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { notFound } from "next/navigation";
import slugify from "slugify";

// Generate static paths
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();

    return posts.map((post) => ({
      slug: slugify(post.slug || post.title, {
        lower: true,
        strict: true,
      }),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Page component
export default async function NewsPost({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const allPosts = await getAllPosts();

    // Match sanitized slug to actual post
    const matchedPost = allPosts.find((p) =>
      slugify(p.slug || p.title, { lower: true, strict: true }) === params.slug
    );

    if (!matchedPost) {
      throw new Error("Post not found");
    }

    const post: NewsPost = await getPostBySlug(matchedPost.slug);

    return (
      <article className="prose prose-lg max-w-3xl mx-auto">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg mb-6"
          />
        )}
        <h1>{post.title}</h1>
        <p className="text-gray-500">
          By {post.author} on {new Date(post.date).toDateString()}
        </p>
        <p className="text-gray-600 italic">{post.summary}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        {post.content ? (
          <MDXRemote source={post.content} />
        ) : (
          <p>No content available</p>
        )}
      </article>
    );
  } catch (error) {
    console.error("Rendering error:", error);
    notFound();
  }
}

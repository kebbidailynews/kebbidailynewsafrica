import { getAllPosts, getPostBySlug, type NewsPost } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function NewsPost({ params }: { params: { slug: string } }) {
  try {
    const post: NewsPost = await getPostBySlug(params.slug);
    console.log(`Rendering post: ${post.slug}, Content: ${post.content.slice(0, 100)}...`);
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
        <p className="text-gray-500">By {post.author} on {new Date(post.date).toDateString()}</p>
        <p className="text-gray-600 italic">{post.summary}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
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
    notFound();
  }
}
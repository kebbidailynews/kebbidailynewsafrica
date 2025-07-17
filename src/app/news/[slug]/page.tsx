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
        <p className="text-gray-500">{new Date(post.date).toDateString()}</p>
        <MDXRemote source={post.content} />
      </article>
    );
  } catch (error) {
    notFound();
  }
}
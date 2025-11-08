// components/Sidebar.tsx
import { getAllPosts } from "@/lib/markdown";

export default async function Sidebar() {
  const posts = await getAllPosts();
  const mostRead = posts.slice(0, 5);

  return (
    <aside className="space-y-6">
      {/* Ad Block */}
      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
        ADVERTISEMENT
      </div>

      {/* Most Read */}
      <div>
        <h3 className="text-xl font-black uppercase text-red-700 border-b-2 border-red-700 pb-1 mb-4">
          MOST READ
        </h3>
        <ol className="space-y-3">
          {mostRead.map((post, i) => (
            <li key={post.slug} className="flex items-start space-x-2">
              <span className="text-2xl font-bold text-gray-400">{i + 1}</span>
              <a href={`/news/${post.slug}`} className="text-sm font-medium hover:text-red-700 line-clamp-2">
                {post.title}
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* Newsletter */}
      <div className="bg-red-700 text-white p-6 rounded-lg">
        <h3 className="font-black text-lg uppercase">Stay Informed</h3>
        <p className="text-sm mt-1">Get daily Kebbi news in your inbox</p>
        <input
          type="email"
          placeholder="Enter email"
          className="w-full mt-3 px-3 py-2 rounded text-gray-900"
        />
        <button className="w-full mt-2 bg-white text-red-700 font-bold py-2 rounded uppercase">
          Subscribe
        </button>
      </div>
    </aside>
  );
}
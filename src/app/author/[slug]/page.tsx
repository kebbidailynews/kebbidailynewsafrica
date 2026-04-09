// app/author/[slug]/page.tsx
import { getPostsByAuthor } from "@/lib/markdown";
import NewsCard from "@/components/NewsCard";
import Image from "next/image";
import { notFound } from "next/navigation";

// ==============================
// Author Type
// ==============================
type Author = {
  name: string;
  bio: string;
  image?: string;
  role?: string;
  twitter?: string;
  linkedin?: string;
  expertise?: string[];
  location?: string;
  education?: string;
};

// ==============================
// Author Database
// ==============================
const AUTHOR_INFO: Record<string, Author> = {
  "ekemini-thompson": {
    name: "Ekemini Thompson",
    bio: "Ekemini Thompson is an AI Research Engineer focused on artificial general intelligence (AGI) and a seasoned journalist covering politics, governance, and technology.",
    image: "/images/authors/ekemini-thompson.jpg",
    role: "AI Research Engineer & Senior Political Correspondent",
    twitter: "https://twitter.com/KaemzyThompson",
    linkedin: "https://linkedin.com/in/ekemini-thompson",
    expertise: ["Artificial Intelligence", "Politics", "Governance", "Technology"],
    location: "Nigeria",
    education: "Computer Science",
  },
};

// ==============================
// Helpers
// ==============================
function formatName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

function getDefaultRole(postsCount: number) {
  if (postsCount > 20) return "Senior Correspondent";
  if (postsCount > 5) return "Staff Writer";
  return "Contributor";
}

function getDefaultBio(name: string) {
  return `${name} is a contributor to Kebbi Daily News, reporting on politics, society, and breaking news across Nigeria.`;
}

// ==============================
// Page
// ==============================
export default async function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {
  const authorSlug = params.slug.toLowerCase().trim();
  const posts = await getPostsByAuthor(authorSlug);
  const author = AUTHOR_INFO[authorSlug];

  if (posts.length === 0 && !author) {
    notFound();
  }

  const displayName = author?.name || formatName(authorSlug);
  const role = author?.role || getDefaultRole(posts.length);
  const bio = author?.bio || getDefaultBio(displayName);

  // ==============================
  // E-E-A-T STRUCTURED DATA
  // ==============================
  const sameAs = [
    author?.twitter,
    author?.linkedin,
  ].filter(Boolean);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    url: `https://kebbidailynews.com/author/${authorSlug}`,
    image: author?.image
      ? `https://kebbidailynews.com${author.image}`
      : undefined,
    description: bio,
    jobTitle: role,
    worksFor: {
      "@type": "NewsMediaOrganization",
      name: "Kebbi Daily News",
      url: "https://kebbidailynews.com",
    },
    ...(sameAs.length && { sameAs }),

    // 🔥 E-E-A-T Enhancers
    ...(author?.expertise && {
      knowsAbout: author.expertise,
    }),
    ...(author?.location && {
      homeLocation: {
        "@type": "Place",
        name: author.location,
      },
    }),
    ...(author?.education && {
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: author.education,
      },
    }),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* ==============================
            AUTHOR HEADER
        ============================== */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start bg-white border border-gray-100 rounded-3xl p-10 mb-16 shadow-sm">
          
          {/* Avatar */}
          <div className="flex-shrink-0">
            {author?.image ? (
              <Image
                src={author.image}
                alt={displayName}
                width={210}
                height={210}
                className="rounded-2xl object-cover shadow-lg border-4 border-white"
                priority
              />
            ) : (
              <div className="w-[210px] h-[210px] bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-5xl font-bold text-red-700 border-4 border-white shadow-lg">
                {getInitials(displayName)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {displayName}
            </h1>

            <p className="text-red-700 font-semibold text-2xl mb-4">
              {role}
            </p>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-6">
              {bio}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 justify-center md:justify-start mb-6">
              {author?.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  className="text-blue-500 font-medium hover:underline"
                >
                  Twitter
                </a>
              )}
              {author?.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  className="text-blue-700 font-medium hover:underline"
                >
                  LinkedIn
                </a>
              )}
            </div>

            {/* Expertise Tags */}
            {author?.expertise && (
              <div className="flex flex-wrap gap-2 mb-6">
                {author.expertise.map((item) => (
                  <span
                    key={item}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-full text-sm text-gray-600 font-medium">
              <span>{posts.length}</span>
              <span>
                article{posts.length !== 1 ? "s" : ""} published
              </span>
            </div>
          </div>
        </div>

        {/* ==============================
            ARTICLES
        ============================== */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
            <span className="w-3 h-9 bg-red-700 rounded"></span>
            Latest Articles by {displayName.split(" ")[0]}
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <p className="text-xl text-gray-500">
              No articles published by this author yet.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

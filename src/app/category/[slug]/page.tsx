// app/category/[slug]/page.tsx
import { getAllPosts } from "@/lib/markdown";
import NewsCard from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

const CATEGORY_MAP: Record<string, { label: string; color: string; description: string; keywords: string }> = {
  politics:  {
    label: "Politics",
    color: "#003366",
    description: "Coverage of Kebbi State government, elected officials, and political developments.",
    keywords: "Kebbi politics, APC, PDP, Governor Kebbi, State Assembly, local government elections",
  },
  security:  {
    label: "Security",
    color: "#8B0000",
    description: "Security updates, armed forces operations, and safety news across Kebbi State.",
    keywords: "Kebbi security, banditry, police, military, community safety, vigilante",
  },
  health:    {
    label: "Health",
    color: "#006837",
    description: "Healthcare news, medical developments, and wellness stories from Kebbi State.",
    keywords: "Kebbi health, hospitals, disease outbreak, vaccination, maternal health",
  },
  economy:   {
    label: "Economy",
    color: "#1A5490",
    description: "Business, agriculture, trade, and economic policy news from Kebbi State.",
    keywords: "Kebbi economy, agriculture, rice farming, trade, business, investment",
  },
  education: {
    label: "Education",
    color: "#2F5496",
    description: "Schools, universities, scholarships, and education policy in Kebbi State.",
    keywords: "Kebbi education, schools, universities, teachers, students, literacy",
  },
  sports:    {
    label: "Sports",
    color: "#004225",
    description: "Football, athletics, and all sporting news from Kebbi State.",
    keywords: "Kebbi sports, football, Kebbi United, athletics, sports development",
  },
  opinion:   {
    label: "Opinion",
    color: "#4A4A4A",
    description: "Editorials, op-eds, and analysis from Kebbi Daily News contributors.",
    keywords: "Kebbi opinion, editorials, analysis, commentary, perspectives",
  },
};

// Decode URL slug (handles %20, %E2%80%99, etc.) and normalise to lowercase
function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw).toLowerCase().trim();
  } catch {
    return raw.toLowerCase().trim();
  }
}

// Build a human-readable label from any slug ("the great fragmentation" → "The Great Fragmentation")
function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function getCategoryInfo(rawSlug: string) {
  const decoded = decodeSlug(rawSlug);
  if (CATEGORY_MAP[decoded]) return CATEGORY_MAP[decoded];
  return {
    label: toTitleCase(decoded),
    color: "#CC0000",
    description: `Latest ${toTitleCase(decoded)} news and updates from Kebbi State, Nigeria.`,
    keywords: `Kebbi ${decoded}, Kebbi State ${decoded}, Nigeria ${decoded}`,
  };
}

// Match a post tag against the decoded slug — handles spaces, case, partial matches
function tagMatchesSlug(tag: string, decoded: string): boolean {
  const t = tag.toLowerCase().trim();
  return t === decoded || t.includes(decoded) || decoded.includes(t);
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    const tags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag.toLowerCase().trim())));
    // Encode tags so Next.js can match them properly
    return Array.from(tags).map((tag) => ({ slug: encodeURIComponent(tag) }));
  } catch {
    return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const decoded = decodeSlug(params.slug);
  const cat = getCategoryInfo(params.slug);
  const baseUrl = "https://kebbidailynews.com";

  try {
    const posts = await getAllPosts();
    const filtered = posts.filter((p) => p.tags.some((t) => tagMatchesSlug(t, decoded)));
    const latestDate = filtered[0] ? new Date(filtered[0].date) : new Date();

    return {
      title: `${cat.label} News — Latest Updates from Kebbi State | Kebbi Daily News`,
      description: cat.description,
      keywords: cat.keywords,
      alternates: { canonical: `${baseUrl}/category/${encodeURIComponent(decoded)}` },
      openGraph: {
        title: `${cat.label} News — Kebbi Daily News`,
        description: cat.description,
        url: `${baseUrl}/category/${encodeURIComponent(decoded)}`,
        siteName: "Kebbi Daily News",
        type: "website",
        locale: "en_NG",
        images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: `${cat.label} News` }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${cat.label} News — Kebbi Daily News`,
        description: cat.description,
        images: [`${baseUrl}/og-image.jpg`],
      },
      other: {
        "DC.date.issued": latestDate.toISOString().split("T")[0],
        dateModified: latestDate.toISOString(),
      },
    };
  } catch {
    return { title: `${cat.label} — Kebbi Daily News`, description: cat.description };
  }
}

function generateExcerpt(content: string, maxLength = 160): string {
  const stripped = content.replace(/#{1,6}\s/g, "").replace(/\*\*/g, "").trim();
  if (stripped.length <= maxLength) return stripped;
  const slice = stripped.slice(0, maxLength);
  return slice.slice(0, slice.lastIndexOf(" ")) + "...";
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const decoded = decodeSlug(params.slug);
  const cat = getCategoryInfo(params.slug);

  const allPosts = await getAllPosts();
  const filtered = allPosts.filter((p) => p.tags.some((t) => tagMatchesSlug(t, decoded)));

  if (filtered.length === 0) notFound();

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.label} News - Kebbi Daily News`,
    description: cat.description,
    url: `https://kebbidailynews.com/category/${encodeURIComponent(decoded)}`,
    inLanguage: "en-NG",
    isPartOf: { "@type": "WebSite", name: "Kebbi Daily News", url: "https://kebbidailynews.com" },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Kebbi Daily News",
      url: "https://kebbidailynews.com",
      foundingDate: "2024",
      areaServed: "Kebbi State, Nigeria",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: filtered.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://kebbidailynews.com/news/${post.slug}`,
        name: post.title,
        description: post.excerpt || generateExcerpt(post.content),
        datePublished: new Date(post.date).toISOString(),
        author: { "@type": "Person", name: post.author },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://kebbidailynews.com" },
        { "@type": "ListItem", position: 2, name: cat.label, item: `https://kebbidailynews.com/category/${encodeURIComponent(decoded)}` },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />

      {/* Category accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: cat.color }} />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <ol className="flex items-center gap-2 text-[10px] font-condensed font-bold tracking-[2px] uppercase text-gray-400">
            <li><Link href="/" className="hover:text-[#CC0000] transition-colors">Home</Link></li>
            <li className="text-gray-300">›</li>
            <li style={{ color: cat.color }}>{cat.label}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-14">

        {/* Category header */}
        <div className="mb-8 border-t-4 pt-5" style={{ borderColor: cat.color }}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-2">
            <div>
              <h1
                className="font-condensed font-black text-5xl uppercase leading-none tracking-tight"
                style={{ color: cat.color }}
              >
                {cat.label}
              </h1>
              <p className="text-gray-500 text-sm mt-2">{cat.description}</p>
            </div>
            <span
              className="font-condensed font-black text-[10px] tracking-[2px] uppercase text-white px-4 py-2 self-start sm:self-auto flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            >
              {filtered.length} {filtered.length === 1 ? "Story" : "Stories"}
            </span>
          </div>
          {filtered[0] && (
            <p className="text-[10px] text-gray-400 font-condensed tracking-wide mt-3">
              Last updated:{" "}
              {new Date(filtered[0].date).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Content */}
          <div className="lg:col-span-8">

            {/* Featured story */}
            {featured && (
              <div className="mb-10">
                <article className="bg-white border border-gray-200 overflow-hidden">
                  {featured.image && (
                    <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                      <Link href={`/news/${featured.slug}`}>
                        <Image
                          src={featured.image}
                          alt={featured.title}
                          fill
                          className="object-cover hover:opacity-90 transition-opacity"
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: cat.color }} />
                      </Link>
                      {/* Category pill on image */}
                      <div
                        className="absolute top-3 left-3 font-condensed font-black text-[10px] tracking-[2px] uppercase text-white px-3 py-1"
                        style={{ backgroundColor: cat.color }}
                      >
                        Featured
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    <h2 className="font-condensed font-black text-2xl sm:text-3xl leading-tight text-gray-900 mb-3 hover:text-[#CC0000] transition-colors">
                      <Link href={`/news/${featured.slug}`}>{featured.title}</Link>
                    </h2>

                    {(featured.excerpt || featured.content) && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                        {featured.excerpt || generateExcerpt(featured.content)}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-gray-400 border-t border-gray-100 pt-4">
                      <span>By</span>
                      <span className="font-bold" style={{ color: cat.color }}>{featured.author}</span>
                      <span className="text-gray-200">|</span>
                      <time>{new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                      <Link
                        href={`/news/${featured.slug}`}
                        className="ml-auto font-condensed font-black text-[9px] tracking-[2px] uppercase text-white px-4 py-1.5 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: cat.color }}
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* Rest of stories */}
            {rest.length > 0 && (
              <div>
                <div className="section-header" style={{ borderColor: cat.color }}>
                  <h2 className="font-condensed font-black text-xl uppercase" style={{ color: cat.color }}>
                    More {cat.label} Stories
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {rest.map((post) => (
                    <NewsCard key={post.slug} post={post} variant="large" />
                  ))}
                </div>
              </div>
            )}

            {filtered.length > 12 && (
              <p className="text-center text-gray-400 font-condensed text-xs tracking-wide mt-10 pt-6 border-t border-gray-100 uppercase">
                Showing all {filtered.length} stories • Check back daily for updates
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-5">

              {/* Trending in category */}
              {rest.length > 0 && (
                <div className="sidebar-widget">
                  <div
                    className="font-condensed font-black text-[10px] tracking-[2px] uppercase text-white px-3 py-2.5"
                    style={{ backgroundColor: cat.color }}
                  >
                    Trending in {cat.label}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {rest.slice(0, 5).map((p, i) => (
                      <div key={p.slug} className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors">
                        <span className="trending-num">{i + 1}</span>
                        <Link
                          href={`/news/${p.slug}`}
                          className="text-[13px] font-semibold text-gray-800 leading-snug hover:text-[#CC0000] transition-colors line-clamp-3"
                        >
                          {p.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="sidebar-widget border-t-4" style={{ borderColor: cat.color }}>
                <div className="p-4">
                  <h3 className="font-condensed font-black text-base uppercase text-gray-900 mb-1">
                    Stay Updated on {cat.label}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    Get the latest {cat.label.toLowerCase()} news delivered to your inbox.
                  </p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-200 text-sm mb-2 focus:outline-none focus:border-gray-400"
                  />
                  <button
                    className="w-full text-white font-condensed font-black text-xs py-2.5 tracking-[2px] uppercase hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: cat.color }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Ad slot */}
              <div className="sidebar-widget">
                <div className="sidebar-widget__head">Advertisement</div>
                <div className="ad-slot h-[250px]"><span>300 × 250</span></div>
              </div>

              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
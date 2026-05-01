// app/category/[slug]/page.tsx
import { getAllPosts } from "@/lib/markdown";
import NewsCard from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image"; // Added for better image optimization

const CATEGORY_MAP: Record<string, { label: string; color: string; description: string; keywords: string }> = {
  politics:  { 
    label: "Politics",  
    color: "#1A56CC", 
    description: "Coverage of Kebbi State government, elected officials, and political developments.",
    keywords: "Kebbi politics, APC, PDP, Governor Kebbi, State Assembly, local government elections"
  },
  security:  { 
    label: "Security",  
    color: "#E06800", 
    description: "Security updates, armed forces operations, and safety news across Kebbi State.",
    keywords: "Kebbi security, banditry, police, military, community safety, vigilante"
  },
  health:    { 
    label: "Health",    
    color: "#166534", 
    description: "Healthcare news, medical developments, and wellness stories from Kebbi State.",
    keywords: "Kebbi health, hospitals, disease outbreak, vaccination, maternal health"
  },
  economy:   { 
    label: "Economy",   
    color: "#6D28D9", 
    description: "Business, agriculture, trade, and economic policy news from Kebbi State.",
    keywords: "Kebbi economy, agriculture, rice farming, trade, business, investment"
  },
  education: { 
    label: "Education", 
    color: "#0E7490", 
    description: "Schools, universities, scholarships, and education policy in Kebbi State.",
    keywords: "Kebbi education, schools, universities, teachers, students, literacy"
  },
  sports:    { 
    label: "Sports",    
    color: "#065F46", 
    description: "Football, athletics, and all sporting news from Kebbi State.",
    keywords: "Kebbi sports, football, Kebbi United, athletics, sports development"
  },
  opinion:   { 
    label: "Opinion",   
    color: "#374151", 
    description: "Editorials, op-eds, and analysis from Kebbi Daily News contributors.",
    keywords: "Kebbi opinion, editorials, analysis, commentary, perspectives"
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
}

// Improved metadata generation
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = params.slug.toLowerCase();
  const cat = CATEGORY_MAP[category];
  
  if (!cat) return {};
  
  const baseUrl = "https://kebbidailynews.com";
  const posts = await getAllPosts();
  const filtered = posts.filter((post) =>
    post.tags.some((tag) => tag.toLowerCase().includes(category))
  );
  
  const latestDate = filtered[0] ? new Date(filtered[0].date) : new Date();
  
  return {
    title: `${cat.label} News — Latest Updates from Kebbi State | Kebbi Daily News`,
    description: cat.description,
    keywords: cat.keywords,
    alternates: {
      canonical: `${baseUrl}/category/${category}`,
    },
    openGraph: {
      title: `${cat.label} News — Kebbi Daily News`,
      description: cat.description,
      url: `${baseUrl}/category/${category}`,
      siteName: "Kebbi Daily News",
      type: "website",
      locale: "en_NG",
      images: [
        {
          url: `${baseUrl}/og-category-${category}.jpg`, // Create category-specific OG images
          width: 1200,
          height: 630,
          alt: `${cat.label} News from Kebbi State`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.label} News — Kebbi Daily News`,
      description: cat.description,
      images: [`${baseUrl}/og-category-${category}.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      languages: {
        'en-US': `${baseUrl}/category/${category}`,
        'en-NG': `${baseUrl}/category/${category}`,
      },
    },
    other: {
      'DC.date.issued': latestDate.toISOString().split('T')[0],
      'dateModified': latestDate.toISOString(),
    },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = params.slug.toLowerCase();
  const cat = CATEGORY_MAP[category];

  if (!cat) notFound();

  const allPosts = await getAllPosts();
  const filtered = allPosts.filter((post) =>
    post.tags.some((tag) => tag.toLowerCase().includes(category))
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);
  
  // Get latest posts for sidebar trending
  const latestPosts = allPosts.slice(0, 5);

  // Enhanced schema for better SEO
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.label} News - Kebbi Daily News`,
    description: cat.description,
    url: `https://kebbidailynews.com/category/${category}`,
    inLanguage: "en-NG",
    isPartOf: {
      "@type": "WebSite",
      name: "Kebbi Daily News",
      url: "https://kebbidailynews.com",
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Kebbi Daily News",
      url: "https://kebbidailynews.com",
      foundingDate: "2024",
      areaServed: "Kebbi State, Nigeria",
      sameAs: [
        "https://facebook.com/kebbidailynews",
        "https://twitter.com/kebbidailynews",
        // Add your social media URLs
      ],
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
        author: {
          "@type": "Person",
          name: post.author,
        },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://kebbidailynews.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: cat.label,
          item: `https://kebbidailynews.com/category/${category}`,
        },
      ],
    },
  };

  function generateExcerpt(content: string, maxLength = 160): string {
    const stripped = content.replace(/#{1,6}\s/g, "").replace(/\*\*/g, "").trim();
    if (stripped.length <= maxLength) return stripped;
    const slice = stripped.slice(0, maxLength);
    return slice.slice(0, slice.lastIndexOf(" ")) + "...";
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />

      {/* Add breadcrumb navigation */}
      <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <ol className="flex items-center gap-2 text-xs text-gray-600">
            <li>
              <Link href="/" className="hover:text-[#CC0000] transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="font-semibold" style={{ color: cat.color }}>
                {cat.label}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-14">

        {/* Category Header - Improved for mobile */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          {/* Title row - responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-14 flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <div>
                <h1 
                  className="font-condensed font-black text-3xl sm:text-4xl md:text-5xl uppercase leading-none tracking-tight"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </h1>
              </div>
            </div>
            {/* RSS Feed link for category */}
            <Link
              href={`/feed/category/${category}.xml`}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500 hover:text-[#CC0000] transition-colors sm:ml-auto"
              aria-label={`Subscribe to ${cat.label} RSS feed`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20S4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18zM4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
              </svg>
              RSS
            </Link>
          </div>
          
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">{cat.description}</p>

          {/* Article count and meta info */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className="font-condensed font-bold text-[10px] tracking-[2px] uppercase text-white px-3 py-1 inline-block"
              style={{ backgroundColor: cat.color }}
            >
              {filtered.length} {filtered.length === 1 ? "Story" : "Stories"}
            </span>
            {filtered.length > 0 && (
              <span className="text-gray-400 text-xs">
                Last updated: {new Date(filtered[0].date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Empty state - improved */}
        {filtered.length === 0 && (
          <div className="text-center py-16 sm:py-24 bg-white border border-gray-200 rounded-lg">
            <div
              className="font-condensed font-black text-4xl sm:text-6xl mb-4 opacity-10"
              style={{ color: cat.color }}
            >
              {cat.label.toUpperCase()}
            </div>
            <p className="text-gray-500 text-base sm:text-lg mb-6 font-condensed">
              No articles in this category yet.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Check back soon for updates on {cat.label.toLowerCase()} in Kebbi State.
            </p>
            <Link
              href="/"
              className="inline-block text-white font-condensed font-bold text-sm tracking-widest uppercase px-6 sm:px-8 py-3 rounded hover:opacity-90 transition-opacity"
              style={{ backgroundColor: cat.color }}
            >
              ← Back to Homepage
            </Link>
          </div>
        )}

        {/* Content */}
        {filtered.length > 0 && (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">

            {/* Main content */}
            <div className="lg:col-span-8">

              {/* Featured top story - improved for mobile */}
              {featured && (
                <div className="mb-8 sm:mb-10">
                  <div className="section-header mb-3 sm:mb-4" style={{ borderColor: cat.color }}>
                    <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide" style={{ color: cat.color }}>
                      Featured Story
                    </h2>
                  </div>
                  <article className="news-card group flex flex-col sm:flex-row overflow-hidden border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                    {featured.image && (
                      <div className="relative w-full sm:w-72 h-56 sm:h-auto flex-shrink-0 bg-gray-200 overflow-hidden">
                        <Image
                          src={featured.image}
                          alt={featured.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 288px"
                        />
                        <div
                          className="absolute top-3 left-3 font-condensed font-bold text-[9px] tracking-[1.5px] text-white px-2 py-0.5 uppercase rounded"
                          style={{ backgroundColor: cat.color }}
                        >
                          {cat.label}
                        </div>
                      </div>
                    )}
                    <div className="p-4 sm:p-6 flex flex-col justify-center">
                      <h2 className="font-condensed font-black text-xl sm:text-2xl leading-tight mb-3 hover:text-[#CC0000] transition-colors">
                        <Link href={`/news/${featured.slug}`}>{featured.title}</Link>
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {featured.excerpt || generateExcerpt(featured.content)}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[11px] text-gray-500">
                          By{" "}
                          <span className="font-semibold" style={{ color: cat.color }}>
                            {featured.author}
                          </span>
                          <span className="mx-1">•</span>
                          {new Date(featured.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <Link
                          href={`/news/${featured.slug}`}
                          className="text-white font-condensed font-bold text-[10px] tracking-widest uppercase px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: cat.color }}
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Rest of articles grid */}
              {rest.length > 0 && (
                <div>
                  <div className="section-header mb-3 sm:mb-4" style={{ borderColor: cat.color }}>
                    <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide" style={{ color: cat.color }}>
                      More {cat.label} Stories
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {rest.map((post) => (
                      <NewsCard key={post.slug} post={post} variant="large" />
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination hint */}
              {filtered.length > 12 && (
                <div className="text-center mt-10 pt-6 border-t border-gray-200">
                  <p className="text-gray-400 font-condensed text-xs sm:text-sm tracking-wide">
                    Showing {rest.length + 1} of {filtered.length} stories
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Check back daily for latest {cat.label.toLowerCase()} updates
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar - with category-specific content */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Pass category context to sidebar */}
                <Sidebar currentCategory={category} />
                
                {/* Category-specific callout */}
                <div className="bg-gray-50 border-l-4 p-4" style={{ borderLeftColor: cat.color }}>
                  <h3 className="font-bold text-sm mb-1">Stay informed on {cat.label}</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Get the latest {cat.label.toLowerCase()} news delivered to your inbox.
                  </p>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded mb-2"
                  />
                  <button 
                    className="w-full text-white font-bold text-xs py-2 rounded transition-opacity hover:opacity-90"
                    style={{ backgroundColor: cat.color }}
                  >
                    Subscribe to {cat.label} Updates
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
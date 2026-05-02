// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "About Us — Kebbi Daily News",
  description:
    "Kebbi Daily News is an independent digital news platform dedicated to delivering timely, accurate, and impactful journalism from Kebbi State and across Nigeria.",
};

const values = [
  {
    title: "Accuracy & Fact-Checking",
    desc: "Every story is thoroughly researched and verified before publication. We correct mistakes promptly and transparently.",
    color: "#CC0000",
  },
  {
    title: "Independence",
    desc: "We are free from political or commercial influence. Our editorial decisions are made solely in the public interest.",
    color: "#003366",
  },
  {
    title: "Local Focus",
    desc: "We prioritize stories that directly affect Kebbi residents — from Birnin Kebbi to Yauri, Zuru to Argungu.",
    color: "#006837",
  },
  {
    title: "Transparency",
    desc: "We clearly distinguish between news reporting and opinion, and we are open about our sources and methods.",
    color: "#1A5490",
  },
  {
    title: "Speed with Responsibility",
    desc: "Breaking news delivered fast — but never at the expense of truth. We would rather be right than first.",
    color: "#8B0000",
  },
  {
    title: "Community Voice",
    desc: "We amplify the voices of everyday Kebbi citizens, holding leaders accountable and giving communities a platform.",
    color: "#004225",
  },
];

const categories = [
  { name: "Politics",  href: "/category/politics",  color: "#003366" },
  { name: "Security",  href: "/category/security",  color: "#8B0000" },
  { name: "Health",    href: "/category/health",    color: "#006837" },
  { name: "Economy",   href: "/category/economy",   color: "#1A5490" },
  { name: "Education", href: "/category/education", color: "#2F5496" },
  { name: "Sports",    href: "/category/sports",    color: "#004225" },
  { name: "Opinion",   href: "/category/opinion",   color: "#4A4A4A" },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Top red bar ── */}
      <div className="h-1 w-full bg-[#CC0000]" />

      {/* ── Hero ── */}
      <div className="bg-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-bold tracking-[2px] uppercase text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#CC0000] transition-colors">Home</Link>
            <span className="text-gray-700">›</span>
            <span className="text-[#CC0000]">About</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block bg-[#CC0000] text-white font-bold text-[9px] tracking-[3px] uppercase px-3 py-1.5 mb-6">
              Who We Are
            </span>
            <h1 className="font-condensed font-black text-5xl sm:text-6xl md:text-7xl uppercase leading-none tracking-tight text-white mb-6">
              Kebbi<br /><span className="text-[#CC0000]">Daily</span> News
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-2xl">
              An independent digital news platform dedicated to delivering timely, accurate, and impactful
              journalism from Kebbi State and across Nigeria — trusted by thousands of readers since our founding.
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="bg-[#CC0000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { num: "7",    label: "Coverage Sections" },
              { num: "21",   label: "Local Government Areas" },
              { num: "24/7", label: "Breaking News" },
              { num: "2015", label: "Est. Birnin Kebbi" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-condensed font-black text-3xl sm:text-4xl leading-none">{num}</div>
                <div className="font-bold text-[10px] tracking-[2px] uppercase text-red-200 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-8 space-y-14">

            {/* Mission */}
            <section>
              <div className="border-t-4 border-[#CC0000] pt-5 mb-6">
                <h2 className="font-condensed font-black text-4xl uppercase text-[#0a1628] leading-none">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                We exist to <strong className="text-[#0a1628]">inform, educate, and empower</strong> the people of Kebbi State
                by providing reliable news, in-depth analysis, and local stories that matter. Our focus is on
                transparent reporting that holds leaders accountable and amplifies community voices — from the
                state house in Birnin Kebbi to the most remote local government areas.
              </p>
            </section>

            {/* Vision */}
            <section>
              <div className="border-t-4 border-[#003366] pt-5 mb-6">
                <h2 className="font-condensed font-black text-4xl uppercase text-[#0a1628] leading-none">
                  Our Vision
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                To become the most <strong className="text-[#0a1628]">trusted and authoritative news source</strong> in
                Kebbi State — a platform where citizens turn first for breaking news, investigative reports,
                politics, security, economy, education, health, and sports. We envision a Kebbi State where
                every resident has access to quality, independent journalism.
              </p>
            </section>

            {/* Values */}
            <section>
              <div className="border-t-4 border-[#CC0000] pt-5 mb-8">
                <h2 className="font-condensed font-black text-4xl uppercase text-[#0a1628] leading-none">
                  What We Stand For
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {values.map(({ title, desc, color }) => (
                  <div
                    key={title}
                    className="bg-white border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div
                      className="h-1 w-12 mb-4"
                      style={{ backgroundColor: color }}
                    />
                    <h3 className="font-condensed font-black text-lg uppercase text-[#0a1628] mb-2">
                      {title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Coverage */}
            <section>
              <div className="border-t-4 border-[#003366] pt-5 mb-6">
                <h2 className="font-condensed font-black text-4xl uppercase text-[#0a1628] leading-none">
                  What We Cover
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Kebbi Daily News covers the full spectrum of news that matters to Kebbi residents — from
                state government decisions and security developments, to health alerts, economic policy,
                education reforms, and sporting achievements.
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map(({ name, href, color }) => (
                  <Link
                    key={name}
                    href={href}
                    className="font-condensed font-black text-[10px] tracking-[2px] uppercase text-white px-4 py-2 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: color }}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </section>

            {/* Team */}
            <section>
              <div className="border-t-4 border-[#CC0000] pt-5 mb-6">
                <h2 className="font-condensed font-black text-4xl uppercase text-[#0a1628] leading-none">
                  Our Team
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Our team consists of experienced journalists, editors, and contributors who live and work in
                Kebbi State. We are deeply rooted in the communities we cover and are committed to ethical
                journalism that serves the public interest.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                From seasoned reporters covering state government to community correspondents embedded in
                local government areas, every member of our team shares a single purpose: to bring you the
                news that matters most.
              </p>
              <div className="mt-6">
                <Link
                  href="/team"
                  className="inline-block font-condensed font-black text-[10px] tracking-[2px] uppercase text-white bg-[#0a1628] px-6 py-3 hover:bg-[#CC0000] transition-colors"
                >
                  Meet the Team →
                </Link>
              </div>
            </section>

            {/* Editorial policy */}
            <section className="bg-[#0a1628] text-white p-8">
              <div className="border-l-4 border-[#CC0000] pl-6">
                <h2 className="font-condensed font-black text-3xl uppercase leading-none mb-4">
                  Editorial Independence
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Kebbi Daily News operates with full editorial independence. We are not owned by or affiliated
                  with any political party, government body, or commercial interest. Our reporting decisions
                  are made solely by our editorial team based on newsworthiness and public interest.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  We are committed to the highest standards of journalism as outlined in our Editorial Policy,
                  including clear separation of news and opinion, prompt corrections of errors, and protection
                  of sources.
                </p>
                <Link
                  href="/editorial-policy"
                  className="inline-block font-condensed font-black text-[10px] tracking-[2px] uppercase text-white border border-[#CC0000] px-5 py-2.5 hover:bg-[#CC0000] transition-colors"
                >
                  Read Our Editorial Policy →
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">

              {/* Contact card */}
              <div className="border-t-4 border-[#CC0000] bg-white shadow-sm">
                <div className="bg-[#0a1628] px-4 py-3">
                  <h3 className="font-condensed font-black text-sm uppercase text-white tracking-wider">
                    Contact Us
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We welcome tips, feedback, story ideas, and corrections.
                  </p>

                  {[
                    { label: "Editorial & Tips", value: "editor@kebbidailynews.com", href: "mailto:editor@kebbidailynews.com" },
                    { label: "Support",          value: "support@kebbidailynews.com", href: "mailto:support@kebbidailynews.com" },
                    { label: "General",          value: "info@kebbidailynews.com",    href: "mailto:info@kebbidailynews.com" },
                  ].map(({ label, value, href }) => (
                    <div key={label} className="border-l-2 border-[#CC0000] pl-3">
                      <div className="font-bold text-[9px] tracking-[2px] uppercase text-gray-400 mb-0.5">
                        {label}
                      </div>
                      <a
                        href={href}
                        className="text-sm font-semibold text-[#CC0000] hover:underline break-all"
                      >
                        {value}
                      </a>
                    </div>
                  ))}

                  <Link
                    href="/contact"
                    className="block text-center font-condensed font-black text-[10px] tracking-[2px] uppercase text-white bg-[#CC0000] px-4 py-3 hover:opacity-90 transition-opacity mt-2"
                  >
                    Visit Contact Page →
                  </Link>
                </div>
              </div>

              {/* Quick links */}
              <div className="border-t-4 border-[#003366] bg-white shadow-sm">
                <div className="bg-[#0a1628] px-4 py-3">
                  <h3 className="font-condensed font-black text-sm uppercase text-white tracking-wider">
                    Quick Links
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { label: "Our Team",         href: "/team" },
                    { label: "Advertise with Us", href: "/advertise" },
                    { label: "Editorial Policy",  href: "/editorial-policy" },
                    { label: "Careers",           href: "/careers" },
                    { label: "Corrections",       href: "/corrections" },
                    { label: "Privacy Policy",    href: "/privacy-policy" },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:text-[#CC0000] hover:bg-gray-50 transition-colors"
                    >
                      <span>{label}</span>
                      <span className="text-gray-300 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Follow us */}
              <div className="border-t-4 border-[#CC0000] bg-white shadow-sm">
                <div className="bg-[#0a1628] px-4 py-3">
                  <h3 className="font-condensed font-black text-sm uppercase text-white tracking-wider">
                    Follow Kebbi Daily News
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { name: "Facebook",   href: "https://www.facebook.com/kebbidailynews",         bg: "#1877F2" },
                    { name: "Twitter / X",href: "https://www.x.com/kebbidailynews",                bg: "#000000" },
                    { name: "Instagram",  href: "https://www.instagram.com/kebbidailynews",        bg: "#E1306C" },
                    { name: "YouTube",    href: "https://www.youtube.com/@kebbidailynews",         bg: "#FF0000" },
                    { name: "WhatsApp",   href: "https://whatsapp.com/channel/kebbidailynews",     bg: "#25D366" },
                    { name: "LinkedIn",   href: "https://www.linkedin.com/company/kebbidailynews", bg: "#0A66C2" },
                  ].map(({ name, href, bg }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded text-white text-xs font-bold hover:opacity-90 transition-opacity w-full"
                      style={{ backgroundColor: bg }}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="bg-[#0a1628] border-t-4 border-[#CC0000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-condensed font-black text-3xl uppercase text-white leading-none mb-2">
              Stay Informed
            </h2>
            <p className="text-gray-400 text-sm">
              Get breaking news and daily headlines from Kebbi State delivered to your inbox.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/"
              className="font-condensed font-black text-[10px] tracking-[2px] uppercase text-white border border-gray-600 px-5 py-3 hover:border-white transition-colors"
            >
              Read the News
            </Link>
            <Link
              href="/contact"
              className="font-condensed font-black text-[10px] tracking-[2px] uppercase text-white bg-[#CC0000] px-5 py-3 hover:opacity-90 transition-opacity"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
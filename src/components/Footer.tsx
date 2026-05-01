// components/Footer.tsx
import Link from "next/link";

const SECTIONS = [
  {
    title: "News",
    links: [
      { name: "Politics", href: "/category/politics" },
      { name: "Security", href: "/category/security" },
      { name: "Economy", href: "/category/economy" },
      { name: "Health", href: "/category/health" },
      { name: "Education", href: "/category/education" },
      { name: "Sports", href: "/category/sports" },
      { name: "Opinion", href: "/category/opinion" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "About KDN", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Advertise", href: "/advertise" },
      { name: "Contact Us", href: "/contact" },
      { name: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Corrections", href: "/corrections" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="kdn-footer">
      {/* Top divider */}
      <div className="h-1 bg-[#CC0000]" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#CC0000] text-white w-10 h-10 flex items-center justify-center font-black text-xs tracking-widest border border-gray-700">
                KDN
              </div>
              <div className="leading-none">
                <div className="font-condensed font-black text-2xl leading-none text-white">
                  KEBBI<span className="text-[#CC0000]">DAILY</span>
                </div>
                <div className="text-[8px] tracking-[4px] text-gray-600 font-bold">NEWS</div>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              Kebbi Daily News is Kebbi State's most trusted source for breaking news, politics, security, and community stories.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {["Facebook", "Twitter", "YouTube", "WhatsApp"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="bg-gray-800 hover:bg-[#CC0000] text-gray-400 hover:text-white font-condensed font-bold text-[9px] px-2 py-1.5 tracking-wide transition-colors uppercase"
                  aria-label={s}
                >
                  {s.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-condensed font-bold text-xs tracking-[2px] text-white mb-4 uppercase border-b border-gray-800 pb-2">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-[#CC0000] text-xs transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-[11px] font-condensed tracking-wide">
            © {new Date().getFullYear()} Kebbi Daily News. All rights reserved.
          </p>
          <p className="text-gray-700 text-[11px] font-condensed tracking-wide">
            Birnin Kebbi, Kebbi State, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
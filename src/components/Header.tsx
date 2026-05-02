// components/Header.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { name: "HOME", href: "/" },
  { name: "POLITICS", href: "/category/politics" },
  { name: "SECURITY", href: "/category/security" },
  { name: "HEALTH", href: "/category/health" },
  { name: "ECONOMY", href: "/category/economy" },
  { name: "EDUCATION", href: "/category/education" },
  { name: "SPORTS", href: "/category/sports" },
  { name: "OPINION", href: "/category/opinion" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-[#0a1628] text-white sticky top-0 z-50 shadow-2xl">
      {/* Top Red Identity Bar */}

      {/* Main Header Row */}
      <div className="border-b-[3px] border-[#CC0000]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 flex-shrink-0 group"
              onClick={() => setMenuOpen(false)}
            >
              <div className="bg-[#CC0000] text-white w-11 h-11 flex items-center justify-center font-black text-sm border-2 border-white tracking-widest">
                KDN
              </div>
              <div className="leading-none">
                <div className="font-black text-[28px] tracking-[-1px] leading-none font-condensed">
                  <span className="text-white">KEBBI</span>
                  <span className="text-[#CC0000]">DAILY</span>
                </div>
                <div className="text-[9px] tracking-[4px] text-gray-500 font-bold mt-0.5">
                  NEWS
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:block flex-1">
              <ul className="flex items-center">
                {NAV_ITEMS.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        block px-4 py-3 text-[11px] font-black uppercase tracking-[1.5px] transition-colors duration-150
                        ${isActive(item.href)
                          ? "bg-[#CC0000] text-white"
                          : "text-gray-300 hover:bg-[#CC0000] hover:text-white"
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Controls - Live Badge Only */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {/* Live Badge */}
              <div className="flex items-center gap-1.5 bg-[#CC0000] text-white text-[10px] font-black px-3 py-1.5 tracking-[2px] uppercase">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-[#0a1628]">
          <ul className="divide-y divide-gray-800">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    flex items-center px-6 py-4 text-sm font-black uppercase tracking-[1.5px]
                    ${isActive(item.href) ? "text-[#CC0000]" : "text-gray-300"}
                  `}
                >
                  {isActive(item.href) && (
                    <span className="w-1 h-4 bg-[#CC0000] mr-3 flex-shrink-0" />
                  )}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
// components/Header.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Politics", href: "/category/politics" },
  { name: "Security", href: "/category/security" },
  { name: "Health", href: "/category/health" },
  { name: "Economy", href: "/category/economy" },
  { name: "Education", href: "/category/education" },
  { name: "Sports", href: "/category/sports" },
  { name: "Opinion", href: "/category/opinion" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white border-b-4 border-red-700 shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
            onClick={() => setMenuOpen(false)}
          >
            <div className="bg-red-700 text-white w-10 h-10 flex items-center justify-center rounded font-black text-lg">
              KDN
            </div>
            <span className="font-black text-xl md:text-2xl text-gray-900 tracking-tight">
              Kebbi Daily News
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    block px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-200
                    ${isActive(item.href)
                      ? "bg-red-700 text-white"
                      : "text-gray-700 hover:bg-red-700 hover:text-white"
                    }
                  `}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <ul className="py-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      block px-6 py-3 font-bold uppercase text-sm tracking-wider transition
                      ${isActive(item.href)
                        ? "bg-red-700 text-white"
                        : "text-gray-700 hover:bg-red-50"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
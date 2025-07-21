'use client';

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Kebbi Daily News
        </Link>

        {/* Hamburger icon */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6 text-base font-medium">
          <li>
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/privacy-policy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="md:hidden bg-gray-800 px-4 pb-4 space-y-2 text-base font-medium">
          <li>
            <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-gray-300">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-gray-300">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/privacy-policy" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-gray-300">
              Privacy Policy
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}

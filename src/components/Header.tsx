import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white py-4">
      <nav className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Kebbi Daily News
        </Link>
        <ul className="flex space-x-6">
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
    </header>
  );
}
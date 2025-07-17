import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Kebbi Daily News
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-blue-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-blue-300">
                News
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/kebbi-logo.svg" // Replace with your actual logo path
          alt="Kebbi Daily News logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Welcome to{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              Kebbi Daily News
            </code>
            , your trusted source for news across Kebbi State.
          </li>
          <li className="tracking-[-.01em]">
            Stay informed with updates on politics, business, culture, and community stories.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/latest-news" // Replace with actual internal link
          >
            <Image
              className="dark:invert"
              src="/news-icon.svg" // Replace with a relevant icon
              alt="News icon"
              width={20}
              height={20}
            />
            Latest News
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/about-us" // Replace with actual internal link
          >
            About Us
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/contact" // Replace with actual internal link
        >
          <Image
            aria-hidden
            src="/contact.svg" // Replace with a relevant icon
            alt="Contact icon"
            width={16}
            height={16}
          />
          Contact Us
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/categories" // Replace with actual internal link
        >
          <Image
            aria-hidden
            src="/categories.svg" // Replace with a relevant icon
            alt="Categories icon"
            width={16}
            height={16}
          />
          Browse Categories
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://kebbidailynews.com" // Your official site link
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Website icon"
            width={16}
            height={16}
          />
          Visit Our Website →
        </a>
      </footer>
    </div>
  );
}

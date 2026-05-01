// app/team/page.tsx

export default function TeamPage() {
  return (
    <article className="prose prose-lg max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Team</h1>
      <p className="text-gray-500 mb-8">Last updated: April 09, 2026</p>

      <p>
        The team behind <strong>Kebbi Daily News</strong> is dedicated to delivering accurate, timely, and impactful stories.
      </p>

      <h2>Editorial Team</h2>
      <p>
        Our editorial team leads news coverage, investigations, and ensures all content meets our standards for accuracy and fairness.
      </p>

      <h2>Contributors</h2>
      <p>
        We work with a network of writers and analysts who provide insights, opinions, and expert perspectives.
      </p>

      <h2>Digital Team</h2>
      <p>
        Our digital team manages publishing, website performance, and audience engagement.
      </p>

      <h2>Join Us</h2>
      <p>
        Interested in being part of our team? Visit our{" "}
        <a href="/careers" className="text-red-700 hover:underline">
          Careers page
        </a>{" "}
        to learn more.
      </p>

      <p className="text-sm text-gray-500 mt-12">
        We are committed to building a trusted news platform for Kebbi and beyond.
      </p>
    </article>
  );
}
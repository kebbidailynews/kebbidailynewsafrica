// app/about/page.tsx
export default function About() {
  return (
    <article className="prose prose-lg max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About Kebbi Daily News
        </h1>
        <p className="text-gray-500 text-lg">
          Last updated: April 09, 2026
        </p>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-xl leading-relaxed text-gray-700">
          Kebbi Daily News is an independent digital news platform dedicated to delivering timely, accurate, 
          and impactful journalism from Kebbi State and across Nigeria.
        </p>

        <h2 className="text-3xl font-semibold text-gray-900 mt-12">Our Mission</h2>
        <p>
          We exist to inform, educate, and empower the people of Kebbi State by providing reliable news, 
          in-depth analysis, and local stories that matter. Our focus is on transparent reporting that 
          holds leaders accountable and amplifies community voices.
        </p>

        <h2 className="text-3xl font-semibold text-gray-900 mt-12">Our Vision</h2>
        <p>
          To become the most trusted and authoritative news source in Kebbi State — a platform where 
          citizens turn first for breaking news, investigative reports, politics, security, economy, 
          education, health, and sports.
        </p>

        <h2 className="text-3xl font-semibold text-gray-900 mt-12">What We Stand For</h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700">
          <li><strong>Accuracy &amp; Fact-Checking:</strong> Every story is thoroughly researched and verified.</li>
          <li><strong>Independence:</strong> We are free from political or commercial influence.</li>
          <li><strong>Local Focus:</strong> We prioritize stories that directly affect Kebbi residents.</li>
          <li><strong>Transparency:</strong> We clearly distinguish between news reporting and opinion.</li>
          <li><strong>Speed with Responsibility:</strong> Breaking news delivered fast, but never at the expense of truth.</li>
        </ul>

        <h2 className="text-3xl font-semibold text-gray-900 mt-12">Our Team</h2>
        <p>
          Our team consists of experienced journalists, editors, and contributors who live and work in 
          Kebbi State. We are deeply rooted in the communities we cover and are committed to ethical 
          journalism that serves the public interest.
        </p>

        <h2 className="text-3xl font-semibold text-gray-900 mt-12">Contact Us</h2>
        <p>
          We welcome tips, feedback, story ideas, and corrections. Feel free to reach out to us through any of the following channels:
        </p>
        <div className="bg-gray-50 p-8 rounded-2xl mt-6">
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3">
              <strong className="text-red-700 w-28">Email:</strong> 
              <a href="mailto:editor@kebbidailynews.com" className="text-red-700 hover:underline">
                editor@kebbidailynews.com
              </a> (Editorial &amp; News Tips)
            </li>
            <li className="flex items-start gap-3">
              <strong className="text-red-700 w-28">Support:</strong> 
              <a href="mailto:support@kebbidailynews.com" className="text-red-700 hover:underline">
                support@kebbidailynews.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <strong className="text-red-700 w-28">General Inquiries:</strong> 
              info@kebbidailynews.com
            </li>
            <li className="flex items-start gap-3">
              <strong className="text-red-700 w-28">Visit:</strong> 
              <a href="/contact" className="text-red-700 hover:underline">Contact Page</a>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 mt-16 border-t pt-8">
          Kebbi Daily News is committed to the highest standards of journalism as outlined in our 
          <a href="/editorial-policy" className="text-red-700 hover:underline"> Editorial Policy</a>.
        </p>
      </div>
    </article>
  );
}
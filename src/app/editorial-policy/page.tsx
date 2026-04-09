// app/editorial-policy/page.tsx
export default function EditorialPolicy() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto py-8 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Editorial Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: April 09, 2026</p>

      <p>
        At <strong>Kebbi Daily News</strong>, we are committed to delivering accurate, fair, and independent journalism focused on Kebbi State and Nigeria.
        Our editorial policy outlines the standards we uphold to maintain trust with our readers.
      </p>

      <h2>Our Commitment</h2>
      <ul>
        <li>We prioritize truth, accuracy, and fairness in all our reporting.</li>
        <li>We clearly distinguish between news reporting and opinion pieces.</li>
        <li>We correct errors promptly and transparently.</li>
        <li>We maintain independence from political, commercial, or external influences.</li>
      </ul>

      <h2>Accuracy and Fact-Checking</h2>
      <p>
        All stories are thoroughly researched and verified using multiple credible sources where possible. 
        We aim to provide context and balance in our coverage, especially on sensitive political, security, and community issues in Kebbi State.
      </p>

      <h2>Original Reporting</h2>
      <p>
        We focus on original content, local investigations, interviews, and analysis relevant to Kebbi residents. 
        We do not publish copied or rewritten content from other sources without proper attribution and added value.
      </p>

      <h2>Opinion vs News</h2>
      <p>
        Opinion and analysis pieces are clearly labeled as such. News articles remain factual and neutral.
      </p>

      <h2>Corrections Policy</h2>
      <p>
        If we make a mistake, we correct it as soon as possible. Significant corrections will be noted at the bottom of the article with the date and nature of the correction.
      </p>

      <h2>Conflicts of Interest</h2>
      <p>
        Our journalists and contributors are required to disclose any potential conflicts of interest. We do not accept payment or gifts that could influence coverage.
      </p>

      <h2>Sponsored Content</h2>
      <p>
        Any sponsored or advertorial content will be clearly labeled as "Sponsored" or "Advertisement".
      </p>

      <h2>Contact Us</h2>
      <p>
        For questions, concerns, or corrections regarding our editorial standards, please contact us at{" "}
        <a href="mailto:editor@kebbidailynews.com" className="text-red-700 hover:underline">
          editor@kebbidailynews.com
        </a>.
      </p>

      <p className="text-sm text-gray-500 mt-12">
        This Editorial Policy may be updated periodically. Continued use of our site constitutes acceptance of the current policy.
      </p>
    </article>
  );
}
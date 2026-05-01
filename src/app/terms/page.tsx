// app/terms-of-use/page.tsx

export default function TermsOfUse() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto py-8 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-gray-500 mb-8">Last updated: April 09, 2026</p>

      <p>
        Welcome to <strong>Kebbi Daily News</strong>. By accessing or using our website, you agree to comply with and be bound by these Terms of Use.
        If you do not agree, please do not use our site.
      </p>

      <h2>Use of Content</h2>
      <p>
        All content on this website, including articles, text, graphics, logos, and images, is the property of Kebbi Daily News unless otherwise stated.
        You may access and use the content for personal, non-commercial purposes only.
      </p>
      <ul>
        <li>You may not reproduce, distribute, or republish our content without permission.</li>
        <li>You may quote excerpts with proper attribution and a link back to our website.</li>
      </ul>

      <h2>User Conduct</h2>
      <p>By using our website, you agree not to:</p>
      <ul>
        <li>Post or share false, misleading, or harmful information.</li>
        <li>Engage in unlawful, abusive, or disruptive behavior.</li>
        <li>Attempt to gain unauthorized access to our systems.</li>
        <li>Use the site in any way that could damage or impair its functionality.</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        All trademarks, logos, and content are protected by applicable intellectual property laws.
        Unauthorized use may result in legal action.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not responsible for the content, accuracy,
        or practices of these external sites.
      </p>

      <h2>Disclaimer</h2>
      <p>
        Content on Kebbi Daily News is provided for informational purposes only. While we strive for accuracy,
        we do not guarantee that all information is complete, current, or error-free.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        Kebbi Daily News shall not be held liable for any direct, indirect, or consequential damages arising from the use
        or inability to use our website.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms of Use from time to time. Continued use of the site after changes are posted
        constitutes acceptance of the updated terms.
      </p>

      <h2>Termination</h2>
      <p>
        We reserve the right to suspend or terminate access to our website at our discretion, without notice,
        for conduct that violates these terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms shall be governed by and interpreted in accordance with the laws of Nigeria.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a
          href="mailto:support@kebbidailynews.com"
          className="text-red-700 hover:underline"
        >
          support@kebbidailynews.com
        </a>.
      </p>

      <p className="text-sm text-gray-500 mt-12">
        Continued use of our website constitutes acceptance of these Terms of Use.
      </p>
    </article>
  );
}
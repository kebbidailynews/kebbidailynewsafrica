// app/privacy-policy/page.tsx
export default function PrivacyPolicy() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto py-8 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: April 09, 2026</p>

      <p>
        At Kebbi Daily News, we respect your privacy and are committed to protecting your personal information.
        This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Personal Information</strong>: We only collect information you voluntarily provide (e.g., name and email via contact forms or comments).</li>
        <li><strong>Non-Personal Information</strong>: We automatically collect data such as IP address, browser type, device information, and pages visited using cookies and analytics tools like Google Analytics and Google AdSense.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To improve our website content and user experience.</li>
        <li>To respond to your inquiries and communications.</li>
        <li>To analyze site traffic and performance.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>
        We use Google Analytics and Google AdSense. These services may use cookies to collect usage data. 
        You can review their privacy policies directly on their websites.
      </p>

      <h2>Data Sharing</h2>
      <p>
        We do not sell your personal information. We may share non-personal data with analytics providers 
        or as required by law.
      </p>

      <h2>Your Rights</h2>
      <p>
        You can manage cookies through your browser settings. If you have provided personal information, 
        you may request access, correction, or deletion by contacting us.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted here with an updated date.
      </p>

      <p className="mt-8">
        For any questions about this Privacy Policy, please contact us at{" "}
        <a href="mailto:support@kebbidailynews.com" className="text-red-700 hover:underline">
          support@kebbidailynews.com
        </a>.
      </p>
    </article>
  );
}
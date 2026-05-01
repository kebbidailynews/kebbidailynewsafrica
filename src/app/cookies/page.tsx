// app/cookie-policy/page.tsx

export default function CookiePolicy() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto py-8 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: April 09, 2026</p>

      <p>
        This Cookie Policy explains how <strong>Kebbi Daily News</strong> uses cookies and similar technologies to recognize you when you visit our website.
        It explains what these technologies are and why we use them.
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small data files stored on your device when you visit a website. They are widely used to make websites work efficiently
        and to provide reporting information.
      </p>

      <h2>How We Use Cookies</h2>
      <p>We use cookies for the following purposes:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
        <li><strong>Performance Cookies:</strong> Help us understand how users interact with our site.</li>
        <li><strong>Functional Cookies:</strong> Remember your preferences and improve your experience.</li>
        <li><strong>Advertising Cookies:</strong> Used to deliver relevant ads through third-party services.</li>
      </ul>

      <h2>Third-Party Cookies</h2>
      <p>
        We may use third-party services such as Google AdSense and analytics providers, which may place cookies on your device
        to serve ads and analyze traffic. These third parties have their own privacy and cookie policies.
      </p>

      <h2>Managing Cookies</h2>
      <p>
        You can control and manage cookies through your browser settings. Most browsers allow you to:
      </p>
      <ul>
        <li>View and delete cookies</li>
        <li>Block cookies from specific sites</li>
        <li>Block all cookies</li>
      </ul>
      <p>
        Please note that disabling cookies may affect the functionality of certain parts of our website.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements.
        Updates will be posted on this page.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about our use of cookies, please contact us at{" "}
        <a
          href="mailto:suppott@kebbidailynews.com"
          className="text-red-700 hover:underline"
        >
          support@kebbidailynews.com
        </a>.
      </p>

      <p className="text-sm text-gray-500 mt-12">
        By continuing to use our website, you consent to our use of cookies as described in this policy.
      </p>
    </article>
  );
}
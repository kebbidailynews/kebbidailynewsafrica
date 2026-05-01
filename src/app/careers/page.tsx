// app/careers/page.tsx

export default function CareersPage() {
  return (
    <article className="prose prose-lg max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Careers</h1>
      <p className="text-gray-500 mb-8">Last updated: April 09, 2026</p>

      <p>
        Join <strong>Kebbi Daily News</strong> and be part of a team committed to delivering impactful journalism.
      </p>

      <h2>Who We’re Looking For</h2>
      <ul>
        <li>Reporters and Correspondents</li>
        <li>Editors and Content Managers</li>
        <li>Social Media Managers</li>
        <li>Interns and Student Contributors</li>
      </ul>

      <h2>Why Work With Us?</h2>
      <ul>
        <li>Opportunity to shape local journalism</li>
        <li>Flexible and remote-friendly roles</li>
        <li>Growth and learning opportunities</li>
      </ul>

      <h2>How to Apply</h2>
      <p>
        Send your CV, portfolio, and a short introduction to{" "}
        <a href="mailto:careers@kebbidailynews.com" className="text-red-700 hover:underline">
          careers@kebbidailynews.com
        </a>.
      </p>

      <p className="text-sm text-gray-500 mt-12">
        We review applications on a rolling basis.
      </p>
    </article>
  );
}
// app/corrections-policy/page.tsx

export default function CorrectionsPolicy() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto py-8 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Corrections Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: April 09, 2026</p>

      <p>
        At <strong>Kebbi Daily News</strong>, accuracy is fundamental to our journalism.
        We are committed to correcting errors promptly, transparently, and responsibly.
      </p>

      <h2>Our Commitment</h2>
      <ul>
        <li>We take all reports of errors seriously.</li>
        <li>We investigate correction requests promptly.</li>
        <li>We correct verified errors clearly and transparently.</li>
        <li>We do not silently alter content in a way that misleads readers.</li>
      </ul>

      <h2>Types of Corrections</h2>
      <p>We handle corrections based on the nature of the error:</p>
      <ul>
        <li>
          <strong>Minor Corrections:</strong> Spelling, grammar, or small factual clarifications that do not affect the overall meaning may be updated without a formal correction note.
        </li>
        <li>
          <strong>Significant Corrections:</strong> Errors that affect facts, figures, names, or context will be corrected with a clear note at the bottom of the article.
        </li>
        <li>
          <strong>Major Errors:</strong> In rare cases where a story is substantially incorrect, we may update, retract, or remove the content with an explanation.
        </li>
      </ul>

      <h2>Correction Process</h2>
      <p>
        When an error is identified, our editorial team reviews the issue and verifies the correct information using reliable sources.
        Once confirmed, the correction is made as quickly as possible.
      </p>

      <h2>Transparency</h2>
      <p>
        For significant corrections, we include a note at the end of the article stating what was corrected and the date of the update.
      </p>

      <h2>How to Request a Correction</h2>
      <p>
        If you believe we have made an error, please contact us with the following details:
      </p>
      <ul>
        <li>The article title and link</li>
        <li>A description of the issue</li>
        <li>Any supporting information or sources</li>
      </ul>

      <p>
        Send correction requests to{" "}
        <a
          href="mailto:support@kebbidailynews.com"
          className="text-red-700 hover:underline"
        >
          support@kebbidailynews.com
        </a>.
      </p>

      <h2>Response Time</h2>
      <p>
        We aim to review and respond to correction requests within a reasonable timeframe,
        depending on the complexity of the issue.
      </p>

      <p className="text-sm text-gray-500 mt-12">
        Maintaining trust with our readers is essential. We appreciate your help in ensuring our reporting remains accurate and reliable.
      </p>
    </article>
  );
}
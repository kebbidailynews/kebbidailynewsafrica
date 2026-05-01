// app/advertise/page.tsx

export default function AdvertisePage() {
  return (
    <article className="prose prose-lg max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Advertise With Us
      </h1>
      <p className="text-gray-500 mb-8">Last updated: April 09, 2026</p>

      <p>
        Partner with <strong>Kebbi Daily News</strong> to reach a growing and engaged audience across Kebbi State and Nigeria.
      </p>

      <h2>Why Advertise With Us?</h2>
      <ul>
        <li>Targeted local audience in Kebbi State</li>
        <li>High visibility across news and featured content</li>
        <li>Trusted and credible platform</li>
      </ul>

      <h2>Advertising Options</h2>
      <ul>
        <li><strong>Display Ads:</strong> Banner placements across key pages</li>
        <li><strong>Sponsored Content:</strong> Articles tailored to your brand</li>
        <li><strong>Brand Partnerships:</strong> Campaign collaborations</li>
      </ul>

      <h2>Get Started</h2>
      <p>
        To request our media kit or discuss advertising opportunities, contact us at{" "}
        <a href="mailto:ads@kebbidailynews.com" className="text-red-700 hover:underline">
          ads@kebbidailynews.com
        </a>.
      </p>

      <p className="text-sm text-gray-500 mt-12">
        We look forward to helping your brand grow with us.
      </p>
    </article>
  );
}
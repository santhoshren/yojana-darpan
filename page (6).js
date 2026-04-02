import Link from 'next/link';

export const metadata = {
  title: 'About YojanaDarpan - India\'s Government Scheme Finder',
  description: 'YojanaDarpan helps millions of Indians discover government schemes they qualify for. Learn about our mission.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">About YojanaDarpan</h1>
          <p className="text-saffron-500 font-medium mb-8">"Aapka haq, aapki jankari"</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              India has over 3,000 active government schemes that distribute lakhs of crores in
              benefits every year — yet millions of eligible citizens never claim them simply because
              they don't know these schemes exist.
            </p>
            <p>
              YojanaDarpan was built to solve this. We track every central and state government
              scheme in real-time, and our eligibility checker matches you to schemes in seconds —
              completely free, forever.
            </p>

            <h2 className="text-xl font-bold text-gray-900 pt-4">Our Mission</h2>
            <p>
              Every eligible Indian should know about and access the government benefits they
              legally deserve. We bridge the information gap between citizens and their government.
            </p>

            <h2 className="text-xl font-bold text-gray-900 pt-4">How We Work</h2>
            <ul className="space-y-2 list-disc list-inside text-gray-600">
              <li>We scrape official government portals (MyScheme.gov.in, state portals) daily</li>
              <li>Our eligibility engine matches your profile to 3,000+ schemes instantly</li>
              <li>We provide step-by-step application guides in simple language</li>
              <li>Zero data sold — your profile stays on your device</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 pt-4">Disclaimer</h2>
            <p className="text-sm text-gray-500">
              YojanaDarpan is an independent information service and is NOT affiliated with the
              Government of India or any state government. All scheme data is sourced from
              official government portals but may not be 100% current. Always verify on the
              official scheme portal before applying.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <Link
              href="/find"
              className="inline-block bg-saffron-500 text-white font-medium px-6 py-3 rounded-xl hover:bg-saffron-600 transition-colors"
            >
              Find Your Schemes Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { STATES, SCHEMES } from '@/data/schemes';
import SchemeCard from '@/components/SchemeCard';
import AdSlot from '@/components/AdSlot';

export async function generateStaticParams() {
  return STATES.map((state) => ({
    state: state.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and'),
  }));
}

export async function generateMetadata({ params }) {
  const stateName = STATES.find(
    (s) => s.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and') === params.state
  );
  return {
    title: `Government Schemes in ${stateName} - Eligibility & Benefits`,
    description: `Find all central and ${stateName} state government schemes. Check eligibility, benefits, and how to apply for schemes in ${stateName}.`,
  };
}

export default function StatePage({ params }) {
  const stateName = STATES.find(
    (s) => s.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and') === params.state
  );

  // Show central schemes for all states (state-specific ones would be added to data)
  const schemes = SCHEMES.filter((s) => s.is_central || s.state === stateName);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-gray-500 mb-3">
            <Link href="/">Home</Link> → <Link href="/states">States</Link> → {stateName}
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Government Schemes in {stateName}
          </h1>
          <p className="text-gray-500">
            {schemes.length} central and state schemes available for {stateName} residents
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <AdSlot type="LEADERBOARD" className="mb-8" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme, i) => (
            <>
              <SchemeCard key={scheme.id} scheme={scheme} />
              {(i + 1) % 6 === 0 && (
                <div key={`ad-${i}`} className="sm:col-span-2 lg:col-span-3">
                  <AdSlot type="LEADERBOARD" />
                </div>
              )}
            </>
          ))}
        </div>

        <div className="mt-10 bg-saffron-50 border border-saffron-100 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Check Your Eligibility in {stateName}</h3>
          <p className="text-gray-600 text-sm mb-4">
            Find exactly which of these {schemes.length} schemes you personally qualify for
          </p>
          <Link
            href="/find"
            className="inline-block bg-saffron-500 text-white font-medium px-6 py-3 rounded-xl hover:bg-saffron-600 transition-colors"
          >
            Check My Eligibility →
          </Link>
        </div>
      </div>
    </div>
  );
}

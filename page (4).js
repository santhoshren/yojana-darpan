import Link from 'next/link';
import { STATES, SCHEMES } from '@/data/schemes';

export const metadata = {
  title: 'State-wise Government Schemes India',
  description: 'Find government schemes specific to your state. Browse schemes for all 28 states and union territories of India.',
};

export default function StatesPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">State-wise Schemes</h1>
          <p className="text-gray-500">Find schemes specific to your state alongside central schemes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {STATES.map((state) => {
            const stateSlug = state.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
            const centralCount = SCHEMES.filter((s) => s.is_central).length;
            return (
              <Link
                key={state}
                href={`/states/${stateSlug}`}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-saffron-300 hover:bg-saffron-50 transition-all group"
              >
                <div className="text-2xl mb-2">🏛️</div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-saffron-600">{state}</p>
                <p className="text-xs text-gray-400 mt-0.5">{centralCount}+ schemes</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

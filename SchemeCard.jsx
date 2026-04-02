import Link from 'next/link';
import { ArrowRight, IndianRupee, CheckCircle2 } from 'lucide-react';

const CATEGORY_COLORS = {
  Agriculture: 'bg-green-50 text-green-700 border-green-100',
  Education: 'bg-blue-50 text-blue-700 border-blue-100',
  Housing: 'bg-orange-50 text-orange-700 border-orange-100',
  'Business/MSME': 'bg-purple-50 text-purple-700 border-purple-100',
  Healthcare: 'bg-red-50 text-red-700 border-red-100',
  'Women Welfare': 'bg-pink-50 text-pink-700 border-pink-100',
  Employment: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Senior Citizen': 'bg-amber-50 text-amber-700 border-amber-100',
};

const BENEFIT_TYPE_ICONS = {
  cash: '💵',
  subsidy: '🏷️',
  loan: '🏦',
  insurance: '🛡️',
  scholarship: '🎓',
  pension: '👴',
  savings: '💰',
  'bank-account': '🏛️',
  credit: '💳',
};

export default function SchemeCard({ scheme, matchReasons = [] }) {
  const colorClass = CATEGORY_COLORS[scheme.category] || 'bg-gray-50 text-gray-700 border-gray-100';
  const benefitIcon = BENEFIT_TYPE_ICONS[scheme.benefit_type] || '✅';

  return (
    <div className="scheme-card bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass} mb-2`}>
            {scheme.category}
          </span>
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            {scheme.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{scheme.ministry}</p>
        </div>
        <span className="text-xl flex-shrink-0">{benefitIcon}</span>
      </div>

      {/* Benefit Amount */}
      <div className="bg-forest-50 rounded-lg px-3 py-2">
        <p className="text-xs text-forest-500 font-medium uppercase tracking-wide">Benefit</p>
        <p className="text-lg font-bold text-forest-500 leading-tight">{scheme.benefit_amount}</p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{scheme.description}</p>

      {/* Match Reasons */}
      {matchReasons.length > 0 && (
        <div className="flex flex-col gap-1">
          {matchReasons.slice(0, 3).map((r) => (
            <div key={r} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span className="text-xs text-gray-600">{r}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {scheme.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
        {scheme.is_central && (
          <span className="text-xs bg-saffron-50 text-saffron-600 border border-saffron-100 px-2 py-0.5 rounded-full">
            Central Scheme
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
        <Link
          href={`/schemes/${scheme.slug}`}
          className="flex-1 text-center text-sm font-medium text-saffron-600 bg-saffron-50 hover:bg-saffron-100 border border-saffron-100 rounded-lg py-2 transition-colors"
        >
          How to Apply
        </Link>
        <a
          href={scheme.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg px-3 py-2 transition-colors"
        >
          Official Site <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

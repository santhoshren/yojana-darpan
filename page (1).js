'use client';
import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import SchemeCard from '@/components/SchemeCard';
import AdSlot from '@/components/AdSlot';
import { SCHEMES, CATEGORIES, STATES } from '@/data/schemes';

export default function SchemesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [benefitType, setBenefitType] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    return SCHEMES.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.description.toLowerCase().includes(search.toLowerCase()) &&
          !s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))) {
        return false;
      }
      if (selectedCategory && s.category !== selectedCategory) return false;
      if (benefitType && s.benefit_type !== benefitType) return false;
      return true;
    });
  }, [search, selectedCategory, benefitType]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  function clearFilters() {
    setSearch('');
    setSelectedCategory('');
    setSelectedState('');
    setBenefitType('');
  }

  const activeFilters = [selectedCategory, benefitType].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">All Government Schemes</h1>
          <p className="text-gray-500">Browse {SCHEMES.length}+ schemes from central and state governments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 bg-gray-50">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search schemes, benefits, keywords..."
              className="flex-1 py-2.5 text-sm bg-transparent outline-none text-gray-900"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none text-gray-700"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </select>

          <select
            value={benefitType}
            onChange={(e) => { setBenefitType(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none text-gray-700"
          >
            <option value="">All Benefit Types</option>
            <option value="cash">💵 Cash Transfer</option>
            <option value="subsidy">🏷️ Subsidy</option>
            <option value="loan">🏦 Loan</option>
            <option value="insurance">🛡️ Insurance</option>
            <option value="scholarship">🎓 Scholarship</option>
            <option value="pension">👴 Pension</option>
          </select>

          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 px-3 py-2.5 rounded-xl border border-red-100 bg-red-50"
            >
              <X className="w-3.5 h-3.5" /> Clear ({activeFilters})
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setSelectedCategory('')}
            className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
              selectedCategory === '' ? 'bg-saffron-500 text-white border-saffron-500' : 'bg-white border-gray-200 text-gray-600 hover:border-saffron-300'
            }`}
          >
            All
          </button>
          {CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.name); setPage(1); }}
              className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                selectedCategory === cat.name ? 'bg-saffron-500 text-white border-saffron-500' : 'bg-white border-gray-200 text-gray-600 hover:border-saffron-300'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {paginated.length} of {filtered.length} schemes
          {selectedCategory && ` in ${selectedCategory}`}
        </p>

        {/* Ad */}
        <AdSlot type="LEADERBOARD" className="mb-6" />

        {/* Scheme grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-500 mb-4">Try different keywords or clear filters</p>
            <button onClick={clearFilters} className="text-saffron-500 hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((scheme, i) => (
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

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setPage(page + 1)}
                  className="bg-white border border-gray-200 hover:border-saffron-400 text-gray-700 font-medium px-8 py-3 rounded-xl transition-colors"
                >
                  Load More Schemes ({filtered.length - paginated.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, FileText, ExternalLink, Clock, ChevronRight } from 'lucide-react';
import { SCHEMES } from '@/data/schemes';
import SchemeCard from '@/components/SchemeCard';
import AdSlot from '@/components/AdSlot';

// Generate static pages for all schemes at build time (SEO gold)
export async function generateStaticParams() {
  return SCHEMES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const scheme = SCHEMES.find((s) => s.slug === params.slug);
  if (!scheme) return {};
  return {
    title: `${scheme.name} - Eligibility, Benefits & How to Apply`,
    description: `${scheme.description} Benefit: ${scheme.benefit_amount}. Learn how to apply, documents required, and eligibility criteria.`,
    keywords: [scheme.name, scheme.category, scheme.ministry, 'government scheme India', 'how to apply'],
    openGraph: {
      title: scheme.name,
      description: scheme.description,
    },
  };
}

export default function SchemeDetailPage({ params }) {
  const scheme = SCHEMES.find((s) => s.slug === params.slug);
  if (!scheme) notFound();

  const related = SCHEMES
    .filter((s) => s.slug !== scheme.slug && s.category === scheme.category)
    .slice(0, 3);

  const e = scheme.eligibility;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-800">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/schemes" className="hover:text-gray-800">Schemes</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/schemes?category=${scheme.category}`} className="hover:text-gray-800">{scheme.category}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium truncate">{scheme.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ─── Main Content ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium bg-saffron-50 text-saffron-600 border border-saffron-100 px-2 py-0.5 rounded-full">
                      {scheme.is_central ? 'Central Scheme' : `${scheme.state} Scheme`}
                    </span>
                    <span className="text-xs text-gray-400">{scheme.ministry}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{scheme.name}</h1>
                </div>
                <a
                  href={scheme.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-saffron-500 hover:bg-saffron-600 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
                >
                  Apply Now <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-gray-600 leading-relaxed">{scheme.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {scheme.tags.map((t) => (
                  <span key={t} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefit Card */}
            <div className="bg-forest-50 border border-forest-100 rounded-2xl p-6">
              <p className="text-xs font-medium text-forest-500 uppercase tracking-wider mb-1">Benefit Amount</p>
              <p className="text-4xl font-bold text-forest-500">{scheme.benefit_amount}</p>
              {scheme.last_date && (
                <div className="flex items-center gap-1.5 mt-3 text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 w-fit">
                  <Clock className="w-3.5 h-3.5" />
                  Application deadline: {scheme.last_date}
                </div>
              )}
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
              <div className="divide-y divide-gray-50">
                {e.age_min && (
                  <EligRow label="Age" value={`${e.age_min}${e.age_max ? ` - ${e.age_max}` : '+'} years`} />
                )}
                {e.gender && e.gender.length < 3 && (
                  <EligRow label="Gender" value={e.gender.join(', ')} />
                )}
                {e.occupation && !e.occupation.includes('any') && (
                  <EligRow label="Occupation" value={e.occupation.join(', ')} />
                )}
                {e.income_max && (
                  <EligRow label="Annual Income" value={`Up to ₹${(e.income_max / 100000).toFixed(1)} Lakh`} />
                )}
                {e.categories && (
                  <EligRow label="Category" value={e.categories.join(', ')} />
                )}
                {e.bpl && (
                  <EligRow label="BPL Card" value="Required" highlight />
                )}
                {e.land_required && (
                  <EligRow label="Land Ownership" value="Required" />
                )}
                {e.states === 'all' ? (
                  <EligRow label="Applicable States" value="All States and UTs" />
                ) : (
                  <EligRow label="Applicable States" value={e.states?.join(', ')} />
                )}
              </div>
            </div>

            {/* Documents Required */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Documents Required</h2>
              <div className="space-y-3">
                {scheme.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-saffron-50 border border-saffron-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-saffron-500" />
                    </div>
                    <span className="text-sm text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Apply */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">How to Apply</h2>
              <div className="space-y-4">
                {scheme.how_to_apply.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-saffron-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href={scheme.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-medium py-3.5 rounded-xl transition-colors"
              >
                Apply on Official Website <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: `Who is eligible for ${scheme.name}?`, a: `${scheme.description} The main eligibility criteria includes ${e.income_max ? `annual income below ₹${(e.income_max/100000).toFixed(1)} lakh, ` : ''}${e.age_min ? `age between ${e.age_min} and ${e.age_max || 70} years, ` : ''}and belonging to ${e.categories?.join('/')} category.` },
                  { q: `What is the benefit of ${scheme.name}?`, a: `Under this scheme, eligible beneficiaries receive ${scheme.benefit_amount}. The benefit is provided by the ${scheme.ministry}.` },
                  { q: `How to apply for ${scheme.name}?`, a: `You can apply online through the official portal at ${scheme.apply_url}. You need to submit: ${scheme.documents.slice(0, 3).join(', ')}.` },
                  { q: `Is ${scheme.name} available in my state?`, a: scheme.is_central ? 'Yes, this is a central government scheme available across all states and union territories of India.' : `This scheme is specifically for residents of ${scheme.state}.` },
                ].map(({ q, a }) => (
                  <details key={q} className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-3 text-sm font-medium text-gray-900 hover:text-saffron-500">
                      {q}
                      <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-sm text-gray-600 pb-3 leading-relaxed">{a}</p>
                  </details>
                ))}
              </div>
            </div>

          </div>

          {/* ─── Sidebar ───────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Quick check eligibility */}
            <div className="bg-saffron-500 rounded-2xl p-5 text-white">
              <h3 className="font-bold text-lg mb-1">Check Your Eligibility</h3>
              <p className="text-orange-100 text-sm mb-4">Answer 4 quick questions to see all schemes you qualify for</p>
              <Link
                href="/find"
                className="block text-center bg-white text-saffron-600 font-medium py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-sm"
              >
                Start Eligibility Check →
              </Link>
            </div>

            {/* Ad */}
            <AdSlot type="RECTANGLE" />

            {/* Share */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-medium text-gray-900 mb-3">Share this scheme</h3>
              <div className="grid grid-cols-2 gap-2">
                <a href={`https://wa.me/?text=Check%20out%20${encodeURIComponent(scheme.name)}%20-%20${encodeURIComponent(scheme.benefit_amount)}%20benefit.`} target="_blank" className="text-center text-sm bg-green-50 text-green-700 border border-green-100 py-2 rounded-lg hover:bg-green-100">
                  📱 WhatsApp
                </a>
                <button
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  className="text-center text-sm bg-gray-50 text-gray-700 border border-gray-100 py-2 rounded-lg hover:bg-gray-100"
                >
                  🔗 Copy Link
                </button>
              </div>
            </div>

            {/* Quick info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-medium text-gray-900 mb-3">Quick Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ministry</span>
                  <span className="text-gray-900 text-right text-xs">{scheme.ministry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="capitalize text-gray-900">{scheme.benefit_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Coverage</span>
                  <span className="text-gray-900">{scheme.is_central ? 'Pan India' : scheme.state}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related schemes */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Schemes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((s) => <SchemeCard key={s.id} scheme={s} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EligRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right ${highlight ? 'text-red-500' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

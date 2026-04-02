'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, CheckCircle, Search, MapPin, TrendingUp, Users, IndianRupee } from 'lucide-react';
import SchemeCard from '@/components/SchemeCard';
import AdSlot from '@/components/AdSlot';
import { SCHEMES, CATEGORIES } from '@/data/schemes';

// ── Animated counter ──────────────────────────────────────────
function AnimatedCounter({ end, prefix = '', suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const endNum = parseInt(end.toString().replace(/\D/g, ''));
          const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * endNum));
            if (progress >= 1) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

// ── Quick category chips ──────────────────────────────────────
const quickChips = [
  { label: '👨‍🌾 Farmer', value: 'farmer' },
  { label: '👩‍🎓 Student', value: 'student' },
  { label: '🏠 Housing', value: 'housing' },
  { label: '💰 Business Loan', value: 'business' },
  { label: '👴 Senior Citizen', value: 'senior' },
  { label: '👩 Women', value: 'women' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState(null);

  function handleSearch(e) {
    e.preventDefault();
    window.location.href = `/schemes?search=${encodeURIComponent(searchQuery)}`;
  }

  function handleChip(chip) {
    setActiveChip(chip.value);
    window.location.href = `/find?preset=${chip.value}`;
  }

  const featuredSchemes = SCHEMES.slice(0, 6);

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="bg-ivory relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E87722' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-forest-500 text-forest-500 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                3,247 Active Government Schemes Tracked
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Discover Every<br />
                Government Scheme<br />
                <span className="text-saffron-500">You Deserve</span>
              </h1>

              <p className="text-lg text-gray-500 mb-7 leading-relaxed">
                Enter your basic details once. Get matched to central and state
                government schemes worth lakhs — for free, forever.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex bg-white border-2 border-saffron-500 rounded-xl overflow-hidden mb-4 shadow-sm">
                <div className="flex items-center px-3 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your state, age, occupation..."
                  className="flex-1 py-3.5 px-2 text-base outline-none bg-transparent text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-saffron-500 hover:bg-saffron-600 text-white font-medium px-6 transition-colors whitespace-nowrap"
                >
                  Find My Schemes →
                </button>
              </form>

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {quickChips.map((chip) => (
                  <button
                    key={chip.value}
                    onClick={() => handleChip(chip)}
                    className={`text-sm border px-3 py-1.5 rounded-full transition-all ${
                      activeChip === chip.value
                        ? 'bg-saffron-500 text-white border-saffron-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-saffron-400 hover:text-saffron-500'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Trust Row */}
              <div className="flex flex-wrap gap-4">
                {['Free Forever', 'No Login Required', 'All 28 States'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-sm text-forest-500">
                    <CheckCircle className="w-4 h-4" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Floating scheme cards */}
            <div className="hidden md:flex flex-col gap-3">
              {SCHEMES.slice(0, 3).map((scheme) => (
                <div key={scheme.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-saffron-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-800">{scheme.name}</span>
                  </div>
                  <p className="text-xl font-bold text-forest-500">{scheme.benefit_amount}</p>
                  <div className="flex gap-1.5 mt-2">
                    {scheme.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <Link
                href="/find"
                className="text-center text-sm text-saffron-500 font-medium mt-1 hover:underline"
              >
                + 3,244 more schemes waiting for you →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ───────────────────────────────────────────── */}
      <section className="bg-saffron-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: TrendingUp, num: 3247, suffix: '+', label: 'Schemes Listed' },
              { icon: MapPin, num: 28, suffix: '+', label: 'States Covered' },
              { icon: Users, num: 4700000, suffix: '+', label: 'People Helped' },
              { icon: IndianRupee, num: 23000, suffix: ' Cr+', label: 'Benefits Tracked', prefix: '₹' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter end={s.num} prefix={s.prefix || ''} suffix={s.suffix} />
                </p>
                <p className="text-sm text-orange-100 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-500">Takes less than 2 minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Fill your profile',
                desc: 'Enter age, state, income, and occupation. Basic details only — no documents needed.',
                color: 'bg-saffron-50 border-saffron-100',
              },
              {
                num: '02',
                title: 'Get matched instantly',
                desc: 'Our system checks 3,000+ schemes in seconds and shows every scheme you qualify for.',
                color: 'bg-green-50 border-green-100',
              },
              {
                num: '03',
                title: 'Apply with guidance',
                desc: 'Step-by-step guide, documents list, and direct links to official portals for every scheme.',
                color: 'bg-blue-50 border-blue-100',
              },
            ].map((step) => (
              <div key={step.num} className={`rounded-2xl border p-6 ${step.color}`}>
                <div className="text-4xl font-black text-gray-900/10 mb-3">{step.num}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/find"
              className="inline-flex items-center gap-2 bg-saffron-500 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-saffron-600 transition-colors text-base"
            >
              Start Finding Your Schemes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AD SLOT ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <AdSlot type="LEADERBOARD" />
      </div>

      {/* ─── CATEGORIES ──────────────────────────────────────────── */}
      <section className="bg-ivory py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
            <p className="text-gray-500">Find schemes relevant to your life</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/schemes?category=${cat.slug}`}
                className="cat-tile bg-white rounded-xl border border-gray-100 p-5 text-center block"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{cat.count} schemes</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED SCHEMES ─────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Most Popular Schemes</h2>
              <p className="text-gray-500">Schemes with highest enrollment in 2024</p>
            </div>
            <Link
              href="/schemes"
              className="text-saffron-500 text-sm font-medium hover:underline hidden sm:flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSchemes.map((scheme, i) => (
              <>
                <SchemeCard key={scheme.id} scheme={scheme} />
                {/* Insert ad after every 3 cards */}
                {(i + 1) % 3 === 0 && i < featuredSchemes.length - 1 && (
                  <div key={`ad-${i}`} className="sm:col-span-2 lg:col-span-3">
                    <AdSlot type="LEADERBOARD" />
                  </div>
                )}
              </>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/schemes"
              className="inline-flex items-center gap-2 bg-white border-2 border-saffron-500 text-saffron-500 font-medium px-8 py-3 rounded-xl hover:bg-saffron-50 transition-colors"
            >
              View All 3,247 Schemes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ALERT SIGNUP ─────────────────────────────────────────── */}
      <section className="bg-forest-500 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-4xl mb-4">🔔</div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Never Miss a New Scheme
          </h2>
          <p className="text-green-100 mb-8">
            Get notified on WhatsApp or Email when new schemes matching your profile are added.
            Free forever.
          </p>
          <AlertSignupForm />
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="bg-ivory py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Real Stories</h2>
            <p className="text-gray-500">People who found schemes they never knew about</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Ramesh Kumar', state: 'Uttar Pradesh', story: 'I got PM Awas Yojana housing subsidy of ₹2.5 lakh through this site. Never knew I was eligible. My family now lives in a pucca house!', role: 'Farmer' },
              { name: 'Priya Devi', state: 'Tamil Nadu', story: 'Found 5 scholarships for my daughter through YojanaDarpan. She got ₹36,000 for her engineering studies. Amazing resource!', role: 'Homemaker' },
              { name: 'Mohammed Salim', state: 'Maharashtra', story: 'Got a Mudra loan of ₹5 lakh for my small shop. The step-by-step guide made the process so easy. Business is now growing!', role: 'Small Business Owner' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-saffron-500 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.story}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-saffron-100 text-saffron-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role} · {t.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL AD ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AdSlot type="LEADERBOARD" />
      </div>
    </>
  );
}

// ─── Alert Signup Form ────────────────────────────────────────
function AlertSignupForm() {
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      });
      setDone(true);
    } catch {}
    setLoading(false);
  }

  if (done) {
    return (
      <div className="text-white text-center">
        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
        <p className="font-medium">You're on the list! We'll notify you of new schemes.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <input
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Email or WhatsApp number"
        required
        className="flex-1 px-4 py-3 rounded-xl text-gray-900 outline-none border-2 border-transparent focus:border-saffron-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-saffron-500 hover:bg-saffron-600 text-white font-medium px-6 py-3 rounded-xl transition-colors whitespace-nowrap disabled:opacity-60"
      >
        {loading ? '...' : 'Set Alert'}
      </button>
    </form>
  );
}
